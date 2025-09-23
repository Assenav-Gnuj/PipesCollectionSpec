# Data Model: Pipes & Tobacco Collection Website

## Entity Relationship Overview

```
Admin User (1) ─── manages ──→ (many) Collection Items
Collection Items ← inherited by → [Pipe, Tobacco, Accessory]
Collection Items (1) ─── has ──→ (many) Images
Collection Items (1) ─── receives ──→ (many) Ratings
Collection Items (1) ─── receives ──→ (many) Comments
Images (1) ─── designated as ──→ Featured Image per Item
Ratings ── tracked by → User Sessions (duplicate prevention)
Comments ── moderated by → Admin User
```

## Core Entities

### User (Admin)
**Purpose**: Administrative access for content management
**Primary Key**: id (UUID)
**Fields**:
- id: UUID, primary key, auto-generated
- email: String, unique, required (authentication identifier)
- name: String, required (display name)
- password_hash: String, required (secure authentication)
- created_at: DateTime, auto-generated
- updated_at: DateTime, auto-updated
- last_login: DateTime, nullable
- is_active: Boolean, default true (account status)

**Relationships**:
- One-to-many with Comments (moderation actions)
- Audit trail for all content modifications

**Validation Rules**:
- Email format validation
- Password minimum 8 characters with complexity requirements
- Unique email constraint

### Pipe
**Purpose**: Individual pipe items in the collection
**Primary Key**: id (UUID)
**Fields**:
- id: UUID, primary key, auto-generated
- name: String, required, max 200 characters
- brand: String, required, max 100 characters (indexed for filtering)
- material: String, required, max 100 characters (e.g., "Briar", "Meerschaum")
- shape: String, required, max 100 characters (e.g., "Billiard", "Dublin")
- finish: String, required, max 100 characters (e.g., "Smooth", "Rusticated")
- filter_type: String, required, max 50 characters (e.g., "9mm", "None")
- stem_material: String, required, max 100 characters (e.g., "Ebonite", "Acrylic")
- country: String, required, max 100 characters (indexed for filtering)
- observations: Text, nullable (admin notes)
- created_at: DateTime, auto-generated
- updated_at: DateTime, auto-updated
- is_active: Boolean, default true (visibility status)

**Relationships**:
- One-to-many with Images
- One-to-many with Ratings
- One-to-many with Comments
- One-to-one with featured Image

**Validation Rules**:
- All required fields must be non-empty
- Name uniqueness within brand constraint
- Country from predefined list for consistency

### Tobacco
**Purpose**: Tobacco products in the collection
**Primary Key**: id (UUID)
**Fields**:
- id: UUID, primary key, auto-generated
- name: String, required, max 200 characters
- brand: String, required, max 100 characters (indexed for filtering)
- blend_type: String, required, max 100 characters (indexed, e.g., "English", "Virginia")
- contents: Text, required (tobacco leaf description)
- cut: String, required, max 100 characters (e.g., "Ribbon", "Flake")
- strength: Integer, required, range 1-9 (flavor profile)
- room_note: Integer, required, range 1-9 (flavor profile)
- taste: Integer, required, range 1-9 (flavor profile)
- observations: Text, nullable (admin notes)
- created_at: DateTime, auto-generated
- updated_at: DateTime, auto-updated
- is_active: Boolean, default true (visibility status)

**Relationships**:
- One-to-many with Images
- One-to-many with Ratings
- One-to-many with Comments
- One-to-one with featured Image

**Validation Rules**:
- All required fields must be non-empty
- Strength, room_note, taste must be integers 1-9
- Name uniqueness within brand constraint
- Blend type from predefined list

### Accessory
**Purpose**: Smoking accessories and related items
**Primary Key**: id (UUID)
**Fields**:
- id: UUID, primary key, auto-generated
- name: String, required, max 200 characters
- brand: String, nullable, max 100 characters
- category: String, required, max 100 characters (e.g., "Tool", "Storage", "Lighter")
- description: Text, required (detailed description)
- observations: Text, nullable (admin notes)
- created_at: DateTime, auto-generated
- updated_at: DateTime, auto-updated
- is_active: Boolean, default true (visibility status)

**Relationships**:
- One-to-many with Images
- One-to-many with Ratings
- One-to-many with Comments
- One-to-one with featured Image

**Validation Rules**:
- Required fields must be non-empty
- Category from predefined list for consistency

### Image
**Purpose**: Photo storage for all collection items
**Primary Key**: id (UUID)
**Fields**:
- id: UUID, primary key, auto-generated
- item_id: UUID, required (foreign key to pipe/tobacco/accessory)
- item_type: String, required (enum: "pipe", "tobacco", "accessory")
- filename: String, required, unique (storage identifier)
- original_name: String, required (user uploaded filename)
- file_size: Integer, required (bytes)
- mime_type: String, required (e.g., "image/jpeg")
- width: Integer, required (pixel width)
- height: Integer, required (pixel height)
- is_featured: Boolean, default false (featured image flag)
- alt_text: String, required (accessibility description)
- created_at: DateTime, auto-generated
- sort_order: Integer, default 0 (display ordering)

