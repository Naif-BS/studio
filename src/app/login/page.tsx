
"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail } from 'lucide-react'; // Using Mail icon for generic email login

export default function LoginPage() {
  const { login, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Password field for mock traditional login

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password); 
  };
  
  const handleOutlookSignIn = async () => {
    // Simulate Outlook sign-in, using a default mock user or specific logic
    await login('outlook.user@example.com', 'password'); 
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">MediaScope</CardTitle>
          <CardDescription>Sign in to monitor media effectively</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={authLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={authLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="mx-4 flex-shrink text-xs uppercase text-muted-foreground">Or</span>
            <div className="flex-grow border-t border-border"></div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleOutlookSignIn} disabled={authLoading}>
            {authLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.208.667H4.002C2.133.667.668 2.132.668 4.001v3.427h7.198V.667zM2.93 9.193H.668v5.613h2.262V9.193zm8.278-1.264H4.002v7.198h7.417c1.81 0 3.281-1.47 3.281-3.282V7.81c0-1.751-1.47-3.143-3.492-3.143zM11.208 16.03h-7.21V20c0 1.869 1.465 3.334 3.333 3.334h3.877v-7.304zM2.93 16.455H.668V21.07c0 .725.25 1.39.675 1.915l8.033-8.033H2.93v1.503zm10.543-7.262c0-1.004-.815-1.82-1.82-1.82s-1.82.816-1.82 1.82c0 1.004.815 1.819 1.82 1.819s1.82-.815 1.82-1.819zm1.82 0c0-1.004-.815-1.82-1.82-1.82V5.51c1.752 0 3.282 1.47 3.282 3.282s-1.53 3.282-3.282 3.282v-1.82c1.005 0 1.82-.815 1.82-1.82zm6.761 2.816l-4.103 4.124v4.04h.042c1.868 0 3.375-1.507 3.375-3.375V12.01c0-.014.042-.042.042-.042s.042-.042.042-.042h.042c.11-.78.555-2.24.563-2.283z" />
            </svg>
            Sign in with Outlook
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
