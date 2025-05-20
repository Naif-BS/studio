
"use client";

import type { User } from 'firebase/auth'; // Using firebase type for structure, but not implementing firebase auth
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null; // Mocking User type
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email?: string, password?: string) => Promise<void>; // Mock login
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock User data structure
interface MockUser extends User {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking auth state from localStorage or a cookie
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem('mediaScopeUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage:", error);
      // Clear potentially corrupted stored data
      localStorage.removeItem('mediaScopeUser');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email?: string, password?: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser: MockUser = {
        uid: 'mock-user-123',
        email: email || 'user@example.com',
        displayName: email ? email.split('@')[0] : 'Mock User',
        photoURL: `https://placehold.co/100x100.png?text=${(email ? email[0] : 'M').toUpperCase()}`,
        // Required User properties from firebase/auth User type
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        providerId: 'password', // or 'microsoft.com' for Outlook
        refreshToken: 'mock-refresh-token',
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => 'mock-id-token',
        getIdTokenResult: async () => ({ token: 'mock-id-token', claims: {}, expirationTime: '', issuedAtTime: '', signInProvider: null, signInSecondFactor: null}),
        reload: async () => {},
        toJSON: () => ({}),
      };
      setUser(mockUser);
      localStorage.setItem('mediaScopeUser', JSON.stringify(mockUser));
      router.push('/dashboard');
    } catch (error) {
      console.error("Login process failed:", error);
      // In a real app, you might show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
      localStorage.removeItem('mediaScopeUser');
      router.push('/login');
    } catch (error) {
      console.error("Logout process failed:", error);
      // In a real app, you might show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
