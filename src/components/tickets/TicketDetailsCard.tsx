
"use client";

import React, { useState } from 'react';
import type { Ticket, TicketStatus, TicketAction } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TicketStatusBadge } from './TicketStatusBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, User, Link as LinkIcon, Image as ImageIcon, Edit3, Send, Workflow } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale'; // Default to enUS
import { useAuth } from '@/contexts/AuthContext';
import { ticketStatusOptions } from '@/types';
import { Separator } from '../ui/separator';

interface TicketDetailsCardProps {
  ticket: Ticket;
  onUpdateStatus: (ticketId: string, status: TicketStatus, actionDescription?: string) => void;
  onAddAction: (ticketId: string, description: string) => void;
  isUpdating?: boolean;
}

export default function TicketDetailsCard({ ticket, onUpdateStatus, onAddAction, isUpdating }: TicketDetailsCardProps) {
  const { user } = useAuth();
  const [newActionText, setNewActionText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>(ticket.status);

  const dateLocale = enUS; // Default to English locale for dates

  const handleAddAction = () => {
    if (newActionText.trim() && user?.displayName) {
      onAddAction(ticket.id, newActionText.trim());
      setNewActionText('');
    }
  };

  const handleStatusUpdate = () => {
    if (selectedStatus !== ticket.status) {
      const actionDesc = `Status changed to ${selectedStatus} by ${user?.displayName || 'User'}`;
      onUpdateStatus(ticket.id, selectedStatus, actionDesc);
    }
  };
  
  const canUpdateStatus = ticket.status !== 'Closed';

  // Map enum values to display text (English)
  const mediaMaterialDisplay: Record<string, string> = {
    'Video': 'Video',
    'Article': 'Article',
    'Social Media Post': 'Social Media Post',
    'Image': 'Image',
    'Audio': 'Audio',
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

  const statusDisplay: Record<TicketStatus, string> = {
    'New': 'New',
    'Processing': 'Processing',
    'Closed': 'Closed',
  };


  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle className="text-2xl">{ticket.serialNumber}</CardTitle>
          <TicketStatusBadge status={ticket.status} className="px-3 py-1.5 text-sm" />
        </div>
        <CardDescription className="text-sm text-muted-foreground flex items-center pt-1">
          <Clock className="h-4 w-4 me-1.5" />
          {`Received: ${format(new Date(ticket.receivedAt), 'PPp', { locale: dateLocale })} by ${ticket.reportedBy}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-md mb-1">Incident Details</h3>
          <p className="text-sm text-foreground/90">{ticket.description}</p>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <p><strong>Media Material:</strong> {ticket.mediaMaterial === 'Other' && ticket.otherMediaMaterial ? ticket.otherMediaMaterial : mediaMaterialDisplay[ticket.mediaMaterial] || ticket.mediaMaterial}</p>
            <p><strong>Media Platform:</strong> {ticket.platform === 'Other' && ticket.otherPlatform ? ticket.otherPlatform : platformDisplay[ticket.platform] || ticket.platform}</p>
            {ticket.issueLink && (
              <p className="flex items-center">
                <LinkIcon className="h-4 w-4 me-1.5" />
                <strong>Issue Link:</strong>&nbsp;
                <a href={ticket.issueLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                  {ticket.issueLink}
                </a>
              </p>
            )}
            {ticket.screenshotLink && (
              <div className="mt-2">
                <p className="flex items-center font-semibold text-sm mb-1">
                  <ImageIcon className="h-4 w-4 me-1.5 text-primary" />
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
          <h3 className="font-semibold text-md mb-2 flex items-center"><Workflow className="h-5 w-5 me-2 text-primary" />Actions Log</h3>
          {ticket.actionsLog.length > 0 ? (
            <ScrollArea className="h-40 border rounded-md p-3 bg-muted/30">
              <ul className="space-y-3">
                {ticket.actionsLog.slice().reverse().map((action, index) => (
                  <li key={index} className="text-sm">
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
        
        {canUpdateStatus && (
            <>
            <Separator />
            <div className="space-y-3">
              <h3 className="font-semibold text-md flex items-center"><Edit3 className="h-5 w-5 me-2 text-primary"/>Update Ticket</h3>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-grow space-y-1.5 w-full sm:w-auto">
                      <label htmlFor="status-select" className="text-sm font-medium text-muted-foreground">Change Status</label>
                      <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as TicketStatus)} disabled={isUpdating || !canUpdateStatus}>
                          <SelectTrigger id="status-select">
                              <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                              {ticketStatusOptions.filter(opt => opt !== 'New' || ticket.status === 'New').map(option => (
                                  <SelectItem key={option} value={option} disabled={option === 'New' && ticket.status !== 'New'}>
                                      {statusDisplay[option] || option}
                                  </SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  </div>
                  <Button onClick={handleStatusUpdate} disabled={isUpdating || selectedStatus === ticket.status || !canUpdateStatus}>
                      {isUpdating ? "Updating..." : "Update Status"}
                  </Button>
              </div>
              
              <div className="space-y-1.5">
                 <label htmlFor="action-log" className="text-sm font-medium text-muted-foreground">Log Action</label>
                <Textarea
                  id="action-log"
                  placeholder="Log actions taken for this ticket..."
                  value={newActionText}
                  onChange={(e) => setNewActionText(e.target.value)}
                  className="min-h-[80px]"
                  disabled={isUpdating || !canUpdateStatus}
                />
              </div>
              <Button onClick={handleAddAction} disabled={!newActionText.trim() || isUpdating || !canUpdateStatus}>
                <Send className="h-4 w-4 me-2" /> Add Action to Log
              </Button>
            </div>
            </>
        )}

      </CardContent>
      {ticket.status === 'Closed' && ticket.closedAt && (
          <CardFooter className="text-sm text-muted-foreground">
              {`Closed on: ${format(new Date(ticket.closedAt), 'PPp', { locale: dateLocale })}`}
          </CardFooter>
      )}
    </Card>
  );
}
