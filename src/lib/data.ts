
import type { Ticket, TicketStatus, MediaMaterial, Platform, TicketAction } from '@/types';

const mediaMaterialToCode: Record<MediaMaterial, string> = {
  'Press Release': 'P',
  'Legal Document': 'L',
  'Infographic': 'F',
  'Image': 'M',
  'Video Clip': 'V',
  'Audio Clip': 'A',
  'GIF': 'G',
  'Other': 'Z', // Changed from 'O'
};

const platformToCode: Record<Platform, string> = {
  'Umm Al-Qura Newspaper': 'U',
  'Local Media Channel/Platform': 'C',
  'International Media Channel/Platform': 'N',
  'SRSA Website': 'S',
  'Unified Platform': 'P',
  'SRSA Account on Platform X': 'X',
  'SRSA Account on Instagram': 'I',
  'SRSA Account on TikTok': 'T',
  'SRSA Account on LinkedIn': 'K',
  'Other': 'Y', // Changed from 'O'
};

let tickets: Ticket[] = [
  {
    id: '1',
    serialNumber: 'BDM-VN0001', // Video Clip (V), International (N)
    receivedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), 
    startedProcessingAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), 
    closedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), 
    status: 'Closed',
    mediaMaterial: 'Video Clip',
    platform: 'International Media Channel/Platform',
    issueLink: 'https://youtube.com/example_video_1',
    description: 'Misleading content in a viral video.',
    actionsLog: [
      { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), description: 'Initial review started.', user: 'Analyst 1' },
      { timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), description: 'Content verified and flagged. Case closed.', user: 'Analyst 1' },
    ],
    reportedBy: 'User A',
  },
  {
    id: '2',
    serialNumber: 'BDM-PC0001', // Press Release (P), Local Channel (C)
    receivedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), 
    startedProcessingAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 
    status: 'Processing',
    mediaMaterial: 'Press Release',
    platform: 'Local Media Channel/Platform',
    issueLink: 'https://news.com/example_article_1',
    description: 'Hate speech found in comments section.',
     actionsLog: [
      { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), description: 'Ticket assigned to Analyst 2.', user: 'System' },
      { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), description: 'Contacted platform for comment removal.', user: 'Analyst 2' },
    ],
    reportedBy: 'User B',
  },
  {
    id: '3',
    serialNumber: 'BDM-FX0001', // Infographic (F), Platform X (X)
    receivedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), 
    status: 'New',
    mediaMaterial: 'Infographic',
    platform: 'SRSA Account on Platform X',
    issueLink: 'https://x.com/example_post_1',
    description: 'Fake news spreading rapidly.',
    actionsLog: [],
    reportedBy: 'User C',
  },
  {
    id: '4',
    serialNumber: 'BDM-MI0001', // Image (M), Instagram (I)
    receivedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), 
    status: 'New',
    mediaMaterial: 'Image',
    platform: 'SRSA Account on Instagram',
    screenshotLink: 'https://placehold.co/600x400.png',
    description: 'Copyright infringement on an image.',
    actionsLog: [],
    reportedBy: 'User D',
  },
   {
    id: '5',
    serialNumber: 'BDM-AT0001', // Audio Clip (A), TikTok (T)
    receivedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), 
    startedProcessingAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), 
    closedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), 
    status: 'Closed',
    mediaMaterial: 'Audio Clip',
    platform: 'SRSA Account on TikTok',
    issueLink: 'https://tiktok.com/example_audio_1',
    description: 'Unauthorized use of copyrighted music.',
    actionsLog: [
      { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), description: 'Investigation initiated.', user: 'Analyst 3' },
      { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), description: 'Takedown notice sent. Issue resolved.', user: 'Analyst 3' },
    ],
    reportedBy: 'User E',
  },
  {
    id: '6',
    serialNumber: 'BDM-ZY0001', // Other (Z), Other (Y) - Updated
    receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), 
    status: 'New',
    mediaMaterial: 'Other',
    otherMediaMaterial: 'Live Stream Segment',
    platform: 'Other',
    otherPlatform: 'Twitch',
    issueLink: 'https://twitch.tv/example_stream_clip',
    description: 'Violation of community guidelines during a live stream.',
    actionsLog: [],
    reportedBy: 'User F',
  },
  {
    id: '7',
    serialNumber: 'BDM-LU0001', // Legal Document (L), Umm Al-Qura (U)
    receivedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    startedProcessingAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    closedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    status: 'Closed',
    mediaMaterial: 'Legal Document',
    platform: 'Umm Al-Qura Newspaper',
    issueLink: 'https://example-umm-al-qura.com/article_123',
    description: 'Official announcement clarification needed.',
    actionsLog: [
      { timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), description: 'Reviewed official text.', user: 'Analyst SRSA' },
      { timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), description: 'No action needed. Archived.', user: 'Analyst SRSA' },
    ],
    reportedBy: 'System Alert',
  },
  {
    id: '8',
    serialNumber: 'BDM-VS0001', // Video Clip (V), SRSA Website (S)
    receivedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    status: 'New',
    mediaMaterial: 'Video Clip',
    platform: 'SRSA Website',
    issueLink: 'https://srsa.gov.sa/videos/promo_vid_error',
    description: 'Broken video link on SRSA website.',
    actionsLog: [],
    reportedBy: 'Internal Audit',
  }
];

