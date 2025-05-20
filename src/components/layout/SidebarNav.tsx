
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, BookText, HardHat, FilePlus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/logbook', label: 'Logbook', icon: BookText },
  { href: '/operation-room', label: 'Operation Room', icon: HardHat },
  { href: '/report-incident', label: 'Report Incident', icon: FilePlus },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border shadow-lg flex items-center z-40 md:hidden">
      <TooltipProvider delayDuration={0}>
        <ul className="flex justify-around items-center w-full h-full px-1">
          {navItems.map((item) => (
            <li key={item.href} className="flex-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center justify-center h-full p-1 rounded-md text-xs font-medium transition-colors w-full",
                      "hover:bg-accent hover:text-accent-foreground",
                      (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)))
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 mb-0.5" />
                    <span className="truncate text-[10px]">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="mb-1">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </li>
          ))}
        </ul>
      </TooltipProvider>
    </nav>
  );
}
