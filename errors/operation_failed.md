---
layout: docs
title: operation_failed
---

# operation_failed

**HTTP status:** `400 Bad Request`  
**Content-Type:** `application/problem+json`  
**Error code:** `operation_failed`

## Summary

The operation could not be completed due to an unspecified server-side or persistence failure.

## When it occurs

- Delete or create/update of a park, queue, or package fails after validation (e.g. database or external service error).

## Response shape

Standard error fields only. No extra extension fields.

## Example

```json
{
  "success": false,
  "status": 400,
  "error_code": "operation_failed",
  "type": "http://commonpark-platform.dev.ordino.global/errors/operation_failed",
  "title": "The operation failed",
  "detail": "The operation failed due to an unknown error."
}
```

## How to fix

- Retry the request. If it persists, treat as a server issue and contact support or check service health.
