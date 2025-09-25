# Coolify Deployment Guide

This document provides comprehensive instructions for deploying the Pipes & Tobacco Collection website on a VPS using Coolify.

## Prerequisites

- VPS with Coolify installed and configured
- Domain `www.cachimbosetabacos.com.br` pointing to your VPS IP
- SSH access to your VPS
- Basic familiarity with Docker and environment variables

## Pre-Deployment Setup

### 1. DNS Configuration

Point your domain to the VPS:
```bash
# A Record
www.cachimbosetabacos.com.br → YOUR_VPS_IP

# Optional: Naked domain redirect
cachimbosetabacos.com.br → YOUR_VPS_IP
```

### 2. Environment Variables

Copy the production environment template and customize:

```bash
cp .env.production .env
```

**Required Changes:**
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `POSTGRES_PASSWORD`: Strong password for database
- `MINIO_ACCESS_KEY` & `MINIO_SECRET_KEY`: MinIO credentials
- `ADMIN_PASSWORD_HASH`: Generate with bcrypt (see Admin Setup)

## Coolify Deployment Steps

### 1. Create New Project

In Coolify dashboard:
1. Click "New Project"
2. Project name: "Pipes Collection"
3. Description: "Pipes & Tobacco Collection Website"

### 2. Add Git Repository

1. Click "Add Source" → "Git Repository"
2. Repository URL: `https://github.com/Assenav-Gnuj/PipesCollectionSpec`
3. Branch: `main`
4. Build Pack: Docker
5. Dockerfile: Use `docker-compose.prod.yml`

### 3. Configure Environment Variables

In the project settings, add all variables from `.env.production`:

**Critical Variables:**
```env
NODE_ENV=production
DATABASE_URL=postgresql://pipes_user:YOUR_PASSWORD@postgres:5432/pipes_collection
NEXTAUTH_URL=https://www.cachimbosetabacos.com.br
NEXTAUTH_SECRET=YOUR_GENERATED_SECRET
POSTGRES_USER=pipes_user
POSTGRES_PASSWORD=YOUR_DB_PASSWORD
POSTGRES_DB=pipes_collection
REDIS_URL=redis://redis:6379
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=YOUR_MINIO_KEY
MINIO_SECRET_KEY=YOUR_MINIO_SECRET
MINIO_BUCKET=pipes-collection
ADMIN_EMAIL=admin@cachimbosetabacos.com.br
ADMIN_PASSWORD_HASH=YOUR_BCRYPT_HASH
```

### 4. Configure Domain

1. Go to "Domains" in your project
2. Add domain: `www.cachimbosetabacos.com.br`
3. Enable "Generate SSL Certificate"
4. Enable "Force HTTPS"

### 5. Deploy Application

1. Click "Deploy"
2. Monitor deployment logs
3. Wait for all services to be healthy

## Post-Deployment Tasks

### 1. Database Migration

SSH into your VPS and run:
```bash
docker exec -it <app_container_name> /app/scripts/migrate.sh
```

### 2. Verify Services

Check that all services are running:
```bash
# Check application health
curl https://www.cachimbosetabacos.com.br/api/health

# Check database connection
docker exec -it <postgres_container> psql -U pipes_user -d pipes_collection -c "SELECT 1;"

# Check MinIO
curl http://<your-vps-ip>:9001
```

### 3. Admin Setup

Generate admin password hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('YOUR_ADMIN_PASSWORD', 12))"
```

Update the `ADMIN_PASSWORD_HASH` environment variable in Coolify.

### 4. MinIO Configuration

1. Access MinIO console at `http://<your-vps-ip>:9001`
2. Login with your MINIO_ACCESS_KEY and MINIO_SECRET_KEY
3. Create bucket named `pipes-collection`
4. Set bucket policy to public for images (if needed)

## Backup Strategy

### Automated Backups

Set up a cron job on your VPS:
```bash
# Daily backup at 2 AM
0 2 * * * docker exec <app_container> /app/scripts/backup.sh daily

# Weekly backup on Sunday at 3 AM
0 3 * * 0 docker exec <app_container> /app/scripts/backup.sh weekly
```

### Manual Backup

```bash
docker exec -it <app_container> /app/scripts/backup.sh manual_$(date +%Y%m%d)
```

### Restore from Backup

```bash
docker exec -it <app_container> /app/scripts/restore.sh /app/backups/backup_file.sql.gz
```

## Monitoring

### Health Checks

The application includes built-in health checks:
- Application: `/api/health`
- Database: Automatic via Docker health checks
- Redis: Automatic via Docker health checks
- MinIO: Automatic via Docker health checks

### Logs

View application logs:
```bash
# Application logs
docker logs <app_container> -f

# Database logs
docker logs <postgres_container> -f

# Redis logs
docker logs <redis_container> -f
```

## Troubleshooting

### Common Issues

**1. Build Failures**
```bash
# Check build logs in Coolify
# Common issues: missing environment variables, Docker build context

# Fix: Ensure all required environment variables are set
```

**2. Database Connection Issues**
```bash
# Check database container status
docker ps | grep postgres

# Check database logs
docker logs <postgres_container>

# Verify DATABASE_URL format
```

**3. Image Upload Issues**
```bash
# Check MinIO container status
docker ps | grep minio

# Check MinIO logs
docker logs <minio_container>

# Verify MinIO credentials and bucket exists
```

**4. SSL Certificate Issues**
```bash
# Wait for Coolify to generate certificates (can take 5-10 minutes)
# Ensure DNS is properly configured
# Check Coolify proxy logs
```

### Performance Optimization

**1. Database Performance**
```sql
-- Run these queries periodically to maintain performance
VACUUM ANALYZE;
REINDEX DATABASE pipes_collection;
```

**2. Image Optimization**
- Images are automatically optimized by Next.js
- Consider setting up CDN if traffic increases

**3. Redis Configuration**
- Current setup includes memory limits and LRU eviction
- Monitor memory usage and adjust if needed

## Maintenance

### Regular Tasks

**Daily:**
- Monitor application health via `/api/health`
- Check disk space usage
- Review application logs for errors

**Weekly:**
- Review backup integrity
- Update dependencies (test in staging first)
- Check for security updates

**Monthly:**
- Review and rotate secrets
- Analyze performance metrics
- Clean up old logs and backups

### Updates

To update the application:
1. Test changes in development
2. Push to main branch
3. Coolify will automatically detect and deploy
4. Monitor deployment in Coolify dashboard
5. Verify application functionality post-deployment

## Security Considerations

- All sensitive data is stored in environment variables
- Database and Redis are not exposed to public internet
- MinIO should be configured with appropriate bucket policies
- Regular security updates via Coolify
- SSL/TLS encryption enabled by default

## Support

For deployment issues:
1. Check Coolify documentation: https://coolify.io/docs
2. Review application logs and health checks
3. Verify environment variable configuration
4. Check DNS and SSL certificate status

For application-specific issues, refer to the main README.md and development documentation.