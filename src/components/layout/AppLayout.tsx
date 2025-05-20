"use client"
import React from 'react';
import Header from './Header';
import SidebarNav from './SidebarNav'; // This will become the bottom bar

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background"> {/* Added w-full */}
      <Header />
      <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 pt-16 pb-20">
        {children}
      </main>
      <SidebarNav /> {/* Bottom navigation bar */}
    </div>
  );
}
