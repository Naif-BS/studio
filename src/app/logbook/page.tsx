
"use client";

import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import TicketTable from '@/components/tickets/TicketTable';
import TicketFilters, { type TicketFiltersState } from '@/components/tickets/TicketFilters';
import { getTickets } from '@/lib/data';
import type { Ticket } from '@/types';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useToast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 10;

const TicketDetailsModal = lazy(() => import('@/components/tickets/TicketDetailsModal'));

export default function LogbookPage() {
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TicketFiltersState>({
    status: '',
    mediaMaterial: '',
    platform: '',
    searchTerm: '',
  });
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [modalTicket, setModalTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadTickets = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setAllTickets(getTickets());
      setIsLoading(false);
    };
    loadTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    setCurrentPage(1);
    return allTickets
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
              (ticket.mediaMaterial && ticket.mediaMaterial.toLowerCase().includes(searchLower)) ||
              (ticket.reportedBy && ticket.reportedBy.toLowerCase().includes(searchLower)) 
            : true)
        );
      })
      .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
  }, [allTickets, filters]);

  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTickets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTickets, currentPage]);


  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleViewTicketClick = (ticketId: string) => {
    const ticket = allTickets.find(t => t.id === ticketId);
    if (ticket) { 
      setModalTicket(ticket); 
      setIsModalOpen(true); 
    }
  };
  

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Incident Logbook</h1>
      <TicketFilters filters={filters} onFilterChange={setFilters} />

      <TicketTable
        tickets={paginatedTickets}
        isLoading={isLoading}
        onRowClick={handleViewTicketClick} 
        showActionsColumn={true} 
      />
      
      {totalPages > 1 && !isLoading && (
          <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink
                        href="#"
                        onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                        isActive={page === currentPage}
                    >
                        {page}
                    </PaginationLink>
                  </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <Suspense fallback={<div>Loading modal...</div>}>
        {modalTicket && (
          <TicketDetailsModal
            ticket={modalTicket}
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
          />
        )}
      </Suspense>
    </div>
  );
}
    
