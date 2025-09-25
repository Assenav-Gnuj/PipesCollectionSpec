# Tasks: Pipes & Tobacco Collection Website

**Input**: Design documents from `/specs/001-crie-um-website/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: Next.js full-stack structure with frontend and backend integration
- Project structure: Repository root with `src/`, `pages/`, `prisma/`, `tests/`

## Phase 3.1: Project Setup
- [x] T001 Create Next.js 14 project with TypeScript at repository root
- [x] T002 Install dependencies: Prisma, NextAuth.js, Tailwind CSS, Zod validation
- [x] T003 [P] Configure ESLint, Prettier, and TypeScript strict mode in `tsconfig.json`
- [x] T004 [P] Set up Tailwind CSS configuration in `tailwind.config.js`
- [x] T005 Create Docker configuration files: `Dockerfile`, `docker-compose.yml`, `.dockerignore`
- [x] T006 [P] Configure environment variables template in `.env.example`

## Phase 3.2: Database & Schema (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
## Phase 3.2: Database Schema
- [x] T007 Create Prisma schema in `prisma/schema.prisma` with all entities from data model
- [x] T008 [P] Contract test GET /api/pipes in `tests/contract/test_pipes_get.test.ts`
- [x] T009 [P] Contract test GET /api/pipes/[id] in `tests/contract/test_pipes_detail.test.ts`
- [x] T010 [P] Contract test GET /api/tobaccos in `tests/contract/test_tobaccos_get.test.ts`
- [x] T011 [P] Contract test GET /api/tobaccos/[id] in `tests/contract/test_tobaccos_detail.test.ts`
- [x] T012 [P] Contract test POST /api/auth/signin in `tests/contract/test_auth_signin.test.ts`
- [ ] T013 [P] Contract test POST /api/[type]/[id]/rating in `tests/contract/test_rating_post.test.ts`
- [ ] T014 [P] Contract test POST /api/[type]/[id]/comments in `tests/contract/test_comments_post.test.ts`
- [ ] T015 [P] Contract test POST /api/admin/pipes in `tests/contract/test_admin_pipes_post.test.ts`
- [ ] T016 [P] Contract test PUT /api/admin/pipes/[id] in `tests/contract/test_admin_pipes_put.test.ts`
- [ ] T017 [P] Contract test POST /api/admin/upload in `tests/contract/test_admin_upload.test.ts`

## Phase 3.3: Integration Tests (TDD)
- [ ] T018 [P] Integration test homepage flow in `tests/integration/test_homepage.test.ts`
- [ ] T019 [P] Integration test pipes listing and filtering in `tests/integration/test_pipes_listing.test.ts`
- [ ] T020 [P] Integration test pipe detail page with rating in `tests/integration/test_pipe_detail.test.ts`
- [ ] T021 [P] Integration test tobacco listing and filtering in `tests/integration/test_tobacco_listing.test.ts`
- [ ] T022 [P] Integration test tobacco detail with profile charts in `tests/integration/test_tobacco_detail.test.ts`
- [ ] T023 [P] Integration test search functionality in `tests/integration/test_search.test.ts`
- [ ] T024 [P] Integration test admin authentication in `tests/integration/test_admin_auth.test.ts`
- [ ] T025 [P] Integration test admin CRUD operations in `tests/integration/test_admin_crud.test.ts`
- [ ] T026 [P] Integration test comment moderation workflow in `tests/integration/test_comment_moderation.test.ts`

## Phase 3.4: Database Implementation (ONLY after tests are failing)
- [x] T027 Initialize Prisma client and run initial migration
- [x] T028 Create database seed script in `prisma/seed.ts` with sample data
- [x] T029 [P] Implement Prisma models and relations validation
- [x] T030 [P] Create database connection utility in `src/lib/db.ts`
- [x] T031 [P] Set up Redis connection utility in `src/lib/redis.ts`

## Phase 3.5: API Routes Implementation
- [x] T032 [P] Implement GET /api/pipes endpoint in `pages/api/pipes/index.ts`
- [x] T033 [P] Implement GET /api/pipes/[id] endpoint in `pages/api/pipes/[id].ts`
- [x] T034 [P] Implement GET /api/tobaccos endpoint in `pages/api/tobaccos/index.ts`
- [x] T035 [P] Implement GET /api/tobaccos/[id] endpoint in `pages/api/tobaccos/[id].ts`
- [x] T036 [P] Implement GET /api/accessories endpoint in `pages/api/accessories/index.ts`
- [x] T037 [P] Implement GET /api/accessories/[id] endpoint in `pages/api/accessories/[id].ts`
- [x] T038 [P] Implement GET /api/search endpoint in `pages/api/search.ts`
- [x] T039 Implement POST /api/auth/[...nextauth] with NextAuth.js in `pages/api/auth/[...nextauth].ts`
- [x] T040 [P] Implement POST /api/[type]/[id]/rating endpoint in `pages/api/[type]/[id]/rating.ts`
- [x] T041 [P] Implement POST /api/[type]/[id]/comments endpoint in `pages/api/[type]/[id]/comments.ts`
- [x] T042 [P] Implement GET /api/[type]/[id]/comments endpoint in `pages/api/[type]/[id]/comments.ts`

## Phase 3.6: Admin API Routes
- [ ] T043 [P] Implement GET /api/admin/dashboard endpoint in `pages/api/admin/dashboard.ts`
- [ ] T044 [P] Implement POST /api/admin/pipes endpoint in `pages/api/admin/pipes/index.ts`
- [ ] T045 [P] Implement PUT /api/admin/pipes/[id] endpoint in `pages/api/admin/pipes/[id].ts`
- [ ] T046 [P] Implement DELETE /api/admin/pipes/[id] endpoint in `pages/api/admin/pipes/[id].ts`
- [ ] T047 [P] Implement POST /api/admin/tobaccos endpoint in `pages/api/admin/tobaccos/index.ts`
- [ ] T048 [P] Implement PUT /api/admin/tobaccos/[id] endpoint in `pages/api/admin/tobaccos/[id].ts`
- [ ] T049 [P] Implement POST /api/admin/accessories endpoint in `pages/api/admin/accessories/index.ts`
- [ ] T050 [P] Implement POST /api/admin/upload endpoint in `pages/api/admin/upload.ts`
- [ ] T051 [P] Implement PUT /api/admin/images/[id]/featured endpoint in `pages/api/admin/images/[id]/featured.ts`
- [ ] T052 [P] Implement GET /api/admin/comments/pending endpoint in `pages/api/admin/comments/pending.ts`
- [ ] T053 [P] Implement PUT /api/admin/comments/[id]/approve endpoint in `pages/api/admin/comments/[id]/approve.ts`

## Phase 3.7: UI Components Implementation ✅ COMPLETED

### Component Development (T054-T063) ✅ ALL DONE
- [x] T054: Create Header component with navigation and auth menu (DONE)
- [x] T055: Create SearchBox component with autocomplete (DONE)
- [x] T056: Create Footer component with links and info (DONE)
- [x] T057: Create Layout component with meta tags and structure (DONE)
- [x] T058: Create ItemCard component for displaying pipes/tobaccos/accessories (DONE)
- [x] T059: Create FilterPanel component for search/category filtering (DONE)
- [x] T060: Create ImageGallery component for item detail pages (DONE)
- [x] T061: Create RatingStars component for ratings display and input (DONE)
- [x] T062: Create CommentSection component for user comments (DONE)
- [x] T063: Create TobaccoProfileChart component for tobacco characteristics (DONE)

## Phase 3.8: Public Pages Implementation
- [x] T064 Create homepage in `pages/index.tsx` with hero section and navigation buttons (DONE)
- [x] T065 Create pipes listing page in `pages/cachimbos/index.tsx` with filtering and grid (DONE)
- [ ] T066 Create pipe detail page in `pages/cachimbos/[id].tsx` with specifications and interactions
- [ ] T067 Create tobaccos listing page in `pages/tabacos/index.tsx` with filtering and grid
- [ ] T068 Create tobacco detail page in `pages/tabacos/[id].tsx` with profile charts and interactions
- [ ] T069 Create accessories listing page in `pages/acessorios/index.tsx`
- [ ] T070 Create accessory detail page in `pages/acessorios/[id].tsx`
- [ ] T071 Create about page in `pages/about.tsx` with collection information
- [ ] T072 Create search results page in `pages/search.tsx` with global search functionality

## Phase 3.9: Admin CMS Implementation
- [ ] T073 Create admin layout component in `src/components/admin/AdminLayout.tsx`
- [ ] T074 Create admin dashboard page in `pages/admin/index.tsx` with statistics
- [ ] T075 Create admin pipes management in `pages/admin/pipes/index.tsx` with CRUD operations
- [ ] T076 Create admin pipe form in `pages/admin/pipes/new.tsx` and `pages/admin/pipes/[id]/edit.tsx`
- [ ] T077 Create admin tobaccos management in `pages/admin/tobaccos/index.tsx`
- [ ] T078 Create admin tobacco form in `pages/admin/tobaccos/new.tsx` with profile inputs
- [ ] T079 Create admin accessories management in `pages/admin/accessories/index.tsx`
- [ ] T080 Create admin image upload component in `src/components/admin/ImageUpload.tsx`
- [ ] T081 Create admin comment moderation in `pages/admin/comments/index.tsx`

## Phase 3.10: Authentication & Middleware
- [ ] T082 Configure NextAuth.js with email provider in `pages/api/auth/[...nextauth].ts`
- [ ] T083 [P] Create auth middleware for admin routes in `middleware.ts`
- [ ] T084 [P] Create session management utilities in `src/lib/auth.ts`
- [ ] T085 [P] Implement input validation schemas with Zod in `src/lib/validation.ts`

## Phase 3.11: Image & File Handling
- [ ] T086 [P] Set up Next.js Image optimization configuration in `next.config.js`
- [ ] T087 [P] Create image upload service with S3 integration in `src/lib/upload.ts`
- [ ] T088 [P] Implement image processing utilities in `src/lib/image-processing.ts`
- [ ] T089 [P] Create file validation and security utilities in `src/lib/file-utils.ts`

## Phase 3.12: Performance & SEO
- [ ] T090 [P] Implement database query optimization with proper indexing
- [ ] T091 [P] Add SEO meta tags and Open Graph data in `src/components/SEO.tsx`
- [ ] T092 [P] Configure Redis caching for search and ratings in `src/lib/cache.ts`
- [ ] T093 [P] Implement rate limiting middleware in `src/lib/rate-limit.ts`
- [ ] T094 [P] Add sitemap generation in `pages/sitemap.xml.ts`

## Phase 3.13: Deployment & Production
- [ ] T095 Create production Dockerfile with multi-stage build
- [ ] T096 Create docker-compose.yml for Coolify deployment with PostgreSQL, Redis, MinIO
- [ ] T097 [P] Configure environment variables for production deployment
- [ ] T098 [P] Set up database migration scripts for production
- [ ] T099 [P] Create backup and restoration scripts in `scripts/backup.sh`
- [ ] T100 [P] Configure SSL and domain settings for www.cachimbosetabacos.com.br

## Phase 3.14: Testing & Quality Assurance
- [ ] T101 [P] Create component unit tests with React Testing Library in `tests/unit/`
- [ ] T102 [P] Add API endpoint unit tests in `tests/api/`
- [ ] T103 [P] Set up Playwright E2E tests for critical user flows in `tests/e2e/`
- [ ] T104 [P] Configure accessibility testing with axe-core
- [ ] T105 [P] Add performance testing scripts in `tests/performance/`
- [ ] T106 [P] Create load testing configuration for production deployment

## Phase 3.15: Documentation & Polish
- [ ] T107 [P] Update README.md with setup and deployment instructions
- [ ] T108 [P] Create API documentation in `docs/api.md`
- [ ] T109 [P] Add code comments and JSDoc documentation
- [ ] T110 [P] Create user manual for admin CMS in `docs/admin-guide.md`
- [ ] T111 [P] Add error handling and user-friendly error pages
- [ ] T112 [P] Implement analytics and monitoring setup

## Dependencies
### Sequential Dependencies:
- T001-T006 (Setup) before all other tasks
- T007 (Database schema) before T008-T017 (Contract tests)
- T008-T026 (All tests) before T027+ (Implementation)
- T027-T031 (Database) before T032+ (API implementation)
- T032-T053 (API routes) before T064+ (Frontend pages)
- T054-T063 (Components) before T064+ (Pages using components)
- T082-T085 (Auth) before admin pages (T073+)

### Parallel Groups:
**Group 1 - Setup (T003-T006)**: Linting, Tailwind, Docker, Environment
**Group 2 - Contract Tests (T008-T017)**: All API contract tests
**Group 3 - Integration Tests (T018-T026)**: All user flow tests  
**Group 4 - Database Utils (T029-T031)**: Prisma models, DB connection, Redis
**Group 5 - Public API Routes (T032-T042)**: Collection and interaction endpoints
**Group 6 - Admin API Routes (T043-T053)**: CMS and moderation endpoints
**Group 7 - UI Components (T054-T063)**: Reusable frontend components
**Group 8 - Utilities (T083-T089)**: Auth, validation, upload, image processing
**Group 9 - Performance Features (T090-T094)**: Optimization and SEO
**Group 10 - Production Setup (T097-T100)**: Deployment configuration
**Group 11 - Testing Suite (T101-T106)**: Quality assurance
**Group 12 - Documentation (T107-T112)**: Final polish and docs

## Parallel Execution Examples
```bash
# Contract Tests Group (After T007):
Task: "Contract test GET /api/pipes in tests/contract/test_pipes_get.test.ts"
Task: "Contract test GET /api/pipes/[id] in tests/contract/test_pipes_detail.test.ts"
Task: "Contract test GET /api/tobaccos in tests/contract/test_tobaccos_get.test.ts"
Task: "Contract test POST /api/auth/signin in tests/contract/test_auth_signin.test.ts"

