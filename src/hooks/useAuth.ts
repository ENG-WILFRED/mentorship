'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  storeTokens,
  getAccessToken,
  getRefreshToken,
  getUserRole,
  clearTokens,
  isTokenExpired,
} from '../lib/auth';
import { loginUser } from '../actions/auth/loginAction';
import { registerUser } from '../actions/auth/registerAction';
import { refreshAccessTokenAction } from '../actions/auth/refreshAction';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  memorableId: string;
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Define refreshAccessToken first
  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        setUser(null);
        setRole(null);
        return;
      }

      const result = await refreshAccessTokenAction(refreshToken);

      if (!result.success) {
        clearTokens();
        setUser(null);
        setRole(null);
        return;
      }

        if (result.accessToken && result.refreshToken && result.role) {
          storeTokens(result.accessToken, result.refreshToken, result.role);
          setRole(result.role);
        }
    } catch (err) {
      console.error('Token refresh failed:', err);
      clearTokens();
      setUser(null);
      setRole(null);
    }
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const accessToken = getAccessToken();
      const storedRole = getUserRole();
      if (accessToken && storedRole) {
        setRole(storedRole);
      }
    };
    initializeAuth();
  }, []);

  // Setup auto-refresh token
  useEffect(() => {
    const setupAutoRefresh = async () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!accessToken || !refreshToken) {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
        return;
      }

      // Check immediately
      if (isTokenExpired(accessToken)) {
        await refreshAccessToken();
      }

      // Set up interval to check every minute
      refreshIntervalRef.current = setInterval(async () => {
        const token = getAccessToken();
        if (token && isTokenExpired(token)) {
          await refreshAccessToken();
        }
      }, 60 * 1000); // Check every minute
    };

    setupAutoRefresh();

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [refreshAccessToken]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loginUser(email, password);

      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }

        if (result.accessToken && result.refreshToken && result.role && result.user) {
          storeTokens(result.accessToken, result.refreshToken, result.role);
          setUser(result.user);
          setRole(result.role);
        } else {
          throw new Error('Invalid response from login');
        }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (firstName: string, lastName: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await registerUser(firstName, lastName, email, password);

      if (!result.success) {
        throw new Error(result.error || 'Registration failed');
      }

        if (result.accessToken && result.refreshToken && result.role && result.user) {
          storeTokens(result.accessToken, result.refreshToken, result.role);
          setUser(result.user);
          setRole(result.role);
        } else {
          throw new Error('Invalid response from registration');
        }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      clearTokens();
      setUser(null);
      setRole(null);
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    }
  }, []);

  return {
    user,
    role,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!role && !!getAccessToken(),
  };
}
