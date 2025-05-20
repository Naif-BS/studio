
"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { TicketStatus } from '@/types';
import { Circle, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TranslationKey } from '@/lib/translations';

interface TicketStatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

export function TicketStatusBadge({ status, className }: TicketStatusBadgeProps) {
  const { t } = useLanguage();

  const statusConfigMap: Record<TicketStatus, { icon: React.ElementType; color: string; textColor: string; labelKey: TranslationKey }> = {
    New: {
      icon: Circle,
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-blue-50',
      labelKey: 'ticketStatus.new',
    },
    Processing: {
      icon: Loader2,
      color: 'bg-amber-500 hover:bg-amber-600',
      textColor: 'text-amber-50',
      labelKey: 'ticketStatus.processing',
    },
    Closed: {
      icon: CheckCircle2,
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-green-50',
      labelKey: 'ticketStatus.closed',
    },
  };
  
  const config = statusConfigMap[status] || {
    icon: AlertCircle,
    color: 'bg-gray-500 hover:bg-gray-600',
    textColor: 'text-gray-50',
    labelKey: 'ticketStatus.unknown' as TranslationKey,
  };
  const Icon = config.icon;

  return (
    <Badge variant="default" className={cn("flex items-center gap-1.5 px-2.5 py-1 text-xs", config.color, config.textColor, className)}>
      <Icon className={cn("h-3.5 w-3.5", status === 'Processing' ? 'animate-spin' : '')} />
      <span>{t(config.labelKey)}</span>
    </Badge>
  );
}
