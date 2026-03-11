---
layout: docs
title: invalid_signature
---

# invalid_signature

**HTTP status:** `400 Bad Request`  
**Content-Type:** `application/problem+json`  
**Error code:** `invalid_signature`

## Summary

The webhook signature (e.g. Stripe’s `Stripe-Signature` header) could not be verified with the configured secret.

## When it occurs

- Stripe webhook: signature verification fails (wrong secret, tampered body, or invalid format).
- Other providers may use similar signature checks.

## Response shape

Standard error fields only.

## Example

```json
{
  "success": false,
  "status": 400,
  "error_code": "invalid_signature",
  "type": "http://commonpark-platform.dev.ordino.global/errors/invalid_signature",
  "title": "Bad request",
  "detail": "The request was unable to be completed due to a problem with the request."
}
```

## How to fix

- Ensure the webhook signing secret in the environment matches the one in the payment provider dashboard.
- Confirm the raw request body is not modified before verification (e.g. no re-parsing that changes bytes).
- Regenerate the webhook secret in the provider if it was rotated and update the server configuration.
