---
layout: docs
title: API Error Reference
---

# API Error Reference

Documentation for each error response returned by the CommonPark API. All error responses use **RFC 7807** problem details with `Content-Type: application/problem+json`.

## Common fields

- **`success`**: `false` for all error responses
- **`status`**: HTTP status code
- **`error_code`**: Machine-readable code (used in `type` URI as `.../errors/{error_code}`)
- **`type`**: URI reference for the problem type, e.g. `https://commonpark-platform.dev.ordino.global/errors/{error_code}`
- **`title`**: Short human-readable summary
- **`detail`**: Explanation specific to this occurrence
- **`trace_id`**: Request trace identifier (when available)
- Optional extra data (e.g. `errors`, `context`, `request_data`)

## Index by HTTP status

| Status | Error codes |
|--------|-------------|
| 400    | [validation_error](validation_error), [resource_not_found](resource_not_found), [operation_failed](operation_failed), [session_creation_failed](session_creation_failed), [invalid_signature](invalid_signature), [invalid_payload](invalid_payload), [unknown_error](unknown_error) |
| 401    | [unauthorized](unauthorized), [multiple_authentication_schemes](multiple_authentication_schemes), [authentication_not_enabled](authentication_not_enabled), [invalid_authorization_header](invalid_authorization_header), [invalid_api_key_header](invalid_api_key_header), [invalid_credentials](invalid_credentials) |
| 403    | [insufficient_permissions](insufficient_permissions) |
| 404    | [not_found](not_found) |
| 500    | [processing_error](processing_error) |
| 501    | [not_configured](not_configured) |

## Index by error code (A–Z)

- [authentication_not_enabled](authentication_not_enabled)
- [insufficient_permissions](insufficient_permissions)
- [invalid_api_key_header](invalid_api_key_header)
- [invalid_authorization_header](invalid_authorization_header)
- [invalid_credentials](invalid_credentials)
- [invalid_payload](invalid_payload)
- [invalid_signature](invalid_signature)
- [multiple_authentication_schemes](multiple_authentication_schemes)
- [not_configured](not_configured)
- [not_found](not_found)
- [operation_failed](operation_failed)
- [processing_error](processing_error)
- [resource_not_found](resource_not_found)
- [session_creation_failed](session_creation_failed)
- [unauthorized](unauthorized)
- [unknown_error](unknown_error)
- [validation_error](validation_error)
