
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TicketTable from '@/components/tickets/TicketTable';
import dynamic from 'next/dynamic';
import TicketFilters, { type TicketFiltersState } from '@/components/tickets/TicketFilters';
import { getTickets, updateTicketStatus as apiUpdateTicketStatus, addTicketAction as apiAddTicketAction } from '@/lib/data';
import type { Ticket, TicketStatus } from '@/types';
import { ticketStatusDisplay } from '@/types'; // Import for toast
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card as UiCard } from "@/components/ui/card";
import { Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function OperationRoomPage() {
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const ticketIdFromQuery = searchParams.get('ticketId'); 

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
    setIsLoading(false);
  }, []); 

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleSelectTicket = (ticketId: string) => {
    const ticket = allTickets.find(t => t.id === ticketId);
    setSelectedTicket(ticket || null);
    if (ticket && ticketIdFromQuery !== ticket.id) {
      router.push(`/operation-room?ticketId=${ticketId}`, { scroll: false });
    } else if (!ticket && ticketIdFromQuery) {
      router.push(`/operation-room`, { scroll: false });
    }
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
      toast({ 
        title: "Incident Status Updated", 
        description: `Incident ${updatedTicket.serialNumber} status changed to ${ticketStatusDisplay[updatedTicket.status]}.` 
      });
    } else {
      toast({ title: 'Error', description: 'Failed to update incident status.', variant: 'destructive' });
    }
    setIsUpdating(false);
  };

  const handleAddAction = async (ticketId: string, description: string) => {
    const currentUserDisplayName = user?.displayName || 'User';

    const ticketToUpdateOriginalState = allTickets.find(t => t.id === ticketId);
    if (!ticketToUpdateOriginalState) {
      toast({ title: 'Error', description: 'Incident not found.', variant: 'destructive' });
      return;
    }

    setIsUpdating(true);
    
    let resultingTicket = apiAddTicketAction(ticketId, description, currentUserDisplayName);

    if (resultingTicket) {
      toast({ title: 'Action Logged', description: 'New action added to incident.' });

      if (ticketToUpdateOriginalState.status === 'New') {
        const statusUpdateMessage = `Status automatically changed to Processing by ${currentUserDisplayName} after action was logged.`;
        const ticketAfterStatusUpdate = apiUpdateTicketStatus(ticketId, 'Processing', statusUpdateMessage);
        
        if (ticketAfterStatusUpdate) {
          resultingTicket = ticketAfterStatusUpdate; 
          toast({
            title: "Incident Status Updated",
            description: `Incident ${resultingTicket.serialNumber} status automatically changed to ${ticketStatusDisplay[resultingTicket.status]}.`
          });
        } else {
          toast({ title: 'Error', description: 'Failed to automatically update incident status after logging action.', variant: 'destructive' });
        }
      }
      
      if (resultingTicket) {
        setAllTickets(prev => prev.map(t => (t.id === ticketId ? resultingTicket! : t)));
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket(resultingTicket!);
        }
      }
    } else {
      toast({ title: 'Error', description: 'Failed to log action for incident.', variant: 'destructive' });
    }
    setIsUpdating(false);
  };
  
  const displayedTickets = useMemo(() => {
    return allTickets
      .filter(ticket => ticket.status !== 'Closed') 
      .filter(ticket => {
        const searchLower = filters.searchTerm?.toLowerCase() || '';
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
      .sort((a, b) => { 
        const statusOrder = { 'New': 1, 'Processing': 2 } as Record<string, number>; 
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        } 
        return new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime(); 
      });
  }, [allTickets, filters]);

   useEffect(() => {
    if (!isLoading) { 
      let newSelectedTicketToSet = selectedTicket; 
      let newUrlTicketId = ticketIdFromQuery; 

      if (selectedTicket && !displayedTickets.find(t => t.id === selectedTicket.id)) {
        newSelectedTicketToSet = displayedTickets[0] || null;
        newUrlTicketId = newSelectedTicketToSet ? newSelectedTicketToSet.id : null;
      }
      else if (!selectedTicket && ticketIdFromQuery) {
        const ticketFromQuery = displayedTickets.find(t => t.id === ticketIdFromQuery);
        newSelectedTicketToSet = ticketFromQuery || null; 
        if (!ticketFromQuery) { 
          newUrlTicketId = null; 
        }
      }
      else if (!selectedTicket && !ticketIdFromQuery && displayedTickets.length > 0) {
        newSelectedTicketToSet = displayedTickets[0];
        newUrlTicketId = newSelectedTicketToSet.id; 
      }
      else if (selectedTicket && selectedTicket.id !== ticketIdFromQuery) {
          if (displayedTickets.find(t => t.id === selectedTicket.id)) {
              newUrlTicketId = selectedTicket.id;
          } else {
              newSelectedTicketToSet = displayedTickets[0] || null;
              newUrlTicketId = newSelectedTicketToSet ? newSelectedTicketToSet.id : null;
          }
      }
      else if (!selectedTicket && displayedTickets.length === 0 && ticketIdFromQuery) {
          newUrlTicketId = null; 
      }

      if (selectedTicket?.id !== newSelectedTicketToSet?.id) {
        setSelectedTicket(newSelectedTicketToSet);
      }

      const currentPath = '/operation-room';
      const desiredFullPath = newUrlTicketId ? `${currentPath}?ticketId=${newUrlTicketId}` : currentPath;
      const currentFullPath = ticketIdFromQuery ? `${currentPath}?ticketId=${ticketIdFromQuery}` : currentPath;

      if (desiredFullPath !== currentFullPath) {
         router.replace(desiredFullPath, { scroll: false });
      }
    }
  }, [displayedTickets, selectedTicket, isLoading, router, ticketIdFromQuery]); 

const TicketDetailsCard = dynamic(() => import('@/components/tickets/TicketDetailsCard'), {
  loading: () => <TicketDetailsSkeleton />, 
});

  const TicketDetailsSkeleton = () => (
    <UiCard className="h-full p-6 space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-8 w-1/3" /> 
        <Skeleton className="h-6 w-20" /> 
      </div>
      <Skeleton className="h-4 w-1/2" /> 
      <Separator />
      <Skeleton className="h-5 w-1/4 mb-1" /> 
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Separator />
      <Skeleton className="h-5 w-1/4 mb-2" /> 
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
    </UiCard>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Incident Management Center</h1>
      </div>

      <TicketFilters filters={filters} onFilterChange={setFilters} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold tracking-tight mb-3">Incident Queue</h2>
          <TicketTable
            tickets={displayedTickets}
            isLoading={isLoading}
            onRowClick={handleSelectTicket}
            visibleColumns={['SerialNumber', 'Status', 'Description', 'Media Material', 'Media Platform', 'ReportedBy']}
            showActionsColumn={true}
          />
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold tracking-tight mb-3">Incident Details</h2>
          {isLoading && !selectedTicket ? ( 
             <TicketDetailsSkeleton />
          ) : selectedTicket ? (
            <React.Suspense fallback={<TicketDetailsSkeleton />}>
              <TicketDetailsCard
                ticket={selectedTicket}
                onUpdateStatus={handleUpdateStatus}
                onAddAction={handleAddAction}
                isUpdating={isUpdating}
              />
            </React.Suspense>
          ) : (
            <UiCard className="h-full flex items-center justify-center min-h-[300px] bg-muted/20 border-dashed">
              <div className="text-center text-muted-foreground p-6">
                <Info className="mx-auto h-12 w-12 mb-3" />
                <p className="text-lg">No incident selected.</p>
                <p>Select an incident from the queue to view its details and manage it. If the queue appears empty, please check your filters.</p>
              </div>
            </UiCard>
          )}
        </div>
      </div>
    </div>
  );
}
