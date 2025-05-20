
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TicketTable from '@/components/tickets/TicketTable';
import TicketDetailsCard from '@/components/tickets/TicketDetailsCard';
import TicketFilters, { type TicketFiltersState } from '@/components/tickets/TicketFilters';
import { getTickets, updateTicketStatus as apiUpdateTicketStatus, addTicketAction as apiAddTicketAction } from '@/lib/data';
import type { Ticket, TicketStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Alert seems unused
import { Card } from "@/components/ui/card";
import { Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function OperationRoomPage() {
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();

  const [filters, setFilters] = useState<TicketFiltersState>({
    status: 'New', 
    mediaMaterial: '',
    platform: '',
    searchTerm: '',
  });

  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300)); 
    const fetchedTickets = getTickets();
    setAllTickets(fetchedTickets);
    
    const ticketIdFromQuery = searchParams.get('ticketId');
    if (ticketIdFromQuery) {
      const ticket = fetchedTickets.find(t => t.id === ticketIdFromQuery);
      setSelectedTicket(ticket || null);
    }
    setIsLoading(false);
  }, [searchParams]);


  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleSelectTicket = (ticketId: string) => {
    const ticket = allTickets.find(t => t.id === ticketId);
    setSelectedTicket(ticket || null);
    router.push(`/operation-room?ticketId=${ticketId}`, { scroll: false });
  };
  
  const handleUpdateStatus = async (ticketId: string, status: TicketStatus, actionDescription?: string) => {
    if (!user) return;
    setIsUpdating(true);
    const updatedTicket = apiUpdateTicketStatus(ticketId, status, actionDescription);
    if (updatedTicket) {
      setAllTickets(prev => prev.map(t => t.id === ticketId ? updatedTicket : t));
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(updatedTicket);
      }
      toast({ title: t('status') + ' ' + t('ticketStatus.' + status.toLowerCase() as any), description: `Ticket ${updatedTicket.serialNumber} status changed to ${status}.` });
    } else {
      toast({ title: 'Error', description: 'Failed to update ticket status.', variant: 'destructive' });
    }
    setIsUpdating(false);
  };

  const handleAddAction = async (ticketId: string, description: string) => {
    if (!user?.displayName) return;
    setIsUpdating(true);
    const updatedTicket = apiAddTicketAction(ticketId, description, user.displayName);
     if (updatedTicket) {
      setAllTickets(prev => prev.map(t => t.id === ticketId ? updatedTicket : t));
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(updatedTicket);
      }
      toast({ title: t('actions') + ' Logged', description: 'New action added to ticket log.' });
    } else {
      toast({ title: 'Error', description: 'Failed to log action.', variant: 'destructive' });
    }
    setIsUpdating(false);
  };
  
  const displayedTickets = useMemo(() => {
    return allTickets
      .filter(ticket => {
        const searchLower = filters.searchTerm?.toLowerCase() || '';
        return (
          (filters.status ? ticket.status === filters.status : true) &&
          (filters.mediaMaterial ? ticket.mediaMaterial === filters.mediaMaterial : true) &&
          (filters.platform ? ticket.platform === filters.platform : true) &&
          (filters.searchTerm
            ? ticket.serialNumber.toLowerCase().includes(searchLower) ||
              ticket.description.toLowerCase().includes(searchLower)
            : true)
        );
      })
      .sort((a, b) => {
        const statusOrder = { 'New': 1, 'Processing': 2, 'Closed': 3 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime();
      });
  }, [allTickets, filters]);


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">{t('operationRoom.title')}</h1>
      </div>
      
      <TicketFilters filters={filters} onFilterChange={setFilters} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <h2 className="text-xl font-semibold mb-3">{t('operationRoom.ticketsQueue')}</h2>
          <TicketTable tickets={displayedTickets} isLoading={isLoading} onRowClick={handleSelectTicket} />
        </div>
        
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-3">{t('operationRoom.ticketDetails')}</h2>
          {selectedTicket ? (
            <TicketDetailsCard
              ticket={selectedTicket}
              onUpdateStatus={handleUpdateStatus}
              onAddAction={handleAddAction}
              isUpdating={isUpdating}
            />
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[300px] bg-muted/20 border-dashed">
              <div className="text-center text-muted-foreground p-6">
                <Info className="mx-auto h-12 w-12 mb-3" />
                <p className="text-lg">{t('operationRoom.noTicketSelected')}</p>
                <p>{t('operationRoom.noTicketSelectedDesc')}</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
