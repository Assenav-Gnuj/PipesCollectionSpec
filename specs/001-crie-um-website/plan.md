
# Implementation Plan: Pipes & Tobacco Collection Website

**Branch**: `001-crie-um-website` | **Date**: 2025-09-23 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-crie-um-website/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
A comprehensive web application for showcasing a curated pipes and tobacco collection with public browsing interface and administrative CMS. The solution prioritizes beginner-friendly deployment on VPS with Coolify, targeting the domain www.cachimbosetabacos.com.br for optimal user experience and content management.

## Technical Context
**Language/Version**: JavaScript/Node.js 18+ (backend), HTML5/CSS3/ES6+ (frontend)  
**Primary Dependencies**: Next.js 14 (full-stack framework), Prisma (database ORM), NextAuth.js (authentication)  
**Storage**: PostgreSQL (relational data), S3-compatible storage (images), Redis (session cache)  
**Testing**: Jest (unit), Playwright (integration), Vitest (component testing)  
**Target Platform**: Linux VPS with Coolify deployment platform  
**Project Type**: web - determines frontend+backend structure  
**Performance Goals**: <3s page load, <500ms search response, 60fps animations, Core Web Vitals optimization  
**Constraints**: Beginner-friendly deployment, Coolify-compatible Docker setup, domain-ready SSL configuration  
**Scale/Scope**: Personal collection website, ~100-500 items, moderate traffic, single admin user  
**Deployment Context**: VPS with Coolify, www.cachimbosetabacos.com.br domain, beginner-friendly management

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### User-Centric Design Compliance
- [x] Feature supports intuitive navigation and clear visual hierarchy (header nav + search)
- [x] Mobile responsiveness considered in design (Next.js responsive framework)
- [x] Interactive elements require no user registration (ratings + comments without signup)
- [x] Page load performance impact assessed (<3s target, Next.js optimization)

### Content Management Alignment  
- [x] Admin functionality includes proper CRUD operations (full CMS for pipes/tobaccos/accessories)
- [x] Image management supports multiple files with featured selection (5 images per item + featured)
- [x] Content moderation workflow defined (admin approval for comments)
- [x] Real-time content updates verified (immediate reflection of admin changes)

### Performance & Accessibility Standards
- [x] Page load time targets defined (≤ 3 seconds via Next.js SSR + optimization)
- [x] Image optimization strategy included (Next.js Image component + WebP/AVIF support)
- [x] Accessibility requirements (WCAG 2.1 AA) considered (semantic HTML + ARIA attributes)
- [x] Search functionality performance evaluated (<500ms target with efficient indexing)

### Clean Architecture Principles
- [x] Frontend/backend separation maintained (Next.js API routes + clear separation)
- [x] RESTful API design followed (standard HTTP methods + resource-based URLs)
- [x] Database schema supports flexible content relationships (Prisma schema design)
- [x] Components designed for isolated testing (React component architecture)

### Security & Privacy Requirements
- [x] Minimal data collection approach verified (only optional comment names + admin auth)
- [x] Input validation and sanitization included (Prisma validation + sanitization middleware)
- [x] Admin authentication security planned (NextAuth.js secure session management)
- [x] HTTPS implementation ensured (Coolify automatic SSL + domain configuration)

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Structure Decision**: Option 2 - Web application (Next.js full-stack with frontend + backend integration)

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh copilot`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base template
- Generate Next.js/React project setup tasks with TypeScript and Tailwind CSS
- Create Prisma schema tasks from data-model.md entities (User, Pipe, Tobacco, Accessory, Image, Rating, Comment)
- Generate API route contract tests from contracts/api-spec.md endpoints (auth, collection items, admin)
- Create React component tasks for public pages (HomePage, PipesPage, TobaccosPage, AccessoriesPage, DetailPages)
- Generate admin CMS component tasks (Dashboard, ContentManagement, CommentModeration)
- Create integration tests from quickstart.md user acceptance scenarios
- Add Docker configuration tasks for Coolify deployment
- Include image optimization and performance tasks

**Ordering Strategy**:
- TDD order: Contract tests → Integration tests → Component tests → Implementation
- Dependency order: Database schema → API contracts → UI components → Admin features
- Mark [P] for parallel execution: Independent component development, separate API endpoints
- Sequential: Database migrations before API implementation, API before UI consumption

**Estimated Output**: 35-40 numbered, ordered tasks covering:
- Project setup (5 tasks): Next.js, TypeScript, Tailwind, Docker
- Database & API (12 tasks): Prisma schema, API routes, authentication
- Public UI (10 tasks): Homepage, listing pages, detail pages, search
- Admin CMS (8 tasks): Dashboard, CRUD operations, comment moderation
- Testing & deployment (8 tasks): Contract tests, integration tests, Coolify setup

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*No constitutional violations identified - all design decisions align with established principles*

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command) - technology stack decisions documented
- [x] Phase 1: Design complete (/plan command) - data model, contracts, quickstart created
- [x] Phase 2: Task planning complete (/plan command - approach described for Next.js full-stack implementation)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS - all constitutional requirements verified
- [x] Post-Design Constitution Check: PASS - clean architecture and performance standards maintained
- [x] All NEEDS CLARIFICATION resolved - comprehensive technical context established
- [x] Complexity deviations documented - no violations identified

---
*Based on Constitution v1.0.0 - See `/memory/constitution.md`*
