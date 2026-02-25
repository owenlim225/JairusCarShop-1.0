# API REFERENCE

Complete API documentation for all endpoints.

## Base URL

**Production:** `https://api.[your-domain].com/v1`  
**Staging:** `https://api-staging.[your-domain].com/v1`

## Authentication

All API requests require authentication via Bearer token:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/login
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST /auth/register
Register new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Users

#### GET /users/me
Get current user profile.

**Response:**
```json
{
  "id": "123",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### PUT /users/me
Update current user profile.

**Request:**
```json
{
  "name": "Jane Doe"
}
```

**Response:**
```json
{
  "id": "123",
  "email": "user@example.com",
  "name": "Jane Doe",
  "updatedAt": "2024-01-02T00:00:00Z"
}
```

### Resources

#### GET /resources
List all resources.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `sort` (optional): Sort field (default: createdAt)
- `order` (optional): Sort order (asc/desc, default: desc)

**Response:**
```json
{
  "data": [
    {
      "id": "123",
      "name": "Resource 1",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### POST /resources
Create new resource.

**Request:**
```json
{
  "name": "New Resource",
  "description": "Resource description"
}
```

**Response:**
```json
{
  "id": "123",
  "name": "New Resource",
  "description": "Resource description",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### GET /resources/:id
Get resource by ID.

**Response:**
```json
{
  "id": "123",
  "name": "Resource 1",
  "description": "Resource description",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### PUT /resources/:id
Update resource.

**Request:**
```json
{
  "name": "Updated Resource",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "id": "123",
  "name": "Updated Resource",
  "description": "Updated description",
  "updatedAt": "2024-01-02T00:00:00Z"
}
```

#### DELETE /resources/:id
Delete resource.

**Response:**
```json
{
  "success": true,
  "message": "Resource deleted"
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 422 | Request validation failed |
| INTERNAL_ERROR | 500 | Server error |

## Rate Limiting

- **Authenticated:** 1000 requests per hour
- **Unauthenticated:** 100 requests per hour

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Pagination

All list endpoints support pagination:

- `page`: Page number (1-indexed)
- `limit`: Items per page (max: 100)

Response includes pagination metadata:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Versioning

API versioning via URL path:
- `/v1/` - Current version
- Future versions: `/v2/`, `/v3/`, etc.

## SDKs

Official SDKs available:
- **JavaScript/TypeScript:** `npm install @your-project/sdk`
- **Python:** `pip install your-project-sdk`

---

**Last Updated:** [Date]  
**Owner:** Technical Lead

