
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
import { Card as UiCard } from "@/components/ui/card";
import { Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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
    status: '', 
    mediaMaterial: '',
    platform: '',
    searchTerm: '',
  });

  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300)); 
    const fetchedTickets = getTickets();
    setAllTickets(fetchedTickets);
    
    // Initial selection logic will be handled by the useEffect hook
    // to ensure it runs after displayedTickets is calculated.
    setIsLoading(false);
  }, []); // Removed searchParams and router from here, they are stable and handled in effect

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleSelectTicket = (ticketId: string) => {
    const ticket = allTickets.find(t => t.id === ticketId);
    setSelectedTicket(ticket || null);
    // Only push to router if the new ticketId is different, to avoid redundant pushes.
    if (ticket && searchParams.get('ticketId') !== ticket.id) {
      router.push(`/operation-room?ticketId=${ticketId}`, { scroll: false });
    } else if (!ticket && searchParams.get('ticketId')) {
      router.push(`/operation-room`, { scroll: false });
    }
  };
  
  const handleUpdateStatus = async (ticketId: string, status: TicketStatus, actionDescription?: string) => {
    if (!user) return;
    setIsUpdating(true);
    const updatedTicket = apiUpdateTicketStatus(ticketId, status, actionDescription);
    if (updatedTicket) {
      setAllTickets(prev => prev.map(t => t.id === ticketId ? updatedTicket : t));
      // Selection logic will be handled by useEffect which depends on displayedTickets
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
      .filter(ticket => ticket.status !== 'Closed') 
      .filter(ticket => {
        const searchLower = filters.searchTerm?.toLowerCase() || '';
        // If filter.status is empty, include 'New' and 'Processing'
        const statusFilterActive = filters.status && (filters.status === 'New' || filters.status === 'Processing');
        return (
          (statusFilterActive ? ticket.status === filters.status : (ticket.status === 'New' || ticket.status === 'Processing')) &&
          (filters.mediaMaterial ? ticket.mediaMaterial === filters.mediaMaterial : true) &&
          (filters.platform ? ticket.platform === filters.platform : true) &&
          (filters.searchTerm
            ? ticket.serialNumber.toLowerCase().includes(searchLower) ||
              ticket.description.toLowerCase().includes(searchLower)
            : true)
        );
      })
      .sort((a, b) => { // FIFO: Newest 'New' first, then newest 'Processing'
        const statusOrder = { 'New': 1, 'Processing': 2 } as Record<string, number>; 
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status]; 
        }
        // For tickets with the same status, sort by receivedAt (FIFO - oldest first)
        return new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime();
      });
  }, [allTickets, filters]);

  // Effect to handle auto-selection of tickets and URL updates
  useEffect(() => {
    const ticketIdFromQuery = searchParams.get('ticketId');

    if (!isLoading) { // Guard: Only run when not initially loading
      let newSelectedTicketToSet = selectedTicket; 
      let newUrlTicketId = ticketIdFromQuery; 

      // Case 1: Selected ticket is no longer valid (e.g., closed or filtered out from displayedTickets)
      if (selectedTicket && !displayedTickets.find(t => t.id === selectedTicket.id)) {
        newSelectedTicketToSet = displayedTickets[0] || null;
        newUrlTicketId = newSelectedTicketToSet ? newSelectedTicketToSet.id : null;
      }
      // Case 2: No ticket selected yet, but URL has one (e.g. initial load with query param)
      else if (!selectedTicket && ticketIdFromQuery) {
        const ticketFromQuery = displayedTickets.find(t => t.id === ticketIdFromQuery);
        newSelectedTicketToSet = ticketFromQuery || null; // Select if found and displayable
        if (!ticketFromQuery) { // Ticket from URL not found/actionable
          newUrlTicketId = null; // Signal to clear from URL
        }
        // else newUrlTicketId remains ticketIdFromQuery because it's valid
      }
      // Case 3: No ticket selected, no URL param, but there are displayable tickets -> select the first one
      else if (!selectedTicket && !ticketIdFromQuery && displayedTickets.length > 0) {
        newSelectedTicketToSet = displayedTickets[0];
        newUrlTicketId = newSelectedTicketToSet.id; // Signal to add to URL
      }
      // Case 4: Selected ticket exists, but URL is out of sync or needs clearing
      else if (selectedTicket && selectedTicket.id !== ticketIdFromQuery) {
          // If the current selectedTicket IS in displayedTickets, then the URL is stale/incorrect.
          if (displayedTickets.find(t => t.id === selectedTicket.id)) {
              newUrlTicketId = selectedTicket.id;
              // newSelectedTicketToSet remains selectedTicket
          } else {
              // This means selectedTicket was valid, but filters changed and it's gone.
              // Logic in Case 1 should already cover this by now. This is a fallback.
              newSelectedTicketToSet = displayedTickets[0] || null;
              newUrlTicketId = newSelectedTicketToSet ? newSelectedTicketToSet.id : null;
          }
      }
      // Case 5: No ticket selected, no displayable tickets, but URL has an ID (stale URL)
      else if (!selectedTicket && displayedTickets.length === 0 && ticketIdFromQuery) {
          newUrlTicketId = null; // Signal to clear stale URL
      }


      // Update React state for selectedTicket if it has changed
      if (selectedTicket?.id !== newSelectedTicketToSet?.id) {
        setSelectedTicket(newSelectedTicketToSet);
      }

      // Update URL if it needs to change
      const currentPath = '/operation-room';
      const desiredFullPath = newUrlTicketId ? `${currentPath}?ticketId=${newUrlTicketId}` : currentPath;
      const currentFullPath = ticketIdFromQuery ? `${currentPath}?ticketId=${ticketIdFromQuery}` : currentPath;

      if (desiredFullPath !== currentFullPath) {
         router.replace(desiredFullPath, { scroll: false });
      }
    }
  }, [displayedTickets, selectedTicket, isLoading, router, searchParams]);


  const TicketDetailsSkeleton = () => (
    <UiCard className="h-full min-h-[300px] p-6 space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-8 w-1/3" /> {/* Serial Number */}
        <Skeleton className="h-6 w-20" /> {/* Status Badge */}
      </div>
      <Skeleton className="h-4 w-1/2" /> {/* Received At */}
      <Separator />
      <Skeleton className="h-5 w-1/4 mb-1" /> {/* Incident Details Title */}
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Separator />
      <Skeleton className="h-5 w-1/4 mb-2" /> {/* Actions Log Title */}
      <div className="space-y-3">
        {[1, 2].map(i => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
       {/* Skeletons for update section (optional, as it's conditional) */}
    </UiCard>
  );


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
          {isLoading && !selectedTicket ? ( // Show skeleton when loading and no ticket is yet selected
            <TicketDetailsSkeleton />
          ) : selectedTicket ? (
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
                <p>Please select a ticket from the list to view its details and take action, or check your filters.</p>
              </div>
            </UiCard>
          )}
        </div>
      </div>
    </div>
  );
}
    
