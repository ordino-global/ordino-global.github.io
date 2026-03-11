---
layout: docs
title: resource_not_found
---

# resource_not_found

**HTTP status:** `400 Bad Request`  
**Content-Type:** `application/problem+json`  
**Error code:** `resource_not_found`

## Summary

One or more resources required for the operation could not be found. The request is treated as bad because the referenced IDs are invalid or missing.

## When it occurs

- Entitlements: the given queue ID does not exist.
- Sessions: session key(s), package ID, or queue not found for the request.
- Orders: one or more package IDs in the order do not exist.
- Admin: queue or package patch/update references a non-existent ID.

## Response shape

Standard error fields plus:

| Field | Location | Description |
|-------|----------|-------------|
| `extensions.resource_type` | Optional | Type of resource that was missing (e.g. `session`, `package`, `queue`). |
| `extensions.missing_resources` | Optional | List of IDs or keys that were not found. |
| `request_data` | Optional | The request payload that referenced the missing resources. |

## Example

```json
{
  "success": false,
  "status": 400,
  "error_code": "resource_not_found",
  "type": "http://commonpark-platform.dev.ordino.global/errors/resource_not_found",
  "title": "One or more required resources could not be found",
  "detail": "Could not find the following resource of type `queue`: queue-123.",
  "extensions": {
    "resource_type": "queue",
    "missing_resources": ["queue-123"]
  }
}
```

## How to fix

- Verify the IDs (queue, package, session key, etc.) exist and are correct for the park/environment.
- Create or fetch the resource first, or correct the identifiers and retry.
