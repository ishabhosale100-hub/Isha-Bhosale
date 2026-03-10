import { Case, NetworkNode, NetworkLink, CrossCasePattern, AISuggestedLink, CriminalProfile } from './types';

export const AI_SUGGESTED_LINKS: AISuggestedLink[] = [
  {
    id: 'SUG-001',
    caseA: 'CASE-2024-001',
    caseB: 'CASE-2024-022',
    reason: 'Both cases involve high-frequency jamming signatures and use of "Safe-Move" courier services for logistics.',
    similarityScore: 88,
    factors: ['MO', 'Location']
  },
  {
    id: 'SUG-002',
    caseA: 'CASE-2023-095',
    caseB: 'CASE-2024-001',
    reason: 'Digital footprint analysis suggests the same encrypted communication protocol was used in both the Cyber Fraud and the Midnight Heist.',
    similarityScore: 72,
    factors: ['MO', 'Associate']
  },
  {
    id: 'SUG-003',
    caseA: 'CASE-2024-015',
    caseB: 'CASE-2024-022',
    reason: 'Geographic proximity of the last known signals from both suspects indicates a shared safe-house in the Pune-Bangalore corridor.',
    similarityScore: 65,
    factors: ['Location']
  },
  {
    id: 'SUG-004',
    caseA: 'CASE-2024-005',
    caseB: 'CASE-2024-001',
    reason: 'Both cases utilize identical high-precision silent drills and custom-made lockpicks, suggesting a common equipment supplier or mentor.',
    similarityScore: 91,
    factors: ['Weapon', 'MO']
  }
];

export const CROSS_CASE_PATTERNS: CrossCasePattern[] = [
  {
    id: 'PAT-001',
    title: 'High-Frequency Jamming Signature',
    description: 'Multiple heists involving the same electronic jamming frequency (433MHz) used to disable security systems.',
    involvedCases: ['CASE-2024-001', 'CASE-2023-088'],
    confidence: 94,
    type: 'Modus Operandi'
  },
  {
    id: 'PAT-002',
    title: 'Courier Network Distribution',
    description: 'Contraband distribution pattern using "Safe-Move" courier services across Maharashtra.',
    involvedCases: ['CASE-2024-022', 'CASE-2024-009'],
    confidence: 82,
    type: 'Geographic'
  },
  {
    id: 'PAT-003',
    title: 'Shared Associate: Rahul Khanna',
    description: 'Rahul Khanna identified as a logistics provider in both jewelry heists and high-end vehicle thefts.',
    involvedCases: ['CASE-2024-001', 'CASE-2022-045'],
    confidence: 75,
    type: 'Associate'
  }
];

export const GLOBAL_NETWORK: { nodes: NetworkNode[], links: NetworkLink[] } = {
  nodes: [
    { id: 'Vikram', name: 'Vikram Singh', type: 'Suspect', group: 1 },
    { id: 'Rahul', name: 'Rahul Khanna', type: 'Associate', group: 1 },
    { id: 'Sonia', name: 'Sonia Mehra', type: 'Associate', group: 1 },
    { id: 'Anjali', name: 'Anjali Sharma', type: 'Suspect', group: 2 },
    { id: 'Karan', name: 'Karan Malhotra', type: 'Associate', group: 2 },
    { id: 'GrandPlaza', name: 'Grand Plaza', type: 'Location', group: 3 },
    { id: 'Warehouse', name: 'Old Warehouse', type: 'Location', group: 3 },
    { id: 'Case1', name: 'Midnight Heist', type: 'Case', group: 4 },
    { id: 'Case2', name: 'Cyber Fraud', type: 'Case', group: 4 },
    { id: 'GangA', name: 'Shadow Syndicate', type: 'Gang', group: 5 },
    { id: 'GangB', name: 'Byte Bandits', type: 'Gang', group: 5 },
    { id: 'EVD1', name: 'Fingerprint EVD-001', type: 'Evidence', group: 6 },
    { id: 'EVD2', name: 'Badge EVD-002', type: 'Evidence', group: 6 },
    { id: 'EVD3', name: 'Comm Log EVD-003', type: 'Evidence', group: 6 },
  ],
  links: [
    { source: 'Vikram', target: 'Rahul', label: 'Frequent Contact' },
    { source: 'Vikram', target: 'Sonia', label: 'Partner' },
    { source: 'Vikram', target: 'Case1', label: 'Primary Suspect' },
    { source: 'Rahul', target: 'Case1', label: 'Accomplice' },
    { source: 'Case1', target: 'GrandPlaza', label: 'Occurrence' },
    { source: 'Anjali', target: 'Karan', label: 'Co-conspirator' },
    { source: 'Anjali', target: 'Case2', label: 'Leader' },
    { source: 'Karan', target: 'Case2', label: 'Developer' },
    { source: 'Vikram', target: 'Anjali', label: 'Shared Contact' },
    { source: 'Vikram', target: 'GangA', label: 'Member' },
    { source: 'Anjali', target: 'GangB', label: 'Affiliate' },
    { source: 'Case1', target: 'EVD1', label: 'Evidence' },
    { source: 'Case1', target: 'EVD2', label: 'Evidence' },
    { source: 'Case1', target: 'EVD3', label: 'Evidence' },
    { source: 'Vikram', target: 'EVD1', label: 'Linked By' },
  ]
};

