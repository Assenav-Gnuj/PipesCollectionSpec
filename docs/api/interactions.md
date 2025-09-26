# User Interactions API

Documentation for user interaction endpoints including ratings and comments.

## Overview

The API provides endpoints for users to interact with collection items through:
- **Ratings**: 1-5 star ratings with session-based duplicate prevention
- **Comments**: User comments with moderation system
- **Session Management**: Browser session tracking for user interactions

## Ratings

### POST /{type}/{id}/rating

Submit a rating for a collection item.

**Path Parameters:**
- `type`: Item type (`pipe`, `tobacco`, `accessory`)
- `id`: Item ID (UUID)

**Request Body:**
```json
{
  "rating": 4,
  "session_id": "session_1640995200000_abc123def"
}
```

**Validation:**
- `rating`: Required integer between 1-5
- `session_id`: Required string for duplicate prevention

**Response Success (200):**
```json
{
  "message": "Rating submitted successfully",
  "new_average": 4.3,
  "rating_count": 13
}
```

**Response Error (409) - Duplicate Rating:**
```json
{
  "error": "Rating already submitted for this session",
  "code": "RATING_EXISTS",
  "timestamp": "2025-09-23T12:00:00Z"
}
```

**Response Error (400) - Invalid Rating:**
```json
{
  "error": "Invalid rating value",
  "code": "VALIDATION_ERROR",
  "details": {
    "rating": "Must be between 1 and 5"
  },
  "timestamp": "2025-09-23T12:00:00Z"
}
```

### Implementation Example

```javascript
// Submit rating with session management
async function submitRating(itemType, itemId, rating) {
  const sessionId = getOrCreateSessionId();
  
  try {
    const response = await fetch(`/api/${itemType}/${itemId}/rating`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rating: rating,
        session_id: sessionId
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      if (error.code === 'RATING_EXISTS') {
        alert('You have already rated this item');
      } else {
        throw new Error(error.error);
      }
      return;
    }
    
    const result = await response.json();
    updateRatingDisplay(result.new_average, result.rating_count);
    
  } catch (error) {
    console.error('Rating submission failed:', error);
  }
}

function getOrCreateSessionId() {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}
```

## Comments

### POST /{type}/{id}/comments

Submit a comment for a collection item.

**Path Parameters:**
- `type`: Item type (`pipe`, `tobacco`, `accessory`)
- `id`: Item ID (UUID)

**Request Body:**
```json
{
  "content": "Great pipe with excellent draw and cool smoking characteristics!",
  "author_name": "John Doe",
  "session_id": "session_1640995200000_abc123def"
}
```

**Validation:**
- `content`: Required string, 1-2000 characters
- `author_name`: Optional string, max 100 characters
- `session_id`: Required string for tracking

**Response Success (201):**
```json
{
  "message": "Comment submitted for moderation",
  "comment_id": "clm456def789"
}
```

**Response Error (400) - Validation Error:**
```json
{
  "error": "Comment validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "content": "Content is required and must be under 2000 characters",
    "author_name": "Author name must be under 100 characters"
  },
  "timestamp": "2025-09-23T12:00:00Z"
}
```

### GET /{type}/{id}/comments

Retrieve approved comments for an item.

**Path Parameters:**
- `type`: Item type (`pipe`, `tobacco`, `accessory`)
- `id`: Item ID (UUID)

**Query Parameters:**
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page (1-100), default 20

**Response (200):**
```json
{
  "comments": [
    {
      "id": "clm456def789",
      "content": "Excellent pipe with smooth draw and great craftsmanship. Highly recommended!",
      "author_name": "John Doe",
      "created_at": "2025-09-23T14:30:00Z"
    },
    {
      "id": "clm789ghi012",
      "content": "Beautiful pipe, worth every penny.",
      "author_name": "Jane Smith",
      "created_at": "2025-09-22T16:45:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_count": 2,
    "has_next": false,
    "has_prev": false
  }
}
```

### Comment Implementation Example

```javascript
// Submit comment with validation
async function submitComment(itemType, itemId, content, authorName = '') {
  if (!content.trim()) {
    alert('Comment content is required');
    return;
  }
  
  if (content.length > 2000) {
    alert('Comment must be under 2000 characters');
    return;
  }
  
  const sessionId = getOrCreateSessionId();
  
  try {
    const response = await fetch(`/api/${itemType}/${itemId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content.trim(),
        author_name: authorName.trim(),
        session_id: sessionId
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    
    const result = await response.json();
    alert('Comment submitted for moderation. It will appear after approval.');
    clearCommentForm();
    
  } catch (error) {
    console.error('Comment submission failed:', error);
    alert('Failed to submit comment: ' + error.message);
  }
}

// Load and display comments
async function loadComments(itemType, itemId) {
  try {
    const response = await fetch(`/api/${itemType}/${itemId}/comments`);
    
    if (!response.ok) {
      throw new Error('Failed to load comments');
    }
    
    const data = await response.json();
    displayComments(data.comments);
    
  } catch (error) {
    console.error('Failed to load comments:', error);
  }
}

