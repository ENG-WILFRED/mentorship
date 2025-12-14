import jwt from 'jsonwebtoken';
import { prisma } from   './prisma'// Adjust the import path as necessary

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-access-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key';
const ACCESS_TOKEN_EXPIRY = '1h'; // 1 hour
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
  exp?: number;
  iat?: number;
}

/**
 * Generate both access and refresh tokens
 */
export function generateTokens(payload: TokenPayload) {
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Decode token without verification (for client-side role extraction)
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Client-side: Store tokens in localStorage
 */
export function storeTokens(accessToken: string, refreshToken: string, role: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userRole', role);
  }
}

/**
 * Client-side: Retrieve access token
 */
export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
}

/**
 * Client-side: Retrieve refresh token
 */
export function getRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
}

/**
 * Client-side: Retrieve user role
 */
export function getUserRole(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userRole');
  }
  return null;
}

/**
 * Client-side: Clear all auth tokens and role
 */
export function clearTokens() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
  }
}

/**
 * Client-side: Check if access token is expired (with buffer time)
 */
export function isTokenExpired(token: string, bufferSeconds = 300): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  return (decoded.exp * 1000) - Date.now() < bufferSeconds * 1000;
}
/** so am adding server side user management features */
// Add these to your existing lib/auth.ts file



/**
 * Server-side: Get current user from request
 */
export async function getCurrentUser(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  
  const token = authHeader.split(' ')[1]
  const decoded = verifyAccessToken(token)
  
  if (!decoded) return null
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { 
        id: true, 
        email: true, 
        role: true, 
        firstName: true, 
        lastName: true 
      }
    })
    
    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    return {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    }
  }
}

/**
 * Check if user has required role (server-side)
 */
export function checkUserRole(user: any, requiredRole: string | string[]): boolean {
  if (!user) return false
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role)
  }
  
  return user.role === requiredRole
}

/**
 * Simple middleware for API routes
 */
export async function requireAuthMiddleware(request: Request) {
  const user = await getCurrentUser(request)
  
  if (!user) {
    return { error: 'Unauthorized', status: 401 }
  }
  
  return { user }
}