export const getTickets = (): Ticket[] => {
  return JSON.parse(JSON.stringify(tickets)).map((ticket: Ticket) => ({
    ...ticket,
    receivedAt: new Date(ticket.receivedAt),
    startedProcessingAt: ticket.startedProcessingAt ? new Date(ticket.startedProcessingAt) : null,
    closedAt: ticket.closedAt ? new Date(ticket.closedAt) : null,
    actionsLog: ticket.actionsLog.map(log => ({...log, timestamp: new Date(log.timestamp)}))
  }));
};

export const getTicketById = (id: string): Ticket | undefined => {
  const ticket = tickets.find(t => t.id === id);
  if (!ticket) return undefined;
  // Deep clone and parse dates
  const clonedTicket = JSON.parse(JSON.stringify(ticket));
  return {
    ...clonedTicket,
    receivedAt: new Date(clonedTicket.receivedAt),
    startedProcessingAt: clonedTicket.startedProcessingAt ? new Date(clonedTicket.startedProcessingAt) : null,
    closedAt: clonedTicket.closedAt ? new Date(clonedTicket.closedAt) : null,
    actionsLog: clonedTicket.actionsLog.map((log: TicketAction) => ({...log, timestamp: new Date(log.timestamp)}))
  };
};

// Helper function to generate the next serial number
const generateNextSerialNumber = (material: MediaMaterial, plat: Platform): string => {
  const materialCode = mediaMaterialToCode[material] || 'Z'; // Default to 'Z' if somehow unknown
  const platformCode = platformToCode[plat] || 'Y'; // Default to 'Y' if somehow unknown
  const prefix = `BDM-${materialCode}${platformCode}`;

  const existingSerialsForPrefix = tickets
    .filter(t => t.serialNumber.startsWith(prefix))
    .map(t => {
      const numericPart = t.serialNumber.substring(prefix.length);
      return parseInt(numericPart, 10);
    })
    .filter(num => !isNaN(num));

  const maxNumber = existingSerialsForPrefix.length > 0 ? Math.max(...existingSerialsForPrefix) : 0;
  const nextNumber = maxNumber + 1;
  
  return `${prefix}${String(nextNumber).padStart(4, '0')}`;
};


export const addTicket = (ticketData: Omit<Ticket, 'id' | 'serialNumber' | 'receivedAt' | 'status' | 'actionsLog'>): Ticket => {
  const newTicket: Ticket = {
    id: String(tickets.length + 1 + Math.random()), 
    serialNumber: generateNextSerialNumber(ticketData.mediaMaterial, ticketData.platform), 
    receivedAt: new Date(),
    status: 'New',
    actionsLog: [],
    mediaMaterial: ticketData.mediaMaterial,
    platform: ticketData.platform,
    description: ticketData.description,
    reportedBy: ticketData.reportedBy,
    issueLink: ticketData.issueLink || null,
    screenshotLink: ticketData.screenshotLink || null,
    otherMediaMaterial: ticketData.mediaMaterial === 'Other' ? ticketData.otherMediaMaterial : null,
    otherPlatform: ticketData.platform === 'Other' ? ticketData.otherPlatform : null,
  };
  tickets.unshift(newTicket); 
  
  const clonedNewTicket = JSON.parse(JSON.stringify(newTicket));
  return {
    ...clonedNewTicket,
    receivedAt: new Date(clonedNewTicket.receivedAt),
    startedProcessingAt: clonedNewTicket.startedProcessingAt ? new Date(clonedNewTicket.startedProcessingAt) : null,
    closedAt: clonedNewTicket.closedAt ? new Date(clonedNewTicket.closedAt) : null,
    actionsLog: clonedNewTicket.actionsLog.map((log: TicketAction) => ({...log, timestamp: new Date(log.timestamp)}))
  };
};

