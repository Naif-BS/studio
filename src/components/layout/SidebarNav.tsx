
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button'; // Button import seems unused
import { ScrollArea } from '@/components/ui/scroll-area';
import { LayoutDashboard, BookText, HardHat, FilePlus } from 'lucide-react'; // Filter icon was unused
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  // SidebarTrigger, // SidebarTrigger import seems unused here
  useSidebar,
} from '@/components/ui/sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TranslationKey } from '@/lib/translations';


interface NavItem {
  href: string;
  labelKey: TranslationKey; // Use key for translation
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: '/dashboard', labelKey: 'sidebar.dashboard', icon: LayoutDashboard },
  { href: '/logbook', labelKey: 'sidebar.logbook', icon: BookText },
  { href: '/operation-room', labelKey: 'sidebar.operationRoom', icon: HardHat },
  { href: '/report-incident', labelKey: 'sidebar.reportIncident', icon: FilePlus },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const { open } = useSidebar();
  const { dir, t } = useLanguage();


  return (
    <Sidebar
      side={dir === 'rtl' ? 'right' : 'left'}
      collapsible="icon">
        <SidebarHeader className="flex items-center justify-between p-3">
          <Link href="/dashboard" className={cn(
            "text-xl font-semibold text-primary transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
            {t('mediaScope')}
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
                    tooltip={{children: t(item.labelKey), side: dir === 'rtl' ? 'left' : 'right'}}
                    className="justify-start"
                  >
                    <a>
                      <item.icon className="h-5 w-5" />
                      <span className={cn(open ? "inline" : "sr-only")}>{t(item.labelKey)}</span>
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
        <p className="text-xs text-muted-foreground text-center">{t('sidebar.copyright')}</p>
      </SidebarFooter>
    </Sidebar>
  );
}

