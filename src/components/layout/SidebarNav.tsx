
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
import { useLanguage } from '@/contexts/LanguageContext';


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
  const { dir } = useLanguage();


  return (
    <Sidebar className={cn(dir === 'rtl' ? "rtl:border-l ltr:border-r-0" : "ltr:border-r rtl:border-l-0")} collapsible="icon">
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
                    tooltip={{children: item.label, side: dir === 'rtl' ? 'left' : 'right'}}
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
        <p className="text-xs text-muted-foreground text-center">&copy; {new Date().getFullYear()} MediaScope</p>
      </SidebarFooter>
    </Sidebar>
  );
}
