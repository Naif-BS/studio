
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
    setIsLoading(true);
    try {
      const storedUserJson = localStorage.getItem('mediaScopeUser');
      if (storedUserJson) {
        let userObj = JSON.parse(storedUserJson) as MockUser | null;
        if (userObj) {
          // Ensure displayName is valid and non-empty
          if (!userObj.displayName || userObj.displayName.trim() === '') {
            userObj.displayName = (userObj.email ? userObj.email.split('@')[0].trim() : null) || 'User';
          }
          // Ensure photoURL is consistent with displayName
          userObj.photoURL = `https://placehold.co/100x100.png?text=${(userObj.displayName[0] || 'U').toUpperCase()}`;
          
          // Optional: Update localStorage if changes were made to the loaded user object
          // localStorage.setItem('mediaScopeUser', JSON.stringify(userObj));
          
          setUser(userObj);
        } else {
          setUser(null); 
        }
      }
    } catch (error) {
      console.error("Failed to load user from localStorage:", error);
      localStorage.removeItem('mediaScopeUser');
      setUser(null); 
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email?: string, password?: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const providedEmail = email || 'user@example.com';
      const namePart = providedEmail.split('@')[0].trim();
      const generatedDisplayName = namePart || 'User'; // Ensures displayName is never empty

      const mockUser: MockUser = {
        uid: 'mock-user-123',
        email: providedEmail,
        displayName: generatedDisplayName,
        photoURL: `https://placehold.co/100x100.png?text=${(generatedDisplayName[0] || 'U').toUpperCase()}`,
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        providerId: 'password', 
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
