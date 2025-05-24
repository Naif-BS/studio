
"use client";

import React, { useState } from 'react';
import type { Ticket, TicketStatus, TicketAction } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TicketStatusBadge } from './TicketStatusBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
// Removed Select imports as they are no longer used here
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, User, Link as LinkIcon, Image as ImageIcon, Edit3, Send, Workflow, CheckCircle2 } from 'lucide-react'; // Added CheckCircle2
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { ticketStatusDisplay } from '@/types'; // ticketStatusOptions removed as it's not used
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';

interface TicketDetailsCardProps {
  ticket: Ticket;
  onUpdateStatus?: (ticketId: string, status: TicketStatus, actionDescription?: string) => void;
  onAddAction?: (ticketId: string, description: string) => void;
  isUpdating?: boolean;
  isModalVariant?: boolean;
}

export default function TicketDetailsCard({ ticket, onUpdateStatus, onAddAction, isUpdating, isModalVariant }: TicketDetailsCardProps) {
  const { user } = useAuth();
  const [newActionText, setNewActionText] = useState('');
  // Removed selectedStatus state as it's no longer needed

  React.useEffect(() => {
    // setSelectedStatus(ticket.status); // Removed
    setNewActionText('');
  }, [ticket]);

  const dateLocale = enUS;

  const handleAddAction = () => {
    if (newActionText.trim() && user?.displayName && onAddAction) {
      onAddAction(ticket.id, newActionText.trim());
      setNewActionText('');
    }
  };

  const handleCloseIncident = () => {
    if (onUpdateStatus && ticket.status !== 'Closed') {
      const actionDesc = `Incident closed by ${user?.displayName || 'User'}.`;
      onUpdateStatus(ticket.id, 'Closed', actionDesc);
    }
  };

  const canUpdateStatus = ticket.status !== 'Closed'; // This now primarily means "can log action" or "can close"
  const showActionSection = !!onUpdateStatus && !!onAddAction;

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

  return (
    <Card className={cn(
      "w-full",
      isModalVariant ? "" : "shadow-lg border animate-in fade-in zoom-in-80 slide-in-from-bottom-4 duration-500"
    )}>
      {!isModalVariant && (
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <CardTitle className="text-2xl font-bold">{ticket.serialNumber}</CardTitle>
            <TicketStatusBadge status={ticket.status} className="px-3 py-1.5 text-sm" />
          </div>
          <CardDescription className="text-sm text-muted-foreground flex items-center pt-1">
            <Clock className="h-4 w-4 me-1.5" />
            {`Received: ${format(new Date(ticket.receivedAt), 'PPp', { locale: dateLocale })} by ${ticket.reportedBy}`}
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className={cn(isModalVariant ? "pt-0" : "pt-0")}>
        <div>
          <h3 className="font-semibold text-md mb-1">Incident Details</h3>
          <p className="text-sm text-foreground/90">{ticket.description}</p>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <p><strong>Media Material:</strong>
              {ticket.mediaMaterial === 'Other' && ticket.otherMediaMaterial
                ? `Other: ${ticket.otherMediaMaterial}`
                : mediaMaterialDisplay[ticket.mediaMaterial] || ticket.mediaMaterial}
            </p>
            <p><strong>Media Platform:</strong>
              {ticket.platform === 'Other' && ticket.otherPlatform
                ? `Other: ${ticket.otherPlatform}`
                : platformDisplay[ticket.platform] || ticket.platform}
            </p>
            {ticket.issueLink && (
              <p className="flex items-center">
                <LinkIcon className="h-4 w-4 me-1.5" />
                <strong>Link to Media Content:</strong>&nbsp;
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

        <Separator className="my-4" />

        <div>
          <h3 className="font-semibold text-md mb-2 flex items-center"><Workflow className="h-5 w-5 me-2 text-primary" />Action Log</h3>
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

        {showActionSection && ( // canUpdateStatus check is now within button disable logic
            <>
            <Separator className="my-4" />
            <div className="space-y-3">
              <h3 className="font-semibold text-md flex items-center"><Edit3 className="h-5 w-5 me-2 text-primary"/>Update Incident</h3>
              {/* Status Select and Update Button Removed */}
              <div className="space-y-1.5">
                 <label htmlFor="action-log" className="text-sm font-medium text-muted-foreground">Log Action</label>
                <Textarea
                  id="action-log"
                  placeholder="Log actions taken for this incident..."
                  value={newActionText}
                  onChange={(e) => setNewActionText(e.target.value)}
                  className="min-h-[80px]"
                  disabled={isUpdating || !canUpdateStatus}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleAddAction} disabled={!newActionText.trim() || isUpdating || !canUpdateStatus} className="flex-1 sm:flex-auto">
                  <Send className="h-4 w-4 me-2" /> Log Action
                </Button>
                <Button variant="destructive" onClick={handleCloseIncident} disabled={isUpdating || !canUpdateStatus} className="flex-1 sm:flex-auto">
                  <CheckCircle2 className="h-4 w-4 me-2" /> Close Incident
                </Button>
              </div>
            </div>
            </>
        )}

      </CardContent>
      {!isModalVariant && ticket.status === 'Closed' && ticket.closedAt && (
          <CardFooter className="text-sm text-muted-foreground">
              {`Resolved on: ${format(new Date(ticket.closedAt), 'PPp', { locale: dateLocale })}`}
          </CardFooter>
      )}
    </Card>
  );
}
