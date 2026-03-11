---
layout: docs
title: invalid_payload
---

# invalid_payload

**HTTP status:** `400 Bad Request`  
**Content-Type:** `application/problem+json`  
**Error code:** `invalid_payload`

## Summary

The webhook request body could not be parsed or was null (e.g. missing or invalid JSON).

## When it occurs

- PayPal or Shopify webhook: `ReadFromJsonAsync` returns null (empty or non-JSON body).
- Body is not valid JSON or does not deserialize to the expected type.

## Response shape

Standard error fields only.

## Example

```json
{
  "success": false,
  "status": 400,
  "error_code": "invalid_payload",
  "type": "http://commonpark-platform.dev.ordino.global/errors/invalid_payload",
  "title": "Bad request",
  "detail": "The request was unable to be completed due to a problem with the request."
}
```

## How to fix

- Send a valid JSON body that matches the expected webhook payload schema.
- For provider webhooks, ensure the sender is the real provider and the request was not truncated or corrupted.
