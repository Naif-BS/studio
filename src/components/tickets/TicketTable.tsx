
"use client";

import React from 'react';
import Link from 'next/link';
import type { Ticket } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TicketStatusBadge } from './TicketStatusBadge';
import { Button } from '@/components/ui/button';
import { Eye, Clock, Layers, RadioTower } from 'lucide-react'; // Added Layers and RadioTower for icons
import { format } from 'date-fns';

interface TicketTableProps {
  tickets: Ticket[];
  isLoading?: boolean;
  onRowClick?: (ticketId: string) => void; // For operation room interaction
}

export default function TicketTable({ tickets, isLoading, onRowClick }: TicketTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Removed Serial Number header */}
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[170px]">Material</TableHead>
              <TableHead className="w-[170px]">Platform</TableHead>
              <TableHead className="w-[180px]">Received</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {/* Removed Serial Number cell skeleton */}
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
            {/* Removed Serial Number header */}
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
              {/* Removed Serial Number cell */}
              <TableCell><TicketStatusBadge status={ticket.status} /></TableCell>
              <TableCell className="truncate max-w-sm" title={ticket.description}>{ticket.description}</TableCell>
              <TableCell>{ticket.mediaMaterial === 'Other' ? ticket.otherMediaMaterial : ticket.mediaMaterial}</TableCell>
              <TableCell>{ticket.platform === 'Other' ? ticket.otherPlatform : ticket.platform}</TableCell>
              <TableCell>{format(new Date(ticket.receivedAt), 'PPp')}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                  <Link href={`/operation-room?ticketId=${ticket.id}`}>
                    <Eye className="mr-0 md:mr-2 h-4 w-4" /> <span className="hidden md:inline">View</span>
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
