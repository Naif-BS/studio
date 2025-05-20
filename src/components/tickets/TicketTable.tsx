
"use client";

import React from 'react';
import Link from 'next/link';
import type { Ticket } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TicketStatusBadge } from './TicketStatusBadge';
import { Button } from '@/components/ui/button';
import { Eye, Clock } from 'lucide-react';
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
              {['ID', 'Status', 'Material', 'Platform', 'Received', 'Actions'].map((header) => (
                <TableHead key={header} className={header === 'Actions' ? 'text-right' : ''}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div></TableCell>
                <TableCell><div className="h-6 bg-muted rounded w-20 animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div></TableCell>
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
            <TableHead className="w-[180px]">Serial Number</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[150px]">Media Material</TableHead>
            <TableHead className="w-[150px]">Platform</TableHead>
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
              <TableCell className="font-medium">{ticket.serialNumber}</TableCell>
              <TableCell><TicketStatusBadge status={ticket.status} /></TableCell>
              <TableCell className="truncate max-w-xs" title={ticket.description}>{ticket.description}</TableCell>
              <TableCell>{ticket.mediaMaterial}</TableCell>
              <TableCell>{ticket.platform}</TableCell>
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
