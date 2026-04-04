import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Bot, Sparkles, Send, ChevronRight, Zap, Loader2, Globe, Check,
} from 'lucide-react';
import { useFarmStore } from '../../store/farmStore';
import { cn } from '../../lib/utils';
import api, { getApiError } from '../../lib/axios';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'ai' | 'user';
  content: string;
}

type LangCode = 'EN' | 'HI' | 'GU' | 'HING' | 'GUENG';

const LANG_OPTIONS: { code: LangCode; label: string }[] = [
  { code: 'EN', label: 'English' },
  { code: 'HI', label: 'हिंदी' },
  { code: 'GU', label: 'ગુજરાતી' },
  { code: 'HING', label: 'Hinglish' },
  { code: 'GUENG', label: 'Guj-Eng' },
];

const SUGGESTED_PROMPTS = ['Optimize Yield', 'Soil Deficiencies', 'Market Trends'];

const TRANSLATIONS: Record<string, Record<LangCode, string>> = {
  "Analyzing data...": {
    EN: "Analyzing data for you...",
    HI: "आपके लिए डेटा का विश्लेषण कर रहा हूँ...",
    GU: "તમારા માટે ડેટાનું વિશ્લેષણ કરી રહ્યું છે...",
    HING: "Aapke liye data analyze ho raha hai...",
    GUENG: "Tamara maate data analysis thai rahyu che..."
  },
  "Please provide more details": {
    EN: "Please provide more details about your concern.",
    HI: "कृपया अपनी चिंता के बारे में अधिक विवरण प्रदान करें।",
    GU: "કૃપા કરીને તમારા પ્રશ્ન વિશે વધુ વિગત આપો.",
    HING: "Kripya apne sawaal ki thodi aur details dein.",
    GUENG: "Krupya tamara prashn ni thodi vadhare details aapo."
  },
};

export function SidePanel({ isOpen, onClose }: SidePanelProps) {
  const { currentDomain, isDemoMode } = useFarmStore();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: `Hello! I am your ${currentDomain} Advisor. How can I help optimize your operations today?` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<LangCode>('EN');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const translate = (key: string, code: LangCode) => {
    return TRANSLATIONS[key]?.[code] || key;
  };

  const getPlaceholder = (code: LangCode) => {
    switch (code) {
      case 'HI': return 'अपना सवाल पूछें...';
      case 'GU': return 'તમારો પ્રશ્ન પૂછો...';
      case 'HING': return 'Apna sawaal pucho...';
      case 'GUENG': return 'Tamaro sawaal pucho...';
      default: return 'Ask advisor anything...';
    }
  };

  const detectLanguage = (text: string): LangCode | null => {
    if (/[ऀ-ॿ]/.test(text)) return 'HI';
    if (/[અ-હ]/.test(text)) return 'GU';
    return null;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const question = input;
    setInput('');
    setLoading(true);

    try {
      const detected = detectLanguage(question);
      const activeLang = detected || lang;
      if (detected && detected !== lang) setLang(detected);

      if (isDemoMode) {
        await new Promise(r => setTimeout(r, 1200));
        setMessages(prev => [...prev, {
          role: 'ai',
          content: translate("Analyzing data...", activeLang) + ` Based on current simulations, I recommend increasing nitrogen levels by 10% in Field A.`,
        }]);
      } else {
        const res = await api.post('/rag/ask', { question });
        setMessages(prev => [...prev, { role: 'ai', content: res.data.data.answer }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: `Error: ${getApiError(err)}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-bg/40 backdrop-blur-sm z-[110]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-[480px] bg-surface border-l border-white/5 shadow-2xl z-[120] flex flex-col"
          >
            <div className="p-8 border-b border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Sparkles size={120} className="text-teal-500" />
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl glass border border-teal-500/20 flex items-center justify-center shadow-xl shadow-teal-500/10">
                    <Bot className="text-teal-500" size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-black text-white tracking-tight">AI Advisor</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                      <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest">
                        {currentDomain} Focus Mode
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-3 glass border border-white/5 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <X size={20} className="text-text-muted group-hover:text-white group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <div className="relative mt-4 inline-block">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-text-muted hover:text-white transition-colors uppercase tracking-widest"
                >
                  <Globe size={10} className="text-teal-500" />
                  {LANG_OPTIONS.find(o => o.code === lang)?.label}
                </button>

                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-2 w-32 glass border border-white/10 rounded-xl overflow-hidden z-20 shadow-2xl"
                    >
                      {LANG_OPTIONS.map(opt => (
                        <button
                          key={opt.code}
                          onClick={() => {
                            setLang(opt.code);
                            setShowLangMenu(false);
                          }}
                          className={cn(
                            "w-full px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-left flex items-center justify-between transition-colors",
                            lang === opt.code ? "bg-teal-500/10 text-teal-500" : "text-text-muted hover:bg-white/5 hover:text-white"
                          )}
                        >
                          {opt.label}
                          {lang === opt.code && <Check size={10} />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {messages.map((m, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex flex-col max-w-[90%]',
                    m.role === 'user' ? 'ml-auto items-end' : 'items-start'
                  )}
                >
                  <div className={cn(
                    'p-5 rounded-[24px] text-sm leading-relaxed font-bold tracking-tight shadow-lg',
                    m.role === 'user'
                      ? 'bg-teal-500 text-bg rounded-tr-none'
                      : 'glass border border-white/5 text-white rounded-tl-none'
                  )}>
                    {m.content}
                  </div>
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-2 px-1 opacity-50">
                    {m.role === 'user' ? 'You' : 'AgriSense AI'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start"
                >
                  <div className="p-5 glass border border-white/5 rounded-[24px] rounded-tl-none flex items-center gap-3">
                    <Loader2 size={16} className="animate-spin text-teal-500" />
                    <span className="text-xs font-bold text-text-muted">Analyzing knowledge base...</span>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="p-8 border-t border-white/5 bg-white/[0.02] space-y-4">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">
                Suggested Guidance
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map(p => (
                  <button
                    key={p}
                    onClick={() => setInput(p)}
                    disabled={loading}
                    className="px-4 py-2 glass border border-white/10 rounded-xl text-[10px] font-black text-white hover:border-teal-500/30 hover:bg-teal-500/5 transition-all flex items-center gap-2 uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={12} className="text-teal-500" />
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 border-t border-white/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  disabled={loading}
                  placeholder={loading ? 'AI is thinking...' : getPlaceholder(lang)}
                  className="w-full pl-6 pr-14 py-4 glass border border-white/10 rounded-2xl outline-none text-white font-medium focus:border-teal-500/40 transition-all placeholder:text-text-muted shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="absolute right-2 top-2 p-3 bg-teal-500 text-bg rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center shadow-lg shadow-teal-500/20"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 mt-6 text-[10px] font-black text-text-muted uppercase tracking-widest opacity-50">
                <div className="flex items-center gap-1.5 cursor-help">
                  <Zap size={12} />
                  <span>Turbo Sync Active</span>
                </div>
                <div className="w-1 h-1 bg-white/20 rounded-full" />
                <span>CraftCore AI Engine v4</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}