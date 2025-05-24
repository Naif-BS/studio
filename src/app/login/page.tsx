// src/app/login/page.tsx
"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; // Import Google specific auth
import { app } from '@/lib/firebase'; // Your Firebase app instance
import { useToast } from '@/hooks/use-toast'; // Assuming you have this for notifications
import { useRouter } from 'next/navigation'; // Import Next.js router for redirection

export default function LoginPage() {
  const { user, login, isLoading: authLoading } = useAuth(); // Keep login if you have email/password too
  const [isSigningIn, setIsSigningIn] = React.useState(false); // New state for Google sign-in specific loading
  const { toast } = useToast();
  const router = useRouter(); // Initialize router

  const auth = getAuth(app); // Get the Firebase Auth instance

  // Function to handle Google Sign-in
  const handleGoogleSignIn = async () => {
    setIsSigningIn(true); // Start loading state for Google sign-in
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider); // Use signInWithPopup for Google
      toast({
        title: "Signed In Successfully!",
        description: "Welcome back to MediaScope.",
        variant: "default",
      });
      // Optionally redirect after successful login
      router.push('/dashboard'); // Redirect to dashboard or another protected route

    } catch (error: any) {
      console.error("Google Sign-in Error:", error);
      let errorMessage = "Failed to sign in with Google.";
      if (error.code) {
        // Specific Firebase Auth error codes
        if (error.code === 'auth/popup-closed-by-user') {
          errorMessage = 'Sign-in window was closed. Please try again.';
        } else if (error.code === 'auth/cancelled-popup-request') {
          errorMessage = 'Sign-in cancelled. A previous request was already in progress.';
        } else if (error.code === 'auth/account-exists-with-different-credential') {
          errorMessage = 'An account with this email already exists using a different sign-in method.';
        }
        // You can add more specific error handling here
      }
      toast({
        title: "Sign-in Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSigningIn(false); // End loading state
    }
  };

  // If user is already authenticated (e.g., from a previous session), redirect
  React.useEffect(() => {
    if (user && !authLoading) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="mx-auto mb-4">
            {/* You can uncomment and update your logo here if you have one */}
            {/* <Image
              src="/srsa-logo.png"
              alt="SRSA Organization Logo"
              width={600}
              height={120}
            /> */}
            <h1 className="text-2xl font-bold text-foreground">Saudi Red Sea Authority</h1>
            <p className="text-sm text-muted-foreground">Media Monitoring Center</p>
          </div>
          <CardDescription className="pt-2">Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn} // Use the new Google sign-in handler
            disabled={isSigningIn || authLoading} // Disable button during Google sign-in or AuthContext loading
          >
            {(isSigningIn || authLoading) && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
            {/* Google SVG Icon (replaces Outlook icon) */}
            <svg className="me-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.6c2.093 0 3.993.896 5.333 2.366l-2.01 2.01c-.96-.96-2.28-1.55-3.323-1.55-2.093 0-3.864 1.4-4.52 3.327-.087.42-.133.86-.133 1.303 0 .42.046.86.133 1.303.656 1.927 2.427 3.327 4.52 3.327 1.043 0 2.363-.59 3.323-1.55l2.01 2.01c-1.34 1.47-3.24 2.366-5.333 2.366-4.627 0-8.4-3.773-8.4-8.4s3.773-8.4 8.4-8.4zm0 4.8c1.373 0 2.653.64 3.493 1.637l-1.42 1.42c-.52-.52-1.29-.86-2.073-.86-1.593 0-2.893 1.3-2.893 2.893 0 1.593 1.3 2.893 2.893 2.893 1.593 0 2.893-1.3 2.893-2.893 0-.087-.01-.173-.017-.26H12v-2.4H15.6c-.08-.52-.193-.93-.327-1.303-.84-1.043-2.12-1.637-3.473-1.637z"/>
            </svg>
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}