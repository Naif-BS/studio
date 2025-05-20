
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
import { useAuth } from '@/contexts/AuthContext';
import { ticketStatusOptions } from '@/types';
import { Separator } from '../ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { arSA, enUS } from 'date-fns/locale'; // Import locales for date formatting

interface TicketDetailsCardProps {
  ticket: Ticket;
  onUpdateStatus: (ticketId: string, status: TicketStatus, actionDescription?: string) => void;
  onAddAction: (ticketId: string, description: string) => void;
  isUpdating?: boolean;
}

export default function TicketDetailsCard({ ticket, onUpdateStatus, onAddAction, isUpdating }: TicketDetailsCardProps) {
  const { user } = useAuth();
  const { dir, t, language } = useLanguage();
  const [newActionText, setNewActionText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>(ticket.status);

  const dateLocale = language === 'ar' ? arSA : enUS;

  const handleAddAction = () => {
    if (newActionText.trim() && user?.displayName) {
      onAddAction(ticket.id, newActionText.trim());
      setNewActionText('');
    }
  };

  const handleStatusUpdate = () => {
    if (selectedStatus !== ticket.status) {
      const actionDesc = t('status') + ' ' + t('ticketStatus.'+selectedStatus.toLowerCase() as any) + ' by ' + (user?.displayName || 'User');
      onUpdateStatus(ticket.id, selectedStatus, actionDesc);
    }
  };
  
  const canUpdateStatus = ticket.status !== 'Closed';

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle className="text-2xl">{ticket.serialNumber}</CardTitle>
          <TicketStatusBadge status={ticket.status} className="px-3 py-1.5 text-sm" />
        </div>
        <CardDescription className="text-sm text-muted-foreground flex items-center pt-1">
          <Clock className={`h-4 w-4 ${dir === 'rtl' ? 'ms-1.5' : 'me-1.5'}`} />
          {t('ticketDetailsCard.receivedBy', { date: format(new Date(ticket.receivedAt), 'PPp', { locale: dateLocale }), user: ticket.reportedBy })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-md mb-1">{t('ticketDetailsCard.incidentDetails')}</h3>
          <p className="text-sm text-foreground/90">{ticket.description}</p>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <p><strong>{t('mediaMaterial')}:</strong> {ticket.mediaMaterial === 'Other' && ticket.otherMediaMaterial ? ticket.otherMediaMaterial : t(`mediaMaterialOptions.${ticket.mediaMaterial.toLowerCase().replace(/\s+/g, '')}` as any) }</p>
            <p><strong>{t('platform')}:</strong> {ticket.platform === 'Other' && ticket.otherPlatform ? ticket.otherPlatform : t(`platformOptions.${ticket.platform.toLowerCase().replace(/\s+/g, '').replace('(', '').replace(')', '')}` as any)}</p>
            {ticket.issueLink && (
              <p className="flex items-center">
                <LinkIcon className={`h-4 w-4 ${dir === 'rtl' ? 'ms-1.5' : 'me-1.5'}`} />
                <strong>{t('ticketDetailsCard.issueLink')}</strong>&nbsp;
                <a href={ticket.issueLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                  {ticket.issueLink}
                </a>
              </p>
            )}
            {ticket.screenshotLink && (
              <p className="flex items-center">
                <ImageIcon className={`h-4 w-4 ${dir === 'rtl' ? 'ms-1.5' : 'me-1.5'}`} />
                <strong>{t('ticketDetailsCard.screenshot')}</strong>&nbsp;
                <a href={ticket.screenshotLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                  {t('ticketDetailsCard.viewScreenshot')}
                </a>
              </p>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold text-md mb-2 flex items-center"><Workflow className={`h-5 w-5 ${dir === 'rtl' ? 'ms-2' : 'me-2'} text-primary`} />{t('ticketDetailsCard.actionsLog')}</h3>
          {ticket.actionsLog.length > 0 ? (
            <ScrollArea className="h-40 border rounded-md p-3 bg-muted/30">
              <ul className="space-y-3">
                {ticket.actionsLog.slice().reverse().map((action, index) => (
                  <li key={index} className="text-sm">
                    <div className="flex justify-between items-center text-xs text-muted-foreground mb-0.5">
                      <span className="flex items-center"><User className={`h-3 w-3 ${dir === 'rtl' ? 'ms-1' : 'me-1'}`} />{action.user}</span>
                      <span className="flex items-center"><Clock className={`h-3 w-3 ${dir === 'rtl' ? 'ms-1' : 'me-1'}`} />{format(new Date(action.timestamp), 'MMM d, yyyy h:mm a', { locale: dateLocale })}</span>
                    </div>
                    <p className="text-foreground/90">{action.description}</p>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground italic">{t('ticketDetailsCard.noActionsLogged')}</p>
          )}
        </div>
        
        {canUpdateStatus && (
            <>
            <Separator />
            <div className="space-y-3">
              <h3 className="font-semibold text-md flex items-center"><Edit3 className={`h-5 w-5 ${dir === 'rtl' ? 'ms-2' : 'me-2'} text-primary`}/>{t('ticketDetailsCard.updateTicket')}</h3>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-grow space-y-1.5 w-full sm:w-auto">
                      <label htmlFor="status-select" className="text-sm font-medium text-muted-foreground">{t('ticketDetailsCard.changeStatus')}</label>
                      <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as TicketStatus)} disabled={isUpdating || !canUpdateStatus} dir={dir}>
                          <SelectTrigger id="status-select">
                              <SelectValue placeholder={t('selectPlaceholder')} />
                          </SelectTrigger>
                          <SelectContent>
                              {ticketStatusOptions.filter(opt => opt !== 'New' || ticket.status === 'New').map(option => (
                                  <SelectItem key={option} value={option} disabled={option === 'New' && ticket.status !== 'New'}>
                                      {t(`ticketStatus.${option.toLowerCase()}` as any)}
                                  </SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  </div>
                  <Button onClick={handleStatusUpdate} disabled={isUpdating || selectedStatus === ticket.status || !canUpdateStatus}>
                      {isUpdating ? t('ticketDetailsCard.updatingStatusButton') : t('ticketDetailsCard.updateStatusButton')}
                  </Button>
              </div>
              
              <div className="space-y-1.5">
                 <label htmlFor="action-log" className="text-sm font-medium text-muted-foreground">{t('ticketDetailsCard.logAction')}</label>
                <Textarea
                  id="action-log"
                  placeholder={t('ticketDetailsCard.logActionPlaceholder')}
                  value={newActionText}
                  onChange={(e) => setNewActionText(e.target.value)}
                  className="min-h-[80px]"
                  disabled={isUpdating || !canUpdateStatus}
                />
              </div>
              <Button onClick={handleAddAction} disabled={!newActionText.trim() || isUpdating || !canUpdateStatus}>
                <Send className={`h-4 w-4 ${dir === 'rtl' ? 'ms-2' : 'me-2'}`} /> {t('ticketDetailsCard.addActionToLogButton')}
              </Button>
            </div>
            </>
        )}

      </CardContent>
      {ticket.status === 'Closed' && ticket.closedAt && (
          <CardFooter className="text-sm text-muted-foreground">
              {t('ticketDetailsCard.closedOn', {date: format(new Date(ticket.closedAt), 'PPp', { locale: dateLocale })})}
          </CardFooter>
      )}
    </Card>
  );
}
