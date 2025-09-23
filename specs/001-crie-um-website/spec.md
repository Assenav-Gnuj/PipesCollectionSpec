# Feature Specification: Pipes & Tobacco Collection Website

**Feature Branch**: `001-crie-um-website`  
**Created**: 2025-09-23  
**Status**: Draft  
**Input**: User description: "Crie um website para a minha coleção de Cachimbos e Tabacos"

## User Scenarios & Testing

### Primary User Story
A pipe and tobacco collector wants to showcase their collection through a professional website where visitors can browse, rate, and comment on pipes and tobaccos, while the collector maintains full control over the content through an administrative panel.

### Acceptance Scenarios
1. **Given** a visitor accesses the homepage, **When** they view the hero section, **Then** they see "My Collection of Pipes & Tobaccos" title with description and two navigation buttons
2. **Given** a visitor clicks "Explore Cachimbos", **When** the pipes page loads, **Then** they see a filterable grid of all pipes with images, basic info, and "Ver detalhes" buttons
3. **Given** a visitor is on a pipe detail page, **When** they click on rating stars, **Then** their rating is recorded and the average rating updates immediately
4. **Given** a visitor wants to comment on a pipe, **When** they submit a comment, **Then** the comment appears pending admin moderation
5. **Given** an admin accesses the CMS, **When** they add a new pipe with 5 photos, **Then** they can select one as the featured image and the pipe appears on the public site
6. **Given** a visitor uses the search box, **When** they enter a pipe brand name, **Then** relevant results appear filtered across the collection
7. **Given** a visitor clicks on tobacco profile charts, **When** viewing strength/taste/room note, **Then** they see visual graphs showing values from 1-9 scale

### Edge Cases
- What happens when a user tries to rate the same item multiple times from the same session?
- How does the system handle image uploads that exceed size limits?
- What occurs when no search results are found?
- How are comments moderated and what happens to offensive content?
- What happens when the admin deletes an item that has existing ratings and comments?

## Requirements

### Functional Requirements

**Header & Navigation**
- **FR-001**: System MUST display a small logo in the top-left corner of every page
- **FR-002**: System MUST provide a navigation menu in the top-right with "Home", "Cachimbos", "Tabacos", "Acessórios", and "About" links
- **FR-003**: System MUST include a search box below the navigation menu in the top-right corner
- **FR-004**: Search functionality MUST filter across all collection items and return relevant results

**Home Page**
- **FR-005**: Home page MUST display a hero section with "My Collection of Pipes & Tobaccos" as the main title
- **FR-006**: Hero section MUST include descriptive text: "Explore a carefully curated collection of premium pipes and fine tobaccos. Each piece tells a unique story of craftsmanship, tradition and passion for smoking."
- **FR-007**: Hero section MUST provide two action buttons: "Explore Cachimbos" and "Descubra Tabacos"
- **FR-008**: "Explore Cachimbos" button MUST navigate to the pipes listing page
- **FR-009**: "Descubra Tabacos" button MUST navigate to the tobaccos listing page

**Pipes Section**
- **FR-010**: Pipes page MUST display all pipes in a grid layout with featured image, ID, name, brand, country, and "Ver detalhes" button
- **FR-011**: Pipes page MUST include filters for brand and country selection at the top
- **FR-012**: Each pipe detail page MUST display a large featured image with 4 additional smaller images below
- **FR-013**: Users MUST be able to click on any image to view it in an enlarged format
- **FR-014**: Pipe detail pages MUST include specifications section with: ID, Brand, Name, Material, Shape, Finish, Filter, Stem Material, Country
- **FR-015**: Pipe detail pages MUST include an "Observations" field for admin-entered descriptive text
- **FR-016**: Pipe detail pages MUST include an average rating system allowing visitors to rate 1-5 stars without registration
- **FR-017**: Pipe detail pages MUST allow visitors to leave comments without registration
- **FR-018**: Pipe detail pages MUST include a "Voltar para os Cachimbos" button returning to pipes listing

**Tobaccos Section**
- **FR-019**: Tobaccos page MUST display all tobaccos in a grid layout with featured image, ID, name, brand, blend type, and "Ver detalhes" button
- **FR-020**: Tobaccos page MUST include filters for brand and blend type selection at the top
- **FR-021**: Each tobacco detail page MUST display a large featured image with 4 additional smaller images below
- **FR-022**: Users MUST be able to click on any image to view it in an enlarged format
- **FR-023**: Tobacco detail pages MUST include specifications section with: ID, Brand, Name, Blend Type, Contents, Cut
- **FR-024**: Tobacco detail pages MUST include an "Observations" field for admin-entered descriptive text
- **FR-025**: Tobacco detail pages MUST include a "Tobacco Profile" section with visual charts for Strength, Room Note, and Taste (scale 1-9, where 1=mild, 9=strong)
- **FR-026**: Tobacco detail pages MUST include an average rating system allowing visitors to rate 1-5 stars without registration
- **FR-027**: Tobacco detail pages MUST allow visitors to leave comments without registration
- **FR-028**: Tobacco detail pages MUST include a "Voltar para os Tabacos" button returning to tobaccos listing

**Footer**
- **FR-029**: Footer MUST include quick links to all main sections: Home, About, Cachimbos, Tabacos, Acessórios
- **FR-030**: Footer MUST include a contact section with descriptive text and email address
- **FR-031**: Footer MUST display copyright notice: "© 2025 Coleção de Cachimbos e Tabacos. Todos os direitos reservados."

**Administrative CMS**
- **FR-032**: System MUST provide a secure administrative panel accessible only to authorized users
- **FR-033**: Admin panel MUST allow complete CRUD operations (Create, Read, Update, Delete) for pipes
- **FR-034**: Admin panel MUST allow complete CRUD operations for tobaccos
- **FR-035**: Admin panel MUST allow complete CRUD operations for accessories
- **FR-036**: Admin panel MUST support uploading up to 5 images per item with featured image selection
- **FR-037**: Admin panel MUST provide comment moderation tools to approve, edit, or delete user comments
- **FR-038**: All admin changes MUST be immediately reflected on the public website

**User Interaction**
- **FR-039**: Rating system MUST prevent duplicate votes from the same user session
- **FR-040**: Comment system MUST capture timestamp and allow optional name entry
- **FR-041**: All user-generated content MUST be stored securely and moderated through admin panel

### Key Entities

- **Pipe**: Represents individual pipes in the collection with specifications (ID, brand, name, material, shape, finish, filter type, stem material, country), multiple images, user ratings, comments, and admin observations
- **Tobacco**: Represents tobacco products with specifications (ID, brand, name, blend type, contents, cut), flavor profile data (strength, room note, taste on 1-9 scale), multiple images, user ratings, comments, and admin observations  
- **Accessory**: Represents smoking accessories and related items with basic specifications, images, and descriptions
- **Rating**: Represents user ratings (1-5 stars) linked to specific pipes or tobaccos, tracked by user session to prevent duplicates
- **Comment**: Represents user comments on pipes or tobaccos with optional user name, timestamp, content, and moderation status
- **Image**: Represents uploaded photos for collection items with featured image designation and file metadata
- **Admin User**: Represents authorized administrators with secure access to the content management system

---

## Review & Acceptance Checklist

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous  
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---
