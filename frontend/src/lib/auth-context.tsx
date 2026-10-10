'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authApi } from './api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string; targetRole?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      const res = await authApi.getCurrentUser();
      if (res.data.success && res.data.data) {
        setUser(res.data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      sessionStorage.removeItem('applytrack_token');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await authApi.login(credentials);
    if (res.data.success && res.data.data) {
      const { user: loggedInUser, token } = res.data.data;
      if (token) {
        sessionStorage.setItem('applytrack_token', token);
      }
      setUser(loggedInUser);
      router.push('/dashboard');
    }
  };

  const register = async (data: { name: string; email: string; password: string; targetRole?: string }) => {
    const res = await authApi.register(data);
    if (res.data.success && res.data.data) {
      const { user: registeredUser, token } = res.data.data;
      if (token) {
        sessionStorage.setItem('applytrack_token', token);
      }
      setUser(registeredUser);
      router.push('/dashboard');
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      sessionStorage.removeItem('applytrack_token');
      setUser(null);
      router.push('/login');
    }
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
