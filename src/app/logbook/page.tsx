
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import TicketTable from '@/components/tickets/TicketTable';
import TicketDetailsCard from '@/components/tickets/TicketDetailsCard'; // Changed from Modal
import TicketFilters, { type TicketFiltersState } from '@/components/tickets/TicketFilters';
import { getTickets } from '@/lib/data';
import type { Ticket } from '@/types';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card } from "@/components/ui/card"; // For placeholder
import { Info } from 'lucide-react'; // For placeholder icon

const ITEMS_PER_PAGE = 10;

export default function LogbookPage() {
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TicketFiltersState>({
    status: '',
    mediaMaterial: '',
    platform: '',
    searchTerm: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null); // Changed from modalTicket

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
              (ticket.mediaMaterial && ticket.mediaMaterial.toLowerCase().includes(searchLower))
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewTicketClick = (ticketId: string) => {
    const ticket = allTickets.find(t => t.id === ticketId);
    setSelectedTicket(ticket || null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Media Logbook</h1>
      <TicketFilters filters={filters} onFilterChange={setFilters} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TicketTable 
            tickets={paginatedTickets} 
            isLoading={isLoading} 
            onRowClick={handleViewTicketClick} 
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
                            onClick={(e) => { e.preventDefault(); handlePageChange(page);}}
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
        </div>
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-3 sticky top-20">Ticket Details</h2> {/* sticky top for better UX */}
          {selectedTicket ? (
            <TicketDetailsCard ticket={selectedTicket} />
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[300px] bg-muted/20 border-dashed sticky top-32">
              <div className="text-center text-muted-foreground p-6">
                <Info className="mx-auto h-12 w-12 mb-3" />
                <p className="text-lg">No ticket selected.</p>
                <p>Please select a ticket from the list to view its details.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

    