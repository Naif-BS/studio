
"use client";

import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoading: authLoading } = useAuth();

  const handleOutlookSignIn = async () => {
    await login('outlook.user@example.com', 'password');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto">
            <Image
              src="/srsa-logo.png"
              alt="SRSA Organization Logo"
              width={229}
              height={60}
              data-ai-hint="organization logo"
            />
          </div>
          <CardDescription>Sign in with your Outlook account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" onClick={handleOutlookSignIn} disabled={authLoading}>
            {authLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
            <svg className="me-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.208.667H4.002C2.133.667.668 2.132.668 4.001v3.427h7.198V.667zM2.93 9.193H.668v5.613h2.262V9.193zm8.278-1.264H4.002v7.198h7.417c1.81 0 3.281-1.47 3.281-3.282V7.81c0-1.751-1.47-3.143-3.492-3.143zM11.208 16.03h-7.21V20c0 1.869 1.465 3.334 3.333 3.334h3.877v-7.304zM2.93 16.455H.668V21.07c0 .725.25 1.39.675 1.915l8.033-8.033H2.93v1.503zm10.543-7.262c0-1.004-.815-1.82-1.82-1.82s-1.82.816-1.82 1.82c0 1.004.815 1.819 1.82 1.819s1.82-.815 1.82-1.819zm1.82 0c0-1.004-.815-1.82-1.82-1.82V5.51c1.752 0 3.282 1.47 3.282 3.282s-1.53 3.282-3.282 3.282v-1.82c1.005 0 1.82-.815 1.82-1.82zm6.761 2.816l-4.103 4.124v4.04h.042c1.868 0 3.375-1.507 3.375-3.375V12.01c0-.014.042-.042.042-.042s.042-.042.042-.042h.042c.11-.78.555-2.24.563-2.283z" />
            </svg>
            Sign in with Outlook
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
