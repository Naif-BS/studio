
"use client"
import React from 'react';
import Header from './Header';
import SidebarNav from './SidebarNav'; // This will become the bottom bar
import { SidebarProvider } from '@/components/ui/sidebar';
// SidebarInset is removed as it might be an unnecessary layer for the current layout

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}> {/* Kept for potential use by other components */}
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 pt-16 pb-20"> {/* pt-16 for Header (h-16), pb-20 for SidebarNav (h-16) + extra space */}
          {children}
        </main>
        <SidebarNav /> {/* Bottom navigation bar */}
      </div>
    </SidebarProvider>
  );
}
