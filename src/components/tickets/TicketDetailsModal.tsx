
"use client";

import React from 'react';
import type { Ticket } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { TicketStatusBadge } from './TicketStatusBadge';
import TicketDetailsCard from './TicketDetailsCard';

interface TicketDetailsModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TicketDetailsModal({ ticket, isOpen, onOpenChange }: TicketDetailsModalProps) {
  if (!ticket) return null;

  const dateLocale = enUS;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 bg-card">
        <DialogHeader className="p-6 pb-0 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <DialogTitle className="text-2xl">{ticket.serialNumber}</DialogTitle>
            <TicketStatusBadge status={ticket.status} className="px-3 py-1.5 text-sm" />
          </div>
          <DialogDescription className="text-sm text-muted-foreground flex items-center pt-1">
            <Clock className="h-4 w-4 me-1.5" />
            {`Received: ${format(new Date(ticket.receivedAt), 'PPp', { locale: dateLocale })} by ${ticket.reportedBy}`}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow overflow-y-auto">
          <div className="p-6"> {/* Add padding around the card content area */}
            <TicketDetailsCard ticket={ticket} isModalVariant={true} />
          </div>
        </ScrollArea>
        
        <DialogFooter className="p-6 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
    
