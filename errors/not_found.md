---
layout: docs
title: not_found
---

# not_found

**HTTP status:** `404 Not Found`  
**Content-Type:** `application/problem+json`  
**Error code:** `not_found`

## Summary

The requested resource (URL path or entity) does not exist. Use this when the client targets a specific resource by path or ID and that resource is missing.

## When it occurs

- Reservation lookup: no reservation for the given locator/email.
- Reservation get/delete: reservation ID not found.
- Session list/get: session key or user context not found.
- Queue get: queue ID not found.
- Park get/patch: park ID not found.
- Package get: package ID not found.
- Config: config not found.
- Token (captcha) image: reservation or token not found.

## Response shape

Standard error fields plus:

| Field | Location | Description |
|-------|----------|-------------|
| `path` | Top-level | Description or path of the resource that was not found. |

## Example

```json
{
  "success": false,
  "status": 404,
  "error_code": "not_found",
  "type": "https://commonpark-platform.dev.ordino.global/errors/not_found",
  "title": "The specified resource was not found",
  "detail": "The resource at `reservation/abc123` was not found.",
  "path": "reservation/abc123"
}
```

## How to fix

- Confirm the URL, ID, or locator is correct and that the resource exists in this park/environment.
- For list endpoints, ensure query filters (e.g. email, session_key) are valid.