**Relationships**:
- Many-to-one with Pipe/Tobacco/Accessory (polymorphic)
- Constraint: max 5 images per item
- Constraint: exactly 1 featured image per item

**Validation Rules**:
- Supported MIME types: image/jpeg, image/png, image/webp
- Maximum file size: 10MB
- Minimum dimensions: 400x400 pixels
- Maximum dimensions: 4000x4000 pixels
- Alt text required for accessibility

### Rating
**Purpose**: User star ratings (1-5) for collection items
**Primary Key**: id (UUID)
**Fields**:
- id: UUID, primary key, auto-generated
- item_id: UUID, required (foreign key to pipe/tobacco/accessory)
- item_type: String, required (enum: "pipe", "tobacco", "accessory")
- session_id: String, required (browser session identifier)
- rating: Integer, required, range 1-5
- created_at: DateTime, auto-generated
- ip_address: String, nullable (for analytics, not identification)

**Relationships**:
- Many-to-one with Pipe/Tobacco/Accessory (polymorphic)
- Constraint: one rating per session per item

**Validation Rules**:
- Rating must be integer 1-5
- Session ID required for duplicate prevention
- Unique constraint on (item_id, item_type, session_id)

### Comment
**Purpose**: User comments on collection items
**Primary Key**: id (UUID)
**Fields**:
- id: UUID, primary key, auto-generated
- item_id: UUID, required (foreign key to pipe/tobacco/accessory)
- item_type: String, required (enum: "pipe", "tobacco", "accessory")
- content: Text, required, max 2000 characters
- author_name: String, nullable, max 100 characters (optional user name)
- session_id: String, required (browser session identifier)
- is_approved: Boolean, default false (moderation status)
- moderated_by: UUID, nullable (admin who approved/rejected)
- moderated_at: DateTime, nullable (moderation timestamp)
- created_at: DateTime, auto-generated
- ip_address: String, nullable (for moderation purposes)

**Relationships**:
- Many-to-one with Pipe/Tobacco/Accessory (polymorphic)
- Many-to-one with User (moderation relationship)

**Validation Rules**:
- Content length 1-2000 characters
- Content must pass profanity filter
- Author name optional but if provided, 1-100 characters
- Session ID required for tracking

## Database Indexes

### Performance Indexes
```sql
-- Collection item filtering
CREATE INDEX idx_pipe_brand ON pipes(brand);
CREATE INDEX idx_pipe_country ON pipes(country);
CREATE INDEX idx_tobacco_brand ON tobaccos(brand);
CREATE INDEX idx_tobacco_blend_type ON tobaccos(blend_type);
CREATE INDEX idx_accessory_category ON accessories(category);

-- Search optimization
CREATE INDEX idx_pipe_search ON pipes USING GIN(to_tsvector('english', name || ' ' || brand));
CREATE INDEX idx_tobacco_search ON tobaccos USING GIN(to_tsvector('english', name || ' ' || brand));
CREATE INDEX idx_accessory_search ON accessories USING GIN(to_tsvector('english', name || ' ' || coalesce(brand, '')));

-- Image management
CREATE INDEX idx_image_item ON images(item_id, item_type);
CREATE INDEX idx_image_featured ON images(item_id, item_type, is_featured);

-- Rating aggregation
CREATE INDEX idx_rating_item ON ratings(item_id, item_type);

-- Comment moderation
CREATE INDEX idx_comment_moderation ON comments(is_approved, created_at);
CREATE INDEX idx_comment_item ON comments(item_id, item_type, is_approved);
```

### Constraint Indexes
```sql
-- Unique constraints
CREATE UNIQUE INDEX idx_user_email ON users(email);
CREATE UNIQUE INDEX idx_rating_session ON ratings(item_id, item_type, session_id);
CREATE UNIQUE INDEX idx_image_filename ON images(filename);

-- Featured image constraint (one per item)
CREATE UNIQUE INDEX idx_featured_image ON images(item_id, item_type) WHERE is_featured = true;
```

## Data Integrity Rules

### Business Logic Constraints
1. **Featured Image Rule**: Each collection item must have exactly one featured image
2. **Image Limit Rule**: Maximum 5 images per collection item
3. **Rating Uniqueness**: One rating per session per item (prevent duplicate votes)
4. **Comment Moderation**: Comments visible only after admin approval
5. **Soft Delete**: Items marked inactive rather than deleted (preserve ratings/comments)

### Validation Layer
1. **Input Sanitization**: All text fields sanitized against XSS attacks
2. **File Upload Security**: Image MIME type validation and size limits
3. **Rate Limiting**: Session-based limits on rating and comment submission
4. **Content Filtering**: Automated profanity detection for comments

### Data Migration Strategy
1. **Schema Versioning**: Prisma migrations for all schema changes
2. **Backward Compatibility**: New fields nullable or with defaults
3. **Data Seeding**: Initial admin user and sample data for testing
4. **Backup Strategy**: Automated daily backups with retention policy

This data model provides a robust foundation for the collection website while maintaining simplicity for beginner-friendly management and deployment.