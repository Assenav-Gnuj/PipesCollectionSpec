# Collection Endpoints

Documentation for accessing collection items (pipes, tobaccos, accessories).

## Pipes

### GET /api/pipes

Retrieve all active pipes with filtering and pagination.

**Query Parameters:**
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page (1-100), default 20
- `search` (optional): Search in name and brand
- `brand` (optional): Filter by brand
- `country` (optional): Filter by country  
- `material` (optional): Filter by material
- `shape` (optional): Filter by shape
- `sortBy` (optional): Sort field (name, brand, createdAt), default createdAt
- `sortOrder` (optional): Sort direction (asc, desc), default desc

**Example Request:**
```bash
GET /api/pipes?page=1&limit=10&brand=Peterson&country=Ireland
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "clm123abc",
      "name": "Peterson Sherlock Holmes Baker Street",
      "brand": "Peterson",
      "material": "Briar",
      "shape": "Billiard", 
      "finish": "Smooth",
      "filter_type": "9mm",
      "stem_material": "Ebonite",
      "country": "Ireland",
      "created_at": "2025-09-23T10:00:00Z",
      "featured_image": {
        "id": "img123",
        "filename": "peterson-baker-street-1.jpg",
        "alt_text": "Peterson Baker Street pipe side view",
        "width": 1200,
        "height": 800
      },
      "average_rating": 4.5,
      "rating_count": 12,
      "comment_count": 8
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_count": 45,
      "has_next": true,
      "has_prev": false
    },
    "filters": {
      "available_brands": ["Peterson", "Savinelli", "Dunhill"],
      "available_countries": ["Ireland", "Italy", "England"],
      "available_materials": ["Briar", "Meerschaum", "Corn Cob"],
      "available_shapes": ["Billiard", "Dublin", "Bent", "Straight"]
    }
  }
}
```

### GET /api/pipes/{id}

Retrieve detailed information for a single pipe.

**Path Parameters:**
- `id`: Pipe ID (UUID)

**Example Request:**
```bash
GET /api/pipes/clm123abc
```

**Response (200):**
```json
{
  "data": {
    "id": "clm123abc",
    "name": "Peterson Sherlock Holmes Baker Street",
    "brand": "Peterson",
    "material": "Briar",
    "shape": "Billiard",
    "finish": "Smooth", 
    "filter_type": "9mm",
    "stem_material": "Ebonite",
    "country": "Ireland",
    "observations": "Beautiful craftsmanship with excellent draw and cool smoking characteristics.",
    "created_at": "2025-09-23T10:00:00Z",
    "updated_at": "2025-09-23T10:00:00Z",
    "images": [
      {
        "id": "img123",
        "filename": "peterson-baker-street-1.jpg",
        "alt_text": "Peterson Baker Street pipe side view",
        "width": 1200,
        "height": 800,
        "is_featured": true,
        "sort_order": 0
      },
      {
        "id": "img124", 
        "filename": "peterson-baker-street-2.jpg",
        "alt_text": "Peterson Baker Street pipe bowl detail",
        "width": 1200,
        "height": 800,
        "is_featured": false,
        "sort_order": 1
      }
    ],
    "ratings": {
      "average": 4.5,
      "count": 12,
      "distribution": {
        "5": 6,
        "4": 4,
        "3": 2,
        "2": 0,
        "1": 0
      }
    },
    "comment_count": 8
  }
}
```

## Tobaccos

### GET /api/tobaccos

Retrieve all active tobaccos with filtering and pagination.

**Query Parameters:**
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page (1-100), default 20
- `search` (optional): Search in name and brand
- `brand` (optional): Filter by brand
- `blend_type` (optional): Filter by blend type
- `strength` (optional): Filter by strength range (e.g., "3-7")
- `sortBy` (optional): Sort field (name, brand, strength, createdAt), default createdAt
- `sortOrder` (optional): Sort direction (asc, desc), default desc

**Example Request:**
```bash
GET /api/tobaccos?blend_type=English&strength=5-8
```

**Response (200):**
```json
{
  "data": [
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
      "created_at": "2025-09-23T11:00:00Z",
      "featured_image": {
        "id": "img125",
        "filename": "dunhill-emp-tin.jpg",
        "alt_text": "Dunhill Early Morning Pipe tobacco tin",
        "width": 800,
        "height": 800
      },
      "average_rating": 4.2,
      "rating_count": 8,
      "comment_count": 5
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "total_pages": 2,
      "total_count": 23,
      "has_next": true,
      "has_prev": false
    },
    "filters": {
      "available_brands": ["Dunhill", "Cornell & Diehl", "G.L. Pease"],
      "available_blend_types": ["English", "Virginia", "Aromatic", "Burley"],
      "available_cuts": ["Ribbon", "Flake", "Plug", "Cube Cut"],
      "strength_range": { "min": 1, "max": 9 }
    }
  }
}
```

