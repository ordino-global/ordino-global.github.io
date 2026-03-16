# Reservation Tokens

Reservation tokens are how the system validates user reservations at the point of use.

## Validation flow

1. The guest app displays the reservation token as a QR code (available from the server as an image at `token_url`).
2. The ride attendant scans the QR code using their device.
3. The attendant device sends the token to the `/api/reservations/complete` endpoint.
4. The platform checks the reservation status and returns eligibility information.
5. The attendant device shows the result to the ride attendant.
6. The guest app calls `/api/reservations/{id}` to check the reservation state.
7. The guest app shows the guest the scan status.

The API provides both `token` and `token_url` on the reservation resource. Treat the raw token as an opaque handle—no processing or decoding. You can either render a QR code from the token in your app or display the image at `token_url` directly.

The `/api/reservations/complete` response is a success envelope with a `data` object. The payload includes `result` (an outcome code), `is_allowed_to_enter`, and optional reservation details. Outcome behaviour:

- **`result: "allowed"`** → `is_allowed_to_enter: true` (reservation was ready and has been completed).
- **`result: "already_completed"`** → `is_allowed_to_enter: false` (token was already used).
- **`result: "too_early"`** → `is_allowed_to_enter: false` (reservation not yet ready); `data.remaining_wait_time_seconds` is present. If it is small (e.g. 30), the attendant may override and use a button to record their decision.
  - The platform currently only returns `is_allowed_to_enter: true` when the reservation is ready. Future settings may allow letting guests in slightly early and remove this from individual attendants.
  - Attendants always have the final say; capturing their decisions improves data quality.

Other possible `result` values include `invalid_token`, `not_found`, `not_in_queue`, `canceled`, and `too_late`. See the [API reference](https://registry.scalar.com/@ordino/apis/commonpark-api@latest) for full schemas.

### Example API exchange

**1. Attendant device — submit token for validation**

The attendant app sends the scanned token (the opaque string from the reservation’s `token` field) in the request body. Optionally include `queue_id` to restrict validation to a specific queue. Attendant devices typically use API key authentication.

```http
POST /api/reservations/complete HTTP/1.1
Host: {park_id}.dev.ordino.global
x-api-key: <attendant_api_key>
Content-Type: application/json
Accept: application/json

{
  "token": "<reservation_token_from_scan>",
  "queue_id": "dragons_tail"
}
```

Responses use a success envelope: `{ "success": true, "data": { ... } }`. The `data` object contains `result`, `is_allowed_to_enter`, and optional fields such as `reservation_id`, `queue_id`, `ready_at`, `remaining_wait_time_seconds`, and `members`.

**Example response (200 OK) — reservation ready, guest allowed**

```json
{
  "success": true,
  "data": {
    "result": "allowed",
    "is_allowed_to_enter": true,
    "reservation_id": "r-b314d67fc96c4ea7b884cff5d17c58fe",
    "queue_id": "dragons_tail",
    "queue_name": "Dragon's Tail",
    "guest_count": 1,
    "ready_at": "2025-03-13T15:00:00Z"
  }
}
```

**Example response (200 OK) — reservation not yet ready**

```json
{
  "success": true,
  "data": {
    "result": "too_early",
    "is_allowed_to_enter": false,
    "reservation_id": "r-b314d67fc96c4ea7b884cff5d17c58fe",
    "queue_id": "dragons_tail",
    "remaining_wait_time_seconds": 30,
    "ready_at": "2025-03-13T15:00:00Z"
  }
}
```

**Example response (200 OK) — reservation already completed**

```json
{
  "success": true,
  "data": {
    "result": "already_completed",
    "is_allowed_to_enter": false,
    "reservation_id": "r-b314d67fc96c4ea7b884cff5d17c58fe",
    "queue_id": "dragons_tail"
  }
}
```

**2. Guest app — check reservation state after scan**

The guest app polls or refetches the reservation so the UI can show that the scan was recorded (e.g. “Checked in” or “Used”).

```http
GET /api/reservations/r-b314d67fc96c4ea7b884cff5d17c58fe HTTP/1.1
Host: {park_id}.dev.ordino.global
Authorization: Bearer <guest_access_token>
Accept: application/json
```

**Example response (200 OK) — after successful scan**

```json
{
  "success": true,
  "data": {
    "reservation_id": "r-b314d67fc96c4ea7b884cff5d17c58fe",
    "url": "https://{park_id}.dev.ordino.global/api/reservations/r-b314d67fc96c4ea7b884cff5d17c58fe",
    "queue_id": "dragons_tail",
    "queue_name": "Dragon's Tail",
    "queue_url": "https://{park_id}.dev.ordino.global/api/queues/dragons_tail",
    "state": "completed",
    "ready_at": "2025-03-13T15:00:00Z",
    "cancel_url": null,
    "token_url": null,
  }
}
```

Once `data.state` is `completed`, the guest app can show that the reservation has been used.

## Connectivity issues at point of use

When connectivity is unreliable at the ride entrance, the attendant device can validate the reservation token locally. This avoids depending on the network but has trade-offs.

**Pros**

- Validation can be done without calling the platform.

**Cons**

- The validation app becomes more complex.
- The guest app cannot get real-time feedback on reservation state.
- Odd states can occur (e.g. guest must cancel a reservation that was already scanned; it then shows as completed after sync).
- Guests might use “stale” tokens (e.g. after a closure moved their ready time), whether by mistake or to cheat.

### Requirements for offline validation

- Implement token validation and parsing in the validation app.
- Record all offline scans and any attendant decisions.
- When back online, send offline scans to the server to sync.
- Check scanned tokens against local history to prevent duplicate use.
- Retain scanned tokens for the whole day (not only unsynced ones), so intermittent connectivity cannot allow reuse.

### Token format and validation

The reservation token is a JWT with platform-specific claims.

**Header**

```json
{
  "alg": "RS256",
  "kid": "13e5e18fad7957d2f3ff05cc5abd382ba85820def9f59b86ecc90ebb61fb1b0a",
  "typ": "JWT"
}
```

**Payload**

```jsonc
{
  "iat": 1773680600,   // [NumericDate] Time the token was issued (not when the reservation was made)
  "sub": "r-b314d67fc96c4ea7b884cff5d17c58fe",  // Reservation ID
  "qid": "dragons_tail",  // Queue ID
  "guests": 1,  // Number of guests
  "who": "s-5fcf387e06764256b0eeb3a902b56d1d",  // Session IDs in the reservation
  "rdyat": 1773680556,  // [NumericDate] Expected ready time when the token was issued
  "exp": 1773767000,  // [NumericDate] Token expiry (limits use to a limited window)
  "iss": "https://sim-park.dev.ordino.global",  // https://{park_id}.dev.ordino.global
  "aud": "sim-park.dev.ordino.global"  // {park_id}.dev.ordino.global
}
```

JWKS for verifying the token: `${iss}/.well-known/jwks.json`. A valid token must satisfy:

- `alg` = `RS256`
- `iat` < now
- `exp` > now
- `iss` = `https://{park_id}.dev.ordino.global`
- `aud` = `{park_id}.dev.ordino.global`
- Signature valid with the public key from JWKS

After authenticating the token, the app must verify:

1. **Queue** — Confirm `qid` matches the queue this device is configured for (or skip if the device is not queue-specific).

   > [!NOTE]
   > The token only has the queue ID. To show the queue name, preload names and IDs from `/api/queues`.

2. **Ready time** — Ensure `rdyat` > current time at scan.
3. **No duplicate use** — The token has not been scanned before, or the earlier scan did not allow entry.
