
"use client";

import React from 'react';
import type { Ticket } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TicketStatusBadge } from './TicketStatusBadge';
import { Button } from '@/components/ui/button';
import { Eye, Clock, Layers, RadioTower, FileText, User, Play, CheckCircle, Link as LinkIcon, Image as ImageIcon, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Link from 'next/link'; // For clickable links

interface TicketTableProps {
  tickets: Ticket[];
  isLoading?: boolean;
  onRowClick?: (ticketId: string) => void;
  showActionsColumn?: boolean; // New prop
}

const mediaMaterialDisplay: Record<string, string> = {
    'Press Release': 'Press Release',
    'Legal Document': 'Legal Document',
    'Infographic': 'Infographic',
    'Image': 'Image',
    'Video Clip': 'Video Clip',
    'Audio Clip': 'Audio Clip',
    'GIF': 'GIF',
    'Other': 'Other',
};

const platformDisplay: Record<string, string> = {
    'Umm Al-Qura Newspaper': 'Umm Al-Qura Newspaper',
    'Local Media Channel/Platform': 'Local Media Channel/Platform',
    'International Media Channel/Platform': 'International Media Channel/Platform',
    'SRSA Website': 'SRSA Website',
    'Unified Platform': 'Unified Platform',
    'SRSA Account on Platform X': 'SRSA Account on Platform X',
    'SRSA Account on Instagram': 'SRSA Account on Instagram',
    'SRSA Account on TikTok': 'SRSA Account on TikTok',
    'SRSA Account on LinkedIn': 'SRSA Account on LinkedIn',
    'Other': 'Other',
};


export default function TicketTable({ tickets, isLoading, onRowClick, showActionsColumn = true }: TicketTableProps) {
  const dateLocale = enUS;

  const formatDateSafe = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), 'PPp', { locale: dateLocale });
    } catch (e) {
      return "Invalid Date";
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]"><div className="flex items-center gap-1"><FileText className="h-4 w-4" /> Serial Number</div></TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead><div className="flex items-center gap-1"><Mail className="h-4 w-4" /> Description</div></TableHead>
              <TableHead className="w-[200px]"><div className="flex items-center gap-1"><Layers className="h-4 w-4" /> Media Material</div></TableHead>
              <TableHead className="w-[250px]"><div className="flex items-center gap-1"><RadioTower className="h-4 w-4" /> Media Platform</div></TableHead>
              <TableHead className="w-[180px]"><div className="flex items-center gap-1"><Clock className="h-4 w-4" /> Received</div></TableHead>
              <TableHead className="w-[150px]"><div className="flex items-center gap-1"><User className="h-4 w-4" /> Reported By</div></TableHead>
              <TableHead className="w-[180px]"><div className="flex items-center gap-1"><Play className="h-4 w-4" /> Started Processing</div></TableHead>
              <TableHead className="w-[180px]"><div className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Closed At</div></TableHead>
              <TableHead className="w-[200px]"><div className="flex items-center gap-1"><LinkIcon className="h-4 w-4" /> Link to Media Content</div></TableHead>
              <TableHead className="w-[120px]"><div className="flex items-center gap-1"><ImageIcon className="h-4 w-4" /> Screenshot</div></TableHead>
              {showActionsColumn && <TableHead className="text-right w-[100px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div></TableCell>
                <TableCell><div className="h-6 bg-muted rounded w-20 animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-muted rounded w-full animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-muted rounded w-10 animate-pulse"></div></TableCell>
                {showActionsColumn && <TableCell className="text-right"><div className="h-8 w-20 bg-muted rounded animate-pulse ml-auto"></div></TableCell>}
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
            <TableHead className="w-[150px]"><div className="flex items-center gap-1"><FileText className="h-4 w-4" /> Serial Number</div></TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead><div className="flex items-center gap-1"><Mail className="h-4 w-4" /> Description</div></TableHead>
            <TableHead className="w-[200px]"><div className="flex items-center gap-1"><Layers className="h-4 w-4" /> Media Material</div></TableHead>
            <TableHead className="w-[250px]"><div className="flex items-center gap-1"><RadioTower className="h-4 w-4" /> Media Platform</div></TableHead>
            <TableHead className="w-[180px]"><div className="flex items-center gap-1"><Clock className="h-4 w-4" /> Received</div></TableHead>
            <TableHead className="w-[150px]"><div className="flex items-center gap-1"><User className="h-4 w-4" /> Reported By</div></TableHead>
            <TableHead className="w-[180px]"><div className="flex items-center gap-1"><Play className="h-4 w-4" /> Started Processing</div></TableHead>
            <TableHead className="w-[180px]"><div className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Closed At</div></TableHead>
            <TableHead className="w-[200px]"><div className="flex items-center gap-1"><LinkIcon className="h-4 w-4" /> Link to Media Content</div></TableHead>
            <TableHead className="w-[120px]"><div className="flex items-center gap-1"><ImageIcon className="h-4 w-4" /> Screenshot</div></TableHead>
            {showActionsColumn && <TableHead className="text-right w-[100px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow 
              key={ticket.id} 
              onClick={onRowClick && showActionsColumn ? () => onRowClick(ticket.id) : undefined}
              className={onRowClick && showActionsColumn ? 'cursor-pointer hover:bg-muted/50' : ''}
            >
              <TableCell>{ticket.serialNumber}</TableCell>
              <TableCell><TicketStatusBadge status={ticket.status} /></TableCell>
              <TableCell className="truncate max-w-xs" title={ticket.description}>{ticket.description}</TableCell>
              <TableCell>
                {ticket.mediaMaterial === 'Other' && ticket.otherMediaMaterial 
                  ? `Other: ${ticket.otherMediaMaterial}` 
                  : mediaMaterialDisplay[ticket.mediaMaterial] || ticket.mediaMaterial}
              </TableCell>
              <TableCell>
                {ticket.platform === 'Other' && ticket.otherPlatform 
                  ? `Other: ${ticket.otherPlatform}` 
                  : platformDisplay[ticket.platform] || ticket.platform}
              </TableCell>
              <TableCell>{formatDateSafe(ticket.receivedAt)}</TableCell>
              <TableCell>{ticket.reportedBy}</TableCell>
              <TableCell>{formatDateSafe(ticket.startedProcessingAt)}</TableCell>
              <TableCell>{formatDateSafe(ticket.closedAt)}</TableCell>
              <TableCell>
                {ticket.issueLink ? (
                  <Link href={ticket.issueLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate block max-w-[180px]">
                    {ticket.issueLink}
                  </Link>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell>
                {ticket.screenshotLink ? <ImageIcon className="h-5 w-5 text-primary" /> : "No"}
              </TableCell>
              {showActionsColumn && (
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      if (onRowClick) {
                        onRowClick(ticket.id);
                      }
                    }}
                  >
                    <Eye className="md:me-2 h-4 w-4" /> <span className="hidden md:inline">View</span>
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

