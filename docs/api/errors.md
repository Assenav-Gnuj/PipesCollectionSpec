# Error Handling

Comprehensive guide to API error responses, codes, and handling strategies.

## Error Response Format

All API endpoints return errors in a consistent JSON format:

```json
{
  "error": "Human readable error message",
  "code": "MACHINE_READABLE_CODE",
  "details": {
    "field": "validation error details"
  },
  "timestamp": "2025-09-23T12:00:00Z"
}
```

**Fields:**
- `error`: Human-readable error message for display
- `code`: Machine-readable error code for programmatic handling
- `details`: Additional error information (validation errors, etc.)
- `timestamp`: ISO 8601 timestamp when error occurred

## HTTP Status Codes

### Success Codes

| Code | Name | Description |
|------|------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request successful, no content returned |

### Client Error Codes

| Code | Name | Description | Action |
|------|------|-------------|---------|
| 400 | Bad Request | Invalid request data | Fix request data |
| 401 | Unauthorized | Authentication required | Login or refresh token |
| 403 | Forbidden | Insufficient permissions | Check user role |
| 404 | Not Found | Resource doesn't exist | Check resource ID |
| 409 | Conflict | Resource conflict | Handle duplicate/conflict |
| 422 | Unprocessable Entity | Validation failed | Fix validation errors |
| 429 | Too Many Requests | Rate limit exceeded | Wait and retry |

### Server Error Codes

| Code | Name | Description | Action |
|------|------|-------------|---------|
| 500 | Internal Server Error | Server error occurred | Retry or contact support |
| 502 | Bad Gateway | Gateway error | Retry later |
| 503 | Service Unavailable | Service temporarily down | Retry with backoff |
| 504 | Gateway Timeout | Request timeout | Retry with longer timeout |

## Error Codes

### Authentication Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTH_REQUIRED` | 401 | Authentication required for this endpoint |
| `AUTH_INVALID` | 401 | Invalid email/password combination |
| `SESSION_EXPIRED` | 401 | Session has expired, please login again |
| `TOKEN_INVALID` | 401 | Invalid authentication token |

### Authorization Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `FORBIDDEN` | 403 | Insufficient permissions for this action |
| `ADMIN_REQUIRED` | 403 | Admin privileges required |

### Validation Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `MISSING_REQUIRED_FIELD` | 400 | Required field missing |
| `INVALID_FORMAT` | 400 | Field format invalid |
| `VALUE_TOO_LONG` | 400 | Field value exceeds maximum length |
| `VALUE_TOO_SHORT` | 400 | Field value below minimum length |
| `INVALID_ENUM_VALUE` | 400 | Invalid enum value provided |

### Resource Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `NOT_FOUND` | 404 | Resource not found |
| `ITEM_NOT_FOUND` | 404 | Collection item not found |
| `USER_NOT_FOUND` | 404 | User not found |
| `COMMENT_NOT_FOUND` | 404 | Comment not found |
| `IMAGE_NOT_FOUND` | 404 | Image not found |

### Conflict Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `DUPLICATE_ENTRY` | 409 | Resource already exists |
| `RATING_EXISTS` | 409 | Rating already submitted for this session |
| `EMAIL_EXISTS` | 409 | Email address already registered |

### File Upload Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `FILE_TOO_LARGE` | 413 | File exceeds maximum size limit |
| `INVALID_FILE_TYPE` | 400 | File type not allowed |
| `FILE_UPLOAD_ERROR` | 500 | File upload failed |
| `IMAGE_PROCESSING_ERROR` | 500 | Image processing failed |

### Rate Limiting Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `RATE_LIMITED` | 429 | Too many requests |
| `COMMENT_RATE_LIMITED` | 429 | Too many comments submitted |
| `RATING_RATE_LIMITED` | 429 | Too many ratings submitted |

## Error Examples

### Validation Error

**Request:**
```bash
POST /api/admin/pipes
{
  "name": "",
  "brand": "Peterson",
  "material": "Briar"
  // Missing required fields
}
```

**Response (400):**
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "name": "Name is required and cannot be empty",
    "shape": "Shape is required",
    "finish": "Finish is required",
    "filter_type": "Filter type is required",
    "stem_material": "Stem material is required"
  },
  "timestamp": "2025-09-23T12:00:00Z"
}
```

### Authentication Error

**Request:**
```bash
GET /api/admin/dashboard
# No authentication headers
```

**Response (401):**
```json
{
  "error": "Authentication required",
  "code": "AUTH_REQUIRED",
  "timestamp": "2025-09-23T12:00:00Z"
}
```

### Resource Not Found

**Request:**
```bash
GET /api/pipes/invalid-id
```

**Response (404):**
```json
{
  "error": "Pipe not found",
  "code": "ITEM_NOT_FOUND",
  "timestamp": "2025-09-23T12:00:00Z"
}
```

### Rate Limiting

**Request:**
```bash
POST /api/pipe/123/rating
# Too many requests from same session
```

**Response (429):**
```json
{
  "error": "Too many rating submissions",
  "code": "RATING_RATE_LIMITED",
  "details": {
    "limit": "10 ratings per hour",
    "retry_after": 3600,
    "remaining": 0
  },
  "timestamp": "2025-09-23T12:00:00Z"
}
```

### File Upload Error

**Request:**
```bash
POST /api/admin/upload-images
# File too large
```

**Response (413):**
```json
{
  "error": "File too large",
  "code": "FILE_TOO_LARGE",
  "details": {
    "max_size": "10MB",
    "file_size": "15MB",
    "filename": "large-image.jpg"
  },
  "timestamp": "2025-09-23T12:00:00Z"
}
```

## Error Handling Strategies

### JavaScript/Frontend

```javascript
// Generic error handler
function handleApiError(error, response) {
  if (response) {
    switch (response.status) {
      case 400:
        return handleValidationError(error);
      case 401:
        return handleAuthError(error);
      case 403:
        return handleForbiddenError(error);
      case 404:
        return handleNotFoundError(error);
      case 409:
        return handleConflictError(error);
      case 429:
        return handleRateLimitError(error);
      case 500:
      case 502:
      case 503:
      case 504:
        return handleServerError(error);
      default:
        return handleGenericError(error);
    }
  }
  return handleNetworkError(error);
}

