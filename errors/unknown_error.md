---
layout: docs
title: unknown_error
---

# unknown_error

**HTTP status:** `400 Bad Request`  
**Content-Type:** `application/problem+json`  
**Error code:** `unknown_error`

## Summary

A generic error code used when an operation fails without a more specific code (e.g. session creation or legacy endpoints).

## When it occurs

- **Sessions:** `CreateSession` (obsolete) returns failure and `result.Error` is null; the response uses `unknown_error`.
- **Payments:** `session_creation_failed` responses may include `extensions.error` set to `unknown_error` when the session creator does not return a specific message.

## Response shape

Standard error fields. May include `request_data` or `extensions.error` depending on the endpoint.

## Example

```json
{
  "success": false,
  "status": 400,
  "error_code": "unknown_error",
  "type": "http://commonpark-platform.dev.ordino.global/errors/unknown_error",
  "title": "Bad request",
  "detail": "The request was unable to be completed due to a problem with the request."
}
```

## How to fix

- For session creation: validate input (email, packages, park) and check logs for the underlying cause.
- Prefer the payments webhook flow over the obsolete session create endpoint; use the payment provider’s retry for webhooks.
