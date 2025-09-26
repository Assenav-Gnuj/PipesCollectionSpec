-- Database initialization script for Pipes Collection
-- This script sets up basic database configuration

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create indexes for search performance
-- These will be created by Prisma migrations, but ensuring they exist
-- for optimal search performance

-- Set timezone
SET timezone = 'UTC';