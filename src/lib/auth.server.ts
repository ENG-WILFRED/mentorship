import { prisma } from './prisma';
import { verifyAccessToken } from './auth';

export async function getCurrentUser(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token);
  if (!decoded) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Error fetching user (server):', error);
    return {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  }
}

export function checkUserRole(user: any, requiredRole: string | string[]): boolean {
  if (!user) return false;
  if (Array.isArray(requiredRole)) return requiredRole.includes(user.role);
  return user.role === requiredRole;
}

export async function requireAuthMiddleware(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) return { error: 'Unauthorized', status: 401 };
  return { user };
}
