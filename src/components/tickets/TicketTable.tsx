
"use client";

import React from 'react';
import Link from 'next/link';
import type { Ticket } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TicketStatusBadge } from './TicketStatusBadge';
import { Button } from '@/components/ui/button';
import { Eye, Clock, Layers, RadioTower } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { arSA, enUS } from 'date-fns/locale';
import type { TranslationKey } from '@/lib/translations';

interface TicketTableProps {
  tickets: Ticket[];
  isLoading?: boolean;
  onRowClick?: (ticketId: string) => void;
}

// Helper function to get translation key for enum values
const getEnumTranslationKey = (value: string, prefix: string): TranslationKey => {
    const formattedValue = value.toLowerCase().replace(/\s+/g, '').replace(/[^\w]/gi, '');
    return `${prefix}.${formattedValue}` as TranslationKey;
}


export default function TicketTable({ tickets, isLoading, onRowClick }: TicketTableProps) {
  const { t, language, dir } = useLanguage();
  const dateLocale = language === 'ar' ? arSA : enUS;

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">{t('status')}</TableHead>
              <TableHead>{t('description')}</TableHead>
              <TableHead className="w-[170px]">
                <div className="flex items-center gap-1">
                  <Layers className="h-4 w-4" /> {t('mediaMaterial')}
                </div>
              </TableHead>
              <TableHead className="w-[170px]">
                <div className="flex items-center gap-1">
                  <RadioTower className="h-4 w-4" /> {t('platform')}
                </div>
              </TableHead>
              <TableHead className="w-[180px]">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {t('received')}
                </div>
              </TableHead>
              <TableHead className="ltr:text-right rtl:text-left w-[100px]">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><div className="h-6 bg-muted rounded w-20 animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-muted rounded w-full animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div></TableCell>
                <TableCell className="ltr:text-right rtl:text-left"><div className="h-8 w-20 bg-muted rounded animate-pulse ltr:ml-auto rtl:mr-auto"></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md bg-card">
        <p className="text-lg text-muted-foreground">{t('noTicketsFound')}</p>
        <p className="text-sm text-muted-foreground">{t('noTicketsFoundDesc')}</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">{t('status')}</TableHead>
            <TableHead>{t('description')}</TableHead>
            <TableHead className="w-[170px]">
              <div className="flex items-center gap-1">
                <Layers className="h-4 w-4" /> {t('mediaMaterial')}
              </div>
            </TableHead>
            <TableHead className="w-[170px]">
              <div className="flex items-center gap-1">
                <RadioTower className="h-4 w-4" /> {t('platform')}
              </div>
            </TableHead>
            <TableHead className="w-[180px]">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {t('received')}
              </div>
            </TableHead>
            <TableHead className="ltr:text-right rtl:text-left w-[100px]">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow 
              key={ticket.id} 
              onClick={onRowClick ? () => onRowClick(ticket.id) : undefined}
              className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
            >
              <TableCell><TicketStatusBadge status={ticket.status} /></TableCell>
              <TableCell className="truncate max-w-sm" title={ticket.description}>{ticket.description}</TableCell>
              <TableCell>{ticket.mediaMaterial === 'Other' ? ticket.otherMediaMaterial : t(getEnumTranslationKey(ticket.mediaMaterial, 'mediaMaterialOptions'))}</TableCell>
              <TableCell>{ticket.platform === 'Other' ? ticket.otherPlatform : t(getEnumTranslationKey(ticket.platform, 'platformOptions'))}</TableCell>
              <TableCell>{format(new Date(ticket.receivedAt), 'PPp', { locale: dateLocale })}</TableCell>
              <TableCell className="ltr:text-right rtl:text-left">
                <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                  <Link href={`/operation-room?ticketId=${ticket.id}`}>
                    <Eye className={dir === 'rtl' ? 'md:ms-2 h-4 w-4' : 'md:me-2 h-4 w-4'} /> <span className="hidden md:inline">{t('view')}</span>
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
