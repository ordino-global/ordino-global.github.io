---
layout: docs
title: multiple_authentication_schemes
---

# multiple_authentication_schemes

**HTTP status:** `401 Unauthorized`  
**Content-Type:** `application/problem+json`  
**Error code:** `multiple_authentication_schemes`

## Summary

The request included more than one authentication method. Only one scheme may be used per request.

## When it occurs

- Both `Authorization` (e.g. Bearer or Basic) and `x-api-key` (or another scheme) are sent.
- The API resolves this as ambiguous and rejects the request.

## Response shape

Standard error fields plus:

| Field | Location | Description |
|-------|----------|-------------|
| `authentication_scheme` | Optional | The scheme that caused the conflict. |

## Example

```json
{
  "success": false,
  "status": 401,
  "error_code": "multiple_authentication_schemes",
  "type": "https://commonpark-platform.dev.ordino.global/errors/multiple_authentication_schemes",
  "title": "Multiple authentication schemes were specified in the request.",
  "detail": "Only one authentication scheme can be used at a time.  Use either the Authorization header or the x-api-key header, but not both.",
  "authentication_scheme": "ApiKey"
}
```

## How to fix

- Send only one of: `Authorization` header (Bearer/Basic) or `x-api-key` header.
- Remove the extra auth header and retry.
