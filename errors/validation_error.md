---
layout: docs
title: validation_error
---

# validation_error

**HTTP status:** `400 Bad Request`  
**Content-Type:** `application/problem+json`  
**Error code:** `validation_error`

## Summary

The request body or parameters failed validation. The response includes a list of validation errors per field.

## When it occurs

- Model binding fails (e.g. invalid types, required fields missing).
- Explicit validation in controllers (e.g. reservation lookup without required identifiers, queue delete with invalid body, package/park/queue/session create or update with invalid data).

## Response shape

Standard error fields plus:

| Field | Location | Description |
|-------|----------|-------------|
| `errors` | Optional | Object mapping field names to arrays of error messages. |

## Example

```json
{
  "success": false,
  "status": 400,
  "error_code": "validation_error",
  "type": "https://commonpark-platform.dev.ordino.global/errors/validation_error",
  "title": "One or more validation errors occurred",
  "detail": "The request was unable to be completed due to a problem with the request.",
  "errors": {
    "Email": ["The Email field is required."],
    "Packages": ["At least one package is required."]
  }
}
```

## How to fix

- Ensure the request body and query parameters match the API schema.
- Correct the fields listed under `errors` and retry.
