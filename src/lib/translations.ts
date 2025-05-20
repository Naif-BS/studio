
// @ts-nocheck
// Using @ts-nocheck temporarily as this file will grow significantly
// and managing precise types for a deep translation object can be complex
// for this prototyping phase. A more robust i18n solution would handle this.

export type TranslationKey = string; // More specific keys can be defined later

export interface Translations {
  [lang: string]: {
    [key: TranslationKey]: string | { [subKey: string]: string };
  };
}

export const translations: Translations = {
  en: {
    // General
    mediaScope: "MediaScope",
    loading: "Loading...",
    actions: "Actions",
    status: "Status",
    description: "Description",
    platform: "Platform",
    mediaMaterial: "Media Material",
    received: "Received",
    search: "Search",
    searchByKeyword: "Search by keyword, ID...",
    anyStatus: "Any Status",
    anyMaterial: "Any Material",
    anyPlatform: "Any Platform",
    clearFilters: "Clear Filters",
    view: "View",
    submit: "Submit",
    totalTickets: "Total Tickets",
    newTickets: "New Tickets",
    processingTickets: "Processing Tickets",
    closedTickets: "Closed Tickets",
    avgProcessingTime: "Avg. Processing Start Time",
    avgProcessingTimeDesc: "From receipt to start",
    avgResolutionTime: "Avg. Resolution Time",
    avgResolutionTimeDesc: "From receipt to close",
    noTicketsFound: "No tickets found.",
    noTicketsFoundDesc: "There are no tickets matching the current criteria.",
    selectPlaceholder: "Select...",
    save: "Save",
    cancel: "Cancel",
    other: "Other",

    // Login Page
    login: {
      title: "MediaScope",
      description: "Sign in with your Outlook account",
      signInWithOutlook: "Sign in with Outlook",
    },

    // Header
    header: {
      toggleLanguage: "Toggle Language",
      profile: "Profile",
      settings: "Settings",
      logout: "Log out",
    },

    // Sidebar
    sidebar: {
      dashboard: "Dashboard",
      logbook: "Logbook",
      operationRoom: "Operation Room",
      reportIncident: "Report Incident",
      copyright: `© ${new Date().getFullYear()} MediaScope`,
    },

    // Dashboard Page
    dashboard: {
      title: "Dashboard Overview",
      recentTicketsActivity: "Recent Tickets Activity",
    },

    // Logbook Page
    logbook: {
      title: "Media Logbook",
    },

    // Operation Room Page
    operationRoom: {
      title: "Operation Room",
      ticketsQueue: "Tickets Queue",
      ticketDetails: "Ticket Details",
      noTicketSelected: "No ticket selected.",
      noTicketSelectedDesc: "Please select a ticket from the list to view its details and take action.",
    },

    // Report Incident Page
    reportIncident: {
      title: "Report New Incident",
    },

    // Ticket Form
    ticketForm: {
      mediaMaterialLabel: "Media Material",
      specifyOtherMediaMaterialLabel: "Specify Other Media Material",
      platformLabel: "Platform of Observation",
      specifyOtherPlatformLabel: "Specify Other Platform",
      issueLinkLabel: "Link to Issue (Optional)",
      screenshotLinkLabel: "Screenshot Link (Optional)",
      descriptionLabel: "Description of Incident",
      selectMediaMaterialPlaceholder: "Select media material",
      selectPlatformPlaceholder: "Select platform",
      submitButton: "Submit Report",
      descriptionPlaceholder: "Provide a detailed description of the incident...",
      otherMediaPlaceholder: "e.g., Podcast Series",
      otherPlatformPlaceholder: "e.g., Specific App Name",
      issueLinkPlaceholder: "https://example.com/issue",
      screenshotLinkPlaceholder: "https://example.com/screenshot.png",
    },
    
    // Ticket Details Card
    ticketDetailsCard: {
        incidentDetails: "Incident Details",
        actionsLog: "Actions Log",
        updateTicket: "Update Ticket",
        changeStatus: "Change Status",
        logAction: "Log Action",
        updateStatusButton: "Update Status",
        updatingStatusButton: "Updating...",
        addActionToLogButton: "Add Action to Log",
        noActionsLogged: "No actions logged yet.",
        receivedBy: "Received: {date} by {user}", // Example with placeholder
        closedOn: "Closed on: {date}",
        issueLink: "Issue Link:",
        screenshot: "Screenshot:",
        viewScreenshot: "View Screenshot",
        logActionPlaceholder: "Log actions taken for this ticket...",
    },

    // Ticket Status Badge
    ticketStatus: {
      new: "New",
      processing: "Processing",
      closed: "Closed",
      unknown: "Unknown",
    },
    
    // Media Materials (for select options)
    mediaMaterialOptions: {
        video: 'Video',
        article: 'Article',
        socialMediaPost: 'Social Media Post',
        image: 'Image',
        audio: 'Audio',
        other: 'Other',
    },

    // Platforms (for select options)
    platformOptions: {
        facebook: 'Facebook',
        xTwitter: 'X (Twitter)',
        instagram: 'Instagram',
        tiktok: 'TikTok',
        youtube: 'YouTube',
        newsSite: 'News Site',
        blog: 'Blog',
        forum: 'Forum',
        other: 'Other',
    },

    // Pagination
    pagination: {
        previous: "Previous",
        next: "Next",
        morePages: "More pages",
    },
  },
  ar: {
    // General
    mediaScope: "ميديا سكوب",
    loading: "جاري التحميل...",
    actions: "الإجراءات",
    status: "الحالة",
    description: "الوصف",
    platform: "المنصة",
    mediaMaterial: "نوع المادة الإعلامية",
    received: "تم الاستلام",
    search: "بحث",
    searchByKeyword: "ابحث بالكلمة المفتاحية, المعرف...",
    anyStatus: "أي حالة",
    anyMaterial: "أي مادة",
    anyPlatform: "أي منصة",
    clearFilters: "مسح الفلاتر",
    view: "عرض",
    submit: "إرسال",
    totalTickets: "إجمالي التذاكر",
    newTickets: "تذاكر جديدة",
    processingTickets: "تذاكر قيد المعالجة",
    closedTickets: "تذاكر مغلقة",
    avgProcessingTime: "متوسط وقت بدء المعالجة",
    avgProcessingTimeDesc: "من الاستلام إلى البدء",
    avgResolutionTime: "متوسط وقت الحل",
    avgResolutionTimeDesc: "من الاستلام إلى الإغلاق",
    noTicketsFound: "لم يتم العثور على تذاكر.",
    noTicketsFoundDesc: "لا توجد تذاكر تطابق المعايير الحالية.",
    selectPlaceholder: "اختر...",
    save: "حفظ",
    cancel: "إلغاء",
    other: "أخرى",

    // Login Page
    login: {
      title: "ميديا سكوب",
      description: "سجل الدخول باستخدام حساب Outlook الخاص بك",
      signInWithOutlook: "تسجيل الدخول باستخدام Outlook",
    },

    // Header
    header: {
      toggleLanguage: "تبديل اللغة",
      profile: "الملف الشخصي",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",
    },

    // Sidebar
    sidebar: {
      dashboard: "لوحة التحكم",
      logbook: "السجل",
      operationRoom: "غرفة العمليات",
      reportIncident: "الإبلاغ عن حادثة",
      copyright: `© ${new Date().getFullYear()} ميديا سكوب`,
    },

    // Dashboard Page
    dashboard: {
      title: "نظرة عامة على لوحة التحكم",
      recentTicketsActivity: "نشاط التذاكر الأخير",
    },

    // Logbook Page
    logbook: {
      title: "سجل الوسائط",
    },

    // Operation Room Page
    operationRoom: {
      title: "غرفة العمليات",
      ticketsQueue: "قائمة انتظار التذاكر",
      ticketDetails: "تفاصيل التذكرة",
      noTicketSelected: "لم يتم تحديد تذكرة.",
      noTicketSelectedDesc: "يرجى تحديد تذكرة من القائمة لعرض تفاصيلها واتخاذ إجراء.",
    },

    // Report Incident Page
    reportIncident: {
      title: "الإبلاغ عن حادثة جديدة",
    },

    // Ticket Form
    ticketForm: {
      mediaMaterialLabel: "نوع المادة الإعلامية",
      specifyOtherMediaMaterialLabel: "حدد نوع المادة الإعلامية الأخرى",
      platformLabel: "منصة الملاحظة",
      specifyOtherPlatformLabel: "حدد المنصة الأخرى",
      issueLinkLabel: "رابط المشكلة (اختياري)",
      screenshotLinkLabel: "رابط لقطة الشاشة (اختياري)",
      descriptionLabel: "وصف الحادثة",
      selectMediaMaterialPlaceholder: "اختر نوع المادة الإعلامية",
      selectPlatformPlaceholder: "اختر المنصة",
      submitButton: "إرسال البلاغ",
      descriptionPlaceholder: "قدم وصفًا تفصيليًا للحادثة...",
      otherMediaPlaceholder: "مثال: سلسلة بودكاست",
      otherPlatformPlaceholder: "مثال: اسم تطبيق معين",
      issueLinkPlaceholder: "https://example.com/issue",
      screenshotLinkPlaceholder: "https://example.com/screenshot.png",
    },
    
    // Ticket Details Card
    ticketDetailsCard: {
        incidentDetails: "تفاصيل الحادثة",
        actionsLog: "سجل الإجراءات",
        updateTicket: "تحديث التذكرة",
        changeStatus: "تغيير الحالة",
        logAction: "تسجيل إجراء",
        updateStatusButton: "تحديث الحالة",
        updatingStatusButton: "جاري التحديث...",
        addActionToLogButton: "إضافة إجراء للسجل",
        noActionsLogged: "لا توجد إجراءات مسجلة بعد.",
        receivedBy: "تم الاستلام: {date} بواسطة {user}",
        closedOn: "أُغلقت في: {date}",
        issueLink: "رابط المشكلة:",
        screenshot: "لقطة شاشة:",
        viewScreenshot: "عرض لقطة الشاشة",
        logActionPlaceholder: "سجل الإجراءات المتخذة لهذه التذكرة...",
    },
    
    // Ticket Status Badge
    ticketStatus: {
      new: "جديدة",
      processing: "قيد المعالجة",
      closed: "مغلقة",
      unknown: "غير معروفة",
    },
    
    // Media Materials (for select options) - these are for display text
    mediaMaterialOptions: {
        video: 'فيديو',
        article: 'مقال',
        socialMediaPost: 'منشور تواصل اجتماعي',
        image: 'صورة',
        audio: 'صوت',
        other: 'أخرى',
    },

    // Platforms (for select options) - these are for display text
    platformOptions: {
        facebook: 'فيسبوك',
        xTwitter: 'إكس (تويتر سابقًا)',
        instagram: 'إنستغرام',
        tiktok: 'تيك توك',
        youtube: 'يوتيوب',
        newsSite: 'موقع إخباري',
        blog: 'مدونة',
        forum: 'منتدى',
        other: 'أخرى',
    },

    // Pagination
    pagination: {
        previous: "السابق",
        next: "التالي",
        morePages: "المزيد من الصفحات",
    },
  },
};

// Helper function to get nested keys like "login.title"
export const getTranslationValue = (obj: any, path: string, lang: string): string => {
  const keys = path.split('.');
  let current = obj[lang];
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      // Fallback to English if translation not found in current language, then to key itself
      current = obj['en'];
      for (const enKey of keys) {
          if (current && typeof current === 'object' && enKey in current) {
              current = current[enKey];
          } else {
              return path; // Return the key if not found in English either
          }
      }
      // If found in English, return it
      if (typeof current === 'string') return current;
      return path;
    }
  }
  return typeof current === 'string' ? current : path;
};
