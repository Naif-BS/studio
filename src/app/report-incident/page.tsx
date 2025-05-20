
"use client";

import React from 'react';
import TicketForm from '@/components/tickets/TicketForm';
import { addTicket } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import type { TicketFormValues as IncidentReportFormValues } from '@/components/tickets/TicketForm';

export default function ReportIncidentPage() {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFormSubmit = (data: IncidentReportFormValues) => {
    if (!user || !user.displayName) {
       toast({
        title: "Error",
        description: "User information not available. Cannot submit report.",
        variant: "destructive",
      });
      return;
    }
    try {
      const newTicketData = {
        ...data,
        reportedBy: user.displayName,
      };
      const newTicket = addTicket(newTicketData);
      toast({
        title: "Report Incident Submitted",
        description: `Ticket ${newTicket.serialNumber} has been successfully submitted.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error Reporting Incident",
        description: "There was an issue submitting your report. Please try again.",
        variant: "destructive",
      });
      console.error("Error submitting incident:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Report New Incident</h1>
      <div className="max-w-2xl">
        <TicketForm onSubmitSuccess={handleFormSubmit} />
      </div>
    </div>
  );
}
