# API Contracts: Pipes & Tobacco Collection Website

## Authentication Endpoints

### POST /api/auth/signin
**Purpose**: Admin login for CMS access
**Request**:
```json
{
  "email": "admin@example.com",
  "password": "securepassword"
}
```
**Response Success (200)**:
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "name": "Admin User"
  },
  "session": {
    "token": "jwt_token",
    "expires": "2025-09-24T10:00:00Z"
  }
}
```
**Response Error (401)**:
```json
{
  "error": "Invalid credentials",
  "code": "AUTH_INVALID"
}
```

### POST /api/auth/signout
**Purpose**: Admin logout
**Request**: Headers with Authorization token
**Response (200)**:
```json
{
  "message": "Signed out successfully"
}
```

## Collection Items - Public Endpoints

### GET /api/pipes
**Purpose**: Retrieve all active pipes with filtering
**Query Parameters**:
- `brand`: string (optional, filter by brand)
- `country`: string (optional, filter by country)
- `search`: string (optional, search name/brand)
- `page`: number (optional, default 1)
- `limit`: number (optional, default 20)

**Response (200)**:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Peterson Sherlock Holmes",
      "brand": "Peterson",
      "country": "Ireland",
      "material": "Briar",
      "shape": "Billiard",
      "featured_image": {
        "id": "uuid",
        "filename": "pipe-001-featured.jpg",
        "alt_text": "Peterson Sherlock Holmes pipe"
      },
      "average_rating": 4.5,
      "rating_count": 12
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  },
  "filters": {
    "brands": ["Peterson", "Savinelli", "Dunhill"],
    "countries": ["Ireland", "Italy", "England"]
  }
}
```

### GET /api/pipes/[id]
**Purpose**: Retrieve single pipe with full details
**Response (200)**:
```json
{
  "id": "uuid",
  "name": "Peterson Sherlock Holmes",
  "brand": "Peterson",
  "country": "Ireland",
  "material": "Briar",
  "shape": "Billiard",
  "finish": "Smooth",
  "filter_type": "9mm",
  "stem_material": "Ebonite",
  "observations": "Beautiful craftsmanship with excellent draw.",
  "images": [
    {
      "id": "uuid",
      "filename": "pipe-001-1.jpg",
      "alt_text": "Peterson pipe side view",
      "is_featured": true,
      "sort_order": 0
    }
  ],
  "average_rating": 4.5,
  "rating_count": 12,
  "created_at": "2025-09-23T10:00:00Z"
}
```

### GET /api/tobaccos
**Purpose**: Retrieve all active tobaccos with filtering
**Query Parameters**: Similar to pipes with `blend_type` filter
**Response (200)**:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Early Morning Pipe",
      "brand": "Dunhill",
      "blend_type": "English",
      "featured_image": {
        "id": "uuid",
        "filename": "tobacco-001-featured.jpg",
        "alt_text": "Dunhill Early Morning Pipe tobacco"
      },
      "strength": 7,
      "room_note": 5,
      "taste": 8,
      "average_rating": 4.2,
      "rating_count": 8
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 23,
    "pages": 2
  },
  "filters": {
    "brands": ["Dunhill", "Cornell & Diehl", "G.L. Pease"],
    "blend_types": ["English", "Virginia", "Aromatic"]
  }
}
```

### GET /api/tobaccos/[id]
**Purpose**: Retrieve single tobacco with full details
**Response (200)**:
```json
{
  "id": "uuid",
  "name": "Early Morning Pipe",
  "brand": "Dunhill",
  "blend_type": "English",
  "contents": "Virginia, Latakia, Oriental, Perique",
  "cut": "Ribbon",
  "strength": 7,
  "room_note": 5,
  "taste": 8,
  "observations": "Classic English blend with moderate Latakia.",
  "images": [
    {
      "id": "uuid",
      "filename": "tobacco-001-1.jpg",
      "alt_text": "Dunhill tobacco tin",
      "is_featured": true,
      "sort_order": 0
    }
  ],
  "average_rating": 4.2,
  "rating_count": 8,
  "created_at": "2025-09-23T10:00:00Z"
}
```

### GET /api/accessories
**Purpose**: Retrieve all active accessories
**Response (200)**:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Czech Tool",
      "brand": "Old Dominion",
      "category": "Tool",
      "description": "Multi-purpose pipe tool with tamper, reamer, and pick.",
      "featured_image": {
        "id": "uuid",
        "filename": "accessory-001-featured.jpg",
        "alt_text": "Czech pipe tool"
      },
      "average_rating": 4.8,
      "rating_count": 5
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "pages": 1
  }
}
```

### GET /api/search
**Purpose**: Global search across all collection types
**Query Parameters**:
- `q`: string (required, search query)
- `type`: string (optional, filter by "pipe", "tobacco", "accessory")

**Response (200)**:
```json
{
  "results": [
    {
      "type": "pipe",
      "id": "uuid",
      "name": "Peterson Sherlock Holmes",
      "brand": "Peterson",
      "featured_image": {
        "filename": "pipe-001-featured.jpg",
        "alt_text": "Peterson pipe"
      },
      "relevance_score": 0.95
    }
  ],
  "total": 5,
  "search_time": "12ms"
}
```

