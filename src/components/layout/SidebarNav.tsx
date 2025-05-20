
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LayoutDashboard, BookText, HardHat, FilePlus } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';

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
  const { open } = useSidebar();

  return (
    <Sidebar
      side="left" // Default to left
      collapsible="icon">
        <SidebarHeader className="flex items-center justify-between p-3">
          <Link href="/dashboard" className={cn(
            "text-xl font-semibold text-primary transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
            MediaScope
          </Link>
        </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                    tooltip={{children: item.label, side: 'right'}}
                    className="justify-start"
                  >
                    <a>
                      <item.icon className="h-5 w-5" />
                      <span className={cn(open ? "inline" : "sr-only")}>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className={cn(
        "p-2 transition-opacity duration-300",
         open ? "opacity-100" : "opacity-0 pointer-events-none h-0 overflow-hidden"
        )}>
        <p className="text-xs text-muted-foreground text-center">{`© ${new Date().getFullYear()} MediaScope`}</p>
      </SidebarFooter>
    </Sidebar>
  );
}
