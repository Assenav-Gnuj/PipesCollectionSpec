# Database Schema

Complete Prisma schema documentation for the Pipes & Tobacco Collection database.

## Overview

The database uses PostgreSQL with Prisma ORM. It consists of 7 main entities with relationships for a pipe and tobacco collection management system.

## Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │     │    Pipe     │     │   Tobacco   │
│ (Admin)     │     │             │     │             │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │ moderates         │ has               │ has
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Comment   │◄────┤    Image    │────►│  Accessory  │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                   ▲                   │
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                           ▼
                   ┌─────────────┐
                   │   Rating    │
                   │             │
                   └─────────────┘
```

## Models

### User (Admin)

Administrative users who can manage content.

```prisma
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  name              String
  passwordHash      String    @map("password_hash")
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")
  lastLogin         DateTime? @map("last_login")
  isActive          Boolean   @default(true) @map("is_active")
  moderatedComments Comment[] @relation("ModeratedBy")

  @@map("users")
}
```

**Fields:**
- `id`: Unique identifier (CUID)
- `email`: Login email (unique)
- `name`: Display name
- `passwordHash`: Bcrypt hashed password
- `createdAt`: Account creation timestamp
- `updatedAt`: Last modification timestamp
- `lastLogin`: Last successful login
- `isActive`: Account status flag
- `moderatedComments`: Comments moderated by this user

### Pipe

Individual smoking pipes in the collection.

```prisma
model Pipe {
  id           String    @id @default(cuid())
  name         String
  brand        String
  material     String
  shape        String
  finish       String
  filterType   String    @map("filter_type")
  stemMaterial String    @map("stem_material")
  country      String
  observations String?
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  isActive     Boolean   @default(true) @map("is_active")
  comments     Comment[] @relation("PipeComments")
  images       Image[]   @relation("PipeImages")
  ratings      Rating[]  @relation("PipeRatings")

  @@map("pipes")
}
```

**Fields:**
- `id`: Unique identifier (CUID)
- `name`: Pipe model name
- `brand`: Manufacturer brand
- `material`: Primary material (Briar, Meerschaum, etc.)
- `shape`: Pipe shape (Billiard, Dublin, etc.)
- `finish`: Surface finish (Smooth, Rusticated, etc.)
- `filterType`: Filter compatibility (9mm, 6mm, None)
- `stemMaterial`: Stem material (Ebonite, Acrylic, etc.)
- `country`: Country of origin
- `observations`: Admin notes (optional)
- `createdAt`: Creation timestamp
- `updatedAt`: Last modification timestamp
- `isActive`: Visibility flag
- `comments`: Related comments
- `images`: Related images
- `ratings`: Related ratings

### Tobacco

Tobacco products in the collection.

```prisma
model Tobacco {
  id           String    @id @default(cuid())
  name         String
  brand        String
  blendType    String    @map("blend_type")
  contents     String
  cut          String
  strength     Int
  roomNote     Int       @map("room_note")
  taste        Int
  observations String?
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  isActive     Boolean   @default(true) @map("is_active")
  comments     Comment[] @relation("TobaccoComments")
  images       Image[]   @relation("TobaccoImages")
  ratings      Rating[]  @relation("TobaccoRatings")

  @@map("tobaccos")
}
```

**Fields:**
- `id`: Unique identifier (CUID)
- `name`: Product name
- `brand`: Manufacturer brand
- `blendType`: Tobacco blend category (English, Virginia, Aromatic)
- `contents`: Tobacco leaf description
- `cut`: Processing cut (Ribbon, Flake, Plug)
- `strength`: Strength rating (1-9)
- `roomNote`: Room note rating (1-9)
- `taste`: Taste rating (1-9)
- `observations`: Admin notes (optional)
- `createdAt`: Creation timestamp
- `updatedAt`: Last modification timestamp
- `isActive`: Visibility flag
- `comments`: Related comments
- `images`: Related images
- `ratings`: Related ratings

### Accessory

Smoking accessories and related items.

```prisma
model Accessory {
  id           String    @id @default(cuid())
  name         String
  brand        String?
  category     String
  description  String
  observations String?
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  isActive     Boolean   @default(true) @map("is_active")
  comments     Comment[] @relation("AccessoryComments")
  images       Image[]   @relation("AccessoryImages")
  ratings      Rating[]  @relation("AccessoryRatings")

  @@map("accessories")
}
```

**Fields:**
- `id`: Unique identifier (CUID)
- `name`: Product name
- `brand`: Manufacturer brand (optional)
- `category`: Product category (Tool, Storage, Lighter, etc.)
- `description`: Detailed description
- `observations`: Admin notes (optional)
- `createdAt`: Creation timestamp
- `updatedAt`: Last modification timestamp
- `isActive`: Visibility flag
- `comments`: Related comments
- `images`: Related images
- `ratings`: Related ratings

### Image

Image storage for all collection items.

```prisma
model Image {
  id           String     @id @default(cuid())
  itemId       String     @map("item_id")
  itemType     ItemType   @map("item_type")
  filename     String     @unique
  originalName String     @map("original_name")
  fileSize     Int        @map("file_size")
  mimeType     String     @map("mime_type")
  width        Int
  height       Int
  isFeatured   Boolean    @default(false) @map("is_featured")
  altText      String     @map("alt_text")
  createdAt    DateTime   @default(now()) @map("created_at")
  sortOrder    Int        @default(0) @map("sort_order")
  pipe         Pipe?      @relation("PipeImages", fields: [itemId], references: [id])
  tobacco      Tobacco?   @relation("TobaccoImages", fields: [itemId], references: [id])
  accessory    Accessory? @relation("AccessoryImages", fields: [itemId], references: [id])

  @@unique([itemId, itemType, isFeatured], name: "one_featured_per_item")
  @@map("images")
}
```

**Fields:**
- `id`: Unique identifier (CUID)
- `itemId`: Reference to parent item
- `itemType`: Type of parent item (enum)
- `filename`: Stored filename (unique)
- `originalName`: Original upload filename
- `fileSize`: File size in bytes
- `mimeType`: MIME type (image/jpeg, image/png, image/webp)
- `width`: Image width in pixels
- `height`: Image height in pixels
- `isFeatured`: Featured image flag (one per item)
- `altText`: Accessibility description
- `createdAt`: Upload timestamp
- `sortOrder`: Display order
- `pipe`: Related pipe (if applicable)
- `tobacco`: Related tobacco (if applicable)
- `accessory`: Related accessory (if applicable)

**Constraints:**
- Only one featured image per item
- Maximum 5 images per item (enforced in business logic)

### Rating

User ratings for collection items.

```prisma
model Rating {
  id        String     @id @default(cuid())
  itemId    String     @map("item_id")
  itemType  ItemType   @map("item_type")
  sessionId String     @map("session_id")
  rating    Int
  createdAt DateTime   @default(now()) @map("created_at")
  ipAddress String?    @map("ip_address")
  pipe      Pipe?      @relation("PipeRatings", fields: [itemId], references: [id])
  tobacco   Tobacco?   @relation("TobaccoRatings", fields: [itemId], references: [id])
  accessory Accessory? @relation("AccessoryRatings", fields: [itemId], references: [id])

  @@unique([itemId, itemType, sessionId], name: "one_rating_per_session")
  @@map("ratings")
}
```

**Fields:**
- `id`: Unique identifier (CUID)
- `itemId`: Reference to rated item
- `itemType`: Type of rated item (enum)
- `sessionId`: Browser session identifier
- `rating`: Rating value (1-5)
- `createdAt`: Rating timestamp
- `ipAddress`: User IP (for analytics)
- `pipe`: Related pipe (if applicable)
- `tobacco`: Related tobacco (if applicable)
- `accessory`: Related accessory (if applicable)

**Constraints:**
- One rating per session per item
- Rating must be 1-5

### Comment

User comments on collection items.

```prisma
model Comment {
  id          String     @id @default(cuid())
  itemId      String     @map("item_id")
  itemType    ItemType   @map("item_type")
  content     String
  authorName  String?    @map("author_name")
  sessionId   String     @map("session_id")
  isApproved  Boolean    @default(false) @map("is_approved")
  moderatedBy String?    @map("moderated_by")
  moderatedAt DateTime?  @map("moderated_at")
  createdAt   DateTime   @default(now()) @map("created_at")
  ipAddress   String?    @map("ip_address")
  pipe        Pipe?      @relation("PipeComments", fields: [itemId], references: [id])
  tobacco     Tobacco?   @relation("TobaccoComments", fields: [itemId], references: [id])
  accessory   Accessory? @relation("AccessoryComments", fields: [itemId], references: [id])
  moderator   User?      @relation("ModeratedBy", fields: [moderatedBy], references: [id])

  @@map("comments")
}
```

**Fields:**
- `id`: Unique identifier (CUID)
- `itemId`: Reference to commented item
- `itemType`: Type of commented item (enum)
- `content`: Comment text (max 2000 chars)
- `authorName`: Optional commenter name (max 100 chars)
- `sessionId`: Browser session identifier
- `isApproved`: Moderation status (default false)
- `moderatedBy`: Admin who moderated
- `moderatedAt`: Moderation timestamp
- `createdAt`: Comment timestamp
- `ipAddress`: User IP (for moderation)
- `pipe`: Related pipe (if applicable)
- `tobacco`: Related tobacco (if applicable)
- `accessory`: Related accessory (if applicable)
- `moderator`: Admin who moderated

## Enums

### ItemType

Defines the types of collection items.

```prisma
enum ItemType {
  pipe
  tobacco
  accessory
}
```

## Database Indexes

### Performance Indexes

```sql
-- Collection item filtering
CREATE INDEX idx_pipe_brand ON pipes(brand);
CREATE INDEX idx_pipe_country ON pipes(country);
CREATE INDEX idx_tobacco_brand ON tobaccos(brand);
CREATE INDEX idx_tobacco_blend_type ON tobaccos(blend_type);
CREATE INDEX idx_accessory_category ON accessories(category);

