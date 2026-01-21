'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Mock auth functions - replace with your actual implementations
const mockGetUser = async () => {
  try {
    // Check if user exists in localStorage/sessionStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    
    // Or check for token in cookies
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    if (token) {
      // Verify token with backend
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

const mockFetchWithAuth = async (url, options = {}) => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
  
  return response;
};

const clearAuthData = () => {
  // Clear localStorage
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
  
  // Clear cookies
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  // Clear any other auth cookies
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    
    // Clear auth-related cookies
    if (name.includes('auth') || name.includes('session') || name.includes('token')) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  }
};

const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  checkAuth: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const checkAuth = useCallback(async () => {
    if (initialized) return;
    
    setLoading(true);
    try {
      const userData = await mockGetUser();
      if (userData) {
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [initialized]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback((userData) => {
    setUser(userData);
    setLoading(false);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(async () => {
    try {
      // Clear state immediately for instant UI update
      setUser(null);
      setLoading(false);
      
      // Clear all auth data
      clearAuthData();
      
      // Call logout endpoint
      await mockFetchWithAuth('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if server call fails
      setUser(null);
      clearAuthData();
    } finally {
      // Force a re-render to update UI
      window.location.href = '/';
    }
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};