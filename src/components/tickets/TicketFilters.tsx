
"use client";

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TicketStatus, MediaMaterial, Platform } from '@/types';
import { ticketStatusOptions, mediaMaterialOptions, platformOptions, ticketStatusDisplay, mediaMaterialDisplay, platformDisplay } from '@/types';
import { FilterX } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TicketFiltersState {
  status?: TicketStatus | '';
  mediaMaterial?: MediaMaterial | '';
  platform?: Platform | '';
  searchTerm?: string;
}

interface TicketFiltersProps {
  filters: TicketFiltersState;
  onFilterChange: (filters: TicketFiltersState) => void;
  showSearch?: boolean;
}

const ALL_ITEMS_VALUE = "__ALL__";

export default function TicketFilters({ filters, onFilterChange, showSearch = true }: TicketFiltersProps) {
  const handleStatusChange = (value: string) => {
    onFilterChange({ ...filters, status: value === ALL_ITEMS_VALUE ? '' : value as TicketStatus | '' });
  };

  const handleMediaMaterialChange = (value: string) => {
    onFilterChange({ ...filters, mediaMaterial: value === ALL_ITEMS_VALUE ? '' : value as MediaMaterial | '' });
  };

  const handlePlatformChange = (value: string) => {
    onFilterChange({ ...filters, platform: value === ALL_ITEMS_VALUE ? '' : value as Platform | '' });
  };

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchTerm: event.target.value });
  };

  const clearFilters = () => {
    onFilterChange({ status: '', mediaMaterial: '', platform: '', searchTerm: '' });
  };
  
  const hasActiveFilters = filters.status || filters.mediaMaterial || filters.platform || (showSearch && filters.searchTerm);

  return (
    <div className={cn(
      "p-3 mb-3 rounded-lg border bg-card text-card-foreground shadow-sm" // Changed shadow-lg to shadow-sm
    )}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
        {showSearch && (
          <div className="space-y-1.5">
            <Label htmlFor="search-tickets">Search Incidents</Label>
            <Input
              id="search-tickets"
              placeholder="Search by keyword, serial, description..."
              value={filters.searchTerm || ''}
              onChange={handleSearchTermChange}
            />
          </div>
        )}
        
        <div className="space-y-1.5">
          <Label htmlFor="filter-status">Incident Status</Label>
          <Select value={filters.status || ALL_ITEMS_VALUE} onValueChange={handleStatusChange}>
            <SelectTrigger id="filter-status">
              <SelectValue placeholder="Any Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_ITEMS_VALUE} key="all-statuses">Any Status</SelectItem>
              {ticketStatusOptions.map(option => (
                <SelectItem key={option} value={option}>{ticketStatusDisplay[option] || option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filter-media-material">Media Material</Label>
          <Select value={filters.mediaMaterial || ALL_ITEMS_VALUE} onValueChange={handleMediaMaterialChange}>
            <SelectTrigger id="filter-media-material">
              <SelectValue placeholder="Any Material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_ITEMS_VALUE} key="all-materials">Any Material</SelectItem>
              {mediaMaterialOptions.map(option => (
                <SelectItem key={option} value={option}>{mediaMaterialDisplay[option] || option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filter-platform">Media Platform</Label>
          <Select value={filters.platform || ALL_ITEMS_VALUE} onValueChange={handlePlatformChange}>
            <SelectTrigger id="filter-platform">
              <SelectValue placeholder="Any Media Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_ITEMS_VALUE} key="all-platforms">Any Media Platform</SelectItem>
              {platformOptions.map(option => (
                <SelectItem key={option} value={option}>{platformDisplay[option] || option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {hasActiveFilters && (
        <div className="mt-3 flex justify-end">
          <Button variant="ghost" onClick={clearFilters} className="w-full sm:w-auto">
            <FilterX className="me-2 h-4 w-4" /> Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
