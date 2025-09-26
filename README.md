# Pipes & Tobacco Collection Website

A comprehensive web application for showcasing a curated pipes and tobacco collection with public browsing interface and administrative CMS. Built with Next.js 14, TypeScript, Prisma, and optimized for deployment on VPS with Coolify.

## 🚀 Features

- **Public Collection Browse**: Beautiful gallery interface for pipes, tobaccos, and accessories
- **Advanced Search**: Full-text search with filtering and sorting capabilities
- **Admin CMS**: Complete content management system for collection maintenance
- **Image Management**: Optimized image handling with automatic resizing and formats
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Performance Optimized**: Built for speed with Next.js optimization features
- **Production Ready**: Docker deployment with health checks and monitoring

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for session and data caching
- **Storage**: S3-compatible storage (MinIO) for images
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Deployment**: Docker + Coolify on VPS

## 📋 Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- PostgreSQL database
- Redis instance
- S3-compatible storage (or MinIO)

## 🏃‍♂️ Quick Start

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Assenav-Gnuj/PipesCollectionSpec.git
   cd PipesCollectionSpec
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database and service configurations
   ```

4. **Start development services**:
   ```bash
   docker-compose up -d postgres redis
   ```

5. **Set up database**:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

6. **Start development server**:
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🚀 Production Deployment

### Coolify Deployment (Recommended)

For complete deployment instructions on VPS with Coolify, see [DEPLOYMENT.md](./DEPLOYMENT.md).

**Quick Deployment Steps:**

1. **Prepare environment**:
   ```bash
   cp .env.production .env
   # Update .env with your production values
   ```

2. **Deploy with Coolify**:
   - Create new project in Coolify
   - Connect Git repository
   - Use `docker-compose.prod.yml`
   - Configure domain: `www.cachimbosetabacos.com.br`
   - Set environment variables
   - Deploy

3. **Post-deployment**:
   ```bash
   # Run database migrations
   docker exec -it <app_container> /app/scripts/migrate.sh
   
   # Verify health
   curl https://www.cachimbosetabacos.com.br/api/health
   ```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Or build manually
docker build -t pipes-collection .
docker run -p 3000:3000 pipes-collection
```

## 📖 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npm run db:migrate      # Run database migrations
npm run db:generate     # Generate Prisma client
npm run db:seed         # Seed database with sample data

# Docker
npm run docker:build    # Build Docker image
npm run docker:run      # Run with Docker Compose
npm run docker:stop     # Stop Docker services

# Backup & Restore
npm run backup          # Create database backup
npm run restore         # Restore from backup
```

## 🏗️ Project Structure

```
├── pages/                 # Next.js pages and API routes
├── src/
│   ├── components/       # React components
│   ├── lib/             # Utility libraries
│   └── styles/          # CSS and styling
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seed script
├── public/              # Static assets
├── scripts/             # Deployment and maintenance scripts
├── tests/               # Test files
├── specs/               # Project specifications
├── docker-compose.yml   # Development services
├── docker-compose.prod.yml # Production deployment
└── Dockerfile           # Production container
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/api/health.test.ts
```

## 📊 Monitoring & Health Checks

- **Health Check**: `GET /api/health`
- **Application Logs**: Via Docker logs or Coolify dashboard
- **Database Health**: Automatic via Docker health checks
- **Performance**: Built-in Next.js analytics and monitoring

## 🔧 Maintenance

### Backup Strategy

```bash
# Create backup
./scripts/backup.sh daily

# Restore from backup
./scripts/restore.sh /path/to/backup.sql.gz
```

### Database Migrations

```bash
# In production
./scripts/migrate.sh
```

### Updates

```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm install

# Rebuild and redeploy
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Complete Coolify deployment instructions
- [Specifications](./specs/001-crie-um-website/) - Detailed project specifications
- [API Documentation](./docs/api.md) - API endpoints and usage

## 🔒 Security

- Environment variables for sensitive data
- Docker security best practices
- Rate limiting on API endpoints
- Input validation and sanitization
- Secure session management

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For deployment issues or questions:
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for common issues
- Review application logs and health checks
- Verify environment variable configuration
- Check DNS and SSL certificate status

---

**Target Domain**: www.cachimbosetabacos.com.br  
**Deployment Platform**: Coolify on VPS  
**Maintenance**: Automated backups and health monitoring