export const MOCK_PROFILES: CriminalProfile[] = [
  {
    id: 'PROF-001',
    name: 'Vikram "The Ghost" Singh',
    photo: 'https://picsum.photos/seed/suspect1/400/400',
    aliases: ['Ghost', 'Vicky'],
    records: ['Grand Larceny', 'Breaking and Entering'],
    pastCases: ['CASE-2022-045', 'CASE-2023-012'],
    punishments: ['3 years probation (2021)'],
    associates: ['Rahul Khanna', 'Sonia Mehra'],
    riskLevel: 'High',
    weaponOfChoice: 'Lockpicks, Silent Drills',
    modusOperandi: 'Disables security via high-frequency jammers before physical entry.',
    gangAffiliation: 'Shadow Syndicate',
    lastActiveLocation: {
      name: 'Sector 45, New Delhi',
      lat: 28.4595,
      lng: 77.0266,
      timestamp: '2024-03-08 12:00'
    },
    psychologicalAssessment: {
      traits: ['Methodical', 'Patient', 'Technologically Proficient'],
      summary: 'High intelligence with a focus on non-violent high-stakes theft. Shows signs of perfectionism.',
      riskFactors: ['Recidivism', 'Technological evolution']
    },
    rehabilitationProgress: {
      status: 'In Progress',
      notes: 'Attending mandatory counseling but remains evasive about past associates.',
      lastAssessmentDate: '2024-01-15'
    },
    behavioralInfo: 'Quiet, observant, avoids direct eye contact. Prefers working alone during the planning phase.',
    backgroundInfo: 'Former security systems engineer for a major firm. Terminated for unauthorized access to client data.'
  },
  {
    id: 'PROF-002',
    name: 'Anjali Sharma',
    photo: 'https://picsum.photos/seed/suspect2/400/400',
    aliases: ['CyberQueen'],
    records: ['Wire Fraud', 'Identity Theft'],
    pastCases: ['CASE-2021-112'],
    punishments: ['5 years imprisonment (Served)'],
    associates: ['Karan Malhotra'],
    riskLevel: 'Medium',
    weaponOfChoice: 'Malware, Social Engineering',
    modusOperandi: 'Uses fake bank portals to harvest credentials.',
    gangAffiliation: 'Byte Bandits',
    psychologicalAssessment: {
      traits: ['Manipulative', 'Charismatic', 'Risk-taker'],
      summary: 'Expert in social engineering. Views victims as numbers rather than people.',
      riskFactors: ['Financial greed', 'Digital anonymity']
    },
    rehabilitationProgress: {
      status: 'Completed',
      notes: 'Successfully completed vocational training in ethical hacking.',
      lastAssessmentDate: '2023-11-20'
    },
    behavioralInfo: 'Extremely articulate and persuasive. Can easily mimic professional personas.',
    backgroundInfo: 'Self-taught programmer from a middle-class background. Started with small-scale phishing in college.'
  },
  {
    id: 'PROF-003',
    name: 'Sameer "Sam" Khan',
    photo: 'https://picsum.photos/seed/suspect3/400/400',
    aliases: ['Sam'],
    records: ['Narcotics Possession', 'Assault'],
    pastCases: [],
    punishments: [],
    associates: ['Arjun Varma'],
    riskLevel: 'Critical',
    weaponOfChoice: 'Firearms',
    modusOperandi: 'Hides contraband in electronics shipments.',
    psychologicalAssessment: {
      traits: ['Aggressive', 'Impulsive', 'Loyal to Gang'],
      summary: 'Prone to violence when cornered. Deeply entrenched in gang culture.',
      riskFactors: ['Violence', 'Drug dependency']
    },
    rehabilitationProgress: {
      status: 'Not Started',
      notes: 'Refuses to participate in any rehabilitation programs.',
      lastAssessmentDate: '2024-02-10'
    },
    behavioralInfo: 'Volatile temperament. Uses intimidation as a primary tool.',
    backgroundInfo: 'Grew up in a high-crime neighborhood. Recruited into local gangs at a young age.'
  }
];

