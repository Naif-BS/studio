
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface SubStat {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  percentageChange?: number;
  comparisonLabel?: string;
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
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          {title}
        </CardTitle>
        {React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6 text-primary" })}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-2xl font-bold">{displayValue}</div>
        {description && (
          <p className="text-xs text-muted-foreground pt-1">{description}</p>
        )}
        {hasPercentageChange && comparisonLabel && !subStats && ( // Only show main % change if no subStats
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
          <div className="mt-3 pt-3 border-t border-border/60 space-y-2">
            {subStats.map((sub, index) => {
              const hasSubPercentageChange = typeof sub.percentageChange === 'number';
              const isSubPositiveChange = hasSubPercentageChange && sub.percentageChange > 0;
              const isSubNegativeChange = hasSubPercentageChange && sub.percentageChange < 0;

              return (
                <div key={index}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      {sub.icon && React.cloneElement(sub.icon as React.ReactElement, { className: "h-4 w-4 me-1.5" })}
                      <span>{sub.label}:</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {typeof sub.value === 'number' ? sub.value.toLocaleString() : sub.value}
                    </span>
                  </div>
                  {hasSubPercentageChange && sub.comparisonLabel && (
                    <div className={cn(
                      "text-xs flex items-center justify-end mt-0.5",
                      isSubPositiveChange && "text-green-600",
                      isSubNegativeChange && "text-red-600",
                      !isSubPositiveChange && !isSubNegativeChange && "text-muted-foreground"
                    )}>
                      {isSubPositiveChange && <ArrowUp className="h-3 w-3 me-0.5" />}
                      {isSubNegativeChange && <ArrowDown className="h-3 w-3 me-0.5" />}
                      {sub.percentageChange?.toFixed(1)}%
                      <span className="ms-1 text-muted-foreground/80">{sub.comparisonLabel}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
