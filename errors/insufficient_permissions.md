---
layout: docs
title: insufficient_permissions
---

# insufficient_permissions

**HTTP status:** `403 Forbidden`  
**Content-Type:** `application/problem+json`  
**Error code:** `insufficient_permissions`

## Summary

The client is authenticated but does not have a role required to perform the action.

## When it occurs

- User is authenticated as a normal user but the endpoint requires an admin (or other) role.
- Reserve action or other role-gated operations when the principal’s role is insufficient.

## Response shape

Standard error fields plus:

| Field | Location | Description |
|-------|----------|-------------|
| `allowed_roles` | Optional | Roles that are permitted for the request. |

## Example

```json
{
  "success": false,
  "status": 403,
  "error_code": "insufficient_permissions",
  "type": "http://commonpark-platform.dev.ordino.global/errors/insufficient_permissions",
  "title": "Insufficient permissions",
  "detail": "The request requires a role that you do not possess and was unable to be completed due to insufficient permissions.",
  "extensions": {
    "allowed_roles": ["Admin"]
  }
}
```

## How to fix

- Use an account or API key that has the required role (e.g. Admin) for the operation.
- If you believe your account should have access, contact the park administrator.
