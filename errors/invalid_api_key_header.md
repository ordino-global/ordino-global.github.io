---
layout: docs
title: invalid_api_key_header
---

# invalid_api_key_header

**HTTP status:** `401 Unauthorized`  
**Content-Type:** `application/problem+json`  
**Error code:** `invalid_api_key_header`

## Summary

The API key header is missing or not in the expected form.

## When it occurs

- API key authentication is enabled but the `x-api-key` header is missing or malformed.
- Header format does not match `x-api-key: <api_key>`.

## Response shape

Standard error fields plus:

| Field | Location | Description |
|-------|----------|-------------|
| `extensions.authentication_scheme` | Optional | e.g. `ApiKey`. |

## Example

```json
{
  "success": false,
  "status": 401,
  "error_code": "invalid_api_key_header",
  "type": "http://commonpark-platform.dev.ordino.global/errors/invalid_api_key_header",
  "title": "The API key header is invalid.",
  "detail": "The API key header should be in the format 'x-api-key: <api_key>'.",
  "extensions": {
    "authentication_scheme": "ApiKey"
  }
}
```

## How to fix

- Send a valid API key in the `x-api-key` request header.
- Ensure the key is enabled for the park and has the required role.
