---
layout: docs
title: invalid_credentials
---

# invalid_credentials

**HTTP status:** `401 Unauthorized`  
**Content-Type:** `application/problem+json`  
**Error code:** `invalid_credentials`

## Summary

The credentials (password, API key, or token) are not valid—expired, revoked, or incorrect.

## When it occurs

- **ApiKey:** The key is disabled or does not match a valid key for the park.
- **Bearer (e.g. Google JWT):** Token is invalid, expired, or signature verification fails.
- **Basic:** Username/password not accepted (when Basic is implemented with credential check).

## Response shape

Standard error fields plus:

| Field | Location | Description |
|-------|----------|-------------|
| `extensions.authentication_scheme` | Optional | The scheme used (e.g. `ApiKey`, `GoogleJwt`). |

## Example

```json
{
  "success": false,
  "status": 401,
  "error_code": "invalid_credentials",
  "type": "http://commonpark-platform.dev.ordino.global/errors/invalid_credentials",
  "title": "The specified credentials are not valid.",
  "detail": "The credentials provided are not valid.  Please check the credentials and try again.  If the problem persists, please contact support.",
  "extensions": {
    "authentication_scheme": "ApiKey"
  }
}
```

## How to fix

- Verify the API key or token is correct, not revoked, and enabled for the park.
- For JWT, ensure the token is not expired and is from the configured issuer.
- Rotate or re-issue credentials if necessary.