-- Active item filtering
CREATE INDEX idx_pipe_active ON pipes(is_active, created_at);
CREATE INDEX idx_tobacco_active ON tobaccos(is_active, created_at);
CREATE INDEX idx_accessory_active ON accessories(is_active, created_at);

-- Image management
CREATE INDEX idx_image_item ON images(item_id, item_type);
CREATE INDEX idx_image_featured ON images(item_id, item_type, is_featured);

-- Rating aggregation
CREATE INDEX idx_rating_item ON ratings(item_id, item_type);

-- Comment moderation
CREATE INDEX idx_comment_moderation ON comments(is_approved, created_at);
CREATE INDEX idx_comment_item ON comments(item_id, item_type, is_approved);
```

### Unique Constraints

```sql
-- User constraints
CREATE UNIQUE INDEX idx_user_email ON users(email);

-- Rating constraints
CREATE UNIQUE INDEX idx_rating_session ON ratings(item_id, item_type, session_id);

-- Image constraints
CREATE UNIQUE INDEX idx_image_filename ON images(filename);
CREATE UNIQUE INDEX idx_featured_image ON images(item_id, item_type) WHERE is_featured = true;
```

## Database Migrations

The schema is managed through Prisma migrations. To apply migrations:

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Create migration files
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy
```

## Seeding Data

Sample data can be seeded using:

```bash
# Run seed script
npm run db:seed
```

The seed script creates:
- Default admin user
- Sample pipes, tobaccos, and accessories
- Sample comments and ratings
- Test images

## Environment Variables

Required database configuration:

```bash
# PostgreSQL connection
DATABASE_URL="postgresql://username:password@localhost:5432/pipes_collection?schema=public"

# Optional: Direct database URL for migrations
DIRECT_URL="postgresql://username:password@localhost:5432/pipes_collection?schema=public"
```