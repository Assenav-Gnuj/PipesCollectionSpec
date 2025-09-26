# Authentication

The backend uses NextAuth.js for secure admin authentication. Public endpoints don't require authentication, but all admin endpoints do.

## Authentication Flow

```
Frontend App ──► POST /api/auth/signin ──► NextAuth.js ──► Session Cookie
     │                                                          │
     └──────────── Authenticated Admin Requests ◄──────────────┘
```

## Admin Login

### POST /api/auth/signin

Authenticate admin user and create session.

**Request:**
```json
{
  "email": "admin@example.com", 
  "password": "securepassword"
}
```

**Response Success (200):**
```json
{
  "user": {
    "id": "user123abc",
    "email": "admin@example.com",
    "name": "Admin User"
  },
  "session": {
    "expires": "2025-10-23T10:00:00Z"
  }
}
```

**Response Error (401):**
```json
{
  "error": "Invalid credentials",
  "code": "AUTH_INVALID",
  "timestamp": "2025-09-23T12:00:00Z"
}
```

## Session Management

### GET /api/auth/session

Get current authentication session.

**Response (200) - Authenticated:**
```json
{
  "user": {
    "id": "user123abc",
    "email": "admin@example.com", 
    "name": "Admin User"
  },
  "expires": "2025-10-23T10:00:00Z"
}
```

**Response (200) - Not Authenticated:**
```json
{
  "user": null
}
```

## Admin Logout

### POST /api/auth/signout

End admin session and clear cookies.

**Response (200):**
```json
{
  "message": "Signed out successfully"
}
```

## Session Cookies

NextAuth.js uses secure HTTP-only cookies for session management:

**Cookie Names:**
- `next-auth.session-token` (Production)
- `__Secure-next-auth.session-token` (HTTPS)

**Cookie Settings:**
- `HttpOnly`: true (prevents XSS)
- `Secure`: true (HTTPS only in production)
- `SameSite`: "lax" (CSRF protection)
- `Path`: "/"

## Frontend Implementation

### JavaScript/Fetch

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important: include cookies
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return response.json();
};

// Check session
const getSession = async () => {
  const response = await fetch('/api/auth/session', {
    credentials: 'include'
  });
  return response.json();
};

// Make authenticated request
const adminRequest = async (endpoint, options = {}) => {
  return fetch(endpoint, {
    ...options,
    credentials: 'include', // Include session cookie
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
};
```

### Axios Configuration

```javascript
import axios from 'axios';

// Configure axios to always include cookies
axios.defaults.withCredentials = true;

// Login
const login = async (email, password) => {
  const response = await axios.post('/api/auth/signin', {
    email,
    password
  });
  return response.data;
};

// Create authenticated axios instance
const adminApi = axios.create({
  baseURL: '/api/admin',
  withCredentials: true
});

// Use for admin requests
const getDashboard = () => adminApi.get('/dashboard');
```

### React/Next.js with NextAuth

If building with Next.js, you can use NextAuth.js directly:

```javascript
import { useSession, signIn, signOut } from 'next-auth/react';

function AdminLogin() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <p>Loading...</p>;
  
  if (session) {
    return (
      <>
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  
  return (
    <>
      <p>Not signed in</p>
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
```

## Protected Routes

All `/api/admin/*` endpoints require authentication. Requests without valid session will receive:

**Response (401):**
```json
{
  "error": "Unauthorized", 
  "code": "AUTH_REQUIRED",
  "timestamp": "2025-09-23T12:00:00Z"
}
```

## Security Features

### Password Security
- Passwords hashed with bcrypt (12 rounds)
- Minimum 8 characters required
- No password sent in responses

### Session Security  
- Secure HTTP-only cookies
- Session expiration (30 days default)
- CSRF protection via SameSite cookies
- Session rotation on login

### Rate Limiting
- Login attempts: 5 per minute per IP
- Failed attempts trigger temporary lockout
- Admin endpoints: 1000 requests per minute per user

## Environment Configuration

Required environment variables:

```bash
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pipes_collection

# Optional: Custom session settings
NEXTAUTH_SESSION_MAX_AGE=2592000  # 30 days in seconds
```

## Error Codes

| Code | Description |
|------|-------------|
| `AUTH_INVALID` | Invalid email/password combination |
| `AUTH_REQUIRED` | Authentication required for this endpoint |
| `SESSION_EXPIRED` | Session has expired, please login again |
| `RATE_LIMITED` | Too many authentication attempts |

## Troubleshooting

### Common Issues

**Cookies not being sent:**
- Ensure `credentials: 'include'` in fetch requests
- Set `withCredentials: true` in axios
- Check CORS configuration allows credentials

**Session not persisting:**
- Verify `NEXTAUTH_SECRET` is set
- Check cookie domain matches your application
- Ensure HTTPS in production

**401 Unauthorized on admin endpoints:**
- Verify session cookie is being sent
- Check session hasn't expired
- Confirm user has admin privileges

### Debug Session Issues

```javascript
// Check if session cookie exists
console.log(document.cookie);

// Verify session endpoint
fetch('/api/auth/session', { credentials: 'include' })
  .then(r => r.json())
  .then(console.log);
```