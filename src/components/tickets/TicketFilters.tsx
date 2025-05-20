
"use client";

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TicketStatus, MediaMaterial, Platform } from '@/types';
import { ticketStatusOptions, mediaMaterialOptions, platformOptions } from '@/types';
import { FilterX } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TranslationKey } from '@/lib/translations';

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

// Helper function to get translation key for enum values (like 'Social Media Post' -> 'socialMediaPost')
const getEnumTranslationKey = (value: string, prefix: string): TranslationKey => {
    const formattedValue = value.toLowerCase().replace(/\s+/g, '').replace(/[^\w]/gi, ''); // Basic normalization
    return `${prefix}.${formattedValue}` as TranslationKey;
}


export default function TicketFilters({ filters, onFilterChange, showSearch = true }: TicketFiltersProps) {
  const { dir, t } = useLanguage();
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
            <Label htmlFor="search-tickets">{t('search')}</Label>
            <Input
              id="search-tickets"
              placeholder={t('searchByKeyword')}
              value={filters.searchTerm || ''}
              onChange={handleSearchTermChange}
            />
          </div>
        )}
        
        <div className="space-y-1.5">
          <Label htmlFor="filter-status">{t('status')}</Label>
          <Select value={filters.status || ALL_ITEMS_VALUE} onValueChange={handleStatusChange} dir={dir}>
            <SelectTrigger id="filter-status">
              <SelectValue placeholder={t('anyStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_ITEMS_VALUE} key="all-statuses">{t('anyStatus')}</SelectItem>
              {ticketStatusOptions.map(option => (
                <SelectItem key={option} value={option}>{t(`ticketStatus.${option.toLowerCase()}` as any)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filter-media-material">{t('mediaMaterial')}</Label>
          <Select value={filters.mediaMaterial || ALL_ITEMS_VALUE} onValueChange={handleMediaMaterialChange} dir={dir}>
            <SelectTrigger id="filter-media-material">
              <SelectValue placeholder={t('anyMaterial')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_ITEMS_VALUE} key="all-materials">{t('anyMaterial')}</SelectItem>
              {mediaMaterialOptions.map(option => (
                <SelectItem key={option} value={option}>{t(getEnumTranslationKey(option, 'mediaMaterialOptions'))}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filter-platform">{t('platform')}</Label>
          <Select value={filters.platform || ALL_ITEMS_VALUE} onValueChange={handlePlatformChange} dir={dir}>
            <SelectTrigger id="filter-platform">
              <SelectValue placeholder={t('anyPlatform')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_ITEMS_VALUE} key="all-platforms">{t('anyPlatform')}</SelectItem>
              {platformOptions.map(option => (
                <SelectItem key={option} value={option}>{t(getEnumTranslationKey(option, 'platformOptions'))}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {hasActiveFilters && (
          <div className="md:col-start-auto xl:col-start-auto pt-2 md:pt-0 flex items-end">
            <Button variant="ghost" onClick={clearFilters} className="w-full md:w-auto">
              <FilterX className={dir === 'rtl' ? 'ms-2' : 'me-2' + " h-4 w-4"} /> {t('clearFilters')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
