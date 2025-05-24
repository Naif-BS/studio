
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import dynamic from 'next/dynamic';
import TicketFilters, { type TicketFiltersState } from '@/components/tickets/TicketFilters';
import DashboardDateFilters, { type DateFilterValue } from '@/components/dashboard/DashboardDateFilters';
import { 
  getTickets, 
  calculateAverageProcessingTime, 
  calculateAverageResolutionTime, 
  calculateResolutionRate, 
  calculateOldestOpenIncidentAge,
  getTopMediaMaterials,
  getTopMediaPlatforms,
  type TopListItem
} from '@/lib/data';
import type { Ticket, MediaMaterial, Platform } from '@/types';
import { ListChecks, Clock, AlertTriangle, Hourglass, FileText, Target, CalendarClock, Timer, ShieldCheck, Newspaper, RadioTower, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { isWithinInterval, startOfDay, endOfDay, isSameDay, isSameMonth, isSameYear, isValid } from 'date-fns';
import { mediaMaterialDisplay, platformDisplay } from '@/types';
import TicketTable from '@/components/tickets/TicketTable';


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
      if (!isValid(ticketDate)) return false;

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
          return false;
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
    const ticketsForStats = ticketsFilteredByDate;

    if (isLoading && dateFilter.type === 'allTime' && allTickets.length === 0) {
        return {
            total: '...', newCount: '...', processingCount: '...', closedCount: '...',
            avgProcessingTime: '...', avgResolutionTime: '...',
            resolutionRate: '...', oldestOpenIncidentAge: '...',
            topMaterials: [], topPlatforms: [],
            newPct: undefined, processingPct: undefined, closedPct: undefined,
            avgProcessingTimePct: undefined, avgResolutionTimePct: undefined,
            comparisonLabel: "from last day",
        };
    }

    const showPercentageChange = dateFilter.type === 'allTime';
    const newIncidentsCount = ticketsForStats.filter(t => t.status === 'New').length;
    const processingIncidentsCount = ticketsForStats.filter(t => t.status === 'Processing').length;
    const closedIncidentsCount = ticketsForStats.filter(t => t.status === 'Closed').length;

    return {
      total: ticketsForStats.length,
      newCount: newIncidentsCount,
      processingCount: processingIncidentsCount,
      closedCount: closedIncidentsCount,
      avgProcessingTime: calculateAverageProcessingTime(ticketsForStats),
      avgResolutionTime: calculateAverageResolutionTime(ticketsForStats),
      resolutionRate: calculateResolutionRate(ticketsForStats),
      oldestOpenIncidentAge: calculateOldestOpenIncidentAge(ticketsForStats),
      topMaterials: getTopMediaMaterials(ticketsForStats, 3),
      topPlatforms: getTopMediaPlatforms(ticketsForStats, 3),
      newPct: showPercentageChange ? getRandomPercentage() : undefined,
      processingPct: showPercentageChange ? getRandomPercentage() : undefined,
      closedPct: showPercentageChange ? getRandomPercentage() : undefined,
      avgProcessingTimePct: showPercentageChange ? getRandomPercentage() : undefined,
      avgResolutionTimePct: showPercentageChange ? getRandomPercentage() : undefined,
      comparisonLabel: showPercentageChange ? "from last day" : undefined,
    };
  }, [ticketsFilteredByDate, isLoading, dateFilter.type, allTickets.length]);

  const incidentStatusSubStats = [
    {
      label: "New Incidents",
      value: stats.newCount,
      icon: <AlertTriangle className="h-4 w-4"/>,
      percentageChange: stats.newPct,
      comparisonLabel: stats.comparisonLabel
    },
    {
      label: "Active Incidents",
      value: stats.processingCount,
      icon: <Hourglass className="h-4 w-4"/>,
      percentageChange: stats.processingPct,
      comparisonLabel: stats.comparisonLabel
    },
    {
      label: "Resolved Incidents",
      value: stats.closedCount,
      icon: <ListChecks className="h-4 w-4"/>,
      percentageChange: stats.closedPct,
      comparisonLabel: stats.comparisonLabel
    },
  ];

  const keyPerformanceMetricsSubStats = [
    {
      label: "Avg. Initial Response Time",
      value: stats.avgProcessingTime,
      icon: <Clock className="h-4 w-4" />,
      percentageChange: stats.avgProcessingTimePct,
      comparisonLabel: stats.comparisonLabel,
    },
    {
      label: "Avg. Resolution Time",
      value: stats.avgResolutionTime,
      icon: <Timer className="h-4 w-4" />,
      percentageChange: stats.avgResolutionTimePct,
      comparisonLabel: stats.comparisonLabel,
    },
    {
      label: "Resolution Rate",
      value: stats.resolutionRate,
      icon: <Target className="h-4 w-4"/>,
    },
    {
      label: "Oldest Open Incident Age",
      value: stats.oldestOpenIncidentAge,
      icon: <CalendarClock className="h-4 w-4"/>,
    },
  ];

  const topMaterialsSubStats = stats.topMaterials.map(item => ({
    label: mediaMaterialDisplay[item.name as MediaMaterial] || item.name,
    value: item.count,
  }));

  const topPlatformsSubStats = stats.topPlatforms.map(item => ({
    label: platformDisplay[item.name as Platform] || item.name,
    value: item.count,
  }));


  const recentIncidentsLimit = 5;
  const displayedTicketsInTable = fullyFilteredTickets.slice(0, recentIncidentsLimit);

  const handleTicketRowClick = (ticketId: string) => {
    const ticket = allTickets.find(t => t.id === ticketId);
    if (ticket) {
      setModalTicket(ticket);
      setIsModalOpen(true);
    }
  };

  if (isLoading && dateFilter.type === 'allTime' && allTickets.length === 0) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full mb-6 rounded-lg" /> {/* Date Filters Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[140px] md:col-span-2 lg:col-span-2 w-full rounded-lg" /> 
          <Skeleton className="h-[140px] md:col-span-2 lg:col-span-2 w-full rounded-lg" /> 
          <Skeleton className="h-[140px] md:col-span-2 lg:col-span-2 w-full rounded-lg" /> 
          <Skeleton className="h-[140px] md:col-span-2 lg:col-span-2 w-full rounded-lg" /> 
        </div>
        <Skeleton className="h-10 w-1/4 mb-4" /> {/* Recent Incidents Title Skeleton */}
        {/* Skeleton for TicketTable */}
        <div className="rounded-md border">
            <div className="flex items-center justify-between p-3 border-b bg-muted/50">
                {/* Adjusted skeleton for fewer columns */}
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-5 w-1/4 rounded" />)} 
                <Skeleton className="h-5 w-[100px] rounded" /> {/* Actions column */}
            </div>
            {[...Array(recentIncidentsLimit)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 border-b last:border-b-0">
                 {/* Adjusted skeleton for fewer columns */}
                 {[...Array(4)].map((_, j) => <Skeleton key={j} className="h-4 w-1/4 rounded" />)}
                <Skeleton className="h-8 w-[100px] rounded-md" /> {/* Actions column */}
            </div>
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Incidents"
            value={stats.total}
            icon={<FileText className="h-6 w-6" />}
            description="Incident volume and status summary."
            subStats={incidentStatusSubStats}
            className="md:col-span-2 lg:col-span-2"
          />

          <StatCard
            title="Key Performance Metrics"
            value={"..."}
            icon={<Activity className="h-6 w-6" />}
            description="Incident handling efficiency and effectiveness."
            subStats={keyPerformanceMetricsSubStats}
            className="md:col-span-2 lg:col-span-2"
          />
          
          <StatCard
            title="Top Media Materials"
            value={stats.topMaterials.length > 0 ? mediaMaterialDisplay[stats.topMaterials[0].name as MediaMaterial] || stats.topMaterials[0].name : "N/A"}
            icon={<Newspaper className="h-6 w-6" />}
            description="Primary media types causing incidents."
            subStats={topMaterialsSubStats}
            className="md:col-span-2 lg:col-span-2"
          />

          <StatCard
            title="Top Media Platforms"
            value={stats.topPlatforms.length > 0 ? platformDisplay[stats.topPlatforms[0].name as Platform] || stats.topPlatforms[0].name : "N/A"}
            icon={<RadioTower className="h-6 w-6" />}
            description="Primary platforms of reported incidents."
            subStats={topPlatformsSubStats}
            className="md:col-span-2 lg:col-span-2"
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Recent Incidents Overview</h2>
        <TicketFilters filters={contentFilters} onFilterChange={setContentFilters} />
        <TicketTable
            tickets={displayedTicketsInTable}
            isLoading={isLoading && allTickets.length === 0}
            onRowClick={handleTicketRowClick}
            visibleColumns={['Status', 'Description', 'Media Material', 'Media Platform']}
        />
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


    