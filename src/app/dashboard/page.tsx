

"use client";

import React, { useState, useEffect, useMemo } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import TicketTable from '@/components/tickets/TicketTable';
import dynamic from 'next/dynamic'; // Use dynamic import
import TicketFilters, { type TicketFiltersState } from '@/components/tickets/TicketFilters';
import { getTickets, calculateAverageProcessingTime, calculateAverageResolutionTime } from '@/lib/data';
import type { Ticket } from '@/types';
import { ListChecks, Clock, AlertTriangle, Hourglass, FileText, BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  // Dynamically import the modal component
  const TicketDetailsModal = dynamic(() => import('@/components/tickets/TicketDetailsModal'), {
    loading: () => <p>Loading modal...</p>, // Fallback while loading
  });

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TicketFiltersState>({
    status: '',
    mediaMaterial: '',
    platform: '',
    searchTerm: '',
  });
  const [modalTicket, setModalTicket] = useState<Ticket | null>(null); // For modal
  const [isModalOpen, setIsModalOpen] = useState(false); // For modal visibility

  useEffect(() => {
    const loadTickets = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const fetchedTickets = getTickets();
      setTickets(fetchedTickets);
      setIsLoading(false);
    };
    loadTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets
      .filter(ticket => {
        const searchLower = filters.searchTerm?.toLowerCase() || '';
        return (
          (filters.status ? ticket.status === filters.status : true) &&
          (filters.mediaMaterial ? ticket.mediaMaterial === filters.mediaMaterial : true) &&
          (filters.platform ? ticket.platform === filters.platform : true) &&
          (filters.searchTerm
            ? ticket.serialNumber.toLowerCase().includes(searchLower) ||
              ticket.description.toLowerCase().includes(searchLower) ||
              (ticket.platform && ticket.platform.toLowerCase().includes(searchLower)) ||
              (ticket.mediaMaterial && ticket.mediaMaterial.toLowerCase().includes(searchLower))
            : true)
        );
      })
      .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
  }, [tickets, filters]);

  const stats = useMemo(() => {
    if (isLoading) {
        return {
            total: '...', new: '...', processing: '...', closed: '...',
            avgProcessingTime: '...', avgResolutionTime: '...'
        };
    }
    return {
      total: tickets.length,
      new: tickets.filter(t => t.status === 'New').length,
      processing: tickets.filter(t => t.status === 'Processing').length,
      closed: tickets.filter(t => t.status === 'Closed').length,
      avgProcessingTime: calculateAverageProcessingTime(tickets),
      avgResolutionTime: calculateAverageResolutionTime(tickets),
    };
  }, [tickets, isLoading]);

  const recentTicketsLimit = 5;
  const displayedTickets = filteredTickets.slice(0, recentTicketsLimit);

  const handleTicketRowClick = (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      setModalTicket(ticket);
      setIsModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[126px] w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-10 w-1/4 mb-4" />
        {/* TicketFilters skeleton - not strictly necessary as it's simple inputs */}
        <div className="rounded-md border">
            <Skeleton className="h-12 w-full" /> {/* Header */}
            {[...Array(recentTicketsLimit)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full border-t" /> 
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard Overview</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Tickets" value={stats.total} icon={<FileText className="h-5 w-5" />} />
          <StatCard title="New Tickets" value={stats.new} icon={<AlertTriangle className="h-5 w-5" />} />
          <StatCard title="Processing Tickets" value={stats.processing} icon={<Hourglass className="h-5 w-5" />} />
          <StatCard title="Closed Tickets" value={stats.closed} icon={<ListChecks className="h-5 w-5" />} />
          <StatCard title="Avg. Processing Start Time" value={stats.avgProcessingTime} icon={<Clock className="h-5 w-5" />} description="From receipt to start"/>
          <StatCard title="Avg. Resolution Time" value={stats.avgResolutionTime} icon={<BarChart3 className="h-5 w-5" />} description="From receipt to close"/>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Recent Tickets Activity</h2>
        <TicketFilters filters={filters} onFilterChange={setFilters} />
        <div className="mt-4">
          <TicketTable
              tickets={displayedTickets}
              isLoading={isLoading}
              onRowClick={handleTicketRowClick}
              visibleColumns={['Status', 'Description', 'Media Material', 'Media Platform']}
              showActionsColumn={true} // Add the Actions column with the View button
          />
        </div>
      </section>

      {modalTicket && (
        <TicketDetailsModal
          ticket={modalTicket}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </div>
  );
}
    