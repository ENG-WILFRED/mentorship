# Quick Start Guide - Authentication System

## Installation & Setup (Already Done ✅)

1. **Install Dependencies**
   ```bash
   pnpm add jsonwebtoken
   pnpm add -D @types/jsonwebtoken
   ```

2. **Environment Variables** (`.env.local`)
   ```
   ACCESS_TOKEN_SECRET=your-secret-access-key-change-this-in-production
   REFRESH_TOKEN_SECRET=your-secret-refresh-key-change-this-in-production
   ```

3. **Database Schema** (Already in Prisma)
   - User model with email, password, role, firstName, lastName, etc.

## Running the Application

### Start Development Server
```bash
pnpm run dev
```
Server runs on `http://localhost:3001` (or available port)

### Build for Production
```bash
pnpm run build
pnpm run start
```

## Testing the Auth System

### 1. Test Registration
1. Go to `http://localhost:3001/auth/register`
2. Fill in:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: password123
3. Click "Create Account"
4. Should redirect to dashboard showing "Welcome back, John Doe! 👋"

### 2. Test Login
1. Go to `http://localhost:3001/auth/login`
2. Enter:
   - Email: john@example.com
   - Password: password123
3. Click "Sign In"
4. Should show dashboard with user data

### 3. Verify Tokens in localStorage
1. Open DevTools (F12)
2. Go to "Application" tab
3. Click "localStorage"
4. Should see:
   - `accessToken` - JWT token
   - `refreshToken` - JWT token
   - `userRole` - User's role

### 4. Test Auto-Logout
1. Delete `refreshToken` from localStorage
2. Wait a minute
3. You'll see automatic logout attempt
4. Page should redirect to login

### 5. Test Logout
1. On dashboard, click "Sign Out" button
2. localStorage should be cleared
3. Should redirect to login page

## Using Auth in Your Components

### Option 1: Using the Hook (Client Components)
```typescript
"use client";
import { useAuthContext } from "@/context/AuthContext";

export function MyComponent() {
  const { user, role, logout, isAuthenticated } = useAuthContext();
  
  if (!isAuthenticated) return <div>Not logged in</div>;
  
  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <p>Role: {role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Option 2: Protecting Pages
```typescript
"use client";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, role } = useAuthContext();

  useEffect(() => {
    if (!isAuthenticated || role !== "ADMIN") {
      router.push("/auth/login");
    }
  }, [isAuthenticated, role, router]);

  if (!isAuthenticated) return <div>Loading...</div>;

  return <div>Admin Page</div>;
}
```

## API Integration

### Adding Auth Headers to API Calls
```typescript
import { getAccessToken } from "@/lib/auth";

async function fetchUserData() {
  const token = getAccessToken();
  
  const response = await fetch("/api/user-data", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  
  return response.json();
}
```

## Common Patterns

### Conditional Rendering Based on Auth
```typescript
const { isAuthenticated, role } = useAuthContext();

return (
  <div>
    {isAuthenticated ? (
      <>
        <Dashboard />
      </>
    ) : (
      <>
        <LoginPrompt />
      </>
    )}
  </div>
);
```

### Show Admin-Only Features
```typescript
const { role } = useAuthContext();

return (
  <div>
    {role === "ADMIN" && (
      <AdminPanel />
    )}
  </div>
);
```

### Handle Logout
```typescript
const { logout } = useAuthContext();
const router = useRouter();

const handleLogout = async () => {
  await logout();
  router.push("/");
};
```

## Database Queries

### Check User Role
```typescript
import { prisma } from "@/lib/prisma";

const user = await prisma.user.findUnique({
  where: { email: "john@example.com" }
});

console.log(user.role); // GUEST, MENTOR, ADMIN, STUDENT
```

### Update User Role (Admin Only)
```typescript
await prisma.user.update({
  where: { id: userId },
  data: { role: "MENTOR" }
});
```

## Troubleshooting

### Issue: "useAuthContext must be used within AuthProvider"
**Solution**: Make sure your component is wrapped with `<AuthProvider>` (it should be in layout.tsx already)

### Issue: Tokens not persisting
**Solution**: Check if localStorage is enabled in browser settings

### Issue: Auto-logout not working
**Solution**: Check browser console for errors, verify JWT secrets in `.env.local`

### Issue: "Invalid email or password" on login
**Solution**: 
1. Make sure user exists in database
2. Try registering a new account
3. Check database connection

### Issue: Prisma migration errors
**Solution**: Run migration
```bash
pnpm exec prisma migrate dev
```

## Production Checklist

- [ ] Change `ACCESS_TOKEN_SECRET` to a strong random string
- [ ] Change `REFRESH_TOKEN_SECRET` to a strong random string
- [ ] Use HTTPS (required for secure cookies)
- [ ] Consider implementing HTTP-only cookies
- [ ] Add rate limiting to auth endpoints
- [ ] Implement email verification on registration
- [ ] Add password reset functionality
- [ ] Monitor failed login attempts
- [ ] Set up logging for auth events
- [ ] Test with real database in staging

## Security Best Practices

1. **Environment Variables**: Never commit secrets to git
2. **HTTPS Only**: Always use HTTPS in production
3. **Token Rotation**: Implement token rotation for long sessions
4. **Rate Limiting**: Prevent brute force attacks
5. **Input Validation**: Validate all user inputs
6. **Password Strength**: Enforce strong passwords
7. **Secure Cookies**: Use HTTP-only, Secure, SameSite flags
8. **CORS**: Configure CORS properly
9. **Logging**: Log auth events for security monitoring
10. **Regular Updates**: Keep dependencies updated

## Next Steps

After confirming auth works:

1. **Add role-based route protection**
   ```typescript
   if (role !== "MENTOR") {
     router.push("/unauthorized");
   }
   ```

2. **Integrate with API endpoints**
   - Add Authorization header to all requests
   - Verify token on backend

3. **Add more auth features**
   - Password reset
   - Email verification
   - Two-factor authentication

4. **Improve UX**
   - Add session timeout warning
   - Implement "Remember me"
   - Add OAuth providers

## Support Resources

- JWT Documentation: https://jwt.io/
- Prisma Documentation: https://www.prisma.io/docs/
- Next.js Authentication: https://nextjs.org/docs/app/building-your-application/authentication
- bcryptjs: https://github.com/dcodeIO/bcrypt.js

## Questions?

Refer to the full documentation in `AUTHENTICATION.md` for detailed information about the implementation.
