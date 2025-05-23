
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface SubStat {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  className?: string;
  percentageChange?: number;
  comparisonLabel?: string;
  subStats?: SubStat[];
}

export default function StatCard({ title, value, icon, description, className, percentageChange, comparisonLabel, subStats }: StatCardProps) {
  const hasPercentageChange = typeof percentageChange === 'number';
  const isPositiveChange = hasPercentageChange && percentageChange > 0;
  const isNegativeChange = hasPercentageChange && percentageChange < 0;

  const displayValue = (typeof value === 'string' && value === '...') ? '...' :
                       (typeof value === 'number' ? value.toLocaleString() : value);

  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6 text-primary" })}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-2xl font-bold">{displayValue}</div>
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
        {subStats && subStats.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/60 space-y-1.5">
            {subStats.map((sub, index) => (
              <div key={index} className="text-xs flex items-center justify-between text-muted-foreground">
                <div className="flex items-center">
                  {sub.icon && React.cloneElement(sub.icon as React.ReactElement, { className: "h-3.5 w-3.5 me-1.5 opacity-80" })}
                  <span>{sub.label}:</span>
                </div>
                <span className="font-medium text-foreground/90">{typeof sub.value === 'number' ? sub.value.toLocaleString() : sub.value}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
