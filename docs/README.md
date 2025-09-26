# Pipes & Tobacco Collection Backend API Documentation

Complete documentation for building custom frontends using the Pipes & Tobacco Collection backend API.

## Overview

This documentation provides everything you need to create a new frontend application in any language or framework to interact with the existing backend system. The backend is built with Next.js 14, Prisma ORM, and PostgreSQL.

## What's Included

### 📚 API Documentation
- [Complete API Reference](./api/README.md) - All endpoints with request/response examples
- [Authentication Guide](./api/authentication.md) - NextAuth.js integration
- [Error Handling](./api/errors.md) - Standard error responses and codes

### 🗄️ Database Documentation  
- [Database Schema](./database/schema.md) - Complete Prisma schema with relationships
- [Data Models](./database/models.md) - Entity descriptions and validation rules
- [Sample Data](./database/sample-data.md) - Example records for testing

### 🖥️ Frontend Implementation Guides
- [React/Next.js](./frontend-guides/react-nextjs.md) - React-based frontend
- [Vue.js](./frontend-guides/vuejs.md) - Vue 3 implementation
- [Angular](./frontend-guides/angular.md) - Angular frontend
- [Pure JavaScript](./frontend-guides/vanilla-js.md) - Framework-free implementation
- [Mobile (React Native)](./frontend-guides/react-native.md) - Mobile app development
- [Python/Django](./frontend-guides/python-django.md) - Python web framework
- [PHP/Laravel](./frontend-guides/php-laravel.md) - PHP framework

### 💡 Examples & Templates
- [Code Examples](./examples/) - Working code snippets in multiple languages
- [API Client Libraries](./examples/clients/) - Pre-built API clients
- [Sample Applications](./examples/apps/) - Complete example implementations

### 🚀 Deployment & Setup
- [Development Setup](./deployment/setup.md) - Local development environment
- [Environment Configuration](./deployment/environment.md) - Required environment variables
- [Database Setup](./deployment/database.md) - PostgreSQL configuration and seeding

## Quick Start

1. **Understand the System**: Start with the [API Overview](./api/README.md)
2. **Choose Your Tech Stack**: Review [Frontend Guides](./frontend-guides/) for your preferred technology
3. **Set Up Development**: Follow the [Development Setup](./deployment/setup.md) guide
4. **Build Your Frontend**: Use the provided examples and documentation to implement your frontend

## Architecture Overview

```
┌─────────────────┐    HTTP/REST     ┌──────────────────┐
│   Your Frontend │ ◄──────────────► │   Backend API    │
│   (Any Tech)    │                  │   (Next.js 14)   │
└─────────────────┘                  └──────────────────┘
                                               │
                                               ▼
                                      ┌──────────────────┐
                                      │   PostgreSQL     │
                                      │   Database       │
                                      └──────────────────┘
```

## Core Features

- **Collection Management**: Pipes, tobaccos, and accessories with full CRUD operations
- **Image Handling**: Multi-image support with featured image selection
- **User Interactions**: Ratings and comments system with moderation
- **Admin CMS**: Complete content management system
- **Search & Filtering**: Full-text search and category filtering
- **Authentication**: Secure admin authentication with NextAuth.js

## Getting Help

- Check the [FAQ](./FAQ.md) for common questions
- Review [Troubleshooting](./deployment/troubleshooting.md) for common issues
- See [Contributing](../CONTRIBUTING.md) for how to improve this documentation

---

**Tech Stack**: Next.js 14, Prisma ORM, NextAuth.js, PostgreSQL, TypeScript