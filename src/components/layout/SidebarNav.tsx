
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, BookText, HardHat, FilePlus } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/logbook', label: 'Logbook', icon: BookText },
  { href: '/operation-room', label: 'Incident Center', icon: HardHat },
  { href: '/report-incident', label: 'Report Incident', icon: FilePlus },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border shadow-xl flex items-center z-40">
      <ul className="flex justify-around items-center w-full h-full px-1">
        {navItems.map((item) => (
          <li key={item.href} className="flex-1">
            <Link
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center h-full p-1 rounded-md text-xs font-medium transition-colors w-full",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", 
                (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)))
                  ? "text-primary" 
                  : "text-muted-foreground" 
              )}
            >
              <item.icon className="h-5 w-5 mb-0.5" />
              <span className="truncate text-[10px]">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
