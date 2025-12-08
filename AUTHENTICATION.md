# Authentication System Documentation

## Overview
This document describes the real authentication system implemented for the Wisdom Mentorship application. The system uses JWT (JSON Web Tokens) for secure authentication with access and refresh tokens.

## Features

### 1. JWT Token Management
- **Access Token**: 1-hour expiration, used for authenticating API requests
- **Refresh Token**: 7-day expiration, used to generate new access tokens
- Both tokens are stored in browser localStorage

### 2. Automatic Token Refresh
- Access tokens are automatically refreshed before expiration
- Background refresh check every 1 minute
- Graceful cleanup when refresh token expires

### 3. Role-Based Access
- User roles (ADMIN, MENTOR, STUDENT, GUEST) stored in localStorage
- Role is decoded from JWT token and stored for quick access
- Protects pages based on user authentication status

### 4. Secure Storage
- Tokens stored in localStorage (client-side)
- Role stored in localStorage for quick access
- Clear all tokens on logout

## Architecture

### API Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "GUEST",
    "memorableId": "ABC123"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "role": "GUEST"
}
```

#### POST `/api/auth/login`
Authenticate a user and return tokens.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "MENTOR",
    "memorableId": "ABC123"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "role": "MENTOR"
}
```

#### POST `/api/auth/refresh`
Generate new tokens using refresh token.

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "role": "MENTOR"
}
```

#### POST `/api/auth/logout`
Logout endpoint (mainly for server-side cleanup if needed).

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

### Utility Functions (`src/lib/auth.ts`)

#### Token Generation
```typescript
generateTokens(payload: TokenPayload): { accessToken, refreshToken }
```
Generates both access and refresh tokens.

#### Token Verification
```typescript
verifyAccessToken(token: string): TokenPayload | null
verifyRefreshToken(token: string): TokenPayload | null
```
Server-side token verification.

#### Client Storage
```typescript
storeTokens(accessToken, refreshToken, role)
getAccessToken(): string | null
getRefreshToken(): string | null
getUserRole(): string | null
clearTokens()
isTokenExpired(token, bufferSeconds = 300): boolean
```
Client-side token management.

### React Hook (`src/hooks/useAuth.ts`)

The `useAuth` hook provides authentication functionality to React components.

**Usage:**
```typescript
const { user, role, isLoading, error, login, register, logout, isAuthenticated } = useAuth();
```

**Properties:**
- `user`: Current authenticated user object (null if not authenticated)
- `role`: User role as string
- `isLoading`: Boolean indicating ongoing async operation
- `error`: Error message if operation failed
- `isAuthenticated`: Boolean indicating if user is logged in
- `login(email, password)`: Async function to login
- `register(firstName, lastName, email, password)`: Async function to register
- `logout()`: Async function to logout

### Context Provider (`src/context/AuthContext.tsx`)

Wraps the application to provide authentication context to all components.

**Usage in Root Layout:**
```typescript
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

**Usage in Components:**
```typescript
import { useAuthContext } from "@/context/AuthContext";

export function MyComponent() {
  const { user, role, logout } = useAuthContext();
  // ...
}
```

## Implementation Examples

### Login Page
```typescript
"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/mentor/dashboard");
    } catch {
      // Error handled by hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
      <button disabled={isLoading}>{isLoading ? "Signing in..." : "Sign In"}</button>
    </form>
  );
}
```

### Protected Dashboard Page
```typescript
"use client";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, role, logout } = useAuthContext();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <p>Your role: {role}</p>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```

## Token Lifecycle

1. **Registration/Login**: User credentials exchanged for access + refresh tokens
2. **Storage**: Tokens and role stored in localStorage
3. **Usage**: Access token sent with API requests (via fetch/axios)
4. **Refresh**: Background process checks token expiry every minute
5. **Auto-Refresh**: If token expires, refresh token generates new access token
6. **Logout**: All tokens and role cleared from localStorage

## Environment Variables

Add to `.env.local`:

```
ACCESS_TOKEN_SECRET=your-secret-access-key-change-this-in-production
REFRESH_TOKEN_SECRET=your-secret-refresh-key-change-this-in-production
```

**Important**: Change these secrets in production!

## Security Considerations

1. **Token Storage**: Tokens are stored in localStorage (accessible via JavaScript). For enhanced security:
   - Consider implementing HTTP-only cookies
   - Add CSRF protection
   - Implement token rotation

2. **Token Secrets**: Currently using default fallback values. Set proper secrets in environment variables.

3. **HTTPS**: Always use HTTPS in production to prevent token interception.

4. **Token Expiration**: 
   - Access tokens expire in 1 hour
   - Refresh tokens expire in 7 days
   - Adjust these as needed for your security requirements

5. **Password Hashing**: Passwords are hashed using bcryptjs before storage.

## Testing the System

### 1. Register a New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Refresh Token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your-refresh-token-here"
  }'
```

## Common Issues

### 1. "Token refresh failed" error
- Ensure refresh token is valid and not expired
- Check environment variables for JWT secrets
- Verify database connection

### 2. Page redirects to login immediately
- Check if tokens are being stored correctly in localStorage
- Verify the AuthProvider is wrapped around your app
- Check browser console for errors

### 3. "Invalid email or password"
- Ensure user exists in database
- Verify password is correct
- Check database connection

## Future Enhancements

1. **OAuth Integration**: Add Google/GitHub OAuth
2. **Two-Factor Authentication**: Add 2FA support
3. **Session Management**: Implement server-side session tracking
4. **Token Blacklist**: Add token revocation mechanism
5. **Rate Limiting**: Implement login attempt rate limiting
6. **Password Reset**: Add forgot password functionality
7. **Email Verification**: Verify email on registration
