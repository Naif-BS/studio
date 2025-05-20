
"use client";

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TicketStatus, MediaMaterial, Platform } from '@/types';
import { ticketStatusOptions, mediaMaterialOptions, platformOptions } from '@/types';
import { FilterX } from 'lucide-react';

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

// English display names for enums
const ticketStatusDisplay: Record<string, string> = {
    'New': 'New',
    'Processing': 'Processing',
    'Closed': 'Closed',
};

const mediaMaterialDisplay: Record<string, string> = {
    'Video': 'Video',
    'Article': 'Article',
    'Social Media Post': 'Social Media Post',
    'Image': 'Image',
    'Audio': 'Audio',
    'Other': 'Other',
};

const platformDisplay: Record<string, string> = {
    'Umm Al-Qura Newspaper': 'Umm Al-Qura Newspaper',
    'Local Media Channel/Platform': 'Local Media Channel/Platform',
    'International Media Channel/Platform': 'International Media Channel/Platform',
    'SRSA Website': 'SRSA Website',
    'Unified Platform': 'Unified Platform',
    'SRSA Account on Platform X': 'SRSA Account on Platform X',
    'SRSA Account on Instagram': 'SRSA Account on Instagram',
    'SRSA Account on TikTok': 'SRSA Account on TikTok',
    'SRSA Account on LinkedIn': 'SRSA Account on LinkedIn',
    'Other': 'Other',
};


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
    <div className="mb-6 p-4 bg-card border rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
        {showSearch && (
          <div className="space-y-1.5">
            <Label htmlFor="search-tickets">Search</Label>
            <Input
              id="search-tickets"
              placeholder="Search by keyword, ID..."
              value={filters.searchTerm || ''}
              onChange={handleSearchTermChange}
            />
          </div>
        )}
        
        <div className="space-y-1.5">
          <Label htmlFor="filter-status">Status</Label>
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
        
        {hasActiveFilters && (
          <div className="md:col-start-auto xl:col-start-auto pt-2 md:pt-0 flex items-end">
            <Button variant="ghost" onClick={clearFilters} className="w-full md:w-auto">
              <FilterX className="me-2 h-4 w-4" /> Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
