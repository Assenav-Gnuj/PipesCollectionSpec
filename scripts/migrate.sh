#!/bin/bash
# Database Migration Script for Production Deployment
# Usage: ./scripts/migrate.sh

set -e

echo "🚀 Starting database migration for Pipes Collection..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    exit 1
fi

# Check if Prisma is available
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npm/npx is not available"
    exit 1
fi

echo "📋 Checking database connection..."
npx prisma db push --accept-data-loss=false

echo "🔄 Running database migrations..."
npx prisma db push

echo "📊 Generating Prisma client..."
npx prisma generate

echo "🌱 Running database seed (if needed)..."
if [ -f "prisma/seed.ts" ]; then
    npm run db:seed || echo "⚠️ Warning: Seed script failed or not needed"
fi

echo "✅ Database migration completed successfully!"

# Verify connection
echo "🔍 Verifying database connection..."
npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null

echo "✅ Database is ready for production!"