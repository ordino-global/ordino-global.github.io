---
layout: docs
title: API Authentication
---

## Overview

All Ordino APIs are protected. Requests must include valid credentials, otherwise the API responds with `401 Unauthorized` or `403 Forbidden`.

There are two primary authentication flows:

- **Machine-to-machine (M2M) and admin API access** via **API keys**
- **End-user access** via **Bearer tokens**

### Machine-to-machine and admin authentication (API key)

Use this method for:

- Service-to-service integrations
- Backend jobs and workers
- Administrative tools and dashboards

#### API key header

- **Header name**: `x-api-key`  
- **Location**: HTTP request header  
- **Type**: Static API key issued and managed by Ordino

#### Example request (M2M/admin)

```http
POST /api/orders HTTP/1.1
Host: sb1-test-park.dev.ordino.global
x-api-key: YOUR_API_KEY_HERE
Accept: application/json
```

#### Key lifecycle and security

- Keys are issued by Ordino and scoped to a specific customer account and environment.
- Store keys securely (for example in a secrets manager) and **never** embed them in browser or mobile clients.

If you need a key, or to revoke/rotate an existing key, contact your Ordino representative or support channel.

### End-user authentication (Bearer token)

Use this method when acting on behalf of an authenticated **end user**. In this flow, your application:

1. Authenticates the user (for example via your identity provider or Sign in with Google).
2. Obtains a JWT
3. Sends the JWT to Ordino APIs using the Bearer scheme.

#### Bearer token header

- **Header name**: `Authorization`
- **Format**: `Bearer <access_token>`

#### Example request (user context)

```http
GET /api/reservations HTTP/1.1
Host: sb1-test-park.dev.ordino.global
Authorization: Bearer USER_ACCESS_TOKEN_HERE
Accept: application/json
```

Tokens are:

- Time-limited and may expire; your client should be prepared to refresh or re-authenticate.
- Scoped to a user and, optionally, to a subset of permissions.

Your identity provider or Ordino integration guide will describe how to obtain and refresh these tokens in your environment.

## Configuring for custom JWTs

Specific information will need to be exchanged with Ordino in order to accept the specific JWTs used by your application.

## Security best practices

- **Always use HTTPS**; never send credentials over plain HTTP.
- **Do not log secrets** (API keys, access tokens, or full `Authorization` headers).
