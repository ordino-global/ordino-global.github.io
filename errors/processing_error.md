---
layout: docs
title: processing_error
---

# processing_error

**HTTP status:** `500 Internal Server Error`  
**Content-Type:** `application/problem+json`  
**Error code:** `processing_error`

## Summary

An unexpected exception occurred while processing the payment webhook. The operation did not complete.

## When it occurs

- Stripe, PayPal, or Shopify webhook: an unhandled exception is thrown (e.g. during parsing, payment manager, or session creation).
- Server logs contain the exception details; the response body is generic for security.

## Response shape

Standard error fields only.

## Example

```json
{
  "success": false,
  "status": 500,
  "error_code": "processing_error",
  "type": "http://commonpark-platform.dev.ordino.global/errors/processing_error",
  "title": "Bad request",
  "detail": "The request was unable to be completed due to a problem with the request."
}
```

## How to fix

- Retry the webhook if the provider supports it (many do with exponential backoff).
- Check server logs and metrics for the trace ID; fix the underlying bug or configuration and redeploy.
- If persistent, contact support with the trace ID and webhook payload (if safe to share).
