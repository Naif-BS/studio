
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
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto pb-20"> {/* Added pb-20 for bottom nav space */}
            {children}
          </main>
        </SidebarInset>
        <SidebarNav /> {/* Bottom navigation bar */}
      </div>
    </SidebarProvider>
  );
}
