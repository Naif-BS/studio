
export type MediaMaterial = 'Video' | 'Article' | 'Social Media Post' | 'Image' | 'Audio' | 'Other';
export type Platform = 'Facebook' | 'X (Twitter)' | 'Instagram' | 'TikTok' | 'YouTube' | 'News Site' | 'Blog' | 'Forum' | 'Other';
export type TicketStatus = 'New' | 'Processing' | 'Closed';

export interface TicketAction {
  timestamp: Date;
  description: string;
  user: string; // For simplicity, user is a string. In a real app, this would be a user ID or object.
}

export interface Ticket {
  id: string;
  serialNumber: string;
  receivedAt: Date;
  startedProcessingAt?: Date | null;
  closedAt?: Date | null;
  status: TicketStatus;
  mediaMaterial: MediaMaterial;
  platform: Platform;
  issueLink?: string | null;
  screenshotLink?: string | null;
  description: string;
  actionsLog: TicketAction[];
  reportedBy: string; // User who reported it
}

export const mediaMaterialOptions: MediaMaterial[] = ['Video', 'Article', 'Social Media Post', 'Image', 'Audio', 'Other'];
export const platformOptions: Platform[] = ['Facebook', 'X (Twitter)', 'Instagram', 'TikTok', 'YouTube', 'News Site', 'Blog', 'Forum', 'Other'];
export const ticketStatusOptions: TicketStatus[] = ['New', 'Processing', 'Closed'];
