
"use client"
import React from 'react';
import Header from './Header';
import SidebarNav from './SidebarNav'; // This will become the bottom bar
// SidebarProvider and useSidebar context are removed as they are not essential for the current bottom nav layout.

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    // This div is now the outermost structural element for this layout part.
    // It ensures the layout takes at least the full screen height and applies the background.
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 pt-16 pb-20">
        {children}
      </main>
      <SidebarNav /> {/* Bottom navigation bar */}
    </div>
  );
}
