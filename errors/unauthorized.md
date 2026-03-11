---
layout: docs
title: unauthorized
---

# unauthorized

**HTTP status:** `401 Unauthorized`  
**Content-Type:** `application/problem+json`  
**Error code:** `unauthorized`

## Summary

The request requires authentication but no valid credentials were provided or the endpoint does not accept the provided scheme.

## When it occurs

- No `Authorization` or `x-api-key` header present on a protected endpoint.
- User context required but not authenticated (e.g. session list by user).
- Default challenge when authentication fails without a more specific reason.

## Response shape

Standard error fields plus:

| Field | Location | Description |
|-------|----------|-------------|
| `allowed_roles` | Optional | Roles that are permitted for the request (e.g. `User`). |

## Example

```json
{
  "success": false,
  "status": 401,
  "error_code": "unauthorized",
  "type": "http://commonpark-platform.dev.ordino.global/errors/unauthorized",
  "title": "The specifies resource requires authentication.",
  "detail": "Include a valid Bearer token in the Authorization header of the request to authenticate.",
  "extensions": {
    "allowed_roles": ["User"]
  }
}
```

## How to fix

- Send a valid Bearer token in the `Authorization` header, or a valid API key in `x-api-key`, according to park configuration.
- Ensure the authentication scheme (e.g. Google JWT, Basic, ApiKey) is enabled for the park.
