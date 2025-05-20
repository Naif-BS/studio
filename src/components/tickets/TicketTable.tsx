
"use client";

import React from 'react';
import Link from 'next/link';
import type { Ticket } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TicketStatusBadge } from './TicketStatusBadge';
import { Button } from '@/components/ui/button';
import { Eye, Clock, Layers, RadioTower } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale'; // Default to English locale for dates

interface TicketTableProps {
  tickets: Ticket[];
  isLoading?: boolean;
  onRowClick?: (ticketId: string) => void;
}

// English display names for enums
const mediaMaterialDisplay: Record<string, string> = {
    'Video': 'Video',
    'Article': 'Article',
    'Social Media Post': 'Social Media Post',
    'Image': 'Image',
    'Audio': 'Audio',
    'Other': 'Other',
};

const platformDisplay: Record<string, string> = {
    'Facebook': 'Facebook',
    'X (Twitter)': 'X (Twitter)',
    'Instagram': 'Instagram',
    'TikTok': 'TikTok',
    'YouTube': 'YouTube',
    'News Site': 'News Site',
    'Blog': 'Blog',
    'Forum': 'Forum',
    'Other': 'Other',
};


export default function TicketTable({ tickets, isLoading, onRowClick }: TicketTableProps) {
  const dateLocale = enUS; // Default to English locale for dates

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[170px]">
                <div className="flex items-center gap-1">
                  <Layers className="h-4 w-4" /> Media Material
                </div>
              </TableHead>
              <TableHead className="w-[170px]">
                <div className="flex items-center gap-1">
                  <RadioTower className="h-4 w-4" /> Platform
                </div>
              </TableHead>
              <TableHead className="w-[180px]">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Received
                </div>
              </TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
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
                <TableCell className="text-right"><div className="h-8 w-20 bg-muted rounded animate-pulse ml-auto"></div></TableCell>
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
        <p className="text-lg text-muted-foreground">No tickets found.</p>
        <p className="text-sm text-muted-foreground">There are no tickets matching the current criteria.</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[170px]">
              <div className="flex items-center gap-1">
                <Layers className="h-4 w-4" /> Media Material
              </div>
            </TableHead>
            <TableHead className="w-[170px]">
              <div className="flex items-center gap-1">
                <RadioTower className="h-4 w-4" /> Platform
              </div>
            </TableHead>
            <TableHead className="w-[180px]">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> Received
              </div>
            </TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
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
              <TableCell>{ticket.mediaMaterial === 'Other' ? ticket.otherMediaMaterial : mediaMaterialDisplay[ticket.mediaMaterial] || ticket.mediaMaterial}</TableCell>
              <TableCell>{ticket.platform === 'Other' ? ticket.otherPlatform : platformDisplay[ticket.platform] || ticket.platform}</TableCell>
              <TableCell>{format(new Date(ticket.receivedAt), 'PPp', { locale: dateLocale })}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                  <Link href={`/operation-room?ticketId=${ticket.id}`}>
                    <Eye className="md:me-2 h-4 w-4" /> <span className="hidden md:inline">View</span>
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