export const updateTicketStatus = (id: string, status: TicketStatus, actionDescription?: string): Ticket | undefined => {
  const ticketIndex = tickets.findIndex(t => t.id === id);
  if (ticketIndex === -1) return undefined;

  const updatedTicket = { ...JSON.parse(JSON.stringify(tickets[ticketIndex])) };
  
  updatedTicket.status = status;

  const actionLogEntry: TicketAction = {
    timestamp: new Date(),
    description: actionDescription || `Status updated to ${status}`,
    user: 'System User' 
  };

  if (status === 'Processing' && !updatedTicket.startedProcessingAt) {
    updatedTicket.startedProcessingAt = new Date();
    actionLogEntry.description = actionDescription || `Ticket processing started. Status: ${status}`;
  } else if (status === 'Closed') {
    updatedTicket.closedAt = new Date();
     actionLogEntry.description = actionDescription || `Ticket closed. Status: ${status}`;
  }
  
  updatedTicket.actionsLog = [...updatedTicket.actionsLog, actionLogEntry];
  tickets[ticketIndex] = updatedTicket;
  
  return {
    ...updatedTicket,
    receivedAt: new Date(updatedTicket.receivedAt),
    startedProcessingAt: updatedTicket.startedProcessingAt ? new Date(updatedTicket.startedProcessingAt) : null,
    closedAt: updatedTicket.closedAt ? new Date(updatedTicket.closedAt) : null,
    actionsLog: updatedTicket.actionsLog.map((log: TicketAction) => ({...log, timestamp: new Date(log.timestamp)}))
  };
};

export const addTicketAction = (id: string, description: string, user: string): Ticket | undefined => {
  const ticketIndex = tickets.findIndex(t => t.id === id);
  if (ticketIndex === -1) return undefined;

  const newAction: TicketAction = {
    timestamp: new Date(),
    description,
    user,
  };
  
  const updatedTicket = { ...JSON.parse(JSON.stringify(tickets[ticketIndex])) };
  updatedTicket.actionsLog.push(newAction);
  tickets[ticketIndex] = updatedTicket;
  
  return {
    ...updatedTicket,
    receivedAt: new Date(updatedTicket.receivedAt),
    startedProcessingAt: updatedTicket.startedProcessingAt ? new Date(updatedTicket.startedProcessingAt) : null,
    closedAt: updatedTicket.closedAt ? new Date(updatedTicket.closedAt) : null,
    actionsLog: updatedTicket.actionsLog.map((log: TicketAction) => ({...log, timestamp: new Date(log.timestamp)}))
  };
};

export const calculateAverageProcessingTime = (allTickets: Ticket[]): string => {
  const processingTickets = allTickets.filter(t => t.startedProcessingAt && t.status !== 'New');
  if (processingTickets.length === 0) return 'N/A';

  const totalProcessingTime = processingTickets.reduce((sum, t) => {
    if (t.startedProcessingAt) { 
      const receivedAtTime = t.receivedAt instanceof Date ? t.receivedAt.getTime() : new Date(t.receivedAt).getTime();
      const startedProcessingAtTime = t.startedProcessingAt instanceof Date ? t.startedProcessingAt.getTime() : new Date(t.startedProcessingAt).getTime();
      return sum + (startedProcessingAtTime - receivedAtTime);
    }
    return sum;
  }, 0);
  
  const avgTimeMs = totalProcessingTime / processingTickets.length;
  return formatDuration(avgTimeMs);
};

export const calculateAverageResolutionTime = (allTickets: Ticket[]): string => {
  const resolvedTickets = allTickets.filter(t => t.status === 'Closed' && t.closedAt);
  if (resolvedTickets.length === 0) return 'N/A';
  
  const totalResolutionTime = resolvedTickets.reduce((sum, t) => {
    if (t.closedAt) { 
        const receivedAtTime = t.receivedAt instanceof Date ? t.receivedAt.getTime() : new Date(t.receivedAt).getTime();
        const closedAtTime = t.closedAt instanceof Date ? t.closedAt.getTime() : new Date(t.closedAt).getTime();
        return sum + (closedAtTime - receivedAtTime);
    }
    return sum;
  }, 0);

  const avgTimeMs = totalResolutionTime / resolvedTickets.length;
  return formatDuration(avgTimeMs);
};

const formatDuration = (ms: number): string => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  let duration = '';
  if (days > 0) duration += `${days}d `;
  if (hours > 0) duration += `${hours}h `;
  if (minutes > 0) duration += `${minutes}m `;
  if (seconds > 0 || duration === '') duration += `${seconds}s`;
  
  return duration.trim() || '0s';
};

// Initialize with some data for demonstration
if (tickets.length === 0) {
  // This block is currently not hit due to pre-defined tickets array.
}

