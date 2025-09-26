# API Reference

Complete REST API documentation for the Pipes & Tobacco Collection backend.

## Base URL

```
http://localhost:3000/api  (Development)
https://your-domain.com/api  (Production)
```

## Authentication

Most endpoints are public. Admin endpoints require authentication via NextAuth.js session.

**Public Endpoints**: Collection browsing, search, ratings, comments
**Protected Endpoints**: All `/api/admin/*` endpoints require valid session

## Quick Reference

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pipes` | List all pipes with filtering |
| GET | `/pipes/{id}` | Get single pipe details |
| GET | `/tobaccos` | List all tobaccos with filtering |
| GET | `/tobaccos/{id}` | Get single tobacco details |
| GET | `/accessories` | List all accessories |
| GET | `/accessories/{id}` | Get single accessory details |
| GET | `/search` | Global search across all items |
| POST | `/{type}/{id}/rating` | Submit rating for item |
| POST | `/{type}/{id}/comments` | Submit comment for item |
| GET | `/{type}/{id}/comments` | Get approved comments for item |

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signin` | Admin login |
| POST | `/auth/signout` | Admin logout |
| GET | `/auth/session` | Get current session |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/dashboard` | Dashboard statistics |
| GET/POST | `/admin/pipes` | Manage pipes |
| GET/PUT/DELETE | `/admin/pipes/{id}` | Individual pipe operations |
| GET/POST | `/admin/tobaccos` | Manage tobaccos |
| GET/PUT/DELETE | `/admin/tobaccos/{id}` | Individual tobacco operations |
| GET/POST | `/admin/accessories` | Manage accessories |
| GET/PUT/DELETE | `/admin/accessories/{id}` | Individual accessory operations |
| POST | `/admin/upload-images` | Upload images |
| PUT | `/admin/images/{id}/toggle-featured` | Set featured image |
| GET | `/admin/comments/pending` | Get pending comments |
| PUT | `/admin/comments/{id}/approve` | Approve comment |
| DELETE | `/admin/comments/{id}` | Delete comment |

## Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "data": { /* response data */ },
  "meta": { /* pagination/metadata */ }
}
```

### Error Response  
```json
{
  "error": "Human readable error message",
  "code": "MACHINE_READABLE_CODE", 
  "details": {
    "field": "validation error details"
  },
  "timestamp": "2025-09-23T12:00:00Z"
}
```

## HTTP Status Codes

- **200**: Success
- **201**: Created successfully  
- **400**: Bad request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Resource not found
- **409**: Conflict (duplicate data)
- **429**: Too many requests (rate limiting)
- **500**: Internal server error

## Request Headers

### Required Headers
```
Content-Type: application/json
Accept: application/json
```

### Authentication Headers (Admin endpoints)
```
Cookie: next-auth.session-token=<session_token>
```

## Data Types

### Collection Item Types
- `pipe` - Smoking pipes
- `tobacco` - Tobacco products  
- `accessory` - Smoking accessories

### Rating Scale
- Integer values 1-5 (1 = lowest, 5 = highest)

### Image Formats
- Supported: JPEG, PNG, WebP
- Max size: 10MB
- Min dimensions: 400x400px
- Max dimensions: 4000x4000px

## Detailed Endpoint Documentation

- [Collection Endpoints](./collections.md) - Pipes, tobaccos, accessories
- [Search & Filtering](./search.md) - Search functionality
- [User Interactions](./interactions.md) - Ratings and comments  
- [Authentication](./authentication.md) - Admin login/logout
- [Admin Endpoints](./admin.md) - Content management
- [Image Handling](./images.md) - Upload and management
- [Error Handling](./errors.md) - Error responses and troubleshooting

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Public endpoints**: 100 requests per minute per IP
- **User interactions**: 10 ratings/comments per hour per session
- **Admin endpoints**: 1000 requests per minute per authenticated user

## CORS Configuration

```
Access-Control-Allow-Origin: * (configurable)
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

## SDKs and Libraries

Pre-built client libraries are available:
- [JavaScript/TypeScript](../examples/clients/javascript.md)
- [Python](../examples/clients/python.md)
- [PHP](../examples/clients/php.md)
- [Java](../examples/clients/java.md)