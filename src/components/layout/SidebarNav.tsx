
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LayoutDashboard, BookText, HardHat, FilePlus, Filter } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
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
  const { open, toggleSidebar } = useSidebar();


  return (
    <Sidebar className="ltr:border-r rtl:border-l" collapsible="icon">
        <SidebarHeader className="flex items-center justify-between p-3">
          <Link href="/dashboard" className={cn(
            "text-xl font-semibold text-primary transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
            MediaScope
          </Link>
          {/* Sidebar trigger for desktop, if needed, or style the existing one */}
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
                    tooltip={{children: item.label}}
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
        {/* Footer content if any */}
        <p className="text-xs text-muted-foreground text-center">&copy; {new Date().getFullYear()} MediaScope</p>
      </SidebarFooter>
    </Sidebar>
  );
}
