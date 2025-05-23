
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  className?: string;
  percentageChange?: number;
  comparisonLabel?: string; // e.g., "from last day", "from previous month"
}

export default function StatCard({ title, value, icon, description, className, percentageChange, comparisonLabel }: StatCardProps) {
  const hasPercentageChange = typeof percentageChange === 'number';
  const isPositiveChange = hasPercentageChange && percentageChange > 0;
  const isNegativeChange = hasPercentageChange && percentageChange < 0;

  // Ensure value is not '...' before trying to format as number if it's a string
  const displayValue = (typeof value === 'string' && value === '...') ? '...' : 
                       (typeof value === 'number' ? value.toLocaleString() : value);


  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{displayValue}</div>
        {description && (
          <p className="text-xs text-muted-foreground pt-1">{description}</p>
        )}
        {hasPercentageChange && comparisonLabel && (
          <div className={cn(
            "text-xs flex items-center mt-1",
            isPositiveChange && "text-green-600",
            isNegativeChange && "text-red-600",
            !isPositiveChange && !isNegativeChange && "text-muted-foreground"
          )}>
            {isPositiveChange && <ArrowUp className="h-3 w-3 me-0.5" />}
            {isNegativeChange && <ArrowDown className="h-3 w-3 me-0.5" />}
            {percentageChange?.toFixed(1)}%
            <span className="ms-1 text-muted-foreground/80">{comparisonLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
