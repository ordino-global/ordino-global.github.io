---
layout: docs
title: not_configured
---

# not_configured

**HTTP status:** `501 Not Implemented`  
**Content-Type:** `application/problem+json`  
**Error code:** `not_configured`

## Summary

The payment or webhook integration is not configured for this deployment, so the endpoint cannot process requests.

## When it occurs

- Stripe webhook is called but `STRIPE_WEBHOOK_SECRET` (or equivalent) is not set.
- Payment provider webhook endpoint is hit without the required environment configuration.

## Response shape

Standard error fields only.

## Example

```json
{
  "success": false,
  "status": 501,
  "error_code": "not_configured",
  "type": "https://commonpark-platform.dev.ordino.global/errors/not_configured",
  "title": "Bad request",
  "detail": "The request was unable to be completed due to a problem with the request."
}
```

## How to fix

- Configure the payment provider (e.g. set `STRIPE_WEBHOOK_SECRET`) in the environment.
- Or do not call this webhook until the integration is deployed and configured.
