
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
import { Card as UiCard } from "@/components/ui/card"; // Renamed to avoid conflict if Card is used differently
import { Info } from 'lucide-react';

export default function OperationRoomPage() {
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<TicketFiltersState>({
    status: '', // Default to all actionable tickets (New and Processing)
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
      const ticket = fetchedTickets.find(t => t.id === ticketIdFromQuery && t.status !== 'Closed');
      setSelectedTicket(ticket || null);
    } 
    // Auto-selection logic moved to useEffect dependent on displayedTickets
    setIsLoading(false);
  }, [searchParams]); // Removed router from dependencies as it's stable

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
        // If the updated ticket is the selected one, update its state
        // If it's closed, it will be removed from displayedTickets by the filter,
        // and the useEffect below will handle selecting a new one.
        setSelectedTicket(updatedTicket.status !== 'Closed' ? updatedTicket : null);
      }
      toast({ title: `Status ${status}`, description: `Ticket ${updatedTicket.serialNumber} status changed to ${status}.` });
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
      toast({ title: 'Action Logged', description: 'New action added to ticket log.' });
    } else {
      toast({ title: 'Error', description: 'Failed to log action.', variant: 'destructive' });
    }
    setIsUpdating(false);
  };
  
  const displayedTickets = useMemo(() => {
    return allTickets
      .filter(ticket => ticket.status !== 'Closed') // Always exclude Closed tickets from Operation Room
      .filter(ticket => {
        const searchLower = filters.searchTerm?.toLowerCase() || '';
        return (
          (filters.status ? ticket.status === filters.status : true) && // If filter.status is '', this is true
          (filters.mediaMaterial ? ticket.mediaMaterial === filters.mediaMaterial : true) &&
          (filters.platform ? ticket.platform === filters.platform : true) &&
          (filters.searchTerm
            ? ticket.serialNumber.toLowerCase().includes(searchLower) ||
              ticket.description.toLowerCase().includes(searchLower)
            : true)
        );
      })
      .sort((a, b) => {
        const statusOrder = { 'New': 1, 'Processing': 2 } as Record<string, number>; 
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status]; 
        }
        return new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime(); // FIFO
      });
  }, [allTickets, filters]);

  // Effect to handle auto-selection of tickets and URL updates
  useEffect(() => {
    const ticketIdFromQuery = searchParams.get('ticketId');

    if (!isLoading) {
      if (selectedTicket && !displayedTickets.find(t => t.id === selectedTicket.id)) {
        // Selected ticket is no longer in the displayed list (e.g., became "Closed")
        const firstInList = displayedTickets[0];
        setSelectedTicket(firstInList || null);
        if (firstInList) {
          router.replace(`/operation-room?ticketId=${firstInList.id}`, { scroll: false });
        } else {
          router.replace(`/operation-room`, { scroll: false });
        }
      } else if (!selectedTicket && ticketIdFromQuery) {
        // Ticket ID in query, but not selected yet (e.g., on initial load with query)
        const ticketToSelect = displayedTickets.find(t => t.id === ticketIdFromQuery);
        setSelectedTicket(ticketToSelect || null);
        if (!ticketToSelect) { // If ticket from query not found/actionable, clear query
            router.replace(`/operation-room`, { scroll: false });
        }
      } else if (!selectedTicket && !ticketIdFromQuery && displayedTickets.length > 0) {
        // No ticket selected, no query param, and list has items: select the first
        setSelectedTicket(displayedTickets[0]);
        router.replace(`/operation-room?ticketId=${displayedTickets[0].id}`, { scroll: false });
      } else if (selectedTicket && selectedTicket.id !== ticketIdFromQuery) {
        // selectedTicket state is out of sync with URL (e.g. programmatic change), sync URL
        // This can happen if selectedTicket is updated due to its status change (e.g. to Closed and then set to null)
        // and displayedTickets becomes empty.
         if(displayedTickets.length === 0 && ticketIdFromQuery){
            router.replace(`/operation-room`, { scroll: false });
         } else if (displayedTickets.length > 0 && displayedTickets[0].id !== ticketIdFromQuery) {
            // If there's a better candidate (first in list) and it's not what's in query, update query
            // This logic might need refinement based on precise desired UX for query param sync.
            // For now, ensures if a ticket is selected, URL reflects it.
            const currentSelectedOrFirst = selectedTicket || displayedTickets[0];
             if(currentSelectedOrFirst && currentSelectedOrFirst.id !== ticketIdFromQuery) {
                router.replace(`/operation-room?ticketId=${currentSelectedOrFirst.id}`, { scroll: false });
             }
         }
      }
    }
  }, [displayedTickets, selectedTicket, isLoading, router, searchParams]);


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Operation Room</h1>
      </div>
      
      <TicketFilters filters={filters} onFilterChange={setFilters} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <h2 className="text-xl font-semibold mb-3">Tickets Queue</h2>
          <TicketTable tickets={displayedTickets} isLoading={isLoading} onRowClick={handleSelectTicket} />
        </div>
        
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-3">Ticket Details</h2>
          {selectedTicket ? (
            <TicketDetailsCard
              ticket={selectedTicket}
              onUpdateStatus={handleUpdateStatus}
              onAddAction={handleAddAction}
              isUpdating={isUpdating}
            />
          ) : (
            <UiCard className="h-full flex items-center justify-center min-h-[300px] bg-muted/20 border-dashed">
              <div className="text-center text-muted-foreground p-6">
                <Info className="mx-auto h-12 w-12 mb-3" />
                <p className="text-lg">No ticket selected.</p>
                <p>Please select a ticket from the list to view its details and take action.</p>
              </div>
            </UiCard>
          )}
        </div>
      </div>
    </div>
  );
}
    