export const MOCK_CASES: Case[] = [
  {
    id: 'CASE-2024-001',
    title: 'The Midnight Heist',
    status: 'Open',
    description: 'Investigation into the high-profile jewelry theft at the Grand Plaza.',
    lastUpdated: '2024-03-08 14:30',
    location: 'New Delhi',
    suspect: MOCK_PROFILES[0],
    suspectIds: ['PROF-001'],
    callLogs: [
      {
        id: 'LOG-001',
        number: '+91 98765 43210',
        name: 'Rahul Khanna',
        duration: '04:12',
        timestamp: '2024-03-07 23:45',
        location: 'Sector 45, New Delhi',
        lat: 28.4595,
        lng: 77.0266,
        summary: 'Discussed meeting point near the back entrance. Mentioned "the package" is ready.',
        frequency: 45
      },
      {
        id: 'LOG-002',
        number: '+91 91234 56789',
        duration: '01:05',
        timestamp: '2024-03-08 00:15',
        location: 'Connaught Place',
        lat: 28.6304,
        lng: 77.2177,
        summary: 'Brief confirmation call. Suspect sounded hurried.',
        frequency: 12
      },
      {
        id: 'LOG-004',
        number: '+91 99999 11111',
        name: 'Sonia Mehra',
        duration: '02:30',
        timestamp: '2024-03-08 02:30',
        location: 'Hauz Khas',
        lat: 28.5494,
        lng: 77.2001,
        summary: 'Coordination for the getaway vehicle. Mentioned a black SUV.',
        frequency: 28
      },
      {
        id: 'LOG-005',
        number: '+91 98765 43210',
        name: 'Rahul Khanna',
        duration: '05:45',
        timestamp: '2024-03-08 04:00',
        location: 'Sector 45, New Delhi',
        lat: 28.4595,
        lng: 77.0266,
        summary: 'Final check before the operation. High tension detected in voice.',
        frequency: 52
      },
      {
        id: 'LOG-006',
        number: '+91 90000 00000',
        duration: '00:45',
        timestamp: '2024-03-08 06:15',
        location: 'Unknown',
        lat: 28.6139,
        lng: 77.2090,
        summary: 'Short burst of static, followed by a hang-up.',
        frequency: 5
      }
    ],
    linkedCases: ['CASE-2023-088', 'CASE-2024-005'],
    videos: [
      { title: 'CCTV Entrance Cam 4', url: 'https://www.w3schools.com/html/mov_bbb.mp4', type: 'CCTV', thumbnail: 'https://picsum.photos/seed/cctv1/320/180' },
      { title: 'Interrogation Room B', url: 'https://www.w3schools.com/html/movie.mp4', type: 'Interrogation', thumbnail: 'https://picsum.photos/seed/inter1/320/180' }
    ],
    evidence: [
      { 
        id: 'EVD-001',
        name: 'Fingerprint Scan - Display Case', 
        type: 'Digital', 
        date: '2024-03-08',
        aiSummary: 'Partial match found for Vikram Singh on the glass surface. High confidence (92%).',
        analysis: 'The fingerprint was found on the interior side of the glass, suggesting the suspect reached inside the display after disabling the alarm. The ridge patterns match the suspect\'s left index finger stored in the national database.',
        importance: 'High',
        collectedBy: 'Forensic Expert Dr. Mehta',
        locationFound: 'Main Hall, Grand Plaza',
        tags: ['Fingerprint', 'Forensic', 'High-Confidence'],
        fileSize: '2.4 MB'
      },
      { 
        id: 'EVD-002',
        name: 'Security Badge #442', 
        type: 'Physical', 
        date: '2024-03-08',
        aiSummary: 'Badge belongs to a former employee who reported it missing 2 days prior to the heist.',
        analysis: 'The badge was found near the service elevator. DNA swabs from the badge surface are being processed. Initial analysis shows traces of latex, indicating the suspect might have worn gloves but handled the badge briefly.',
        importance: 'Medium',
        collectedBy: 'Officer Rawat',
        locationFound: 'Service Elevator Area',
        tags: ['Access Card', 'DNA', 'Employee-Linked'],
        fileSize: '15 KB'
      },
      {
        id: 'EVD-003',
        name: 'Encrypted Communication Log',
        type: 'Digital',
        date: '2024-03-09',
        aiSummary: 'Intercepted messages between suspect and unknown associate using Signal-like encryption.',
        analysis: 'Decryption efforts are 60% complete. Key phrases like "the bird has flown" and "rendezvous at sector 7" have been identified. The metadata suggests the messages were sent using a burner phone registered in a fictitious name.',
        importance: 'High',
        collectedBy: 'Cyber Cell Inspector Iyer',
        locationFound: 'Digital Intercept',
        tags: ['Cyber', 'Encrypted', 'Communication'],
        fileSize: '450 KB'
      }
    ],
    lessons: [
      { 
        mistake: 'Delayed cordoning of the secondary exit.', 
        lesson: 'Always secure all perimeters within first 5 minutes.', 
        bestPractice: 'Use automated perimeter deployment protocols.' 
      }
    ],
    timeline: [
      { date: '2024-03-07', time: '23:30', title: 'Incident Occurred', description: 'Alarm triggered at Grand Plaza Jewelry section.', type: 'Incident' },
      { date: '2024-03-08', time: '01:15', title: 'First Evidence Collected', description: 'Fingerprints lifted from the main display.', type: 'Evidence' },
      { date: '2024-03-08', time: '10:00', title: 'Suspect Identified', description: 'Facial recognition matched CCTV footage to Vikram Singh.', type: 'Lead' },
    ],
    messages: [
      { 
        id: 'MSG-1', 
        sender: 'Vikram', 
        content: 'चहा गरम आहे, कप तयार ठेवा।', 
        translatedContent: 'The tea is hot, keep the cups ready.',
        slangMeaning: 'The target is ready, prepare for extraction.',
        language: 'Hindi', 
        timestamp: '2024-03-08 02:00' 
      },
      { 
        id: 'MSG-2', 
        sender: 'Associate X', 
        content: 'पाऊस पडणार आहे, छत्री सोबत ठेवा।', 
        translatedContent: 'It is going to rain, keep an umbrella.',
        slangMeaning: 'Police raid expected, stay hidden.',
        language: 'Marathi', 
        timestamp: '2024-03-08 02:15' 
      },
      { 
        id: 'MSG-3', 
        sender: 'Vikram', 
        content: 'पक्षी उडाला आहे।', 
        translatedContent: 'The bird has flown.',
        slangMeaning: 'The suspect has escaped the perimeter.',
        language: 'Hindi', 
        timestamp: '2024-03-08 02:30' 
      }
    ],
    knowledgeBase: [
      {
        officerName: 'ACP Pradyuman',
        officerRole: 'Senior Investigation Officer (Retd.)',
        officerPhoto: 'https://picsum.photos/seed/officer1/200/200',
        strategy: 'Focus on the digital footprint first. In high-stakes heists, physical evidence is often scrubbed, but digital shadows remain. I prioritized intercepting encrypted channels and cross-referencing IP addresses with known safe-houses.',
        mistakes: 'Ignored the burner phone signals initially, assuming they were noise. This allowed the suspect a 4-hour window to relocate.',
        improvements: 'Implement real-time signal triangulation for all burner phones detected within a 5km radius of the crime scene within the first hour.',
        caseStudy: 'The 2019 Bank Robbery',
        focusPoints: [
          { label: 'Digital Forensics', value: 45, color: '#10b981' },
          { label: 'Field Surveillance', value: 25, color: '#3b82f6' },
          { label: 'Interrogation', value: 20, color: '#f59e0b' },
          { label: 'Informant Network', value: 10, color: '#ef4444' }
        ]
      }
    ]
  },
  {
    id: 'CASE-2023-095',
    title: 'Cyber Fraud Syndicate',
    status: 'Closed',
    description: 'Phishing operation targeting senior citizens across multiple states.',
    lastUpdated: '2023-12-20 09:00',
    location: 'Mumbai',
    resolutionDetails: 'The primary servers were seized in a midnight raid. All 5 members were convicted with 7 years of rigorous imprisonment.',
    resolutionNotes: 'The investigation concluded after a six-month surveillance operation. Key evidence included encrypted hard drives and testimony from a former associate. The recovery of ₹4.5 Crores in stolen funds was a major success.',
    closureDate: '2023-12-15',
    detailedAnalysis: 'The syndicate used a sophisticated mesh of VPNs and proxy servers. The breakthrough came when a junior member used a personal account for a food delivery app from the same IP. Forensic analysis of the seized hardware revealed over 50,000 stolen credentials and a custom-built automated phishing toolkit.',
    suspect: MOCK_PROFILES[1],
    suspectIds: ['PROF-002'],
    callLogs: [],
    linkedCases: [],
    videos: [],
    evidence: [],
    lessons: [],
    timeline: [],
    messages: [],
    knowledgeBase: []
  },
  {
    id: 'CASE-2024-015',
    title: 'The Warehouse Disappearance',
    status: 'Halted',
    description: 'Missing person case with no physical evidence found at the last known location.',
    lastUpdated: '2024-02-15 18:20',
    location: 'Bangalore',
    haltReason: 'Insufficient forensic evidence and lack of eye-witnesses. CCTV footage from the area was corrupted.',
    detailedAnalysis: 'The case reached a stalemate after the primary witness retracted their statement under mysterious circumstances. The warehouse was thoroughly swept, but the use of industrial-grade cleaning agents destroyed any potential DNA or fingerprint evidence. Financial records of the missing person show no activity since the disappearance.',
    suspect: {
      id: 'UNKNOWN',
      name: 'Unknown Suspect',
      photo: 'https://picsum.photos/seed/unknown/400/400',
      aliases: [],
      records: [],
      pastCases: [],
      punishments: [],
      associates: [],
      riskLevel: 'Low',
      weaponOfChoice: 'Unknown',
      modusOperandi: 'Leaves no digital or physical trace.'
    },
    suspectIds: [],
    callLogs: [],
    linkedCases: [],
    videos: [],
    evidence: [],
    lessons: [],
    timeline: [],
    messages: [],
    knowledgeBase: []
  },
  {
    id: 'CASE-2024-022',
    title: 'Drug Trafficking Ring',
    status: 'Open',
    description: 'Large scale distribution network operating through local courier services.',
    lastUpdated: '2024-03-09 10:00',
    location: 'Pune',
    suspect: MOCK_PROFILES[2],
    suspectIds: ['PROF-003'],
    callLogs: [
      {
        id: 'LOG-003',
        number: '+91 88888 77777',
        name: 'Arjun Varma',
        duration: '10:30',
        timestamp: '2024-03-09 08:30',
        location: 'Kothrud, Pune',
        lat: 18.5074,
        lng: 73.8077,
        summary: 'Detailed discussion about the next shipment arrival.',
        frequency: 88
      },
      {
        id: 'LOG-007',
        number: '+91 77777 66666',
        name: 'Local Distributor',
        duration: '03:15',
        timestamp: '2024-03-09 12:00',
        location: 'Baner, Pune',
        lat: 18.5597,
        lng: 73.7799,
        summary: 'Confirmed receipt of the first batch.',
        frequency: 15
      },
      {
        id: 'LOG-008',
        number: '+91 88888 77777',
        name: 'Arjun Varma',
        duration: '08:45',
        timestamp: '2024-03-09 15:30',
        location: 'Kothrud, Pune',
        lat: 18.5074,
        lng: 73.8077,
        summary: 'Disagreement over payment terms.',
        frequency: 92
      }
    ],
    linkedCases: [],
    videos: [],
    evidence: [],
    lessons: [],
    timeline: [],
    messages: [],
    knowledgeBase: []
  },
  {
    id: 'CASE-2024-005',
    title: 'The Diamond Exchange Swap',
    status: 'Open',
    description: 'A precise swap of high-value diamonds with synthetic replicas during a public exhibition.',
    lastUpdated: '2024-03-05 11:00',
    location: 'Surat',
    suspect: {
      id: 'ARTISAN',
      name: 'Unknown',
      photo: 'https://picsum.photos/seed/unknown2/400/400',
      aliases: ['The Artisan'],
      records: [],
      pastCases: [],
      punishments: [],
      associates: ['Rahul Khanna'],
      riskLevel: 'High',
      weaponOfChoice: 'Precision Tools',
      modusOperandi: 'Uses distraction techniques and high-frequency jammers to bypass display sensors.'
    },
    suspectIds: [],
    callLogs: [],
    linkedCases: ['CASE-2024-001'],
    videos: [],
    evidence: [],
    lessons: [],
    timeline: [],
    messages: [],
    knowledgeBase: []
  }
];
