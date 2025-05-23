
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
}

export default function StatCard({ title, value, icon, description, className, percentageChange }: StatCardProps) {
  const hasPercentageChange = typeof percentageChange === 'number';
  const isPositiveChange = hasPercentageChange && percentageChange > 0;
  const isNegativeChange = hasPercentageChange && percentageChange < 0;

  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground pt-1">{description}</p>
        )}
        {hasPercentageChange && (
          <div className={cn(
            "text-xs flex items-center mt-1",
            isPositiveChange && "text-green-600",
            isNegativeChange && "text-red-600",
            !isPositiveChange && !isNegativeChange && "text-muted-foreground"
          )}>
            {isPositiveChange && <ArrowUp className="h-3 w-3 me-0.5" />}
            {isNegativeChange && <ArrowDown className="h-3 w-3 me-0.5" />}
            {percentageChange?.toFixed(1)}%
            <span className="ms-1 text-muted-foreground/80">from last day</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