### GET /api/tobaccos/{id}

Retrieve detailed information for a single tobacco.

**Response (200):**
```json
{
  "data": {
    "id": "tob123abc",
    "name": "Early Morning Pipe",
    "brand": "Dunhill",
    "blend_type": "English",
    "contents": "Virginia, Oriental, Latakia, small amount of Perique",
    "cut": "Ribbon",
    "strength": 7,
    "room_note": 5,  
    "taste": 8,
    "observations": "Classic English blend with moderate Latakia. Perfect for morning smoking with excellent balance.",
    "created_at": "2025-09-23T11:00:00Z",
    "updated_at": "2025-09-23T11:00:00Z",
    "images": [
      {
        "id": "img125",
        "filename": "dunhill-emp-tin.jpg", 
        "alt_text": "Dunhill Early Morning Pipe tobacco tin",
        "width": 800,
        "height": 800,
        "is_featured": true,
        "sort_order": 0
      }
    ],
    "ratings": {
      "average": 4.2,
      "count": 8,
      "distribution": {
        "5": 2,
        "4": 4,
        "3": 2,
        "2": 0,
        "1": 0
      }
    },
    "comment_count": 5
  }
}
```

## Accessories

### GET /api/accessories

Retrieve all active accessories with filtering and pagination.

**Query Parameters:**
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page (1-100), default 20
- `search` (optional): Search in name, brand, and description
- `brand` (optional): Filter by brand
- `category` (optional): Filter by category
- `sortBy` (optional): Sort field (name, brand, category, createdAt), default createdAt
- `sortOrder` (optional): Sort direction (asc, desc), default desc

**Example Request:**
```bash
GET /api/accessories?category=Tool
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "acc123abc",
      "name": "Czech Tool",
      "brand": "Old Dominion",
      "category": "Tool",
      "description": "Multi-purpose pipe tool with tamper, reamer, and pick. Essential for pipe maintenance.",
      "created_at": "2025-09-23T12:00:00Z",
      "featured_image": {
        "id": "img126",
        "filename": "czech-tool-silver.jpg",
        "alt_text": "Silver Czech pipe tool with three functions",
        "width": 600,
        "height": 400
      },
      "average_rating": 4.8,
      "rating_count": 5,
      "comment_count": 3
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_count": 15,
      "has_next": false,
      "has_prev": false
    },
    "filters": {
      "available_brands": ["Old Dominion", "Peterson", "Zippo"],
      "available_categories": ["Tool", "Storage", "Lighter", "Cleaner", "Stand"]
    }
  }
}
```

### GET /api/accessories/{id}

Retrieve detailed information for a single accessory.

**Response (200):**
```json
{
  "data": {
    "id": "acc123abc",
    "name": "Czech Tool",
    "brand": "Old Dominion", 
    "category": "Tool",
    "description": "Multi-purpose pipe tool with tamper, reamer, and pick. Made from high-quality materials with comfortable grip. Essential for proper pipe maintenance and cleaning.",
    "observations": "Excellent build quality. Very popular among pipe smokers for daily use.",
    "created_at": "2025-09-23T12:00:00Z",
    "updated_at": "2025-09-23T12:00:00Z",
    "images": [
      {
        "id": "img126",
        "filename": "czech-tool-silver.jpg",
        "alt_text": "Silver Czech pipe tool with three functions", 
        "width": 600,
        "height": 400,
        "is_featured": true,
        "sort_order": 0
      }
    ],
    "ratings": {
      "average": 4.8,
      "count": 5,
      "distribution": {
        "5": 4,
        "4": 1,
        "3": 0,
        "2": 0,
        "1": 0
      }
    },
    "comment_count": 3
  }
}
```

## Error Responses

### 404 Not Found
```json
{
  "error": "Item not found",
  "code": "ITEM_NOT_FOUND",
  "timestamp": "2025-09-23T12:00:00Z"
}
```

### 400 Bad Request  
```json
{
  "error": "Invalid query parameters",
  "code": "INVALID_PARAMETERS",
  "details": {
    "limit": "Must be between 1 and 100",
    "page": "Must be a positive integer"
  },
  "timestamp": "2025-09-23T12:00:00Z"
}
```