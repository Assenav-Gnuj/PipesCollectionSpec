# Development Setup Guide

Complete guide for setting up the Pipes & Tobacco Collection backend for local development.

## Prerequisites

### Required Software

- **Node.js**: Version 18.0 or later
- **npm**: Version 8.0 or later (comes with Node.js)
- **PostgreSQL**: Version 13 or later
- **Git**: For version control

### System Requirements

- **OS**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: At least 2GB free space

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Assenav-Gnuj/PipesCollectionSpec.git
cd PipesCollectionSpec
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- Prisma ORM
- NextAuth.js
- PostgreSQL client
- TypeScript
- Tailwind CSS

### 3. Database Setup

#### Option A: Local PostgreSQL Installation

Install PostgreSQL on your system:

**Windows:**
```bash
# Using Chocolatey
choco install postgresql

# Or download from https://www.postgresql.org/download/windows/
```

**macOS:**
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql

# Create database
createdb pipes_collection
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres createdb pipes_collection
```

#### Option B: Docker PostgreSQL

```bash
# Start PostgreSQL with Docker
docker run --name postgres-pipes \
  -e POSTGRES_DB=pipes_collection \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

#### Option C: Docker Compose (Recommended)

```bash
# Start all services including PostgreSQL and Redis
docker-compose up -d
```

### 4. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```bash
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/pipes_collection?schema=public"

# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-min-32-chars

# File Upload Configuration
UPLOAD_DIR=./public/uploads
MAX_FILE_SIZE=10485760  # 10MB in bytes

# Redis Configuration (Optional - for caching)
REDIS_URL=redis://localhost:6379

# Development Settings
NODE_ENV=development
```

**Important**: Generate a secure `NEXTAUTH_SECRET`:
```bash
# Generate a random 32-character string
openssl rand -base64 32
```

### 5. Database Migration and Seeding

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

The seed script will create:
- Default admin user (admin@example.com / password)
- Sample pipes, tobaccos, and accessories
- Sample images and ratings
- Test comments

### 6. Verify Installation

Start the development server:

```bash
npm run dev
```

The application should be available at:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api

Test the API endpoints:
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test pipes endpoint
curl http://localhost:3000/api/pipes

# Test admin endpoint (should return 401)
curl http://localhost:3000/api/admin/dashboard
```

## Development Workflow

### 1. Starting Development

```bash
# Start development server with hot reload
npm run dev

# Start in different port
npm run dev -- -p 3001
```

### 2. Database Operations

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset
npm run db:seed

# Create new migration
npx prisma migrate dev --name your_migration_name

# Generate Prisma client after schema changes
npm run db:generate
```

### 3. Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/api/health.test.ts

# Run tests in watch mode
npm test -- --watch
```

### 4. Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint -- --fix

# Format code with Prettier
npm run format

# Type checking
npx tsc --noEmit
```

### 5. Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start

# Analyze bundle size
npm run analyze
```

## Admin User Setup

### Default Admin Account

The seed script creates a default admin account:
- **Email**: admin@example.com
- **Password**: password

### Creating Additional Admin Users

Use Prisma Studio or direct database access:

```bash
# Open Prisma Studio
npx prisma studio
```

Navigate to the `User` model and create a new user with:
- **email**: your-email@example.com
- **name**: Your Name
- **passwordHash**: Use bcrypt to hash your password
- **isActive**: true

Or use a script to create admin users:

```typescript
// scripts/create-admin.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4];

  if (!email || !password || !name) {
    console.error('Usage: npm run create-admin <email> <password> <name>');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      isActive: true,
    },
  });

  console.log('Admin user created:', user.email);
}

createAdmin().finally(() => prisma.$disconnect());
```

Run with:
```bash
npx tsx scripts/create-admin.ts admin@example.com mypassword "Admin Name"
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Error**: `Error: Can't reach database server`

**Solutions**:
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL format
- Ensure database exists: `createdb pipes_collection`
- Check firewall settings

#### 2. Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions**:
```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Or start on different port
npm run dev -- -p 3001
```

#### 3. Prisma Generation Error

**Error**: `Error: Prisma schema validation failed`

**Solutions**:
- Check prisma/schema.prisma syntax
- Ensure DATABASE_URL is correct
- Run `npx prisma format`
- Restart TypeScript server in IDE

#### 4. NextAuth.js Session Error

**Error**: `[next-auth][error][JWT_SESSION_ERROR]`

**Solutions**:
- Ensure NEXTAUTH_SECRET is set and at least 32 characters
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies
- Restart development server

#### 5. File Upload Issues

**Error**: Images not uploading or displaying

**Solutions**:
- Check UPLOAD_DIR exists and is writable
- Verify MAX_FILE_SIZE setting
- Ensure proper file permissions
- Check browser console for errors

### Debug Mode

Enable debug logging:

```bash
# Enable debug logs
DEBUG=* npm run dev

# NextAuth.js specific debugging
NEXTAUTH_DEBUG=true npm run dev

# Prisma query logging
DATABASE_LOGGING=true npm run dev
```

### Health Check

Create a health check script to verify all services:

```bash
# Create health-check.sh
#!/bin/bash

echo "Checking application health..."

# Check Node.js
node --version || echo "❌ Node.js not found"

# Check npm
npm --version || echo "❌ npm not found"

# Check PostgreSQL
pg_isready -h localhost -p 5432 || echo "❌ PostgreSQL not running"

# Check application
curl -f http://localhost:3000/api/health || echo "❌ Application not responding"

echo "✅ Health check complete"
```

## Next Steps

1. **Explore the API**: Use the [API Documentation](../api/README.md)
2. **Build a Frontend**: Follow the [Frontend Guides](../frontend-guides/)
3. **Customize**: Modify the schema and add your own features
4. **Deploy**: Follow the [Deployment Guide](./production.md)

## Getting Help

- Check the [Troubleshooting Guide](./troubleshooting.md)
- Review [API Documentation](../api/)
- Look at example implementations in [Examples](../examples/)
- Check GitHub Issues for known problems

---

**Quick Start Summary**:
```bash
git clone https://github.com/Assenav-Gnuj/PipesCollectionSpec.git
cd PipesCollectionSpec
npm install
cp .env.example .env
# Edit .env with your database URL
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```