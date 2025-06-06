
"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-sidebar text-sidebar-foreground border-sidebar-border px-4 md:px-6">
      <div className="flex-1">
        <Link href="/dashboard" className="flex items-center gap-2 text-sidebar-foreground hover:opacity-80 transition-opacity">
           <div className="flex flex-col">
            <span className="text-lg font-semibold leading-tight">Saudi Red Sea Authority</span>
            <span className="text-xs text-accent opacity-80 leading-tight">Media Monitoring Center</span>
          </div>
        </Link>
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-sidebar-foreground hidden md:inline">
            {user.displayName || 'User'}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user.photoURL || undefined}
                    alt={user.displayName || 'User'}
                    data-ai-hint="user avatar"
                  />
                  <AvatarFallback className="bg-sky-blue text-deep-sea-blue">{getInitials(user.displayName)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="me-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
}
