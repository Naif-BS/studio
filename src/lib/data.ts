
import type { Ticket, TicketStatus, MediaMaterial, Platform, TicketAction } from '@/types';

const mediaMaterialToCode: Record<MediaMaterial, string> = {
  'Press Release': 'P',
  'Legal Document': 'L',
  'Infographic': 'F',
  'Image': 'M',
  'Video Clip': 'V',
  'Audio Clip': 'A',
  'GIF': 'G',
  'Other': 'Z',
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
  'Other': 'Y',
};

let tickets: Ticket[] = [
  {
    id: '1',
    serialNumber: 'BDM-VN0001',
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
    serialNumber: 'BDM-PC0001',
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
    serialNumber: 'BDM-FX0001',
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
    serialNumber: 'BDM-MI0001',
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
    serialNumber: 'BDM-AT0001',
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
    serialNumber: 'BDM-ZY0001',
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
    serialNumber: 'BDM-LU0001',
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
    serialNumber: 'BDM-VS0001',
    receivedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    status: 'New',
    mediaMaterial: 'Video Clip',
    platform: 'SRSA Website',
    issueLink: 'https://srsa.gov.sa/videos/promo_vid_error',
    description: 'Broken video link on SRSA website.',
    actionsLog: [],
    reportedBy: 'Internal Audit',
  },
  // New dummy data starts here
  {
    id: '9',
    serialNumber: 'BDM-PC0002', // Press Release, Local Channel
    receivedAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    startedProcessingAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    status: 'Processing',
    mediaMaterial: 'Press Release',
    platform: 'Local Media Channel/Platform',
    issueLink: 'https://localnews.com/urgent_update',
    description: 'Fact-checking a rapidly spreading local news item.',
    actionsLog: [
      { timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000), description: 'Initial assessment complete.', user: 'Analyst 1' },
    ],
    reportedBy: 'User G',
  },
  {
    id: '10',
    serialNumber: 'BDM-MK0001', // Image, LinkedIn
    receivedAt: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
    startedProcessingAt: new Date(Date.now() - 70 * 60 * 60 * 1000),
    closedAt: new Date(Date.now() - 68 * 60 * 60 * 1000),
    status: 'Closed',
    mediaMaterial: 'Image',
    platform: 'SRSA Account on LinkedIn',
    screenshotLink: 'https://placehold.co/800x450.png',
    description: 'Image used without proper attribution on LinkedIn post.',
    actionsLog: [
      { timestamp: new Date(Date.now() - 70 * 60 * 60 * 1000), description: 'Confirmed improper usage.', user: 'Analyst 2' },
      { timestamp: new Date(Date.now() - 68 * 60 * 60 * 1000), description: 'Contacted poster, image removed. Resolved.', user: 'Analyst 2' },
    ],
    reportedBy: 'User H',
  },
  {
    id: '11',
    serialNumber: 'BDM-FP0001', // Infographic, Unified Platform
    receivedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    status: 'New',
    mediaMaterial: 'Infographic',
    platform: 'Unified Platform',
    issueLink: 'https://unifiedplatform.gov/stats_error',
    description: 'Potential error in data presented in an official infographic.',
    actionsLog: [],
    reportedBy: 'User I',
  },
  {
    id: '12',
    serialNumber: 'BDM-AN0001', // Audio, International
    receivedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    startedProcessingAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    status: 'Processing',
    mediaMaterial: 'Audio Clip',
    platform: 'International Media Channel/Platform',
    issueLink: 'https://podcastplatform.com/episode123?t=30m5s',
    description: 'Misinformation segment in an international podcast.',
    actionsLog: [
      { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 600000), description: 'Transcribing relevant audio segment.', user: 'Analyst 3' },
    ],
    reportedBy: 'User J',
  },
  {
    id: '13',
    serialNumber: 'BDM-GS0001', // GIF, SRSA Website
    receivedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: 'New',
    mediaMaterial: 'GIF',
    platform: 'SRSA Website',
    issueLink: 'https://srsa.gov.sa/animated_explainer_flicker',
    description: 'Accessibility issue: Flickering GIF on main page causing discomfort.',
    actionsLog: [],
    reportedBy: 'Accessibility Team',
  },
  {
    id: '14',
    serialNumber: 'BDM-LX0001', // Legal Document, Platform X
    receivedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    startedProcessingAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    closedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    status: 'Closed',
    mediaMaterial: 'Legal Document',
    platform: 'SRSA Account on Platform X',
    issueLink: 'https://x.com/srsalegal/doc_summary_incorrect',
    description: 'Incorrect summary of a legal document shared.',
    actionsLog: [
      { timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), description: 'Reviewed document and summary.', user: 'Legal Team' },
      { timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), description: 'Correction issued. Post updated.', user: 'Comms Team' },
    ],
    reportedBy: 'Legal Department',
  },
  {
    id: '15',
    serialNumber: 'BDM-VC0001', // Video Clip, Local Media
    receivedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    status: 'New',
    mediaMaterial: 'Video Clip',
    platform: 'Local Media Channel/Platform',
    issueLink: 'https://localbroadcast.tv/clip_qanda',
    description: 'Sensitive information potentially revealed in a Q&A session.',
    actionsLog: [],
    reportedBy: 'PR Team',
  },
  {
    id: '16',
    serialNumber: 'BDM-PS0001', // Press Release, SRSA Website
    receivedAt: new Date(Date.now() - 26 * 60 * 60 * 1000), // 26 hours ago
    startedProcessingAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
    status: 'Processing',
    mediaMaterial: 'Press Release',
    platform: 'SRSA Website',
    issueLink: 'https://srsa.gov.sa/news/typo_in_release',
    description: 'Minor typo found in recently published press release.',
    actionsLog: [
      { timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000), description: 'Typo confirmed by editor.', user: 'Editor' },
    ],
    reportedBy: 'Internal Review',
  },
  {
    id: '17',
    serialNumber: 'BDM-FU0001', // Infographic, Umm Al-Qura
    receivedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
    startedProcessingAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    closedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: 'Closed',
    mediaMaterial: 'Infographic',
    platform: 'Umm Al-Qura Newspaper',
    description: 'Archived: Infographic related to past event, no issues.',
    actionsLog: [
       { timestamp: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000), description: 'Routine archival review.', user: 'Archivist' },
       { timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), description: 'Confirmed for archival. Closed.', user: 'Archivist' },
    ],
    reportedBy: 'System Archive Task',
  },
  {
    id: '18',
    serialNumber: 'BDM-VT0001', // Video Clip, TikTok
    receivedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    status: 'New',
    mediaMaterial: 'Video Clip',
    platform: 'SRSA Account on TikTok',
    screenshotLink: 'https://placehold.co/300x600.png',
    description: 'User comment on TikTok video requires moderation.',
    actionsLog: [],
    reportedBy: 'Social Media Team',
  },
  {
    id: '19',
    serialNumber: 'BDM-ZI0001', // Other, Instagram
    receivedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    startedProcessingAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
    closedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    status: 'Closed',
    mediaMaterial: 'Other',
    otherMediaMaterial: 'User Story Highlight',
    platform: 'SRSA Account on Instagram',
    description: 'Review of outdated Instagram story highlight. Removed.',
    actionsLog: [
        { timestamp: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), description: 'Content identified as outdated.', user: 'Content Manager' },
        { timestamp: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), description: 'Highlight removed from profile. Resolved.', user: 'Content Manager' },
    ],
    reportedBy: 'Content Audit',
  },
  {
    id: '20',
    serialNumber: 'BDM-MY0001', // Image, Other Platform
    receivedAt: new Date(Date.now() - 90 * 60 * 1000), // 1.5 hours ago
    status: 'New',
    mediaMaterial: 'Image',
    platform: 'Other',
    otherPlatform: 'Regional Forum Website',
    issueLink: 'https://regionalforum.org/gallery/image_srsa_uncredited',
    description: 'SRSA image used on external forum gallery without credit.',
    actionsLog: [],
    reportedBy: 'Partnerships Team',
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
  const clonedTicket = JSON.parse(JSON.stringify(ticket));
  return {
    ...clonedTicket,
    receivedAt: new Date(clonedTicket.receivedAt),
    startedProcessingAt: clonedTicket.startedProcessingAt ? new Date(clonedTicket.startedProcessingAt) : null,
    closedAt: clonedTicket.closedAt ? new Date(clonedTicket.closedAt) : null,
    actionsLog: clonedTicket.actionsLog.map((log: TicketAction) => ({...log, timestamp: new Date(log.timestamp)}))
  };
};

const generateNextSerialNumber = (material: MediaMaterial, plat: Platform): string => {
  const materialCode = mediaMaterialToCode[material] || 'Z';
  const platformCode = platformToCode[plat] || 'Y';
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
    actionLogEntry.description = actionDescription || `Incident processing started. Status: ${status}`;
  } else if (status === 'Closed') {
    updatedTicket.closedAt = new Date();
     actionLogEntry.description = actionDescription || `Incident resolved. Status: ${status}`;
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
  if (ms < 0) ms = 0; // Ensure duration is not negative
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  let duration = '';
  if (days > 0) duration += `${days}d `;
  if (hours > 0) duration += `${hours}h `;
  if (minutes > 0) duration += `${minutes}m `;
  if (seconds >= 0 && (duration === '' || days > 0 || hours > 0 || minutes > 0 )) { // Show seconds if it's the only unit or if other units are present.
      duration += `${seconds}s`;
  }
  
  return duration.trim() || '0s'; // Default to 0s if all are zero.
};