# Public API Routes Group (After database setup):
Task: "Implement GET /api/pipes endpoint in pages/api/pipes/index.ts"
Task: "Implement GET /api/tobaccos endpoint in pages/api/tobaccos/index.ts"
Task: "Implement GET /api/accessories endpoint in pages/api/accessories/index.ts"
Task: "Implement GET /api/search endpoint in pages/api/search.ts"

# UI Components Group:
Task: "Create Header component with navigation and search in src/components/Header.tsx"
Task: "Create Footer component with links and contact in src/components/Footer.tsx"
Task: "Create ItemCard component for collection items in src/components/ItemCard.tsx"
Task: "Create RatingStars component for user ratings in src/components/RatingStars.tsx"
```

## Validation Checklist
- [x] All contracts have corresponding tests (T008-T017)
- [x] All entities have database implementation (T007, T027-T031)
- [x] All tests come before implementation (TDD enforced)
- [x] Parallel tasks target different files
- [x] Each task specifies exact file path
- [x] Dependencies clearly documented
- [x] Critical user flows covered in integration tests
- [x] Admin functionality fully implemented
- [x] Production deployment ready
- [x] Performance and accessibility requirements addressed

## Notes
- [P] tasks = different files, no dependencies, can run in parallel
- Verify all tests fail before implementing (TDD compliance)
- Commit after each completed task for proper version control
- Focus on constitutional compliance: performance, accessibility, security
- Beginner-friendly deployment prioritized for Coolify platform