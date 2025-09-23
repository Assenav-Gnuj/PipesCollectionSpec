# Pipes & Tobacco Collection Website

A modern web application for showcasing and managing a curated collection of pipes and tobaccos, featuring a public gallery and administrative content management system.

## Project Overview

This website enables collectors to:
- **Public Interface**: Browse pipes, tobaccos, and accessories with detailed specifications and community ratings
- **Administrative Panel**: Full content management with CRUD operations for collection items
- **User Engagement**: Rating system and commenting without registration requirements
- **Mobile-First Design**: Responsive interface across all devices

## Key Features

### Public Website
- **Home Page**: Hero section with collection overview and navigation to main categories
- **Pipes Section**: Filterable gallery with detailed pipe specifications, photos, and ratings
- **Tobaccos Section**: Browsable tobacco collection with blend profiles and community reviews  
- **Accessories Section**: Additional collection items and smoking accessories
- **Interactive Elements**: Star ratings, comment system, advanced search and filtering

### Administrative CMS
- Complete CRUD operations for all collection items
- Multi-image upload with featured image selection
- Content moderation tools for user comments
- Real-time content updates without caching delays

### Technical Features
- Mobile-responsive design (≥320px screen width)
- Image optimization with WebP/AVIF format support
- Performance targets: <3s page load times, <500ms search responses
- WCAG 2.1 AA accessibility compliance
- Secure HTTPS implementation with minimal data collection

## Architecture

The project follows clean architecture principles with:
- **Frontend/Backend Separation**: RESTful API design
- **Database Design**: Flexible schema supporting complex relationships
- **Security Focus**: Input validation, sanitization, and secure authentication
- **Performance Optimization**: Optimized images and efficient database queries

## Project Structure

```
specs/          # Feature specifications and implementation plans
├── 001-*/      # Individual feature directories
├── 002-*/      # Each containing plan.md, research.md, etc.
└── ...

src/            # Source code (structure TBD based on tech stack)
tests/          # Test suite with contract, integration, and unit tests
docs/           # Additional documentation
```

## Development Standards

This project adheres to the principles defined in `.specify/memory/constitution.md`:

1. **User-Centric Design**: Intuitive navigation, mobile responsiveness, no registration barriers
2. **Content Management Excellence**: Complete admin control with real-time updates
3. **Performance & Accessibility**: Fast loading, WCAG compliance, optimized search
4. **Clean Architecture**: Modular, testable, maintainable code structure
5. **Security & Privacy**: Minimal data collection, secure authentication, HTTPS

## Getting Started

1. Review the project constitution: `.specify/memory/constitution.md`
2. Check feature specifications in `specs/` directory
3. Follow implementation plans for development workflow
4. Ensure all code changes align with constitutional principles

## Contributing

All contributions must:
- Pass constitutional compliance checks
- Include appropriate tests (contract, integration, unit)
- Meet performance and accessibility standards
- Follow the established development workflow

---

*This project follows semantic versioning and constitutional governance as defined in the project constitution.*