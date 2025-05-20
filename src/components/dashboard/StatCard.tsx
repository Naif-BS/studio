
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
// No direct useLanguage here, title should be passed as already translated string or a key
// For simplicity, expecting title to be already translated string passed via prop

interface StatCardProps {
  title: string; // Expecting already translated title
  value: string | number;
  icon: React.ReactNode;
  description?: string; // Expecting already translated description
  className?: string;
}

export default function StatCard({ title, value, icon, description, className }: StatCardProps) {
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
      </CardContent>
    </Card>
  );
}
