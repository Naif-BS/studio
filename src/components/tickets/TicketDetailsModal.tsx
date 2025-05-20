
"use client";

import React from 'react';
import type { Ticket, TicketAction } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, User, Link as LinkIcon, Image as ImageIcon, Layers, RadioTower, FileTextIcon, Workflow } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { TicketStatusBadge } from './TicketStatusBadge';
import { Separator } from '../ui/separator';

interface TicketDetailsModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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

export default function TicketDetailsModal({ ticket, isOpen, onOpenChange }: TicketDetailsModalProps) {
  if (!ticket) return null;

  const dateLocale = enUS;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="pr-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <DialogTitle className="text-2xl">{ticket.serialNumber}</DialogTitle>
            <TicketStatusBadge status={ticket.status} className="px-3 py-1.5 text-sm" />
          </div>
          <DialogDescription className="text-sm text-muted-foreground flex items-center pt-1">
            <Clock className="h-4 w-4 me-1.5" />
            {`Received: ${format(new Date(ticket.receivedAt), 'PPp', { locale: dateLocale })} by ${ticket.reportedBy}`}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow overflow-y-auto pr-6 -mr-6 pl-1"> {/* Adjusted padding for scrollbar */}
          <div className="space-y-6 py-4 px-1"> {/* Matches CardContent spacing */}
            <div>
              <h3 className="font-semibold text-md mb-1 flex items-center">
                <FileTextIcon className="h-5 w-5 me-2 text-primary" />
                Incident Details
              </h3>
              <p className="text-sm text-foreground/90">{ticket.description}</p>
              <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                <p className="flex items-center">
                  <Layers className="h-4 w-4 me-2 text-primary" />
                  <strong>Media Material:</strong>&nbsp;
                  {ticket.mediaMaterial === 'Other' && ticket.otherMediaMaterial 
                    ? `Other: ${ticket.otherMediaMaterial}` 
                    : mediaMaterialDisplay[ticket.mediaMaterial] || ticket.mediaMaterial}
                </p>
                <p className="flex items-center">
                  <RadioTower className="h-4 w-4 me-2 text-primary" />
                  <strong>Media Platform:</strong>&nbsp;
                  {ticket.platform === 'Other' && ticket.otherPlatform 
                    ? `Other: ${ticket.otherPlatform}` 
                    : platformDisplay[ticket.platform] || ticket.platform}
                </p>
                {ticket.issueLink && (
                  <p className="flex items-center">
                    <LinkIcon className="h-4 w-4 me-2 text-primary" />
                    <strong>Link to Media Content:</strong>&nbsp;
                    <a href={ticket.issueLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                      {ticket.issueLink}
                    </a>
                  </p>
                )}
                {ticket.screenshotLink && (
                  <div className="mt-2">
                    <p className="flex items-center font-semibold text-sm mb-1">
                      <ImageIcon className="h-4 w-4 me-2 text-primary" />
                      Screenshot:
                    </p>
                    {ticket.screenshotLink.startsWith('data:image/') ? (
                      <img
                        src={ticket.screenshotLink}
                        alt="Screenshot"
                        className="rounded-md border max-w-full h-auto max-h-60 object-contain"
                        data-ai-hint="user uploaded image"
                      />
                    ) : (
                      <a href={ticket.screenshotLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                        View Screenshot Link
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-md mb-2 flex items-center">
                <Workflow className="h-5 w-5 me-2 text-primary" />
                Actions Log
              </h3>
              {ticket.actionsLog.length > 0 ? (
                <ScrollArea className="h-40 border rounded-md p-3 bg-muted/30">
                  <ul className="space-y-3">
                    {ticket.actionsLog.slice().reverse().map((action, index) => (
                      <li key={index} className="text-sm list-none">
                        <div className="flex justify-between items-center text-xs text-muted-foreground mb-0.5">
                          <span className="flex items-center"><User className="h-3 w-3 me-1" />{action.user}</span>
                          <span className="flex items-center"><Clock className="h-3 w-3 me-1" />{format(new Date(action.timestamp), 'MMM d, yyyy h:mm a', { locale: dateLocale })}</span>
                        </div>
                        <p className="text-foreground/90">{action.description}</p>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              ) : (
                <p className="text-sm text-muted-foreground italic">No actions logged yet.</p>
              )}
            </div>
          </div>
        </ScrollArea>
        
        {ticket.status === 'Closed' && ticket.closedAt && (
          <div className="text-sm text-muted-foreground px-6 pb-4 pt-2 border-t">
              {`Closed on: ${format(new Date(ticket.closedAt), 'PPp', { locale: dateLocale })}`}
          </div>
        )}
        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
