
import React from 'react';
import Link from 'next/link';
import type { Ticket } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TicketStatusBadge } from './TicketStatusBadge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TicketItemProps {
  ticket: Ticket;
}

export default function TicketItem({ ticket }: TicketItemProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            <Link href={`/operation-room?ticketId=${ticket.id}`} className="hover:underline">
              {ticket.serialNumber}
            </Link>
          </CardTitle>
          <TicketStatusBadge status={ticket.status} />
        </div>
        <CardDescription className="text-xs text-muted-foreground flex items-center pt-1">
          <Clock className="h-3 w-3 mr-1" />
          Received: {formatDistanceToNow(new Date(ticket.receivedAt), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm truncate" title={ticket.description}>{ticket.description}</p>
        <div className="text-xs text-muted-foreground mt-2">
          <p>Material: {ticket.mediaMaterial}</p>
          <p>Platform: {ticket.platform}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/operation-room?ticketId=${ticket.id}`}>
            View Details <ExternalLink className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
