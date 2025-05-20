
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
import { LogOut, UserCircle, Settings, Languages } from 'lucide-react'; // Added Languages icon
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useLanguage } from '@/contexts/LanguageContext'; // Added import

export default function Header() {
  const { user, logout } = useAuth();
  const { isMobile } = useSidebar(); 
  const { language, toggleLanguage, dir } = useLanguage(); // Added language context

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <header className={`sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
       {isMobile && <SidebarTrigger />}
      <div className="flex-1">
        <Link href="/dashboard" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          MediaScope
        </Link>
      </div>
      
      <Button variant="outline" size="icon" onClick={toggleLanguage} title="Toggle Language">
        <Languages className="h-5 w-5" />
        <span className="sr-only">Toggle Language ({language === 'en' ? 'Switch to Arabic' : 'Switch to English'})</span>
      </Button>

      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} data-ai-hint="profile avatar" />
                <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
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
            <DropdownMenuItem>
              <UserCircle className={`${dir === 'rtl' ? 'ms-2' : 'me-2'} h-4 w-4`} />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className={`${dir === 'rtl' ? 'ms-2' : 'me-2'} h-4 w-4`} />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className={`${dir === 'rtl' ? 'ms-2' : 'me-2'} h-4 w-4`} />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
