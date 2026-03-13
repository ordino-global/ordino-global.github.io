---
layout: docs
title: session_creation_failed
---

# session_creation_failed

**HTTP status:** `400 Bad Request`  
**Content-Type:** `application/problem+json`  
**Error code:** `session_creation_failed`

## Summary

Payment webhook processing succeeded but creating sessions from the order (e.g. after Stripe/PayPal/Shopify) failed.

## When it occurs

- Stripe, PayPal, or Shopify webhook received and order data extracted, but `CreateSessionsFromOrderAsync` returns failure.
- Typically due to business rules (e.g. invalid package, park, or guest data) or a downstream failure.

## Response shape

Standard error fields plus:

| Field | Location | Description |
|-------|----------|-------------|
| `error` | Optional | Underlying error message from the session creator (e.g. `unknown_error` or a specific message). |

## Example

```json
{
  "success": false,
  "status": 400,
  "error_code": "session_creation_failed",
  "type": "https://commonpark-platform.dev.ordino.global/errors/session_creation_failed",
  "title": "Bad request",
  "detail": "The request was unable to be completed due to a problem with the request.",
  "error": "unknown_error"
}
```

## How to fix

- Inspect `error` for the reason (e.g. missing package, invalid email).
- Ensure order data from the payment provider matches park configuration (packages, prices).
- Check logs for the order ID and session creator errors; fix data or configuration and retry or re-send the webhook if supported.
