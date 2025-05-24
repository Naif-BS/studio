// src/contexts/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  getAuth,
  onAuthStateChanged,
  User,
  IdTokenResult,
  signInWithEmailAndPassword,
  signOut,
  AuthError,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { app } from "@/lib/firebase"; // Make sure this path is correct and src/lib/firebase.ts exists and exports 'app'
import { useToast } from "@/hooks/use-toast"; // Assuming you have a toast notification system

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create a mock user for cases where Firebase might not be fully initialized
// or for environments where auth is not strictly needed (e.g., build time checks)
const MOCK_USER: User = {
  uid: "mock-uid",
  email: "mock@example.com",
  displayName: "Mock User",
  emailVerified: true,
  isAnonymous: false,
  phoneNumber: null,
  photoURL: null,
  providerData: [],
  tenantId: null,
  refreshToken: 'mock-refresh-token',
  // ADDED MISSING PROPERTIES FOR User type
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString(),
  },
  providerId: 'firebase', // Example providerId

  // Mock methods required by User type
  delete: async () => {},
  getIdToken: async () => 'mock-id-token',
  getIdTokenResult: async () => ({
    token: 'mock-id-token',
    claims: {},
    expirationTime: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour from now
    issuedAtTime: new Date().toISOString(),
    authTime: new Date().toISOString(), // This was the previously missing property
    signInProvider: null,
    signInSecondFactor: null
  }),
  reload: async () => {},
  toJSON: () => ({}),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const auth = getAuth(app); // Initialize Firebase Auth instance

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  const login = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Logged In Successfully!",
        description: "Welcome back to MediaScope.",
        variant: "default",
      });
    } catch (err) {
      const firebaseError = err as AuthError;
      setError(firebaseError.message);
      toast({
        title: "Login Failed",
        description: firebaseError.message,
        variant: "destructive",
      });
      console.error("Login error:", firebaseError);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        setUser(userCredential.user); // Update user state with displayName
        setIsAuthenticated(true);
        toast({
          title: "Account Created!",
          description: "Welcome to MediaScope. Your account has been successfully created.",
          variant: "default",
        });
      }
    } catch (err) {
      const firebaseError = err as AuthError;
      setError(firebaseError.message);
      toast({
        title: "Signup Failed",
        description: firebaseError.message,
        variant: "destructive",
      });
      console.error("Signup error:", firebaseError);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        variant: "default",
      });
    } catch (err) {
      const firebaseError = err as AuthError;
      setError(firebaseError.message);
      toast({
        title: "Logout Failed",
        description: firebaseError.message,
        variant: "destructive",
      });
      console.error("Logout error:", firebaseError);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user: user || MOCK_USER,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};