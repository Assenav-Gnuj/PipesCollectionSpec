# Admin Endpoints

Complete documentation for content management system endpoints. All admin endpoints require authentication.

## Dashboard

### GET /api/admin/dashboard

Get dashboard statistics and recent activity.

**Response (200):**
```json
{
  "stats": {
    "total_pipes": 45,
    "total_tobaccos": 23,
    "total_accessories": 15,
    "pending_comments": 3,
    "total_ratings": 156,
    "total_images": 89,
    "active_users": 1
  },
  "recent_activity": [
    {
      "type": "comment",
      "item_name": "Peterson Sherlock Holmes",
      "item_type": "pipe",
      "action": "submitted",
      "timestamp": "2025-09-23T15:00:00Z",
      "author": "John Doe"
    },
    {
      "type": "pipe",
      "item_name": "Savinelli Autograph",
      "action": "created",
      "timestamp": "2025-09-23T14:30:00Z",
      "author": "Admin"
    }
  ],
  "popular_items": [
    {
      "id": "pipe123",
      "name": "Peterson Sherlock Holmes",
      "type": "pipe",
      "rating_count": 12,
      "average_rating": 4.5
    }
  ]
}
```

## Pipe Management

### GET /api/admin/pipes

List all pipes with admin details and filtering.

**Query Parameters:**
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page (1-100), default 10
- `search` (optional): Search in name and brand
- `sortBy` (optional): Sort field (name, brand, createdAt), default createdAt
- `sortOrder` (optional): Sort direction (asc, desc), default desc
- `isActive` (optional): Filter by active status (true, false, all), default all

**Response (200):**
```json
{
  "pipes": [
    {
      "id": "pipe123abc",
      "name": "Peterson Sherlock Holmes",
      "brand": "Peterson",
      "material": "Briar",
      "shape": "Billiard",
      "finish": "Smooth",
      "filter_type": "9mm",
      "stem_material": "Ebonite",
      "country": "Ireland",
      "observations": "Beautiful craftsmanship...",
      "is_active": true,
      "created_at": "2025-09-23T10:00:00Z",
      "updated_at": "2025-09-23T10:00:00Z",
      "images": [
        {
          "id": "img123",
          "filename": "peterson-holmes-1.jpg",
          "is_featured": true
        }
      ],
      "rating_count": 12,
      "average_rating": 4.5,
      "comment_count": 8
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 45,
    "has_next": true,
    "has_prev": false
  }
}
```

### POST /api/admin/pipes

Create a new pipe.

**Request:**
```json
{
  "name": "Savinelli Oscar Tiger",
  "brand": "Savinelli",
  "material": "Briar",
  "shape": "Billiard",
  "finish": "Smooth",
  "filter_type": "6mm",
  "stem_material": "Ebonite",
  "country": "Italy",
  "observations": "Beautiful Italian craftsmanship with excellent balance.",
  "is_active": true
}
```

**Response (201):**
```json
{
  "id": "pipe456def",
  "name": "Savinelli Oscar Tiger",
  "brand": "Savinelli",
  "material": "Briar",
  "shape": "Billiard",
  "finish": "Smooth",
  "filter_type": "6mm",
  "stem_material": "Ebonite",
  "country": "Italy",
  "observations": "Beautiful Italian craftsmanship with excellent balance.",
  "is_active": true,
  "created_at": "2025-09-23T16:00:00Z",
  "updated_at": "2025-09-23T16:00:00Z",
  "images": []
}
```

