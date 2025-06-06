"use client";

import React from 'react';
import TicketForm from '@/components/tickets/TicketForm';
import { addTicket } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import type { TicketFormValues as IncidentReportFormValues } from '@/components/tickets/TicketForm';
import { cn } from '@/lib/utils';
// ADDED IMPORT: Make sure this line exists
import type { MediaMaterial, Platform } from '@/types'; // Import MediaMaterial and Platform types


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
        // CORRECTED LINES: Added type assertions here
        mediaMaterial: data.mediaMaterial as MediaMaterial, // Assert type
        platform: data.platform as Platform,             // Assert type
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
      <div className={cn(
          "max-w-2xl p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
        )}>
        <TicketForm onSubmitSuccess={handleFormSubmit} />
      </div>
    </div>
  );
}