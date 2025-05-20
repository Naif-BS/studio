
export type MediaMaterial = 'Video' | 'Article' | 'Social Media Post' | 'Image' | 'Audio' | 'Other';

export type Platform =
  | 'Umm Al-Qura Newspaper'
  | 'Local Media Channel/Platform'
  | 'International Media Channel/Platform'
  | 'SRSA Website'
  | 'Unified Platform'
  | 'SRSA Account on Platform X'
  | 'SRSA Account on Instagram'
  | 'SRSA Account on TikTok'
  | 'SRSA Account on LinkedIn'
  | 'Other';

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
  otherMediaMaterial?: string | null;
  otherPlatform?: string | null;
}

export const mediaMaterialOptions: MediaMaterial[] = ['Video', 'Article', 'Social Media Post', 'Image', 'Audio', 'Other'];

export const platformOptions: Platform[] = [
  'Umm Al-Qura Newspaper',
  'Local Media Channel/Platform',
  'International Media Channel/Platform',
  'SRSA Website',
  'Unified Platform',
  'SRSA Account on Platform X',
  'SRSA Account on Instagram',
  'SRSA Account on TikTok',
  'SRSA Account on LinkedIn',
  'Other',
];

export const ticketStatusOptions: TicketStatus[] = ['New', 'Processing', 'Closed'];
