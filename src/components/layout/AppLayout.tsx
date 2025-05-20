
"use client"
import React from 'react';
import Header from './Header';
import SidebarNav from './SidebarNav'; // This will become the bottom bar
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}> {/* Kept for potential use by other components, though its direct role for sidebar state is reduced */}
      <div className="flex flex-col min-h-screen bg-background">
        <SidebarInset className="flex flex-col flex-1 overflow-hidden"> {/* Manages Header and Main Content */}
          <Header />
          <main className="flex-1 px-4 md:px-6 lg:px-8 pt-16 pb-20 overflow-auto"> {/* Adjusted padding */}
            {children}
          </main>
        </SidebarInset>
        <SidebarNav /> {/* Bottom navigation bar */}
      </div>
    </SidebarProvider>
  );
}
