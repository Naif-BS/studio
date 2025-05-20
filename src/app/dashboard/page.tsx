
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '@/components/dashboard/StatCard';
import TicketTable from '@/components/tickets/TicketTable';
import TicketFilters, { type TicketFiltersState } from '@/components/tickets/TicketFilters';
import { getTickets, calculateAverageProcessingTime, calculateAverageResolutionTime } from '@/lib/data';
import type { Ticket } from '@/types';
import { ListChecks, Clock, AlertTriangle, Hourglass, FileText, BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TicketFiltersState>({
    status: '',
    mediaMaterial: '',
    platform: '',
    searchTerm: '',
  });
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const loadTickets = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setTickets(getTickets());
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
              ticket.platform.toLowerCase().includes(searchLower) ||
              ticket.mediaMaterial.toLowerCase().includes(searchLower)
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
    router.push(`/operation-room?ticketId=${ticketId}`);
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
        <TicketFilters filters={filters} onFilterChange={setFilters} />
        {/* Skeleton for the table */}
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
        <h1 className="text-3xl font-bold tracking-tight mb-6">{t('dashboard.title')}</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <StatCard title={t('totalTickets')} value={stats.total} icon={<FileText className="h-5 w-5" />} />
          <StatCard title={t('newTickets')} value={stats.new} icon={<AlertTriangle className="h-5 w-5" />} />
          <StatCard title={t('processingTickets')} value={stats.processing} icon={<Hourglass className="h-5 w-5" />} />
          <StatCard title={t('closedTickets')} value={stats.closed} icon={<ListChecks className="h-5 w-5" />} />
          <StatCard title={t('avgProcessingTime')} value={stats.avgProcessingTime} icon={<Clock className="h-5 w-5" />} description={t('avgProcessingTimeDesc')}/>
          <StatCard title={t('avgResolutionTime')} value={stats.avgResolutionTime} icon={<BarChart3 className="h-5 w-5" />} description={t('avgResolutionTimeDesc')}/>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">{t('dashboard.recentTicketsActivity')}</h2>
        <TicketFilters filters={filters} onFilterChange={setFilters} />
        <TicketTable 
            tickets={displayedTickets} 
            isLoading={isLoading} 
            onRowClick={handleTicketRowClick} 
        />
         {/* The TicketTable component itself handles the "no tickets" message */}
      </section>
    </div>
  );
}
