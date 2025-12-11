// Client-safe session helper
export type SessionInfo = {
  userId?: number | null;
  email?: string | null;
  role?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
};

function safeParseJwt<T = any>(token: string | null): T | null {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json))) as T;
  } catch (e) {
    console.error('Failed to decode JWT in browser', e);
    return null;
  }
}

export function getSession(): SessionInfo {
  if (typeof window === 'undefined') return {};
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const userRole = localStorage.getItem('userRole');

  const payload = safeParseJwt<{ userId?: number; email?: string; role?: string }>(accessToken);

  return {
    userId: payload?.userId ?? null,
    email: payload?.email ?? null,
    role: payload?.role ?? userRole ?? null,
    accessToken: accessToken ?? null,
    refreshToken: refreshToken ?? null,
  };
}
