---
layout: docs
title: authentication_not_enabled
---

# authentication_not_enabled

**HTTP status:** `401 Unauthorized`  
**Content-Type:** `application/problem+json`  
**Error code:** `authentication_not_enabled`

## Summary

The authentication scheme used in the request is not enabled for this park or environment.

## When it occurs

- Basic auth header is sent but Basic auth is not enabled for the park.
- ApiKey (`x-api-key`) is sent but API key authentication is not enabled.
- Bearer (e.g. Google JWT) is sent but that scheme is not enabled.

## Response shape

Standard error fields plus:

| Field | Location | Description |
|-------|----------|-------------|
| `extensions.authentication_scheme` | Optional | The scheme that is not enabled (e.g. `Basic`, `ApiKey`, `GoogleJwt`). |

## Example

```json
{
  "success": false,
  "status": 401,
  "error_code": "authentication_not_enabled",
  "type": "http://commonpark-platform.dev.ordino.global/errors/authentication_not_enabled",
  "title": "The attempted authentication scheme is not enabled.",
  "detail": "ApiKey authentication must be enabled in the park settings.",
  "authentication_scheme": "ApiKey"
}
```

## How to fix

- Use an authentication method that is enabled for the park (e.g. Bearer if only Google JWT is on).
- Or enable the desired scheme in park settings (e.g. for development) and retry.