function displayComments(comments) {
  const container = document.getElementById('comments-container');
  
  if (comments.length === 0) {
    container.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
    return;
  }
  
  const commentsHTML = comments.map(comment => `
    <div class="comment">
      <div class="comment-header">
        <strong class="comment-author">${escapeHtml(comment.author_name || 'Anonymous')}</strong>
        <time class="comment-date">${formatDate(comment.created_at)}</time>
      </div>
      <div class="comment-content">${escapeHtml(comment.content)}</div>
    </div>
  `).join('');
  
  container.innerHTML = commentsHTML;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

## Session Management

### Session ID Generation

Sessions are managed client-side using localStorage or sessionStorage:

```javascript
// Generate unique session ID
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get or create persistent session
function getSessionId() {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}

// Get temporary session (clears on browser close)
function getTempSessionId() {
  let sessionId = sessionStorage.getItem('tempSessionId');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('tempSessionId', sessionId);
  }
  return sessionId;
}
```

### Rate Limiting

API implements rate limiting for user interactions:

- **Ratings**: Maximum 10 ratings per hour per session
- **Comments**: Maximum 5 comments per hour per session
- **IP-based**: Additional IP-based limits for abuse prevention

**Rate Limit Response (429):**
```json
{
  "error": "Too many requests",
  "code": "RATE_LIMITED",
  "details": {
    "retry_after": 3600,
    "limit": "10 ratings per hour"
  },
  "timestamp": "2025-09-23T12:00:00Z"
}
```

## Content Moderation

### Comment Approval Process

1. **Submission**: Comments are submitted with `is_approved: false`
2. **Moderation Queue**: Comments enter admin moderation queue
3. **Review**: Admin approves or rejects comments
4. **Display**: Only approved comments appear in public endpoints

### Automatic Filtering

The system includes automatic content filtering:

- **Profanity Filter**: Basic profanity detection
- **Spam Detection**: Pattern-based spam identification  
- **Length Validation**: Content length restrictions
- **Rate Limiting**: Prevents comment spam

### Admin Moderation Tools

See [Admin Endpoints](./admin.md) for comment moderation features:
- View pending comments
- Approve/reject comments
- Bulk approval operations
- Delete inappropriate comments

## Complete Integration Example

```html
<!-- HTML Structure -->
<div class="item-interactions">
  <!-- Rating Section -->
  <div class="rating-section">
    <h3>Rate this item</h3>
    <div class="star-rating" id="star-rating">
      <button class="star" data-rating="1">★</button>
      <button class="star" data-rating="2">★</button>
      <button class="star" data-rating="3">★</button>
      <button class="star" data-rating="4">★</button>
      <button class="star" data-rating="5">★</button>
    </div>
    <div class="rating-info">
      <span id="average-rating">4.2</span> stars 
      (<span id="rating-count">15</span> ratings)
    </div>
  </div>
  
  <!-- Comments Section -->
  <div class="comments-section">
    <h3>Comments</h3>
    
    <!-- Comment Form -->
    <form id="comment-form" class="comment-form">
      <div class="form-group">
        <label for="author-name">Your Name (optional)</label>
        <input type="text" id="author-name" maxlength="100">
      </div>
      <div class="form-group">
        <label for="comment-content">Comment</label>
        <textarea id="comment-content" maxlength="2000" rows="4" required></textarea>
        <div class="char-count">
          <span id="char-count">0</span>/2000 characters
        </div>
      </div>
      <button type="submit">Submit Comment</button>
    </form>
    
    <!-- Comments Display -->
    <div id="comments-container" class="comments-list">
      <!-- Comments will be loaded here -->
    </div>
  </div>
</div>
```

```javascript
// Complete interaction handler
class ItemInteractions {
  constructor(itemType, itemId) {
    this.itemType = itemType;
    this.itemId = itemId;
    this.init();
  }
  
  init() {
    this.setupRating();
    this.setupComments();
    this.loadComments();
  }
  
  setupRating() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
      star.addEventListener('click', (e) => {
        const rating = parseInt(e.target.dataset.rating);
        this.submitRating(rating);
      });
      
      star.addEventListener('mouseenter', (e) => {
        this.highlightStars(parseInt(e.target.dataset.rating));
      });
    });
    
    document.getElementById('star-rating').addEventListener('mouseleave', () => {
      this.resetStars();
    });
  }
  
  setupComments() {
    const form = document.getElementById('comment-form');
    const contentField = document.getElementById('comment-content');
    const charCount = document.getElementById('char-count');
    
    contentField.addEventListener('input', () => {
      charCount.textContent = contentField.value.length;
    });
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitComment();
    });
  }
  
  async submitRating(rating) {
    // Implementation from previous examples...
  }
  
  async submitComment() {
    // Implementation from previous examples...
  }
  
  async loadComments() {
    // Implementation from previous examples...
  }
}

// Initialize for specific item
const interactions = new ItemInteractions('pipe', 'clm123abc');
```