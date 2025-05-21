
export type MediaMaterial =
  | 'Press Release'
  | 'Legal Document'
  | 'Infographic'
  | 'Image'
  | 'Video Clip'
  | 'Audio Clip'
  | 'GIF'
  | 'Other';

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
  user: string; 
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
  reportedBy: string; 
  otherMediaMaterial?: string | null;
  otherPlatform?: string | null;
}

export const mediaMaterialOptions: MediaMaterial[] = [
  'Press Release',
  'Legal Document',
  'Infographic',
  'Image',
  'Video Clip',
  'Audio Clip',
  'GIF',
  'Other',
];

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

// Display names for enums, can be used across components
export const ticketStatusDisplay: Record<TicketStatus, string> = {
    'New': 'New',
    'Processing': 'Processing',
    'Closed': 'Resolved', // Changed from 'Closed'
};

export const mediaMaterialDisplay: Record<MediaMaterial, string> = {
    'Press Release': 'Press Release',
    'Legal Document': 'Legal Document',
    'Infographic': 'Infographic',
    'Image': 'Image',
    'Video Clip': 'Video Clip',
    'Audio Clip': 'Audio Clip',
    'GIF': 'GIF',
    'Other': 'Other',
};

export const platformDisplay: Record<Platform, string> = {
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
