
"use client";

import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { MediaMaterial, Platform } from '@/types';
import { mediaMaterialOptions, platformOptions } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// English display names for enums
const mediaMaterialDisplay: Record<string, string> = {
    'Video': 'Video',
    'Article': 'Article',
    'Social Media Post': 'Social Media Post',
    'Image': 'Image',
    'Audio': 'Audio',
    'Other': 'Other',
};

const platformDisplay: Record<string, string> = {
    'Umm Al-Qura Newspaper': 'Umm Al-Qura Newspaper',
    'Local Media Channel/Platform': 'Local Media Channel/Platform',
    'International Media Channel/Platform': 'International Media Channel/Platform',
    'SRSA Website': 'SRSA Website',
    'Unified Platform': 'Unified Platform',
    'SRSA Account on Platform X': 'SRSA Account on Platform X',
    'SRSA Account on Instagram': 'SRSA Account on Instagram',
    'SRSA Account on TikTok': 'SRSA Account on TikTok',
    'SRSA Account on LinkedIn': 'SRSA Account on LinkedIn',
    'Other': 'Other',
};

const ticketFormSchema = z.object({
  mediaMaterial: z.enum(mediaMaterialOptions, { required_error: "Media material is required." }),
  otherMediaMaterial: z.string().optional(),
  platform: z.enum(platformOptions, { required_error: "Platform is required." }),
  otherPlatform: z.string().optional(),
  issueLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  screenshotLink: z.string().url({ message: "Please enter a valid URL for the screenshot." }).optional().or(z.literal('')),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(1000, { message: "Description must not exceed 1000 characters." }),
}).refine(data => {
  if (data.mediaMaterial === 'Other') {
    return !!data.otherMediaMaterial && data.otherMediaMaterial.trim().length > 0;
  }
  return true;
}, {
  message: "Please specify the other media material.",
  path: ["otherMediaMaterial"],
}).refine(data => {
  if (data.platform === 'Other') {
    return !!data.otherPlatform && data.otherPlatform.trim().length > 0;
  }
  return true;
}, {
  message: "Please specify the other platform.",
  path: ["otherPlatform"],
});

export type TicketFormValues = z.infer<typeof ticketFormSchema>;

interface TicketFormProps {
  onSubmitSuccess: (data: TicketFormValues) => void;
}

export default function TicketForm({ onSubmitSuccess }: TicketFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      mediaMaterial: undefined,
      otherMediaMaterial: '',
      platform: undefined,
      otherPlatform: '',
      issueLink: '',
      screenshotLink: '',
      description: '',
    },
  });

  const { formState: { isSubmitting }, watch } = form;

  const watchedMediaMaterial = watch("mediaMaterial");
  const watchedPlatform = watch("platform");

  const onSubmit: SubmitHandler<TicketFormValues> = async (data) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to report an incident.", variant: "destructive" });
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    const submissionData: TicketFormValues = {
        ...data,
        mediaMaterial: data.mediaMaterial,
        otherMediaMaterial: data.mediaMaterial === 'Other' ? data.otherMediaMaterial : '',
        platform: data.platform,
        otherPlatform: data.platform === 'Other' ? data.otherPlatform : '',
    };

    onSubmitSuccess(submissionData);
    form.reset(); 
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="mediaMaterial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Media Material</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select media material" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mediaMaterialOptions.map(option => (
                      <SelectItem key={option} value={option}>{mediaMaterialDisplay[option] || option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchedMediaMaterial === 'Other' && (
            <FormField
              control={form.control}
              name="otherMediaMaterial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specify Other Media Material</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Podcast Series" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Platform of Observation</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {platformOptions.map(option => (
                      <SelectItem key={option} value={option}>{platformDisplay[option] || option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
           {watchedPlatform === 'Other' && (
            <FormField
              control={form.control}
              name="otherPlatform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specify Other Platform</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Specific App Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="issueLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link to Issue (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/issue" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="screenshotLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Screenshot Link (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/screenshot.png" {...field} data-ai-hint="screenshot link" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description of Incident</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a detailed description of the incident..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
          Submit Report
        </Button>
      </form>
    </Form>
  );
}
