#!/bin/bash
# Database Backup Script for Pipes Collection
# Usage: ./scripts/backup.sh [backup_name]

set -e

BACKUP_NAME=${1:-"backup_$(date +%Y%m%d_%H%M%S)"}
BACKUP_DIR="/app/backups"
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)

echo "🗄️ Starting database backup: $BACKUP_NAME"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Extract database connection details from DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    exit 1
fi

# Parse DATABASE_URL (format: postgresql://user:password@host:port/database)
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

# Set PostgreSQL password for pg_dump
export PGPASSWORD="$DB_PASS"

# Create database dump
BACKUP_FILE="$BACKUP_DIR/${BACKUP_NAME}_${TIMESTAMP}.sql"
echo "📦 Creating database dump..."
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
    --verbose --clean --no-owner --no-privileges \
    --format=plain > "$BACKUP_FILE"

# Compress the backup
echo "🗜️ Compressing backup..."
gzip "$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

# Create backup metadata
METADATA_FILE="$BACKUP_DIR/${BACKUP_NAME}_${TIMESTAMP}.json"
cat > "$METADATA_FILE" << EOF
{
  "backup_name": "$BACKUP_NAME",
  "timestamp": "$TIMESTAMP",
  "database": "$DB_NAME",
  "host": "$DB_HOST",
  "file": "$(basename "$BACKUP_FILE")",
  "size": "$(du -h "$BACKUP_FILE" | cut -f1)"
}
EOF

echo "✅ Backup completed successfully!"
echo "📁 Backup file: $BACKUP_FILE"
echo "📋 Metadata: $METADATA_FILE"

# Clean up old backups (keep last 7 days)
echo "🧹 Cleaning up old backups..."
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.json" -mtime +7 -delete

echo "✅ Backup process completed!"