**Validation Errors (400):**
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "name": "Name is required",
    "brand": "Brand is required",
    "material": "Material is required"
  },
  "timestamp": "2025-09-23T16:00:00Z"
}
```

### GET /api/admin/pipes/{id}

Get detailed pipe information for editing.

**Response (200):**
```json
{
  "id": "pipe123abc",
  "name": "Peterson Sherlock Holmes",
  "brand": "Peterson",
  "material": "Briar",
  "shape": "Billiard",
  "finish": "Smooth",
  "filter_type": "9mm",
  "stem_material": "Ebonite",
  "country": "Ireland",
  "observations": "Beautiful craftsmanship with excellent draw.",
  "is_active": true,
  "created_at": "2025-09-23T10:00:00Z",
  "updated_at": "2025-09-23T10:00:00Z",
  "images": [
    {
      "id": "img123",
      "filename": "peterson-holmes-1.jpg",
      "original_name": "peterson-sherlock-holmes.jpg",
      "file_size": 245760,
      "width": 1200,
      "height": 800,
      "is_featured": true,
      "alt_text": "Peterson Sherlock Holmes pipe side view",
      "sort_order": 0
    }
  ]
}
```

### PUT /api/admin/pipes/{id}

Update existing pipe.

**Request:**
```json
{
  "name": "Peterson Sherlock Holmes Baker Street",
  "brand": "Peterson",
  "material": "Briar",
  "shape": "Billiard",
  "finish": "Smooth",
  "filter_type": "9mm",
  "stem_material": "Ebonite",
  "country": "Ireland",
  "observations": "Updated description with better details.",
  "is_active": true
}
```

**Response (200):**
```json
{
  "id": "pipe123abc",
  "message": "Pipe updated successfully"
}
```

### DELETE /api/admin/pipes/{id}

Soft delete pipe (mark as inactive).

**Response (200):**
```json
{
  "message": "Pipe deleted successfully"
}
```

### PUT /api/admin/pipes/{id}/toggle-status

Toggle pipe active status.

**Response (200):**
```json
{
  "id": "pipe123abc",
  "is_active": false,
  "message": "Pipe status updated successfully"
}
```

## Tobacco Management

### GET /api/admin/tobaccos

List all tobaccos with admin details.

**Query Parameters:** Same as pipes endpoint.

**Response (200):**
```json
{
  "tobaccos": [
    {
      "id": "tob123abc",
      "name": "Early Morning Pipe",
      "brand": "Dunhill",
      "blend_type": "English",
      "contents": "Virginia, Oriental, Latakia",
      "cut": "Ribbon",
      "strength": 7,
      "room_note": 5,
      "taste": 8,
      "observations": "Classic English blend...",
      "is_active": true,
      "created_at": "2025-09-23T11:00:00Z",
      "updated_at": "2025-09-23T11:00:00Z",
      "images": [
        {
          "id": "img124",
          "filename": "dunhill-emp-tin.jpg",
          "is_featured": true
        }
      ],
      "rating_count": 8,
      "average_rating": 4.2,
      "comment_count": 5
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 3,
    "total_count": 23,
    "has_next": true,
    "has_prev": false
  }
}
```

### POST /api/admin/tobaccos

Create new tobacco.

**Request:**
```json
{
  "name": "Virginia Flake",
  "brand": "Samuel Gawith",
  "blend_type": "Virginia",
  "contents": "Pure Virginia tobacco",
  "cut": "Flake",
  "strength": 4,
  "room_note": 6,
  "taste": 7,
  "observations": "Pure Virginia with natural sweetness.",
  "is_active": true
}
```

**Response (201):**
```json
{
  "id": "tob456def",
  "message": "Tobacco created successfully"
}
```

### PUT /api/admin/tobaccos/{id}

Update existing tobacco.

### DELETE /api/admin/tobaccos/{id}

Soft delete tobacco.

## Accessory Management

### GET /api/admin/accessories

List all accessories with admin details.

### POST /api/admin/accessories

Create new accessory.

**Request:**
```json
{
  "name": "Czech Tool Deluxe",
  "brand": "Old Dominion",
  "category": "Tool",
  "description": "Premium multi-function pipe tool with leather case.",
  "observations": "High-quality construction, very popular.",
  "is_active": true
}
```

### PUT /api/admin/accessories/{id}

Update existing accessory.

### DELETE /api/admin/accessories/{id}

Soft delete accessory.

## Image Management

### POST /api/admin/upload-images

Upload images for collection items.

**Request:** FormData with files and metadata
```
Content-Type: multipart/form-data

files: [File objects]
item_id: "pipe123abc"
item_type: "pipe"
alt_text: ["Alt text for image 1", "Alt text for image 2"]
```

**Response (200):**
```json
{
  "uploaded_files": [
    {
      "id": "img789ghi",
      "filename": "pipe-upload-1672834567.jpg",
      "original_name": "my-pipe-photo.jpg",
      "file_size": 245760,
      "width": 1200,
      "height": 800,
      "alt_text": "Peterson pipe detail view"
    }
  ],
  "message": "2 images uploaded successfully"
}
```

**Validation Errors (400):**
```json
{
  "error": "File validation failed",
  "code": "FILE_VALIDATION_ERROR",
  "details": {
    "file_0": "File too large (max 10MB)",
    "file_1": "Invalid file type (only JPEG, PNG, WebP allowed)"
  },
  "timestamp": "2025-09-23T16:00:00Z"
}
```

### PUT /api/admin/images/{id}/toggle-featured

Set image as featured for its item.

**Response (200):**
```json
{
  "id": "img789ghi",
  "is_featured": true,
  "message": "Featured image updated successfully"
}
```

### DELETE /api/admin/images/{id}

Delete image.

**Response (200):**
```json
{
  "message": "Image deleted successfully"
}
```

### PUT /api/admin/images/{id}/reorder

Reorder images for an item.

**Request:**
```json
{
  "sort_order": 2
}
```

**Response (200):**
```json
{
  "message": "Image order updated successfully"
}
```

## Comment Moderation

### GET /api/admin/comments/pending

Get comments pending moderation.

**Query Parameters:**
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page, default 20
- `item_type` (optional): Filter by item type

**Response (200):**
```json
{
  "comments": [
    {
      "id": "com123abc",
      "content": "Great pipe with excellent draw!",
      "author_name": "John Doe",
      "session_id": "sess123",
      "created_at": "2025-09-23T16:00:00Z",
      "ip_address": "192.168.1.1",
      "item": {
        "id": "pipe123abc",
        "name": "Peterson Sherlock Holmes",
        "type": "pipe"
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_count": 3,
    "has_next": false,
    "has_prev": false
  }
}
```

### PUT /api/admin/comments/{id}/approve

Approve comment for public display.

**Response (200):**
```json
{
  "id": "com123abc",
  "is_approved": true,
  "moderated_at": "2025-09-23T16:00:00Z",
  "message": "Comment approved successfully"
}
```

### PUT /api/admin/comments/{id}/reject

Reject comment.

**Response (200):**
```json
{
  "message": "Comment rejected successfully"
}
```

### DELETE /api/admin/comments/{id}

Delete comment permanently.

**Response (200):**
```json
{
  "message": "Comment deleted successfully"
}
```

### POST /api/admin/comments/bulk-approve

Approve multiple comments at once.

**Request:**
```json
{
  "comment_ids": ["com123abc", "com456def", "com789ghi"]
}
```

**Response (200):**
```json
{
  "approved_count": 3,
  "message": "3 comments approved successfully"
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "code": "AUTH_REQUIRED",
  "timestamp": "2025-09-23T16:00:00Z"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions",
  "code": "FORBIDDEN",
  "timestamp": "2025-09-23T16:00:00Z"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found",
  "code": "NOT_FOUND",
  "timestamp": "2025-09-23T16:00:00Z"
}
```

### 422 Validation Error
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "field_name": "Field is required",
    "another_field": "Invalid format"
  },
  "timestamp": "2025-09-23T16:00:00Z"
}
```