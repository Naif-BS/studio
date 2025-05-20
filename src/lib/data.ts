
import type { Ticket, TicketStatus, MediaMaterial, Platform, TicketAction } from '@/types';

let tickets: Ticket[] = [
  {
    id: '1',
    serialNumber: `MS-${Date.now() - 5 * 24 * 60 * 60 * 1000}-A1B2C`,
    receivedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    startedProcessingAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    closedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: 'Closed',
    mediaMaterial: 'Video',
    platform: 'YouTube',
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
    serialNumber: `MS-${Date.now() - 3 * 24 * 60 * 60 * 1000}-D3E4F`,
    receivedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    startedProcessingAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: 'Processing',
    mediaMaterial: 'Article',
    platform: 'News Site',
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
    serialNumber: `MS-${Date.now() - 1 * 24 * 60 * 60 * 1000}-G5H6I`,
    receivedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: 'New',
    mediaMaterial: 'Social Media Post',
    platform: 'X (Twitter)',
    issueLink: 'https://x.com/example_post_1',
    description: 'Fake news spreading rapidly.',
    actionsLog: [],
    reportedBy: 'User C',
  },
  {
    id: '4',
    serialNumber: `MS-${Date.now() - 12 * 60 * 60 * 1000}-J7K8L`,
    receivedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    status: 'New',
    mediaMaterial: 'Image',
    platform: 'Instagram',
    screenshotLink: 'https://placehold.co/600x400.png',
    description: 'Copyright infringement on an image.',
    actionsLog: [],
    reportedBy: 'User D',
  },
   {
    id: '5',
    serialNumber: `MS-${Date.now() - 6 * 24 * 60 * 60 * 1000}-M9N0O`,
    receivedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    startedProcessingAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), 
    closedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), 
    status: 'Closed',
    mediaMaterial: 'Audio',
    platform: 'TikTok',
    issueLink: 'https://tiktok.com/example_audio_1',
    description: 'Unauthorized use of copyrighted music.',
    actionsLog: [
      { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), description: 'Investigation initiated.', user: 'Analyst 3' },
      { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), description: 'Takedown notice sent. Issue resolved.', user: 'Analyst 3' },
    ],
    reportedBy: 'User E',
  },
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
  return {
    ...JSON.parse(JSON.stringify(ticket)),
    receivedAt: new Date(ticket.receivedAt),
    startedProcessingAt: ticket.startedProcessingAt ? new Date(ticket.startedProcessingAt) : null,
    closedAt: ticket.closedAt ? new Date(ticket.closedAt) : null,
    actionsLog: ticket.actionsLog.map(log => ({...log, timestamp: new Date(log.timestamp)}))
  };
};

export const addTicket = (ticketData: Omit<Ticket, 'id' | 'serialNumber' | 'receivedAt' | 'status' | 'actionsLog'>): Ticket => {
  const newTicket: Ticket = {
    ...ticketData,
    id: String(tickets.length + 1),
    serialNumber: `MS-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    receivedAt: new Date(),
    status: 'New',
    actionsLog: [],
  };
  tickets.unshift(newTicket); // Add to the beginning of the array
  return {
    ...JSON.parse(JSON.stringify(newTicket)),
    receivedAt: new Date(newTicket.receivedAt),
  };
};

export const updateTicketStatus = (id: string, status: TicketStatus, actionDescription?: string): Ticket | undefined => {
  const ticketIndex = tickets.findIndex(t => t.id === id);
  if (ticketIndex === -1) return undefined;

  const updatedTicket = { ...tickets[ticketIndex] };
  updatedTicket.status = status;

  const actionLogEntry: TicketAction = {
    timestamp: new Date(),
    description: actionDescription || `Status updated to ${status}`,
    user: 'System User' // Placeholder user
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
    ...JSON.parse(JSON.stringify(updatedTicket)),
    receivedAt: new Date(updatedTicket.receivedAt),
    startedProcessingAt: updatedTicket.startedProcessingAt ? new Date(updatedTicket.startedProcessingAt) : null,
    closedAt: updatedTicket.closedAt ? new Date(updatedTicket.closedAt) : null,
    actionsLog: updatedTicket.actionsLog.map(log => ({...log, timestamp: new Date(log.timestamp)}))
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
  
  tickets[ticketIndex].actionsLog.push(newAction);
  
  const updatedTicket = tickets[ticketIndex];
  return {
    ...JSON.parse(JSON.stringify(updatedTicket)),
    receivedAt: new Date(updatedTicket.receivedAt),
    startedProcessingAt: updatedTicket.startedProcessingAt ? new Date(updatedTicket.startedProcessingAt) : null,
    closedAt: updatedTicket.closedAt ? new Date(updatedTicket.closedAt) : null,
    actionsLog: updatedTicket.actionsLog.map(log => ({...log, timestamp: new Date(log.timestamp)}))
  };
};

export const calculateAverageProcessingTime = (allTickets: Ticket[]): string => {
  const processingTickets = allTickets.filter(t => t.startedProcessingAt && t.status !== 'New');
  if (processingTickets.length === 0) return 'N/A';

  const totalProcessingTime = processingTickets.reduce((sum, t) => {
    // Ensure startedProcessingAt is not null before using it
    if (t.startedProcessingAt) {
      return sum + (t.startedProcessingAt.getTime() - t.receivedAt.getTime());
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
     // Ensure closedAt is not null
    if (t.closedAt) {
      return sum + (t.closedAt.getTime() - t.receivedAt.getTime());
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
  if (seconds > 0 || duration === '') duration += `${seconds}s`; // Show seconds if it's the only unit or primary
  
  return duration.trim() || '0s';
};

// Initialize with some data for demonstration
if (tickets.length === 0) {
  // addTicket({ mediaMaterial: 'Video', platform: 'YouTube', issueLink: 'http://example.com/video', description: 'Sample video issue', reportedBy: 'Mock User 1' });
  // addTicket({ mediaMaterial: 'Article', platform: 'News Site', issueLink: 'http://example.com/article', description: 'Sample article issue', reportedBy: 'Mock User 2' });
}
