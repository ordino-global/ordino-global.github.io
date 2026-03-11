---
layout: docs
title: invalid_authorization_header
---

# invalid_authorization_header

**HTTP status:** `401 Unauthorized`  
**Content-Type:** `application/problem+json`  
**Error code:** `invalid_authorization_header`

## Summary

The `Authorization` header is missing, malformed, or does not match the expected format for the scheme.

## When it occurs

- **Basic:** Header is not `Basic <base64>`, or the base64 is invalid/blank after decoding.
- **Bearer (e.g. Google JWT):** No token after "Bearer", or token is empty.

## Response shape

Standard error fields plus:

| Field | Location | Description |
|-------|----------|-------------|
| `extensions.authentication_scheme` | Optional | The scheme that was used (e.g. `Basic`, `GoogleJwt`). |

## Example

```json
{
  "success": false,
  "status": 401,
  "error_code": "invalid_authorization_header",
  "type": "http://commonpark-platform.dev.ordino.global/errors/invalid_authorization_header",
  "title": "The authorization header is invalid.",
  "extensions": {
    "authentication_scheme": "Basic"
  }
}
```

## How to fix

- **Basic:** Use `Authorization: Basic <base64(username:password)>` with valid base64.
- **Bearer:** Use `Authorization: Bearer <token>` and ensure the token is non-empty and valid for the configured issuer.
