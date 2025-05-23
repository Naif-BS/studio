
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
        title: "Incident Report Submitted",
        description: `Incident ${newTicket.serialNumber} successfully submitted.`,
        variant: "default",
      });
    } catch (error) {
      let errorMessage = "There was an issue submitting your report. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string' && error.trim() !== '') {
        errorMessage = error;
      }
      
      toast({
        title: "Error Submitting Report",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error submitting incident object:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Submit New Incident Report</h1>
      <div className="max-w-2xl border bg-card p-6 rounded-lg shadow-md">
        <TicketForm onSubmitSuccess={handleFormSubmit} />
      </div>
    </div>
  );
}
