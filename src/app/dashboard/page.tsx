
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import TicketTable from '@/components/tickets/TicketTable';
import dynamic from 'next/dynamic'; 
import TicketFilters, { type TicketFiltersState } from '@/components/tickets/TicketFilters';
import DashboardDateFilters, { type DateFilterValue, type DateFilterType } from '@/components/dashboard/DashboardDateFilters';
import { getTickets, calculateAverageProcessingTime, calculateAverageResolutionTime } from '@/lib/data';
import type { Ticket } from '@/types';
import { ListChecks, Clock, AlertTriangle, Hourglass, FileText, BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { isWithinInterval, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, isSameDay, isSameMonth, isSameYear } from 'date-fns';

export default function DashboardPage() {
  const TicketDetailsModal = dynamic(() => import('@/components/tickets/TicketDetailsModal'), {
    loading: () => <p>Loading modal...</p>, 
  });

  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contentFilters, setContentFilters] = useState<TicketFiltersState>({
    status: '',
    mediaMaterial: '',
    platform: '',
    searchTerm: '',
  });
  const [dateFilter, setDateFilter] = useState<DateFilterValue>({ type: 'allTime' });
  const [modalTicket, setModalTicket] = useState<Ticket | null>(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    const loadTickets = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const fetchedTickets = getTickets();
      setAllTickets(fetchedTickets);
      setIsLoading(false);
    };
    loadTickets();
  }, []);

  const ticketsFilteredByDate = useMemo(() => {
    if (dateFilter.type === 'allTime') {
      return allTickets;
    }
    return allTickets.filter(ticket => {
      const ticketDate = new Date(ticket.receivedAt);
      switch (dateFilter.type) {
        case 'daily':
          return dateFilter.date && isSameDay(ticketDate, dateFilter.date);
        case 'monthly':
          return dateFilter.month !== undefined && dateFilter.year !== undefined &&
                 isSameMonth(ticketDate, new Date(dateFilter.year, dateFilter.month, 1));
        case 'yearly':
          return dateFilter.year !== undefined && isSameYear(ticketDate, new Date(dateFilter.year, 0, 1));
        case 'period':
          if (dateFilter.startDate && dateFilter.endDate) {
            return isWithinInterval(ticketDate, { start: startOfDay(dateFilter.startDate), end: endOfDay(dateFilter.endDate) });
          }
          return false; // Should not happen if validation is correct
        default:
          return true;
      }
    });
  }, [allTickets, dateFilter]);

  const fullyFilteredTickets = useMemo(() => {
    return ticketsFilteredByDate
      .filter(ticket => {
        const searchLower = contentFilters.searchTerm?.toLowerCase() || '';
        return (
          (contentFilters.status ? ticket.status === contentFilters.status : true) &&
          (contentFilters.mediaMaterial ? ticket.mediaMaterial === contentFilters.mediaMaterial : true) &&
          (contentFilters.platform ? ticket.platform === contentFilters.platform : true) &&
          (contentFilters.searchTerm
            ? ticket.serialNumber.toLowerCase().includes(searchLower) ||
              ticket.description.toLowerCase().includes(searchLower) ||
              (ticket.platform && ticket.platform.toLowerCase().includes(searchLower)) ||
              (ticket.mediaMaterial && ticket.mediaMaterial.toLowerCase().includes(searchLower))
            : true)
        );
      })
      .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
  }, [ticketsFilteredByDate, contentFilters]);

  const stats = useMemo(() => {
    const getRandomPercentage = () => (Math.random() * 30 - 15);
    const ticketsForStats = ticketsFilteredByDate; // Stats are based on date-filtered tickets

    if (isLoading && dateFilter.type === 'allTime') { // Only show full skeleton on initial load
        return {
            total: '...', new: '...', processing: '...', closed: '...',
            avgProcessingTime: '...', avgResolutionTime: '...',
            totalPct: 0, newPct: 0, processingPct: 0, closedPct: 0,
            comparisonLabel: "from last day",
        };
    }
    
    const showPercentageChange = dateFilter.type === 'allTime'; // Only for 'All Time' for now

    return {
      total: ticketsForStats.length,
      new: ticketsForStats.filter(t => t.status === 'New').length,
      processing: ticketsForStats.filter(t => t.status === 'Processing').length,
      closed: ticketsForStats.filter(t => t.status === 'Closed').length,
      avgProcessingTime: calculateAverageProcessingTime(ticketsForStats),
      avgResolutionTime: calculateAverageResolutionTime(ticketsForStats),
      totalPct: showPercentageChange ? getRandomPercentage() : undefined,
      newPct: showPercentageChange ? getRandomPercentage() : undefined,
      processingPct: showPercentageChange ? getRandomPercentage() : undefined,
      closedPct: showPercentageChange ? getRandomPercentage() : undefined,
      comparisonLabel: showPercentageChange ? "from last day" : undefined,
    };
  }, [ticketsFilteredByDate, isLoading, dateFilter.type]);

  const recentTicketsLimit = 5;
  const displayedTicketsInTable = fullyFilteredTickets.slice(0, recentTicketsLimit);

  const handleTicketRowClick = (ticketId: string) => {
    const ticket = allTickets.find(t => t.id === ticketId); // Find from all tickets to ensure it exists
    if (ticket) {
      setModalTicket(ticket);
      setIsModalOpen(true);
    }
  };

  if (isLoading && dateFilter.type === 'allTime' && allTickets.length === 0) { // More specific initial loading
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full mb-6 rounded-lg" /> {/* Date Filters Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[126px] w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-10 w-1/4 mb-4" /> {/* Recent Incidents Title Skeleton */}
        <div className="rounded-md border">
            <Skeleton className="h-12 w-full" /> {/* Ticket Filters Skeleton */}
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
        <h1 className="text-3xl font-bold tracking-tight mb-4">Dashboard</h1>
        <DashboardDateFilters onApplyFilters={setDateFilter} currentFilterType={dateFilter.type} />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Incidents" value={stats.total} icon={<FileText className="h-5 w-5" />} percentageChange={stats.totalPct} comparisonLabel={stats.comparisonLabel} />
          <StatCard title="New Incidents" value={stats.new} icon={<AlertTriangle className="h-5 w-5" />} percentageChange={stats.newPct} comparisonLabel={stats.comparisonLabel}/>
          <StatCard title="Active Incidents" value={stats.processing} icon={<Hourglass className="h-5 w-5" />} percentageChange={stats.processingPct} comparisonLabel={stats.comparisonLabel}/>
          <StatCard title="Resolved Incidents" value={stats.closed} icon={<ListChecks className="h-5 w-5" />} percentageChange={stats.closedPct} comparisonLabel={stats.comparisonLabel}/>
          <StatCard title="Avg. Initial Response Time" value={stats.avgProcessingTime} icon={<Clock className="h-5 w-5" />} description="From receipt to first action"/>
          <StatCard title="Avg. Resolution Time" value={stats.avgResolutionTime} icon={<BarChart3 className="h-5 w-5" />} description="From receipt to resolution"/>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Recent Incidents Overview</h2>
        <TicketFilters filters={contentFilters} onFilterChange={setContentFilters} />
        <div className="mt-4">
          <TicketTable
              tickets={displayedTicketsInTable}
              isLoading={isLoading && allTickets.length === 0} // Show table skeleton only on initial full load
              onRowClick={handleTicketRowClick}
              visibleColumns={['Status', 'Description', 'Media Material', 'Media Platform']}
              showActionsColumn={true} 
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
