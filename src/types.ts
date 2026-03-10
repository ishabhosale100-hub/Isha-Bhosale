export const TRANSLATIONS: Record<Language, Translation> = {
  en: {
    hub: 'Investigation Hub',
    searchPlaceholder: 'Search name, ID, location...',
    network: 'Network Intelligence',
    authorize: 'AUTHORIZE ACCESS',
    officerId: 'Officer ID',
    accessKey: 'Access Key',
    open: 'Open',
    closed: 'Closed',
    halted: 'Halted',
    profile: 'Criminal Profile',
    calls: 'Call Log Analysis',
    linking: 'Cross-Linking',
    video: 'Video Hub',
    evidence: 'Evidence Repository',
    timeline: 'Case Timeline',
    learning: 'Learning Section',
    messages: 'Message Transcription',
    crossCase: 'Cross-Case Analysis',
    analysis: 'Case Analysis',
  },
  hi: {
    hub: 'जांच केंद्र',
    searchPlaceholder: 'नाम, आईडी, स्थान खोजें...',
    network: 'नेटवर्क इंटेलिजेंस',
    authorize: 'पहुंच अधिकृत करें',
    officerId: 'अधिकारी आईडी',
    accessKey: 'एक्सेस की',
    open: 'खुला',
    closed: 'बंद',
    halted: 'रुका हुआ',
    profile: 'आपराधिक प्रोफ़ाइल',
    calls: 'कॉल लॉग विश्लेषण',
    linking: 'क्रॉस-लिंकिंग',
    video: 'वीडियो हब',
    evidence: 'साक्ष्य भंडार',
    timeline: 'मामला समयरेखा',
    learning: 'सीखने का अनुभाग',
    messages: 'संदेश प्रतिलेखन',
    crossCase: 'क्रॉस-केस विश्लेषण',
    analysis: 'केस विश्लेषण',
  },
  mr: {
    hub: 'तपास केंद्र',
    searchPlaceholder: 'नाव, आयडी, ठिकाण शोधा...',
    network: 'नेटवर्क इंटेलिजेंस',
    authorize: 'प्रवेश अधिकृत करा',
    officerId: 'अधिकारी आयडी',
    accessKey: 'एक्सेस की',
    open: 'सुरू',
    closed: 'पूर्ण',
    halted: 'थांबवलेले',
    profile: 'गुन्हेगारी प्रोफाइल',
    calls: 'कॉल लॉग विश्लेषण',
    linking: 'क्रॉस-लिंकिंग',
    video: 'व्हिडिओ हब',
    evidence: 'पुरावा भांडार',
    timeline: 'प्रकरण कालमर्यादा',
    learning: 'शिक्षण विभाग',
    messages: 'संदेश प्रतिलेखन',
    crossCase: 'क्रॉस-केस विश्लेषण',
    analysis: 'केस विश्लेषण',
  }
};

export interface Translation {
  hub: string;
  searchPlaceholder: string;
  network: string;
  authorize: string;
  officerId: string;
  accessKey: string;
  open: string;
  closed: string;
  halted: string;
  profile: string;
  calls: string;
  linking: string;
  video: string;
  evidence: string;
  timeline: string;
  learning: string;
  messages: string;
  crossCase: string;
  analysis: string;
}

export type CaseStatus = 'Open' | 'Closed' | 'Halted';
export type Language = 'en' | 'hi' | 'mr';

export interface TimelineEvent {
  date: string;
  time: string;
  title: string;
  description: string;
  type: 'Evidence' | 'Interrogation' | 'Incident' | 'Lead';
}

export interface NetworkNode {
  id: string;
  name: string;
  type: 'Suspect' | 'Associate' | 'Location' | 'Case' | 'Gang' | 'Evidence';
  group: number;
}

export interface NetworkLink {
  source: string;
  target: string;
  label: string;
}

export interface CriminalProfile {
  id: string;
  name: string;
  photo: string;
  aliases: string[];
  records: string[];
  pastCases: string[];
  punishments: string[];
  associates: string[];
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  weaponOfChoice: string;
  modusOperandi: string;
  gangAffiliation?: string;
  lastActiveLocation?: {
    name: string;
    lat: number;
    lng: number;
    timestamp: string;
  };
  // Enhanced Learning Section Fields
  psychologicalAssessment?: {
    traits: string[];
    summary: string;
    riskFactors: string[];
  };
  rehabilitationProgress?: {
    status: 'Not Started' | 'In Progress' | 'Completed' | 'Failed';
    notes: string;
    lastAssessmentDate: string;
  };
  behavioralInfo?: string;
  backgroundInfo?: string;
}

export interface CallLog {
  id: string;
  number: string;
  name?: string;
  duration: string;
  timestamp: string;
  location: string;
  lat: number;
  lng: number;
  recordingUrl?: string;
  summary?: string;
  frequency: number; // Number of times contacted
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  translatedContent?: string;
  slangMeaning?: string; // For criminal language to simple language
  language: string;
  timestamp: string;
}

export interface Evidence {
  id: string;
  name: string;
  type: 'Document' | 'Image' | 'Audio' | 'Physical' | 'Digital';
  date: string;
  aiSummary: string;
  analysis: string;
  importance: 'High' | 'Medium' | 'Low';
  fileUrl?: string;
  collectedBy: string;
  locationFound: string;
  tags: string[];
  fileSize?: string;
}

export interface Strategy {
  officerName: string;
  officerRole: string;
  officerPhoto: string;
  strategy: string;
  mistakes: string;
  improvements: string;
  caseStudy: string;
  focusPoints: { label: string; value: number; color: string }[];
}

export interface VoiceNote {
  id: string;
  moduleId: string;
  timestamp: string;
  audioUrl: string;
  duration: string;
}

export interface Case {
  id: string;
  title: string;
  status: CaseStatus;
  description: string;
  lastUpdated: string;
  location: string;
  suspect: CriminalProfile;
  suspectIds: string[]; // Linked criminal profile IDs
  callLogs: CallLog[];
  linkedCases: string[];
  videos: { title: string; url: string; type: string; thumbnail: string }[];
  evidence: Evidence[];
  lessons: { mistake: string; lesson: string; bestPractice: string }[];
  timeline: TimelineEvent[];
  messages: Message[];
  knowledgeBase: Strategy[];
  resolutionDetails?: string; // For closed cases
  resolutionNotes?: string; // Detailed resolution notes
  closureDate?: string; // Date of closure
  haltReason?: string; // For halted cases
  detailedAnalysis?: string; // For closed/halted cases
}

export interface CrossCasePattern {
  id: string;
  title: string;
  description: string;
  involvedCases: string[];
  confidence: number;
  type: 'Modus Operandi' | 'Geographic' | 'Associate' | 'Weapon';
}

export interface AISuggestedLink {
  id: string;
  caseA: string;
  caseB: string;
  reason: string;
  similarityScore: number;
  factors: ('MO' | 'Location' | 'Associate' | 'Weapon')[];
}
