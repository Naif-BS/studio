
"use client";

import React from 'react';
import type { Ticket } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TicketStatusBadge } from './TicketStatusBadge';
import { Button } from '@/components/ui/button';
import { Eye, Clock, Layers, RadioTower, FileText, User, Play, CheckCircle, Link as LinkIcon, Image as ImageIcon, Mail, Workflow } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Link from 'next/link';
import { mediaMaterialDisplay, platformDisplay } from '@/types';

interface TicketTableProps {
  tickets: Ticket[];
  isLoading?: boolean;
  onRowClick?: (ticketId: string) => void;
  showActionsColumn?: boolean;
  visibleColumns?: ('Status' | 'Description' | 'Media Material' | 'Media Platform' | 'Received' | 'SerialNumber' | 'ReportedBy' | 'ActionsLogged' | 'StartedProcessing' | 'ClosedAt' | 'LinkToMedia' | 'Screenshot')[];
}

export default function TicketTable({ tickets, isLoading, onRowClick, showActionsColumn = true, visibleColumns }: TicketTableProps) {
  const dateLocale = enUS;

  const formatDateSafe = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    try {
      // Using a more compact date format 'P' e.g., 05/25/24
      return format(new Date(date), 'P', { locale: dateLocale });
    } catch (e) {
      return "Invalid Date";
    }
  };

  const renderCellContent = (text: string | null | undefined, maxWidth: string = 'none') => {
    const displayText = text || "N/A";
    if (maxWidth !== 'none') {
      return <span className="block truncate" style={{ maxWidth }} title={displayText}>{displayText}</span>;
    }
    return displayText;
  };

  const columns = [
    { 
      key: 'SerialNumber', 
      header: <div className="flex items-center gap-1"><FileText className="h-4 w-4" /> Serial Number</div>, 
      cell: (ticket: Ticket) => renderCellContent(ticket.serialNumber, '100px')
    },
    { 
      key: 'Status', 
      header: <div className="flex items-center gap-1"> Incident Status</div>, 
      cell: (ticket: Ticket) => <TicketStatusBadge status={ticket.status} /> 
    },
    { 
      key: 'Description', 
      header: <div className="flex items-center gap-1"><Mail className="h-4 w-4" /> Incident Description</div>, 
      cell: (ticket: Ticket) => renderCellContent(ticket.description, '120px')
    },
    { 
      key: 'Media Material', 
      header: <div className="flex items-center gap-1"><Layers className="h-4 w-4" /> Media Material</div>, 
      cell: (ticket: Ticket) => {
        const materialText = ticket.mediaMaterial === 'Other' && ticket.otherMediaMaterial 
          ? `Other: ${ticket.otherMediaMaterial}` 
          : mediaMaterialDisplay[ticket.mediaMaterial] || ticket.mediaMaterial;
        return renderCellContent(materialText, '100px');
      }
    },
    { 
      key: 'Media Platform', 
      header: <div className="flex items-center gap-1"><RadioTower className="h-4 w-4" /> Media Platform</div>, 
      cell: (ticket: Ticket) => {
        const platformText = ticket.platform === 'Other' && ticket.otherPlatform 
          ? `Other: ${ticket.otherPlatform}` 
          : platformDisplay[ticket.platform] || ticket.platform;
        return renderCellContent(platformText, '100px');
      } 
    },
    { 
      key: 'Received', 
      header: <div className="flex items-center gap-1"><Clock className="h-4 w-4" /> Date Received</div>, 
      cell: (ticket: Ticket) => formatDateSafe(ticket.receivedAt) 
    },
    { 
      key: 'ReportedBy', 
      header: <div className="flex items-center gap-1"><User className="h-4 w-4" /> Reported By</div>, 
      cell: (ticket: Ticket) => renderCellContent(ticket.reportedBy, '100px')
    },
    { 
      key: 'ActionsLogged', 
      header: <div className="flex items-center gap-1"><Workflow className="h-4 w-4" /> Logged Actions</div>, 
      cell: (ticket: Ticket) => <span className="text-center">{ticket.actionsLog.length}</span> 
    },
    { 
      key: 'StartedProcessing', 
      header: <div className="flex items-center gap-1"><Play className="h-4 w-4" /> Processing Started</div>, 
      cell: (ticket: Ticket) => formatDateSafe(ticket.startedProcessingAt) 
    },
    { 
      key: 'ClosedAt', 
      header: <div className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Resolved Date</div>, 
      cell: (ticket: Ticket) => formatDateSafe(ticket.closedAt) 
    },
    { 
      key: 'LinkToMedia', 
      header: <div className="flex items-center gap-1"><LinkIcon className="h-4 w-4" /> Link to Media Content</div>, 
      cell: (ticket: Ticket) => ticket.issueLink ? (<Link href={ticket.issueLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate block max-w-[180px]">{ticket.issueLink}</Link>) : ("N/A") 
    },
    { 
      key: 'Screenshot', 
      header: <div className="flex items-center gap-1"><ImageIcon className="h-4 w-4" /> Screenshot</div>, 
      cell: (ticket: Ticket) => ticket.screenshotLink ? <ImageIcon className="h-5 w-5 text-primary" /> : "No" 
    },
  ];

  const columnsToDisplay = visibleColumns ? columns.filter(col => visibleColumns.includes(col.key as any)) : columns;

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Adjust skeleton headers according to potential visible columns */}
              {columnsToDisplay.map(col => (
                <TableHead key={col.key} className={col.key === 'Actions' ? "text-right w-[100px]" : undefined}>
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                </TableHead>
              ))}
              {showActionsColumn && <TableHead className="text-right w-[100px]"><div className="h-4 bg-muted rounded w-3/4 animate-pulse ml-auto"></div></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {columnsToDisplay.map(col => (
                  <TableCell key={col.key}><div className="h-4 bg-muted rounded w-full animate-pulse"></div></TableCell>
                ))}
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
        <p className="text-lg text-muted-foreground">No incidents found.</p>
        <p className="text-sm text-muted-foreground">There are no incidents matching the current criteria.</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="cursor-default">
            {columnsToDisplay.map(col => (
              <TableHead key={col.key}>{col.header}</TableHead>
            ))}
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
              {columnsToDisplay.map(col => (
                <TableCell key={col.key}>{col.cell(ticket)}</TableCell>
              ))}
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
                    <Eye className="md:me-2 h-4 w-4" /> <span className="hidden md:inline">View Details</span>
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

    