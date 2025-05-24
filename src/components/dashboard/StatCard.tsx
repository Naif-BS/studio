// src/components/dashboard/StatCard.tsx (This is where this code BELONGS)
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
// You might need to import your SubStat type definition if it's external
// Example: import { SubStat } from '@/types'; // Adjust path if needed

interface StatCardProps {
  title: string;
  value: string | number;
  percentageChange?: number;
  description: string;
  icon?: React.ReactNode;
  subStats?: { label: string; value: string | number; percentageChange?: number; }[];
}

export default function StatCard({
  title,
  value,
  percentageChange,
  description,
  icon,
  subStats,
}: StatCardProps) {
  const hasPercentageChange = typeof percentageChange === 'number';
  const isPositiveChange = hasPercentageChange && percentageChange > 0;
  const isNegativeChange = hasPercentageChange && percentageChange < 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon && <span className="h-4 w-4 text-muted-foreground">{icon}</span>}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div>
          <div className="text-2xl font-bold">
            {typeof value === 'number' ? value.toLocaleString() : value}
            {hasPercentageChange && (
              <span className={cn(
                "ml-2 text-sm font-semibold",
                isPositiveChange && "text-green-500",
                isNegativeChange && "text-red-500"
              )}>
                ({percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(1)}%)
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        {subStats && subStats.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground">Sub-Statistics:</h4>
            {subStats.map((sub, index) => {
              const isSubPositiveChange = typeof sub.percentageChange === 'number' && sub.percentageChange > 0;
              const isSubNegativeChange = typeof sub.percentageChange === 'number' && sub.percentageChange < 0;

              return (
                <div key={index} className="flex justify-between text-sm text-muted-foreground">
                  <span>{sub.label}</span>
                  <span className={cn(
                    isSubPositiveChange && "text-green-500",
                    isSubNegativeChange && "text-red-500"
                  )}>
                    {typeof sub.value === 'number' ? sub.value.toLocaleString() : sub.value}
                    {typeof sub.percentageChange === 'number' && (
                      <span className="ml-1">
                        ({sub.percentageChange > 0 ? '+' : ''}{sub.percentageChange.toFixed(1)}%)
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}