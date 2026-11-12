---
name: api-patterns
description: Guidelines and patterns for designing clean, high-performance, secure, and type-safe REST, tRPC, and GraphQL APIs with structured envelopes, pagination, validation, and error handling.
---

# API Architecture & Engineering Playbook

Use this skill when defining server endpoints, route handlers, middleware, request validation, and API error contracts.

## 1. Uniform Response Envelopes
Standardize all HTTP API responses so client applications have deterministic parsing:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "cursor": "cursor_token_here",
    "hasMore": false,
    "total": 128
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested item does not exist or has been archived.",
    "details": []
  }
}
```

## 2. Validation & Security
- **Strict Input Validation**: Validate headers, query strings, and request bodies using **Zod** or **Valibot**. Never pass unvalidated `req.body` directly to business logic or database queries.
- **HTTP Status Codes**:
  - `200 OK`: Successful read or update.
  - `201 Created`: Resource successfully created (with `Location` header where relevant).
  - `400 Bad Request`: Validation failure.
  - `401 Unauthorized`: Authentication missing or expired.
  - `403 Forbidden`: Authenticated, but lacks required permissions (RBAC).
  - `404 Not Found`: Resource does not exist.
  - `429 Too Many Requests`: Rate limit threshold exceeded.

## 3. Pagination & Performance
- Always default to cursor-based pagination for large datasets or real-time feeds to prevent page-drift issues caused by offset-limit.
- Enable `gzip` / `brotli` compression and cache control headers (`Cache-Control: public, s-maxage=60, stale-while-revalidate=300`) for non-personalized query routes.

