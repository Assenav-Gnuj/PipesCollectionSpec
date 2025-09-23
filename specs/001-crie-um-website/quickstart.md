# Quickstart Guide: Pipes & Tobacco Collection Website

## Development Setup

### Prerequisites
- Node.js 18+ installed
- Docker and Docker Compose installed
- Git for version control
- VS Code or preferred code editor

### Initial Setup
1. **Clone and initialize project**:
   ```bash
   git clone <repository-url>
   cd pipes-collection-website
   npm install
   ```

2. **Environment configuration**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your local settings
   ```

3. **Start development environment**:
   ```bash
   docker-compose up -d  # Start PostgreSQL, Redis, MinIO
   npm run dev           # Start Next.js development server
   ```

4. **Initialize database**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. **Access application**:
   - Frontend: http://localhost:3000
   - Admin panel: http://localhost:3000/admin
   - Database viewer: http://localhost:3000/admin/db

## Production Deployment (Coolify)

### Domain Configuration
1. **DNS Setup**:
   - Point www.cachimbosetabacos.com.br A record to your VPS IP
   - Configure CNAME for naked domain redirect (optional)

2. **Coolify Project Creation**:
   ```bash
   # In Coolify dashboard:
   # 1. Create new project: "Pipes Collection"
   # 2. Add Git repository source
   # 3. Set branch: main
   # 4. Configure domain: www.cachimbosetabacos.com.br
   ```

### Environment Variables (Coolify)
```bash
# Database
DATABASE_URL=postgresql://user:password@postgres:5432/pipes_collection
POSTGRES_USER=pipes_user
POSTGRES_PASSWORD=secure_password_here
POSTGRES_DB=pipes_collection

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://www.cachimbosetabacos.com.br

# Image Storage
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=minio_access_key
MINIO_SECRET_KEY=minio_secret_key
MINIO_BUCKET=pipes-collection

# Redis
REDIS_URL=redis://redis:6379

# Application
NODE_ENV=production
PORT=3000
```

### Coolify Services Configuration
```yaml
# coolify-docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis
      - minio

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      - MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}
      - MINIO_SECRET_KEY=${MINIO_SECRET_KEY}
    volumes:
      - minio_data:/data
    ports:
      - "9001:9001"

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

## User Acceptance Testing

### Public Website Testing
1. **Homepage functionality**:
   ```
   ✓ Visit https://www.cachimbosetabacos.com.br
   ✓ Verify hero section displays correctly
   ✓ Click "Explore Cachimbos" → navigate to pipes page
   ✓ Click "Descubra Tabacos" → navigate to tobaccos page
   ✓ Test search box with brand name
   ✓ Verify mobile responsiveness (resize browser)
   ```

2. **Pipes section testing**:
   ```
   ✓ Navigate to /cachimbos
   ✓ Verify pipe grid displays with images
   ✓ Test brand filter dropdown
   ✓ Test country filter dropdown
   ✓ Click "Ver detalhes" on any pipe
   ✓ Verify pipe specifications display
   ✓ Click images to enlarge
   ✓ Submit rating (1-5 stars)
   ✓ Submit comment (verify pending status)
   ✓ Click "Voltar para os Cachimbos"
   ```

3. **Tobaccos section testing**:
   ```
   ✓ Navigate to /tabacos
   ✓ Verify tobacco grid displays
   ✓ Test brand and blend type filters
   ✓ Click "Ver detalhes" on any tobacco
   ✓ Verify specifications and profile charts
   ✓ Test rating and comment functionality
   ✓ Verify "Voltar para os Tabacos" button
   ```

4. **Accessories section testing**:
   ```
   ✓ Navigate to /acessorios
   ✓ Verify accessories display correctly
   ✓ Test detail pages and functionality
   ```

### Admin Panel Testing
1. **Admin authentication**:
   ```
   ✓ Navigate to /admin
   ✓ Login with admin credentials
   ✓ Verify dashboard displays statistics
   ✓ Test logout functionality
   ```

2. **Content management testing**:
   ```
   ✓ Create new pipe with all specifications
   ✓ Upload 5 images for the pipe
   ✓ Set featured image
   ✓ Edit pipe details
   ✓ Create new tobacco with profile data
   ✓ Test accessibility features
   ✓ Verify changes appear on public site immediately
   ```

3. **Comment moderation testing**:
   ```
   ✓ Submit comment on public site
   ✓ View pending comments in admin
   ✓ Approve comment → verify appears on public site
   ✓ Test comment rejection functionality
   ```

### Performance Testing
1. **Core Web Vitals**:
   ```bash
   # Use Chrome DevTools or online tools
   ✓ First Contentful Paint < 2 seconds
   ✓ Largest Contentful Paint < 3 seconds
   ✓ Cumulative Layout Shift < 0.1
   ✓ First Input Delay < 100ms
   ```

2. **Load testing**:
   ```bash
   # Basic load testing
   ✓ Test homepage under concurrent users
   ✓ Test search functionality performance
   ✓ Test image loading and optimization
   ✓ Test admin panel responsiveness
   ```

### Accessibility Testing
1. **Keyboard navigation**:
   ```
   ✓ Tab through all interactive elements
   ✓ Test search box accessibility
   ✓ Test rating stars with keyboard
   ✓ Test admin panel navigation
   ```

2. **Screen reader compatibility**:
   ```
   ✓ Test with screen reader software
   ✓ Verify image alt text
   ✓ Test form labels and descriptions
   ✓ Verify heading hierarchy
   ```

## Deployment Checklist

### Pre-deployment
- [ ] All tests passing locally
- [ ] Environment variables configured
- [ ] SSL certificate ready
- [ ] Database migrations tested
- [ ] Image optimization verified
- [ ] Admin user created
- [ ] Sample content added for demo

### Post-deployment
- [ ] Domain resolves correctly
- [ ] SSL certificate active
- [ ] All pages load under 3 seconds
- [ ] Admin panel accessible
- [ ] Email notifications working (if implemented)
- [ ] Image uploads functional
- [ ] Search functionality working
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility tested

### Ongoing Maintenance
- [ ] Set up automated backups
- [ ] Configure monitoring and alerts
- [ ] Document admin procedures
- [ ] Plan content update workflow
- [ ] Monitor performance metrics
- [ ] Regular security updates

## Troubleshooting

### Common Issues
1. **Images not loading**:
   - Check MinIO configuration
   - Verify CORS settings
   - Test image upload permissions

2. **Slow page loads**:
   - Check database query performance
   - Verify image optimization
   - Test Redis cache functionality

3. **Admin login issues**:
   - Verify NextAuth configuration
   - Check session storage
   - Validate environment variables

4. **Search not working**:
   - Check PostgreSQL full-text search setup
   - Verify database indexes
   - Test search query syntax

### Support Contacts
- **Technical Issues**: Check application logs
- **Coolify Support**: Refer to Coolify documentation
- **Performance Issues**: Use browser DevTools
- **Database Issues**: Check PostgreSQL logs

This quickstart guide ensures smooth deployment and operation of your Pipes & Tobacco Collection website on your VPS with Coolify platform.