## User Interaction Endpoints

### POST /api/[type]/[id]/rating
**Purpose**: Submit rating for collection item
**Request**:
```json
{
  "rating": 4,
  "session_id": "browser_session_uuid"
}
```
**Response (200)**:
```json
{
  "message": "Rating submitted successfully",
  "new_average": 4.3,
  "rating_count": 13
}
```
**Response Error (409)**:
```json
{
  "error": "Rating already submitted for this session",
  "code": "RATING_EXISTS"
}
```

### POST /api/[type]/[id]/comments
**Purpose**: Submit comment for collection item
**Request**:
```json
{
  "content": "Great pipe with excellent draw!",
  "author_name": "John Doe",
  "session_id": "browser_session_uuid"
}
```
**Response (201)**:
```json
{
  "message": "Comment submitted for moderation",
  "comment_id": "uuid"
}
```

### GET /api/[type]/[id]/comments
**Purpose**: Retrieve approved comments for item
**Response (200)**:
```json
{
  "comments": [
    {
      "id": "uuid",
      "content": "Excellent pipe with smooth draw.",
      "author_name": "John Doe",
      "created_at": "2025-09-23T14:30:00Z"
    }
  ],
  "total": 5
}
```

## Admin CMS Endpoints (Authenticated)

### GET /api/admin/dashboard
**Purpose**: Admin dashboard statistics
**Response (200)**:
```json
{
  "stats": {
    "total_pipes": 45,
    "total_tobaccos": 23,
    "total_accessories": 15,
    "pending_comments": 3,
    "total_ratings": 156
  },
  "recent_activity": [
    {
      "type": "comment",
      "item_name": "Peterson Sherlock Holmes",
      "action": "submitted",
      "timestamp": "2025-09-23T15:00:00Z"
    }
  ]
}
```

### POST /api/admin/pipes
**Purpose**: Create new pipe
**Request**:
```json
{
  "name": "Savinelli Oscar",
  "brand": "Savinelli",
  "material": "Briar",
  "shape": "Billiard",
  "finish": "Smooth",
  "filter_type": "6mm",
  "stem_material": "Ebonite",
  "country": "Italy",
  "observations": "Beautiful Italian craftsmanship."
}
```
**Response (201)**:
```json
{
  "id": "uuid",
  "message": "Pipe created successfully"
}
```

### PUT /api/admin/pipes/[id]
**Purpose**: Update existing pipe
**Request**: Same as POST with updated fields
**Response (200)**:
```json
{
  "message": "Pipe updated successfully"
}
```

### DELETE /api/admin/pipes/[id]
**Purpose**: Soft delete pipe (mark inactive)
**Response (200)**:
```json
{
  "message": "Pipe deactivated successfully"
}
```

### POST /api/admin/upload
**Purpose**: Upload images for collection items
**Request**: FormData with files
**Response (200)**:
```json
{
  "uploaded_files": [
    {
      "id": "uuid",
      "filename": "pipe-001-1.jpg",
      "size": 245760,
      "dimensions": {
        "width": 1200,
        "height": 800
      }
    }
  ]
}
```

### PUT /api/admin/images/[id]/featured
**Purpose**: Set image as featured for item
**Response (200)**:
```json
{
  "message": "Featured image updated successfully"
}
```

### GET /api/admin/comments/pending
**Purpose**: Retrieve comments pending moderation
**Response (200)**:
```json
{
  "comments": [
    {
      "id": "uuid",
      "content": "Nice pipe!",
      "author_name": "Anonymous",
      "item": {
        "type": "pipe",
        "id": "uuid",
        "name": "Peterson Sherlock Holmes"
      },
      "created_at": "2025-09-23T16:00:00Z",
      "ip_address": "192.168.1.1"
    }
  ],
  "total": 3
}
```

### PUT /api/admin/comments/[id]/approve
**Purpose**: Approve comment for public display
**Response (200)**:
```json
{
  "message": "Comment approved successfully"
}
```

### DELETE /api/admin/comments/[id]
**Purpose**: Reject/delete comment
**Response (200)**:
```json
{
  "message": "Comment deleted successfully"
}
```

## Error Response Format

All endpoints follow consistent error response format:
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

## Common HTTP Status Codes

- **200**: Success
- **201**: Created successfully
- **400**: Bad request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Resource not found
- **409**: Conflict (duplicate data)
- **429**: Too many requests (rate limiting)
- **500**: Internal server error

## Request/Response Headers

### Required Headers
```
Content-Type: application/json
Accept: application/json
```

### Authentication Headers (Admin endpoints)
```
Authorization: Bearer <jwt_token>
```

### CORS Headers
```
Access-Control-Allow-Origin: https://www.cachimbosetabacos.com.br
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

This API contract provides a complete foundation for both public collection browsing and administrative content management, ensuring type safety and consistent interfaces across the application.