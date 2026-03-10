import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Search, 
  Mic, 
  Globe, 
  ChevronRight, 
  Activity, 
  CheckCircle2, 
  Clock, 
  MapPin,
  BarChart3,
  Users,
  Database,
  FileText,
  Video,
  ArrowLeft,
  X,
  File,
  Image as ImageIcon,
  Music,
  Box,
  Cpu,
  Download,
  Info,
  Tag,
  AlertTriangle,
  Calendar,
  User,
  MoreHorizontal,
  MessageSquare,
  Languages
} from 'lucide-react';
import { MOCK_CASES, GLOBAL_NETWORK, CROSS_CASE_PATTERNS, AI_SUGGESTED_LINKS, MOCK_PROFILES } from './mockData';
import { Case, CaseStatus, Language, TRANSLATIONS, VoiceNote, CrossCasePattern, CriminalProfile } from './types';
import { NetworkGraph } from './components/NetworkGraph';
import { Timeline } from './components/Timeline';
import { VoiceNoteRecorder } from './components/VoiceNoteRecorder';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { GoogleGenAI, Type } from "@google/genai";

// --- Sub-components ---

const VoiceSearch = ({ onResult }: { onResult: (text: string) => void }) => {
  const [isListening, setIsListening] = useState(false);
  
  const toggleListening = () => {
    setIsListening(!isListening);
    // Mock voice recognition
    if (!isListening) {
      setTimeout(() => {
        onResult("Vikram Singh");
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <button 
      onClick={toggleListening}
      className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-white/10 hover:bg-white/20'}`}
    >
      <Mic className={`w-4 h-4 ${isListening ? 'text-white' : 'text-emerald-500'}`} />
    </button>
  );
};

const LanguageSelector = ({ current, onSelect }: { current: Language, onSelect: (l: Language) => void }) => {
  const langs: { id: Language, label: string }[] = [
    { id: 'en', label: 'EN' },
    { id: 'hi', label: 'हि' },
    { id: 'mr', label: 'म' }
  ];
  
  return (
    <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
      {langs.map(l => (
        <button
          key={l.id}
          onClick={() => onSelect(l.id)}
          className={`px-2 py-1 text-[10px] font-bold rounded transition-all ${current === l.id ? 'bg-emerald-500 text-white' : 'text-white/40 hover:text-white/60'}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};

const AddEvidenceModal = ({ onSave, onCancel }: { onSave: (e: any) => void, onCancel: () => void }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'Document' | 'Image' | 'Audio' | 'Physical' | 'Digital'>('Document');
  const [importance, setImportance] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [locationFound, setLocationFound] = useState('');
  const [collectedBy, setCollectedBy] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileContent, setFileContent] = useState('');

  const analyzeContent = async () => {
    if (!fileContent && !name) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this evidence metadata and suggest 5 relevant tags for a criminal investigation.
        Name: ${name}
        Type: ${type}
        Location: ${locationFound}
        Content Snippet: ${fileContent || 'No content provided'}
        Return only a JSON array of strings.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      
      const suggested = JSON.parse(response.text);
      setSuggestedTags(suggested);
    } catch (error) {
      console.error("AI Tagging failed:", error);
      // Fallback tags if AI fails
      setSuggestedTags(['Investigation', 'Evidence', 'Case-Linked', 'Forensic', 'Priority']);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSave = () => {
    onSave({
      id: `EVD-${Date.now()}`,
      name,
      type,
      date: new Date().toISOString().split('T')[0],
      aiSummary: `AI analyzed ${type} evidence found at ${locationFound}.`,
      analysis: `Detailed forensic analysis of ${name} is pending. Initial assessment suggests ${importance} importance.`,
      importance,
      collectedBy,
      locationFound,
      tags,
      fileSize: '1.2 MB'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#141414] border border-white/10 w-full max-w-2xl rounded-3xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-500" />
            Add New Evidence
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="col-span-2">
            <label className="block text-[10px] text-white/40 uppercase mb-2">Evidence Name</label>
            <input 
              type="text" value={name} onChange={e => setName(e.target.value)} 
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-emerald-500/50" 
              placeholder="e.g., Recovered Hard Drive"
            />
          </div>
          <div>
            <label className="block text-[10px] text-white/40 uppercase mb-2">Type</label>
            <select value={type} onChange={e => setType(e.target.value as any)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-emerald-500/50">
              <option value="Document">Document</option>
              <option value="Image">Image</option>
              <option value="Audio">Audio</option>
              <option value="Physical">Physical</option>
              <option value="Digital">Digital</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-white/40 uppercase mb-2">Importance</label>
            <select value={importance} onChange={e => setImportance(e.target.value as any)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-emerald-500/50">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-white/40 uppercase mb-2">Location Found</label>
            <input type="text" value={locationFound} onChange={e => setLocationFound(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-emerald-500/50" />
          </div>
          <div>
            <label className="block text-[10px] text-white/40 uppercase mb-2">Collected By</label>
            <input type="text" value={collectedBy} onChange={e => setCollectedBy(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-emerald-500/50" />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-[10px] text-white/40 uppercase mb-2">Content Snippet (for AI Analysis)</label>
          <textarea 
            value={fileContent} onChange={e => setFileContent(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 h-24 outline-none focus:border-emerald-500/50 resize-none text-sm"
            placeholder="Paste text from document or describe image content..."
          />
          <button 
            onClick={analyzeContent}
            disabled={isAnalyzing || (!fileContent && !name)}
            className="mt-2 flex items-center gap-2 text-[10px] font-bold text-emerald-500 hover:text-emerald-400 disabled:opacity-50"
          >
            <Cpu className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing with AI...' : 'Suggest Tags with AI'}
          </button>
        </div>

        {suggestedTags.length > 0 && (
          <div className="mb-6 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
            <h4 className="text-[10px] font-bold text-emerald-500 uppercase mb-3">AI Suggested Tags (Select to add)</h4>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map(tag => (
                <button 
                  key={tag} 
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${tags.includes(tag) ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full font-bold transition-all">Cancel</button>
          <button onClick={handleSave} className="px-8 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold transition-all">Save Evidence</button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [view, setView] = useState<'splash' | 'login' | 'dashboard' | 'case' | 'ai-search' | 'network' | 'cross-analysis' | 'profiles-mgmt' | 'cases-mgmt'>('splash');
  const [cases, setCases] = useState<Case[]>(MOCK_CASES);
  const [profiles, setProfiles] = useState<CriminalProfile[]>(MOCK_PROFILES);
  const [suggestedLinks, setSuggestedLinks] = useState(AI_SUGGESTED_LINKS);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<CaseStatus>('Open');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [mergingId, setMergingId] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

  const handleConfirmLink = (suggestionId: string) => {
    const suggestion = suggestedLinks.find(s => s.id === suggestionId);
    if (!suggestion) return;

    setMergingId(suggestionId);
    
    setTimeout(() => {
      // Update cases to include the new link
      setCases(prevCases => prevCases.map(c => {
        if (c.id === suggestion.caseA) {
          return { ...c, linkedCases: Array.from(new Set([...c.linkedCases, suggestion.caseB])) };
        }
        if (c.id === suggestion.caseB) {
          return { ...c, linkedCases: Array.from(new Set([...c.linkedCases, suggestion.caseA])) };
        }
        return c;
      }));

      // If the selected case is one of the linked cases, update it too
      if (selectedCase) {
        if (selectedCase.id === suggestion.caseA) {
          setSelectedCase(prev => prev ? { ...prev, linkedCases: Array.from(new Set([...prev.linkedCases, suggestion.caseB])) } : null);
        } else if (selectedCase.id === suggestion.caseB) {
          setSelectedCase(prev => prev ? { ...prev, linkedCases: Array.from(new Set([...prev.linkedCases, suggestion.caseA])) } : null);
        }
      }

      // Remove the suggestion
      setSuggestedLinks(prev => prev.filter(s => s.id !== suggestionId));
      setMergingId(null);
    }, 1500);
  };

  const handleDismissLink = (suggestionId: string) => {
    setSuggestedLinks(prev => prev.filter(s => s.id !== suggestionId));
  };

  // --- Views ---

  const SplashScreen = () => (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center z-50"
    >
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
        <Shield className="w-24 h-24 text-emerald-500" />
      </motion.div>
      <h1 className="mt-8 text-6xl font-bold tracking-tighter text-white uppercase italic font-serif">Sakshyam</h1>
      <p className="mt-2 text-emerald-400 font-mono text-sm tracking-[0.3em] uppercase">Empowering investigations with intelligence</p>
      <button 
        onClick={() => setView('login')}
        className="mt-12 px-8 py-3 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-500 transition-all"
      >
        INITIALIZE SYSTEM
      </button>
    </motion.div>
  );

  const LoginPage = () => (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md bg-[#141414] border border-white/10 p-8 rounded-3xl">
        <div className="flex justify-center mb-8"><Shield className="w-12 h-12 text-emerald-500" /></div>
        <h2 className="text-2xl font-bold text-white text-center mb-8">{t.authorize}</h2>
        <div className="space-y-4">
          <input type="text" placeholder={t.officerId} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500/50 outline-none" />
          <input type="password" placeholder={t.accessKey} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500/50 outline-none" />
          <button onClick={() => setView('dashboard')} className="w-full bg-emerald-600 py-3 rounded-xl font-bold hover:bg-emerald-500 transition-all uppercase tracking-widest">Login</button>
        </div>
      </motion.div>
    </div>
  );

  const ProfilesManagement = () => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingProfile, setEditingProfile] = useState<CriminalProfile | null>(null);
    const [search, setSearch] = useState('');

    const filteredProfiles = profiles.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.aliases.some(a => a.toLowerCase().includes(search.toLowerCase()))
    );

    const handleDelete = (id: string) => {
      if (confirm('Are you sure you want to delete this profile?')) {
        setProfiles(prev => prev.filter(p => p.id !== id));
      }
    };

    const handleSave = (profile: CriminalProfile) => {
      if (editingProfile) {
        setProfiles(prev => prev.map(p => p.id === profile.id ? profile : p));
      } else {
        setProfiles(prev => [...prev, { ...profile, id: `PROF-${Date.now()}` }]);
      }
      setIsAdding(false);
      setEditingProfile(null);
    };

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
        <header className="max-w-7xl mx-auto mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('dashboard')} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-4xl font-bold italic font-serif">Profile Management</h1>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold transition-all"
          >
            Add New Profile
          </button>
        </header>

        <div className="max-w-7xl mx-auto">
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" placeholder="Search profiles..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-emerald-500/50 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map(p => (
              <div key={p.id} className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden group">
                <div className="aspect-square relative">
                  <img src={p.photo} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                    <button onClick={() => setEditingProfile(p)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full"><FileText className="w-5 h-5" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-3 bg-red-500/20 hover:bg-red-500/30 rounded-full text-red-500"><X className="w-5 h-5" /></button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{p.name}</h3>
                  <p className="text-xs text-white/40 font-mono uppercase mb-4">{p.id}</p>
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      p.riskLevel === 'Critical' ? 'bg-red-500 text-white' :
                      p.riskLevel === 'High' ? 'bg-orange-500 text-white' :
                      p.riskLevel === 'Medium' ? 'bg-blue-500 text-white' :
                      'bg-emerald-500 text-white'
                    }`}>
                      {p.riskLevel} Risk
                    </span>
                    <span className="text-[10px] text-white/40 uppercase">{p.gangAffiliation || 'Independent'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {(isAdding || editingProfile) && (
          <ProfileForm 
            profile={editingProfile} 
            onSave={handleSave} 
            onCancel={() => { setIsAdding(false); setEditingProfile(null); }} 
          />
        )}
      </div>
    );
  };

  const CasesManagement = () => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingCase, setEditingCase] = useState<Case | null>(null);
    const [search, setSearch] = useState('');

    const filteredCases = cases.filter(c => 
      c.title.toLowerCase().includes(search.toLowerCase()) || 
      c.id.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id: string) => {
      if (confirm('Are you sure you want to delete this case?')) {
        setCases(prev => prev.filter(c => c.id !== id));
      }
    };

    const handleSave = (caseData: Case) => {
      if (editingCase) {
        setCases(prev => prev.map(c => c.id === caseData.id ? caseData : c));
      } else {
        setCases(prev => [...prev, { ...caseData, id: `CASE-${new Date().getFullYear()}-${String(prev.length + 1).padStart(3, '0')}` }]);
      }
      setIsAdding(false);
      setEditingCase(null);
    };

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
        <header className="max-w-7xl mx-auto mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('dashboard')} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-4xl font-bold italic font-serif">Case Management</h1>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold transition-all"
          >
            Create New Case
          </button>
        </header>

        <div className="max-w-7xl mx-auto">
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" placeholder="Search cases..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-emerald-500/50 outline-none"
            />
          </div>

          <div className="space-y-4">
            {filteredCases.map(c => (
              <div key={c.id} className="bg-[#141414] border border-white/10 p-6 rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    c.status === 'Open' ? 'bg-emerald-500/10 text-emerald-500' :
                    c.status === 'Closed' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-amber-500/10 text-amber-500'
                  }`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{c.title}</h3>
                    <p className="text-xs text-white/40 font-mono uppercase">{c.id} • {c.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right mr-8">
                    <p className="text-[10px] text-white/40 uppercase mb-1">Last Updated</p>
                    <p className="text-xs font-mono">{c.lastUpdated}</p>
                  </div>
                  <button onClick={() => setEditingCase(c)} className="p-2 hover:bg-white/5 rounded-lg transition-all"><FileText className="w-5 h-5 text-white/40 hover:text-white" /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-all"><X className="w-5 h-5 text-red-500/40 hover:text-red-500" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {(isAdding || editingCase) && (
          <CaseForm 
            caseData={editingCase} 
            profiles={profiles}
            onSave={handleSave} 
            onCancel={() => { setIsAdding(false); setEditingCase(null); }} 
          />
        )}
      </div>
    );
  };

  const ProfileForm = ({ profile, onSave, onCancel }: { profile: CriminalProfile | null, onSave: (p: CriminalProfile) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState<CriminalProfile>(profile || {
      id: '',
      name: '',
      photo: 'https://picsum.photos/seed/newprofile/400/400',
      aliases: [],
      records: [],
      pastCases: [],
      punishments: [],
      associates: [],
      riskLevel: 'Low',
      weaponOfChoice: '',
      modusOperandi: '',
      psychologicalAssessment: { traits: [], summary: '', riskFactors: [] },
      rehabilitationProgress: { status: 'Not Started', notes: '', lastAssessmentDate: '' },
      behavioralInfo: '',
      backgroundInfo: ''
    });

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#141414] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">{profile ? 'Edit Profile' : 'Create New Profile'}</h2>
            <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] text-white/40 uppercase mb-2">Full Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-emerald-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-white/40 uppercase mb-2">Risk Level</label>
                  <select value={formData.riskLevel} onChange={e => setFormData({...formData, riskLevel: e.target.value as any})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-emerald-500/50">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-white/40 uppercase mb-2">Gang Affiliation</label>
                  <input type="text" value={formData.gangAffiliation} onChange={e => setFormData({...formData, gangAffiliation: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-emerald-500/50" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-white/40 uppercase mb-2">Aliases (comma separated)</label>
                <input type="text" value={formData.aliases.join(', ')} onChange={e => setFormData({...formData, aliases: e.target.value.split(',').map(s => s.trim())})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-emerald-500/50" />
              </div>
              <div>
                <label className="block text-[10px] text-white/40 uppercase mb-2">Modus Operandi</label>
                <textarea value={formData.modusOperandi} onChange={e => setFormData({...formData, modusOperandi: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 h-32 outline-none focus:border-emerald-500/50 resize-none" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                <h4 className="text-sm font-bold mb-4 text-emerald-500 uppercase tracking-widest">Enhanced Learning Section</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase mb-2">Psychological Summary</label>
                    <textarea value={formData.psychologicalAssessment?.summary} onChange={e => setFormData({...formData, psychologicalAssessment: {...formData.psychologicalAssessment!, summary: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-sm outline-none focus:border-emerald-500/50 resize-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase mb-2">Rehabilitation Notes</label>
                    <textarea value={formData.rehabilitationProgress?.notes} onChange={e => setFormData({...formData, rehabilitationProgress: {...formData.rehabilitationProgress!, notes: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-sm outline-none focus:border-emerald-500/50 resize-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase mb-2">Behavioral Information</label>
                    <textarea value={formData.behavioralInfo} onChange={e => setFormData({...formData, behavioralInfo: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-sm outline-none focus:border-emerald-500/50 resize-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button onClick={onCancel} className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full font-bold transition-all">Cancel</button>
            <button onClick={() => onSave(formData)} className="px-8 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold transition-all">Save Profile</button>
          </div>
        </motion.div>
      </div>
    );
  };

  const CaseForm = ({ caseData, profiles, onSave, onCancel }: { caseData: Case | null, profiles: CriminalProfile[], onSave: (c: Case) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState<Case>(caseData || {
      id: '',
      title: '',
      status: 'Open',
      description: '',
      lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' '),
      location: '',
      suspect: profiles[0],
      suspectIds: [profiles[0].id],
      callLogs: [],
      linkedCases: [],
      videos: [],
      evidence: [],
      lessons: [],
      timeline: [],
      messages: [],
      knowledgeBase: []
    });

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#141414] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">{caseData ? 'Edit Case' : 'Create New Case'}</h2>
            <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] text-white/40 uppercase mb-2">Case Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-emerald-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-white/40 uppercase mb-2">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-emerald-500/50">
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Halted">Halted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-white/40 uppercase mb-2">Location</label>
                  <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-emerald-500/50" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-white/40 uppercase mb-2">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 h-32 outline-none focus:border-emerald-500/50 resize-none" />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] text-white/40 uppercase mb-2">Primary Suspect</label>
                <select 
                  value={formData.suspectIds[0]} 
                  onChange={e => {
                    const p = profiles.find(x => x.id === e.target.value);
                    if (p) setFormData({...formData, suspect: p, suspectIds: [p.id]});
                  }} 
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-emerald-500/50"
                >
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                <h4 className="text-sm font-bold mb-4 text-blue-400 uppercase tracking-widest">Linked Suspect Info</h4>
                <div className="flex items-center gap-4">
                  <img src={formData.suspect.photo} className="w-16 h-16 rounded-xl object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <p className="font-bold">{formData.suspect.name}</p>
                    <p className="text-[10px] text-white/40 uppercase">{formData.suspect.riskLevel} Risk • {formData.suspect.gangAffiliation || 'Independent'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button onClick={onCancel} className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full font-bold transition-all">Cancel</button>
            <button onClick={() => onSave(formData)} className="px-8 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold transition-all">Save Case</button>
          </div>
        </motion.div>
      </div>
    );
  };

  const Dashboard = () => {
    const filteredCases = cases.filter(c => c.status === activeTab && (c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.suspect.name.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const chartData = [
      { name: 'Open', value: cases.filter(c => c.status === 'Open').length },
      { name: 'Closed', value: cases.filter(c => c.status === 'Closed').length },
      { name: 'Halted', value: cases.filter(c => c.status === 'Halted').length },
    ];

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
        <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <Shield className="w-10 h-10 text-emerald-500" />
            <h1 className="text-4xl font-bold italic font-serif">{t.hub}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text" placeholder={t.searchPlaceholder} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:border-emerald-500/50 outline-none"
              />
            </div>
            <VoiceSearch onResult={setSearchQuery} />
            <LanguageSelector current={lang} onSelect={setLang} />
          </div>
        </header>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#141414] border border-white/10 p-6 rounded-2xl">
              <h3 className="text-xs font-mono text-white/40 uppercase mb-4">Case Distribution</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                      <Cell fill="#10b981" />
                      <Cell fill="#3b82f6" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                    <Tooltip contentStyle={{ background: '#141414', border: '1px solid #333' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-white/40 mt-4">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> OPEN</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> CLOSED</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> HALTED</span>
              </div>
            </div>
            
              <nav className="space-y-2">
                <button onClick={() => setView('ai-search')} className="w-full flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5">
                  <Database className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-sm">AI Search Engine</span>
                </button>
                <button onClick={() => setView('profiles-mgmt')} className="w-full flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5">
                  <User className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-sm">Profile Management</span>
                </button>
                <button onClick={() => setView('cases-mgmt')} className="w-full flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-sm">Case Management</span>
                </button>
                <button onClick={() => setView('network')} className="w-full flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="font-bold text-sm">{t.network}</span>
                </button>
              <button onClick={() => setView('cross-analysis')} className="w-full flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                <span className="font-bold text-sm">{t.crossCase}</span>
              </button>
            </nav>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <div className="flex gap-4 border-b border-white/5 pb-4">
              {(['Open', 'Closed', 'Halted'] as CaseStatus[]).map(s => (
                <button 
                  key={s} onClick={() => setActiveTab(s)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === s ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                >
                  {t[s.toLowerCase() as keyof typeof t]}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCases.map(c => (
                <motion.div 
                  key={c.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onClick={() => { setSelectedCase(c); setView('case'); }}
                  className="group bg-[#141414] border border-white/10 p-6 rounded-2xl cursor-pointer hover:border-emerald-500/50 transition-all"
                >
                  <div className="flex justify-between mb-4">
                    <span className="text-[10px] font-mono text-white/40">{c.id}</span>
                    <Activity className={`w-4 h-4 ${c.status === 'Open' ? 'text-emerald-500' : c.status === 'Closed' ? 'text-blue-500' : 'text-amber-500'}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">{c.title}</h3>
                  <p className="text-sm text-white/50 line-clamp-2 mb-6">{c.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <img src={c.suspect.photo} className="w-6 h-6 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <span className="text-xs text-white/60">{c.suspect.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-emerald-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CrossCaseAnalysis = () => {
    const handleStartScan = () => {
      setIsScanning(true);
      setScanProgress(0);
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    };

    const handleMerge = (id: string) => {
      handleConfirmLink(id);
    };

    const handleDismiss = (id: string) => {
      handleDismissLink(id);
    };

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
        <header className="max-w-7xl mx-auto mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('dashboard')} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-4xl font-bold italic font-serif">{t.crossCase}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleStartScan}
              disabled={isScanning}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${isScanning ? 'bg-purple-500/20 text-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20'}`}
            >
              <Cpu className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? `Analyzing Intelligence... ${scanProgress}%` : 'Scan for New Links'}
            </button>
            <LanguageSelector current={lang} onSelect={setLang} />
          </div>
        </header>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {isScanning && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-purple-500/10 border border-purple-500/20 p-6 rounded-3xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                    <Activity className="w-4 h-4 animate-pulse" />
                    AI Neural Engine Processing...
                  </h4>
                  <span className="text-xs font-mono text-purple-400">{scanProgress}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-white/40 mt-4 font-mono uppercase tracking-widest animate-pulse">
                  Cross-referencing MO signatures • Analyzing geographic clusters • Mapping associate networks
                </p>
              </motion.div>
            )}

            <div className="bg-[#141414] border border-white/10 p-8 rounded-3xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                Identified Patterns & Connections
              </h3>
              <div className="space-y-6">
                {CROSS_CASE_PATTERNS.map(pattern => (
                  <motion.div 
                    key={pattern.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          pattern.type === 'Modus Operandi' ? 'bg-blue-500/20 text-blue-400' :
                          pattern.type === 'Geographic' ? 'bg-emerald-500/20 text-emerald-400' :
                          pattern.type === 'Associate' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          {pattern.type}
                        </span>
                        <h4 className="text-lg font-bold mt-2">{pattern.title}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-white/40 uppercase mb-1">Confidence</div>
                        <div className="text-2xl font-bold text-emerald-500">{pattern.confidence}%</div>
                      </div>
                    </div>
                    <p className="text-sm text-white/60 mb-6 leading-relaxed">{pattern.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {pattern.involvedCases.map(caseId => (
                        <span key={caseId} className="px-3 py-1 bg-black/40 border border-white/10 rounded-full text-[10px] font-mono text-white/40">
                          {caseId}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-[#141414] border border-white/10 p-8 rounded-3xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-500" />
                Proactive AI Link Suggestions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suggestedLinks.map(suggestion => (
                  <motion.div 
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-purple-500/5 border border-purple-500/10 rounded-2xl hover:border-purple-500/30 transition-all relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-3 bg-purple-500/20 rounded-bl-2xl text-[10px] font-bold text-purple-400">
                      {suggestion.similarityScore}% Match
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="px-2 py-1 bg-black/40 rounded border border-white/10 text-[10px] font-mono text-white/60">{suggestion.caseA}</div>
                      <ChevronRight className="w-3 h-3 text-white/20" />
                      <div className="px-2 py-1 bg-black/40 rounded border border-white/10 text-[10px] font-mono text-white/60">{suggestion.caseB}</div>
                    </div>
                    <p className="text-sm text-white/70 mb-6 italic leading-relaxed">"{suggestion.reason}"</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestion.factors.map(f => (
                        <span key={f} className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-[10px] font-bold uppercase">
                          {f === 'MO' ? 'Modus Operandi' : f === 'Location' ? 'Geographic' : f}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex gap-2">
                      <button 
                        onClick={() => handleMerge(suggestion.id)}
                        disabled={mergingId === suggestion.id}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                          mergingId === suggestion.id 
                            ? 'bg-emerald-500/20 text-emerald-400 cursor-not-allowed' 
                            : 'bg-purple-600 hover:bg-purple-500 text-white opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        {mergingId === suggestion.id ? (
                          <span className="flex items-center justify-center gap-2">
                            <Activity className="w-3 h-3 animate-spin" />
                            Merging...
                          </span>
                        ) : 'Confirm Link'}
                      </button>
                      <button 
                        onClick={() => handleDismiss(suggestion.id)}
                        className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-xs font-bold transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
                {suggestedLinks.length === 0 && (
                  <div className="col-span-2 py-12 text-center border border-dashed border-white/10 rounded-2xl">
                    <p className="text-white/20 italic">No new AI suggestions at this time.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        <div className="space-y-8">
          <div className="bg-[#141414] border border-white/10 p-8 rounded-3xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              Geographic Clusters
            </h3>
            <div className="space-y-4">
              {['New Delhi', 'Mumbai', 'Pune'].map(city => (
                <div key={city} className="p-4 bg-white/5 rounded-xl flex justify-between items-center">
                  <span className="font-bold">{city}</span>
                  <span className="text-xs text-white/40">{cases.filter(c => c.location === city).length} Active Cases</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#141414] border border-white/10 p-8 rounded-3xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              Top Suspect Links
            </h3>
            <div className="space-y-4">
              {cases.slice(0, 3).map(c => (
                <div key={c.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <img src={c.suspect.photo} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <p className="text-sm font-bold">{c.suspect.name}</p>
                    <p className="text-[10px] text-white/40 uppercase">{c.suspect.gangAffiliation || 'Independent'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  };

  const CaseDetailView = () => {
    const [activeModule, setActiveModule] = useState<string>('profile');
    const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
    const [translatedMessageId, setTranslatedMessageId] = useState<string | null>(null);
    const [isAddEvidenceModalOpen, setIsAddEvidenceModalOpen] = useState(false);
    if (!selectedCase) return null;

    const handleSaveEvidence = (newEvidence: any) => {
      setCases(prev => prev.map(c => {
        if (c.id === selectedCase.id) {
          return { ...c, evidence: [...c.evidence, newEvidence] };
        }
        return c;
      }));
      setSelectedCase(prev => prev ? { ...prev, evidence: [...prev.evidence, newEvidence] } : null);
      setIsAddEvidenceModalOpen(false);
    };

    const handleSaveVoiceNote = (note: VoiceNote) => {
      setVoiceNotes(prev => [...prev, note]);
    };

    const handleDeleteVoiceNote = (id: string) => {
      setVoiceNotes(prev => prev.filter(n => n.id !== id));
    };

    const modules = [
      { id: 'profile', title: t.profile, icon: Users },
      ...(selectedCase.status === 'Closed' ? [{ id: 'resolution', title: 'Resolution', icon: CheckCircle2 }] : []),
      { id: 'calls', title: t.calls, icon: Activity },
      { id: 'linking', title: t.linking, icon: Globe },
      { id: 'video', title: t.video, icon: Video },
      { id: 'files', title: t.evidence, icon: FileText },
      { id: 'messages', title: t.messages, icon: MessageSquare },
      { id: 'timeline', title: t.timeline, icon: Clock },
      { id: 'knowledge', title: t.learning, icon: Database },
    ];

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <nav className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-xl z-30">
          <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-white/60 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> <span className="text-xs font-mono uppercase">Back</span>
          </button>
          <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-500" /><span className="font-serif italic">Sakshyam</span></div>
          <LanguageSelector current={lang} onSelect={setLang} />
        </nav>

        <div className="max-w-7xl mx-auto p-6 md:p-12">
          <div className="mb-12">
            <h2 className="text-5xl font-bold tracking-tight mb-4">{selectedCase.title}</h2>
            <div className="flex gap-4">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold">{selectedCase.status}</span>
              <span className="px-3 py-1 bg-white/5 text-white/40 rounded-full text-xs font-mono">{selectedCase.id}</span>
            </div>
            {selectedCase.status === 'Closed' && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle2 className="w-12 h-12 text-emerald-500" /></div>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Resolution Verdict
                    </h4>
                    {selectedCase.closureDate && (
                      <span className="text-[10px] font-mono text-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">
                        Closed: {selectedCase.closureDate}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed italic mb-4">"{selectedCase.resolutionDetails}"</p>
                  {selectedCase.resolutionNotes && (
                    <div className="pt-4 border-t border-white/5">
                      <h5 className="text-[10px] text-white/30 uppercase mb-2">Detailed Resolution Notes</h5>
                      <p className="text-xs text-white/60 leading-relaxed">{selectedCase.resolutionNotes}</p>
                    </div>
                  )}
                </div>
                {selectedCase.detailedAnalysis && (
                  <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                    <h4 className="text-blue-400 font-bold text-sm mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" /> Forensic Intelligence Summary
                    </h4>
                    <p className="text-sm text-white/70 leading-relaxed">{selectedCase.detailedAnalysis}</p>
                    <div className="mt-4 pt-4 border-t border-white/5 flex gap-4">
                      <div className="text-center">
                        <p className="text-[10px] text-white/30 uppercase">Evidence Items</p>
                        <p className="text-lg font-bold text-white">{selectedCase.evidence.length}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-white/30 uppercase">Linked Cases</p>
                        <p className="text-lg font-bold text-white">{selectedCase.linkedCases.length}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {selectedCase.status === 'Halted' && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><AlertTriangle className="w-12 h-12 text-amber-500" /></div>
                  <h4 className="text-amber-400 font-bold text-sm mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Cold Case Status
                  </h4>
                  <p className="text-sm text-white/80 leading-relaxed">Reason for Halt: <span className="font-bold text-amber-500">{selectedCase.haltReason}</span></p>
                </div>
                {selectedCase.detailedAnalysis && (
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <h4 className="text-white/60 font-bold text-sm mb-3 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-amber-500" /> Stalemate Forensic Analysis
                    </h4>
                    <p className="text-sm text-white/70 leading-relaxed">{selectedCase.detailedAnalysis}</p>
                    <button className="mt-4 text-[10px] font-bold text-amber-500 hover:underline uppercase tracking-widest">Request AI Re-evaluation</button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-2">
              {modules.map(m => (
                <button 
                  key={m.id} onClick={() => setActiveModule(m.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all border ${activeModule === m.id ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'}`}
                >
                  <m.icon className="w-5 h-5" />
                  <span className="font-bold text-sm">{m.title}</span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-3 bg-[#141414] border border-white/10 rounded-3xl p-8">
              <AnimatePresence mode="wait">
                <motion.div key={activeModule} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  {activeModule === 'profile' && (
                    <div className="space-y-8">
                      <div className="flex gap-8">
                        <img src={selectedCase.suspect.photo} className="w-48 h-48 rounded-2xl object-cover border border-white/10" referrerPolicy="no-referrer" />
                        <div className="space-y-4 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-3xl font-bold">{selectedCase.suspect.name}</h3>
                              <p className="text-white/40 font-mono text-sm uppercase mt-1">Aliases: {selectedCase.suspect.aliases.join(', ')}</p>
                            </div>
                            {selectedCase.suspect.lastActiveLocation && (
                              <button 
                                onClick={() => window.open(`https://www.google.com/maps?q=${selectedCase.suspect.lastActiveLocation?.lat},${selectedCase.suspect.lastActiveLocation?.lng}`, '_blank')}
                                className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-left group hover:bg-emerald-500/20 transition-all"
                              >
                                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                                  <MapPin className="w-4 h-4" />
                                  <span className="text-[10px] font-bold uppercase">Last Active Location</span>
                                </div>
                                <p className="text-xs font-bold">{selectedCase.suspect.lastActiveLocation.name}</p>
                                <p className="text-[8px] text-white/40 mt-1 uppercase">{selectedCase.suspect.lastActiveLocation.timestamp}</p>
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-white/5 rounded-lg"><h5 className="text-[10px] text-white/40 uppercase mb-1">Weapon of Choice</h5><p className="text-sm font-bold text-red-400">{selectedCase.suspect.weaponOfChoice}</p></div>
                            <div className="p-3 bg-white/5 rounded-lg"><h5 className="text-[10px] text-white/40 uppercase mb-1">Gang Affiliation</h5><p className="text-sm font-bold text-blue-400">{selectedCase.suspect.gangAffiliation || 'None'}</p></div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                          <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-emerald-500"><Activity className="w-4 h-4" /> Modus Operandi</h4>
                          <p className="text-sm text-white/70 leading-relaxed">{selectedCase.suspect.modusOperandi}</p>
                        </div>
                        
                        {selectedCase.suspect.psychologicalAssessment && (
                          <div className="p-6 bg-purple-500/5 rounded-2xl border border-purple-500/10">
                            <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-purple-400"><Database className="w-4 h-4" /> Psychological Assessment</h4>
                            <div className="space-y-3">
                              <p className="text-xs text-white/70 italic">"{selectedCase.suspect.psychologicalAssessment.summary}"</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedCase.suspect.psychologicalAssessment.traits.map(t => (
                                  <span key={t} className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-[9px] font-bold uppercase">{t}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedCase.suspect.rehabilitationProgress && (
                          <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                            <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-blue-400"><CheckCircle2 className="w-4 h-4" /> Rehabilitation Progress</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  selectedCase.suspect.rehabilitationProgress.status === 'Completed' ? 'bg-emerald-500 text-white' :
                                  selectedCase.suspect.rehabilitationProgress.status === 'In Progress' ? 'bg-blue-500 text-white' :
                                  'bg-red-500 text-white'
                                }`}>
                                  {selectedCase.suspect.rehabilitationProgress.status}
                                </span>
                                <span className="text-[10px] text-white/40 uppercase">Last: {selectedCase.suspect.rehabilitationProgress.lastAssessmentDate}</span>
                              </div>
                              <p className="text-xs text-white/70">{selectedCase.suspect.rehabilitationProgress.notes}</p>
                            </div>
                          </div>
                        )}

                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                          <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-white/60"><Info className="w-4 h-4" /> Behavioral & Background</h4>
                          <div className="space-y-4">
                            {selectedCase.suspect.behavioralInfo && (
                              <div>
                                <h5 className="text-[10px] text-white/30 uppercase mb-1">Behavioral Patterns</h5>
                                <p className="text-xs text-white/70">{selectedCase.suspect.behavioralInfo}</p>
                              </div>
                            )}
                            {selectedCase.suspect.backgroundInfo && (
                              <div>
                                <h5 className="text-[10px] text-white/30 uppercase mb-1">Background History</h5>
                                <p className="text-xs text-white/70">{selectedCase.suspect.backgroundInfo}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeModule === 'resolution' && (
                    <div className="space-y-8">
                      <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          Case Resolution Report
                        </h3>
                        {selectedCase.closureDate && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                            <Calendar className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-mono font-bold text-emerald-500 uppercase">Closed: {selectedCase.closureDate}</span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                          <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl">
                            <h4 className="text-sm font-bold mb-4 text-emerald-400 uppercase tracking-widest">Final Verdict</h4>
                            <p className="text-xl text-white leading-relaxed font-serif italic">"{selectedCase.resolutionDetails}"</p>
                          </div>

                          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
                            <h4 className="text-sm font-bold mb-4 text-white/40 uppercase tracking-widest">Detailed Resolution Notes</h4>
                            <div className="prose prose-invert max-w-none">
                              <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
                                {selectedCase.resolutionNotes || "No detailed notes provided for this resolution."}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                            <h4 className="text-xs font-bold text-blue-400 uppercase mb-4">Investigation Stats</h4>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-white/40">Evidence Items</span>
                                <span className="text-lg font-bold">{selectedCase.evidence.length}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-white/40">Linked Cases</span>
                                <span className="text-lg font-bold">{selectedCase.linkedCases.length}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-white/40">Timeline Events</span>
                                <span className="text-lg font-bold">{selectedCase.timeline.length}</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-6 bg-purple-500/5 border border-purple-500/10 rounded-2xl">
                            <h4 className="text-xs font-bold text-purple-400 uppercase mb-4">Forensic Summary</h4>
                            <p className="text-xs text-white/60 leading-relaxed">
                              {selectedCase.detailedAnalysis || "Analysis pending archival."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeModule === 'calls' && (
                    <div className="space-y-6">
                      <div className="h-80 mb-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart 
                            data={selectedCase.callLogs.map(log => ({
                              ...log,
                              durationSeconds: log.duration.split(':').reduce((acc, time) => (60 * acc) + +time, 0)
                            }))}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis 
                              dataKey="timestamp" 
                              stroke="#666" 
                              fontSize={10} 
                              tickFormatter={(val) => val.split(' ')[1]} // Show only time on X axis
                            />
                            <YAxis yAxisId="left" stroke="#10b981" fontSize={10} label={{ value: 'Freq', angle: -90, position: 'insideLeft', fill: '#10b981', fontSize: 10 }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={10} label={{ value: 'Sec', angle: 90, position: 'insideRight', fill: '#3b82f6', fontSize: 10 }} />
                            <Tooltip 
                              contentStyle={{ background: '#141414', border: '1px solid #333', borderRadius: '8px' }}
                              itemStyle={{ fontSize: '12px' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                            <Line yAxisId="left" type="monotone" dataKey="frequency" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Call Frequency" />
                            <Line yAxisId="right" type="monotone" dataKey="durationSeconds" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Duration (Seconds)" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-4">
                        {selectedCase.callLogs.map(log => (
                          <div key={log.id} className={`p-5 rounded-2xl border transition-all hover:bg-white/5 ${log.frequency > 50 ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/5'}`}>
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${log.frequency > 50 ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                                  <Users className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className={`font-bold text-lg ${log.frequency > 50 ? 'text-red-400' : 'text-white'}`}>{log.name || 'Unknown Caller'}</span>
                                    {log.frequency > 50 && <span className="text-[8px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">High Risk Contact</span>}
                                  </div>
                                  <p className="text-xs text-white/40 font-mono">{log.number}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Timestamp</p>
                                <p className="text-xs font-mono text-white/60">{log.timestamp}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                                <p className="text-[9px] text-white/30 uppercase mb-1">Duration</p>
                                <p className="text-sm font-bold text-blue-400 flex items-center gap-2">
                                  <Clock className="w-3 h-3" /> {log.duration}
                                </p>
                              </div>
                              <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                                <p className="text-[9px] text-white/30 uppercase mb-1">Frequency</p>
                                <p className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                                  <Activity className="w-3 h-3" /> {log.frequency} calls
                                </p>
                              </div>
                              <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                                <p className="text-[9px] text-white/30 uppercase mb-1">Location</p>
                                <p className="text-sm font-bold text-white/80 flex items-center gap-2 truncate">
                                  <MapPin className="w-3 h-3" /> {log.location}
                                </p>
                              </div>
                            </div>

                            <div className="p-4 bg-white/5 rounded-xl border border-white/5 mb-4">
                              <h5 className="text-[10px] text-white/30 uppercase mb-2 flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Intelligence Summary
                              </h5>
                              <p className="text-xs text-white/70 leading-relaxed italic">"{log.summary}"</p>
                            </div>

                            <div className="flex justify-end">
                              <button 
                                onClick={() => window.open(`https://www.google.com/maps?q=${log.lat},${log.lng}`, '_blank')}
                                className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all"
                              >
                                <MapPin className="w-3 h-3" /> Track Location
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeModule === 'linking' && (
                    <div className="space-y-8">
                      <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                          <Globe className="w-6 h-6 text-blue-500" />
                          Cross-Case Intelligence
                        </h3>
                      </div>

                      <div className="space-y-6">
                        <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                          <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-blue-400">
                            <CheckCircle2 className="w-4 h-4" /> Confirmed Links
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {selectedCase.linkedCases.map(id => (
                              <button 
                                key={id}
                                onClick={() => {
                                  const c = cases.find(x => x.id === id);
                                  if (c) setSelectedCase(c);
                                }}
                                className="px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs font-mono hover:border-blue-500/50 transition-all"
                              >
                                {id}
                              </button>
                            ))}
                            {selectedCase.linkedCases.length === 0 && <p className="text-xs text-white/30 italic">No confirmed links yet.</p>}
                          </div>
                        </div>

                        <div className="p-6 bg-purple-500/5 border border-purple-500/10 rounded-2xl">
                          <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-purple-400">
                            <Cpu className="w-4 h-4" /> AI-Suggested Potential Links
                          </h4>
                          <div className="space-y-4">
                            {suggestedLinks.filter(s => s.caseA === selectedCase.id || s.caseB === selectedCase.id).map(suggestion => {
                              const otherCaseId = suggestion.caseA === selectedCase.id ? suggestion.caseB : suggestion.caseA;
                              const otherCase = cases.find(c => c.id === otherCaseId);
                              
                              return (
                                <div key={suggestion.id} className="p-4 bg-black/40 border border-white/5 rounded-xl hover:border-purple-500/30 transition-all group">
                                  <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                      <span className="text-xs font-bold text-purple-400">{otherCaseId}</span>
                                      <span className="text-[10px] text-white/40 uppercase font-mono">{otherCase?.title}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded">{suggestion.similarityScore}% Similarity</span>
                                  </div>
                                  <p className="text-xs text-white/60 leading-relaxed mb-4">"{suggestion.reason}"</p>
                                  <div className="flex justify-between items-center">
                                    <div className="flex gap-2">
                                      {suggestion.factors.map(f => (
                                        <span key={f} className="text-[8px] font-bold uppercase text-purple-400/60 border border-purple-400/20 px-1.5 py-0.5 rounded">{f}</span>
                                      ))}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                      <button 
                                        onClick={() => handleConfirmLink(suggestion.id)}
                                        className="p-1.5 bg-emerald-500/20 text-emerald-500 rounded hover:bg-emerald-500/30"
                                      >
                                        <CheckCircle2 className="w-3 h-3" />
                                      </button>
                                      <button 
                                        onClick={() => handleDismissLink(suggestion.id)}
                                        className="p-1.5 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            {suggestedLinks.filter(s => s.caseA === selectedCase.id || s.caseB === selectedCase.id).length === 0 && (
                              <p className="text-xs text-white/30 italic">No AI suggestions for this case at this time.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeModule === 'video' && (
                    <div className="grid grid-cols-2 gap-6">
                      {selectedCase.videos.map((v, i) => (
                        <div key={i} className="group relative rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black">
                          <img src={v.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-all" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <button onClick={() => window.open(v.url, '_blank')} className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:scale-110 transition-all backdrop-blur-md">
                              <Video className="w-6 h-6 text-white" />
                            </button>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                            <p className="text-xs font-bold">{v.title}</p>
                            <p className="text-[10px] text-white/40 uppercase">{v.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeModule === 'files' && (
                    <div className="space-y-8">
                      <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                          <FileText className="w-6 h-6 text-emerald-500" />
                          Evidence Repository
                        </h3>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setIsAddEvidenceModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-[10px] font-bold uppercase transition-all"
                          >
                            <Tag className="w-3 h-3" /> Add Evidence
                          </button>
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold uppercase">
                            Total: {selectedCase.evidence.length} Items
                          </span>
                        </div>
                      </div>

                      {isAddEvidenceModalOpen && (
                        <AddEvidenceModal 
                          onSave={handleSaveEvidence} 
                          onCancel={() => setIsAddEvidenceModalOpen(false)} 
                        />
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedCase.evidence.map((item) => (
                          <motion.div 
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden flex flex-col"
                          >
                            <div className="p-5 border-b border-white/5 flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${
                                  item.type === 'Document' ? 'bg-blue-500/20 text-blue-400' :
                                  item.type === 'Image' ? 'bg-purple-500/20 text-purple-400' :
                                  item.type === 'Audio' ? 'bg-amber-500/20 text-amber-400' :
                                  item.type === 'Digital' ? 'bg-emerald-500/20 text-emerald-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {item.type === 'Document' && <File className="w-5 h-5" />}
                                  {item.type === 'Image' && <ImageIcon className="w-5 h-5" />}
                                  {item.type === 'Audio' && <Music className="w-5 h-5" />}
                                  {item.type === 'Digital' && <Cpu className="w-5 h-5" />}
                                  {item.type === 'Physical' && <Box className="w-5 h-5" />}
                                </div>
                                <div>
                                  <h4 className="font-bold text-sm">{item.name}</h4>
                                  <p className="text-[10px] text-white/40 font-mono uppercase">{item.id} • {item.fileSize || 'N/A'}</p>
                                </div>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                item.importance === 'High' ? 'bg-red-500 text-white' :
                                item.importance === 'Medium' ? 'bg-amber-500 text-black' :
                                'bg-emerald-500 text-white'
                              }`}>
                                {item.importance} Priority
                              </span>
                            </div>

                            <div className="p-5 space-y-4 flex-1">
                              <div className="space-y-2">
                                <h5 className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                                  <Cpu className="w-3 h-3" /> AI Summary
                                </h5>
                                <p className="text-xs text-white/70 italic leading-relaxed">"{item.aiSummary}"</p>
                              </div>

                              <div className="space-y-2">
                                <h5 className="text-[10px] text-blue-400 font-bold uppercase flex items-center gap-1">
                                  <Info className="w-3 h-3" /> Detailed Analysis
                                </h5>
                                <p className="text-xs text-white/60 leading-relaxed">{item.analysis}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1">
                                  <h6 className="text-[9px] text-white/30 uppercase">Collected By</h6>
                                  <p className="text-[10px] font-bold flex items-center gap-1"><User className="w-3 h-3 text-white/40" /> {item.collectedBy}</p>
                                </div>
                                <div className="space-y-1">
                                  <h6 className="text-[9px] text-white/30 uppercase">Location Found</h6>
                                  <p className="text-[10px] font-bold flex items-center gap-1"><MapPin className="w-3 h-3 text-white/40" /> {item.locationFound}</p>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 pt-2">
                                {item.tags.map(tag => (
                                  <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[9px] text-white/40 flex items-center gap-1">
                                    <Tag className="w-2 h-2" /> {tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="p-4 bg-white/5 border-t border-white/5 flex justify-between items-center">
                              <div className="flex items-center gap-2 text-[10px] text-white/40">
                                <Calendar className="w-3 h-3" /> {item.date}
                              </div>
                              <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition-all">
                                <Download className="w-3 h-3" /> Download Report
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeModule === 'messages' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                          <MessageSquare className="w-6 h-6 text-emerald-500" />
                          Message Transcription
                        </h3>
                        <span className="text-xs text-white/40 font-mono uppercase">
                          {selectedCase.messages.length} Intercepted Messages
                        </span>
                      </div>

                      <div className="space-y-4">
                        {selectedCase.messages.map((msg) => (
                          <motion.div 
                            key={msg.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => setTranslatedMessageId(translatedMessageId === msg.id ? null : msg.id)}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
                              translatedMessageId === msg.id 
                                ? 'bg-emerald-500/10 border-emerald-500/30' 
                                : 'bg-white/5 border-white/5 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                                  {msg.sender.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-bold">{msg.sender}</p>
                                  <p className="text-[10px] text-white/40 uppercase">{msg.language} Intercept</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] text-white/30 font-mono">{msg.timestamp}</span>
                                <Languages className={`w-4 h-4 transition-colors ${translatedMessageId === msg.id ? 'text-emerald-500' : 'text-white/20 group-hover:text-white/40'}`} />
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                                <p className="text-sm leading-relaxed text-white/90 font-mono">
                                  {msg.content}
                                </p>
                              </div>
                              
                              <AnimatePresence>
                                {translatedMessageId === msg.id && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden space-y-4"
                                  >
                                    {msg.slangMeaning && (
                                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-10"><Shield className="w-8 h-8 text-emerald-500" /></div>
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="text-[10px] font-bold uppercase text-emerald-500 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">AI Decoded: Simple Language</span>
                                        </div>
                                        <p className="text-base text-emerald-400 font-bold leading-relaxed">
                                          {msg.slangMeaning}
                                        </p>
                                      </div>
                                    )}
                                    {msg.translatedContent && (
                                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="text-[10px] font-bold uppercase text-white/40 bg-white/5 px-2 py-0.5 rounded border border-white/10">Literal Translation</span>
                                        </div>
                                        <p className="text-sm text-white/60 italic leading-relaxed">
                                          {msg.translatedContent}
                                        </p>
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              {!translatedMessageId && msg.slangMeaning && (
                                <div className="flex justify-center">
                                  <button className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 flex items-center gap-1 uppercase tracking-widest">
                                    <Languages className="w-3 h-3" /> Click to Decode Criminal Slang
                                  </button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeModule === 'timeline' && <Timeline events={selectedCase.timeline} />}
                  
                  {activeModule === 'knowledge' && (
                    <div className="space-y-12">
                      <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                          <Database className="w-6 h-6 text-emerald-500" />
                          Expert Knowledge Base
                        </h3>
                        <span className="text-xs text-white/40 font-mono uppercase">Case Studies from Veteran Officers</span>
                      </div>

                      {selectedCase.knowledgeBase.map((k, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                          <div className="p-8 border-b border-white/5 bg-gradient-to-r from-emerald-500/10 to-transparent flex flex-col md:flex-row gap-8">
                            <div className="flex flex-col items-center gap-4">
                              <img src={k.officerPhoto} className="w-32 h-32 rounded-2xl object-cover border-2 border-emerald-500/20 shadow-xl" referrerPolicy="no-referrer" />
                              <div className="text-center">
                                <h4 className="text-xl font-bold text-white">{k.officerName}</h4>
                                <p className="text-xs text-emerald-400 font-mono uppercase">{k.officerRole}</p>
                              </div>
                            </div>
                            
                            <div className="flex-1 space-y-6">
                              <div>
                                <h5 className="text-[10px] text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                                  <FileText className="w-3 h-3 text-emerald-500" /> Reference Case Study
                                </h5>
                                <p className="text-2xl font-bold italic font-serif text-white/90">"{k.caseStudy}"</p>
                              </div>
                              
                              <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                                <h5 className="text-[10px] text-emerald-400 font-bold uppercase mb-3">Core Investigation Strategy</h5>
                                <p className="text-sm text-white/70 leading-relaxed italic">
                                  {k.strategy}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-8">
                              <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><AlertTriangle className="w-12 h-12 text-red-500" /></div>
                                <h5 className="text-xs font-bold text-red-400 uppercase mb-4 flex items-center gap-2">
                                  <X className="w-4 h-4" /> Critical Mistakes Made
                                </h5>
                                <p className="text-sm text-white/70 leading-relaxed">
                                  {k.mistakes}
                                </p>
                              </div>

                              <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle2 className="w-12 h-12 text-emerald-500" /></div>
                                <h5 className="text-xs font-bold text-emerald-400 uppercase mb-4 flex items-center gap-2">
                                  <Activity className="w-4 h-4" /> Recommended Improvements
                                </h5>
                                <p className="text-sm text-white/70 leading-relaxed">
                                  {k.improvements}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-6">
                              <h5 className="text-xs font-bold text-blue-400 uppercase mb-4 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" /> Investigation Focus Analysis
                              </h5>
                              <div className="h-64 flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie
                                      data={k.focusPoints}
                                      innerRadius={60}
                                      outerRadius={80}
                                      paddingAngle={5}
                                      dataKey="value"
                                      nameKey="label"
                                    >
                                      {k.focusPoints.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                      ))}
                                    </Pie>
                                    <Tooltip 
                                      contentStyle={{ background: '#141414', border: '1px solid #333', borderRadius: '12px' }}
                                      itemStyle={{ color: '#fff', fontSize: '12px' }}
                                    />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                {k.focusPoints.map((point, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-[10px] font-mono text-white/60">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: point.color }} />
                                    <span className="uppercase">{point.label}</span>
                                    <span className="ml-auto font-bold text-white">{point.value}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <VoiceNoteRecorder 
                    moduleId={activeModule} 
                    onSave={handleSaveVoiceNote} 
                    notes={voiceNotes} 
                    onDelete={handleDeleteVoiceNote} 
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AISearchView = () => {
    const [query, setQuery] = useState('');
    const results = cases.filter(c => 
      c.suspect.name.toLowerCase().includes(query.toLowerCase()) || 
      c.suspect.aliases.some(a => a.toLowerCase().includes(query.toLowerCase()))
    );

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
        <header className="max-w-7xl mx-auto mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('dashboard')} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-4xl font-bold italic font-serif">{t.aiSearch}</h1>
          </div>
          <LanguageSelector current={lang} onSelect={setLang} />
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="relative mb-12">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500" />
            <input 
              type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Enter Criminal Name or Alias..."
              className="w-full bg-[#141414] border border-white/10 rounded-3xl py-6 pl-16 pr-8 text-xl focus:border-emerald-500/50 outline-none shadow-2xl"
            />
          </div>

          <div className="space-y-6">
            {query && results.map(c => (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} key={c.id} className="bg-[#141414] border border-white/10 p-8 rounded-3xl flex gap-8">
                <img src={c.suspect.photo} className="w-32 h-32 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">{c.suspect.name}</h3>
                      <p className="text-white/40 font-mono text-xs uppercase">{c.suspect.aliases.join(', ')}</p>
                    </div>
                    <span className="px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-[10px] font-bold uppercase">{c.suspect.riskLevel} Risk</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div><h5 className="text-[10px] text-white/30 uppercase mb-1">Last Known Case</h5><p className="text-sm font-bold">{c.title}</p></div>
                    <div><h5 className="text-[10px] text-white/30 uppercase mb-1">Modus Operandi</h5><p className="text-sm text-white/60 line-clamp-2">{c.suspect.modusOperandi}</p></div>
                  </div>
                  <button onClick={() => { setSelectedCase(c); setView('case'); }} className="mt-6 text-emerald-400 text-xs font-bold hover:underline">VIEW FULL DOSSIER</button>
                </div>
              </motion.div>
            ))}
            {query && results.length === 0 && <p className="text-center text-white/20">No records found for "{query}"</p>}
          </div>
        </div>
      </div>
    );
  };

  const NetworkView = () => (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
      <nav className="mb-12 flex items-center justify-between">
        <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-white/60 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> <span className="text-xs font-mono uppercase">Dashboard</span>
        </button>
        <h2 className="text-2xl font-bold italic font-serif">{t.network}</h2>
        <div className="w-20" />
      </nav>
      <div className="max-w-7xl mx-auto bg-[#141414] border border-white/10 p-8 rounded-3xl">
        <NetworkGraph nodes={GLOBAL_NETWORK.nodes} links={GLOBAL_NETWORK.links} />
      </div>
    </div>
  );

  return (
    <div className="selection:bg-emerald-500/30">
      <AnimatePresence mode="wait">
        {view === 'splash' && <SplashScreen key="splash" />}
        {view === 'login' && <LoginPage key="login" />}
        {view === 'dashboard' && <Dashboard key="dashboard" />}
        {view === 'case' && <CaseDetailView key="case" />}
        {view === 'ai-search' && <AISearchView key="ai-search" />}
        {view === 'network' && <NetworkView key="network" />}
        {view === 'cross-analysis' && <CrossCaseAnalysis key="cross-analysis" />}
        {view === 'profiles-mgmt' && <ProfilesManagement key="profiles-mgmt" />}
        {view === 'cases-mgmt' && <CasesManagement key="cases-mgmt" />}
      </AnimatePresence>
    </div>
  );
}
