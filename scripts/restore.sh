#!/bin/bash
# Database Restore Script for Pipes Collection
# Usage: ./scripts/restore.sh <backup_file.sql.gz>

set -e

if [ $# -eq 0 ]; then
    echo "❌ Error: No backup file specified"
    echo "Usage: $0 <backup_file.sql.gz>"
    echo ""
    echo "Available backups:"
    ls -la /app/backups/*.sql.gz 2>/dev/null || echo "No backups found in /app/backups/"
    exit 1
fi

BACKUP_FILE="$1"
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)

echo "🔄 Starting database restore from: $BACKUP_FILE"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    exit 1
fi

# Parse DATABASE_URL
DB_URL_REGEX="postgresql://([^:]+):([^@]+)@([^:]+):([^/]+)/(.+)"
if [[ $DATABASE_URL =~ $DB_URL_REGEX ]]; then
    DB_USER="${BASH_REMATCH[1]}"
    DB_PASS="${BASH_REMATCH[2]}"
    DB_HOST="${BASH_REMATCH[3]}"
    DB_PORT="${BASH_REMATCH[4]}"
    DB_NAME="${BASH_REMATCH[5]}"
else
    echo "❌ Error: Invalid DATABASE_URL format"
    exit 1
fi

# Set PostgreSQL password
export PGPASSWORD="$DB_PASS"

# Create a backup of current database before restore
echo "🗄️ Creating safety backup of current database..."
SAFETY_BACKUP="/tmp/safety_backup_${TIMESTAMP}.sql"
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
    --clean --no-owner --no-privileges > "$SAFETY_BACKUP"
echo "✅ Safety backup created: $SAFETY_BACKUP"

# Decompress and restore
echo "📦 Decompressing backup file..."
TEMP_SQL="/tmp/restore_${TIMESTAMP}.sql"
gunzip -c "$BACKUP_FILE" > "$TEMP_SQL"

echo "🔄 Restoring database..."
echo "⚠️ WARNING: This will overwrite the current database!"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Restore cancelled by user"
    rm -f "$TEMP_SQL"
    exit 1
fi

# Restore the database
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" < "$TEMP_SQL"

# Clean up temporary files
rm -f "$TEMP_SQL"

# Run migrations to ensure schema is up to date
echo "🔄 Running migrations to ensure schema compatibility..."
npx prisma db push

echo "✅ Database restore completed successfully!"
echo "🛡️ Safety backup available at: $SAFETY_BACKUP"
echo "🧹 Remember to clean up the safety backup when you're confident the restore was successful"