// Specific error handlers
function handleValidationError(error) {
  if (error.details) {
    // Display field-specific errors
    Object.entries(error.details).forEach(([field, message]) => {
      displayFieldError(field, message);
    });
  } else {
    showErrorMessage(error.error);
  }
}

function handleAuthError(error) {
  switch (error.code) {
    case 'SESSION_EXPIRED':
      // Redirect to login
      window.location.href = '/login?expired=true';
      break;
    case 'AUTH_REQUIRED':
      // Show login modal or redirect
      showLoginModal();
      break;
    default:
      showErrorMessage('Authentication failed: ' + error.error);
  }
}

function handleRateLimitError(error) {
  const retryAfter = error.details?.retry_after || 60;
  showErrorMessage(`Too many requests. Please wait ${retryAfter} seconds before trying again.`);
  
  // Disable submit buttons temporarily
  disableSubmitButtons(retryAfter * 1000);
}

function handleServerError(error) {
  showErrorMessage('Server error occurred. Please try again later.');
  
  // Log for debugging
  console.error('Server error:', error);
  
  // Optionally report to error tracking service
  if (window.Sentry) {
    Sentry.captureException(new Error(error.error));
  }
}

// Retry logic with exponential backoff
async function apiWithRetry(apiCall, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      // Don't retry client errors (4xx)
      if (error.status < 500) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      // Wait with exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Usage example
async function loadPipes() {
  try {
    const response = await apiWithRetry(() => 
      fetch('/api/pipes').then(r => {
        if (!r.ok) {
          return r.json().then(err => {
            throw { ...err, status: r.status };
          });
        }
        return r.json();
      })
    );
    
    displayPipes(response.data);
  } catch (error) {
    handleApiError(error, { status: error.status });
  }
}
```

### React Error Boundaries

```javascript
// Error boundary for React applications
class APIErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('API Error:', error, errorInfo);
    
    // Report to error tracking
    if (window.Sentry) {
      Sentry.captureException(error, { extra: errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>Please refresh the page or try again later.</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Custom hook for API error handling
function useApiError() {
  const [error, setError] = useState(null);
  
  const handleError = useCallback((error) => {
    setError(error);
    
    // Auto-clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return { error, handleError, clearError };
}
```

### Vue.js Error Handling

```javascript
// Vue.js error handler
const app = createApp(App);

app.config.errorHandler = (err, instance, info) => {
  console.error('Vue error:', err, info);
  
  // Handle API errors specifically
  if (err.name === 'APIError') {
    handleApiError(err);
  }
};

// Composition API error handling
function useErrorHandler() {
  const error = ref(null);
  
  const handleError = (err) => {
    error.value = err;
    
    // Auto-clear after 5 seconds
    setTimeout(() => {
      error.value = null;
    }, 5000);
  };
  
  const clearError = () => {
    error.value = null;
  };
  
  return { error, handleError, clearError };
}
```

## Best Practices

### Error Display

1. **User-Friendly Messages**: Show clear, actionable error messages
2. **Field-Level Validation**: Display validation errors next to relevant fields
3. **Toast Notifications**: Use non-blocking notifications for temporary errors
4. **Error Pages**: Provide dedicated error pages for major failures

### Error Recovery

1. **Retry Logic**: Implement automatic retries for server errors
2. **Fallback Data**: Show cached data when API is unavailable
3. **Progressive Enhancement**: Gracefully degrade functionality
4. **User Actions**: Provide clear actions users can take

### Logging and Monitoring

1. **Client-Side Logging**: Log errors for debugging
2. **Error Tracking**: Use services like Sentry for error monitoring
3. **User Context**: Include user and session information in error reports
4. **Rate Limiting**: Respect rate limits and implement backoff strategies

### Security Considerations

1. **Error Information**: Don't expose sensitive information in error messages
2. **Stack Traces**: Never show stack traces to users in production
3. **Input Validation**: Validate all input on both client and server
4. **Rate Limiting**: Implement proper rate limiting to prevent abuse

## Testing Error Scenarios

```javascript
// Test error handling
describe('API Error Handling', () => {
  test('handles validation errors', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: { name: 'Name is required' }
      })
    });
    
    const result = await api.createPipe({});
    
    expect(result.error).toBe('Validation failed');
    expect(result.details.name).toBe('Name is required');
  });
  
  test('handles network errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    await expect(api.getPipes()).rejects.toThrow('Network error');
  });
  
  test('retries server errors', async () => {
    fetch
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: true, json: () => ({ data: [] }) });
    
    const result = await apiWithRetry(() => api.getPipes());
    
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(result.data).toEqual([]);
  });
});
```

This comprehensive error handling guide ensures robust API integration with proper error recovery and user experience.