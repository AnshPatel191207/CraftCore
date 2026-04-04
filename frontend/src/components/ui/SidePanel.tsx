import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, Bot, Globe, Check } from 'lucide-react';
import { useFarmStore } from '../../store/farmStore';
import { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type LangCode = 'EN' | 'HI' | 'GU' | 'HING' | 'GUENG';

const TRANSLATIONS: Record<string, Record<LangCode, string>> = {
  "Use urea and compost": {
    EN: "Use urea and compost for better yield.",
    HI: "बेहतर उपज के लिए यूरिया और खाद का उपयोग करें।",
    GU: "સારી ઉપજ માટે યુરિયા અને ખાતરનો ઉપયોગ કરો.",
    HING: "Behtar yield ke liye Urea aur khaad use karo.",
    GUENG: "Saari yield maate Urea ane khaatar use karo."
  },
  "Your crop needs better soil nutrients": {
    EN: "Your crop needs better soil nutrients. Consider testing your soil.",
    HI: "आपकी फसल को बेहतर मिट्टी के पोषक तत्वों की आवश्यकता है। अपनी मिट्टी के परीक्षण पर विचार करें।",
    GU: "તમારા પાકને વધુ સારી જમીનના પોષક તત્વોની જરૂર છે. તમારી જમીનનું પરીક્ષણ કરવાનું વિચારો.",
    HING: "Aapki fasal ko behtar soil nutrients chahiye. Soil test karwana chahiye.",
    GUENG: "Tamara pak ne behtar soil nutrients ni jarrur che. Soil testing karavo."
  },
  "Please provide more details": {
    EN: "Please provide more details about your concern.",
    HI: "कृपया अपनी चिंता के बारे में अधिक विवरण प्रदान करें।",
    GU: "કૃપા કરીને તમારા પ્રશ્ન વિશે વધુ વિગત આપો.",
    HING: "Kripya apne sawaal ki thodi aur details dein.",
    GUENG: "Krupya tamara prashn ni thodi vadhare details aapo."
  },
  "Analyzing data...": {
    EN: "Analyzing data for you...",
    HI: "आपके लिए डेटा का विश्लेषण कर रहा हूँ...",
    GU: "તમારા માટે ડેટાનું વિશ્લેષણ કરી રહ્યું છે...",
    HING: "Aapke liye data analyze ho raha hai...",
    GUENG: "Tamara maate data analysis thai rahyu che..."
  }
};

const LANG_OPTIONS: { code: LangCode; label: string }[] = [
  { code: 'EN', label: 'English' },
  { code: 'HI', label: 'हिंदी' },
  { code: 'GU', label: 'ગુજરાતી' },
  { code: 'HING', label: 'Hinglish' },
  { code: 'GUENG', label: 'Guj-Eng' },
];

export function SidePanel({ isOpen, onClose }: SidePanelProps) {
  const { currentDomain, pendingChatQuery, setPendingChatQuery } = useFarmStore();
  const [lang, setLang] = useState<LangCode>('EN');
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Hello! I am your KrishiSetu AI. How can I help optimize your operations today?` }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const translate = (textKey: string, code: LangCode) => {
    return TRANSLATIONS[textKey]?.[code] || textKey;
  };

  const detectLanguage = (text: string): LangCode | null => {
    if (/[ऀ-ॿ]/.test(text)) return 'HI';
    if (/[અ-હ]/.test(text)) return 'GU';
    return null;
  };

  useEffect(() => {
    if (isOpen && pendingChatQuery) {
      const query = pendingChatQuery;
      setPendingChatQuery(null);
      
      const userMsg = { role: 'user' as const, content: query };
      setMessages(prev => [...prev, userMsg]);
      
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: `${translate("Analyzing data...", lang)} Based on our Save Soil AI metrics, I recommend implementing cover cropping to sequester more carbon and using drip irrigation to maintain moisture level above 25%.` 
        }]);
      }, 1000);
    }
  }, [isOpen, pendingChatQuery, currentDomain, setPendingChatQuery, lang]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Auto-detect language if possible
    const detected = detectLanguage(input);
    const activeLang = detected || lang;
    if (detected && detected !== lang) setLang(detected);

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    
    // Mock response logic
    setTimeout(() => {
      let responseKey = "Please provide more details";
      const normalizedInput = input.toLowerCase();

      if (normalizedInput.includes("fertilizer") || normalizedInput.includes("urea") || normalizedInput.includes("khaad") || normalizedInput.includes("khaatar")) {
        responseKey = "Use urea and compost";
      } else if (normalizedInput.includes("pak") || normalizedInput.includes("crop") || normalizedInput.includes("fasal")) {
        responseKey = "Your crop needs better soil nutrients";
      }

      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: translate(responseKey, activeLang)
      }]);
    }, 1500);
  };

  const getPlaceholder = (code: LangCode) => {
    switch(code) {
      case 'HI': return "अपना सवाल पूछें...";
      case 'GU': return "તમારો પ્રશ્ન પૂછો...";
      case 'HING': return "Apna sawaal pucho...";
      case 'GUENG': return "Tamaro sawaal pucho...";
      default: return "Ask advisor anything...";
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
            {/* Header */}
            <div className="p-8 border-b border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                    <Sparkles size={120} className="text-teal-500" />
               </div>
               
               <div className="flex items-center justify-between relative z-10">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl glass border border-teal-500/20 flex items-center justify-center shadow-xl shadow-teal-500/10">
                     <Bot className="text-teal-500" size={28} />
                   </div>
                   <div>
                     <h2 className="text-xl font-display font-black text-white tracking-tight">KrishiSetu AI</h2>
                     <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                           <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest">{currentDomain} Mode</span>
                        </div>
                        
                        {/* Language Selector */}
                        <div className="relative">
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
                   </div>
                 </div>
                 <button 
                   onClick={onClose}
                   className="p-3 glass border border-white/5 rounded-xl hover:bg-white/5 transition-colors group"
                 >
                   <X size={20} className="text-text-muted group-hover:text-white group-hover:rotate-90 transition-transform" />
                 </button>
               </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {messages.map((m, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex flex-col max-w-[90%]",
                    m.role === 'user' ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "p-5 rounded-[24px] text-sm leading-relaxed font-bold tracking-tight shadow-lg",
                    m.role === 'user' 
                      ? "bg-teal-500 text-bg rounded-tr-none" 
                      : "glass border border-white/5 text-white rounded-tl-none"
                  )}>
                    {m.content}
                  </div>
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-2 px-1 opacity-50">
                    {m.role === 'user' ? 'You' : 'KrishiSetu AI'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-8 border-t border-white/5">
              <div className="relative group">
                <input
                  type="text"
                  placeholder={getPlaceholder(lang)}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full pl-6 pr-14 py-4 glass border border-white/10 rounded-2xl outline-none text-white font-medium focus:border-teal-500/40 transition-all placeholder:text-text-muted shadow-2xl"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="absolute right-2 top-2 p-3 bg-teal-500 text-bg rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center shadow-lg shadow-teal-500/20"
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-6 text-[10px] font-black text-text-muted uppercase tracking-widest opacity-50">
                 <div className="flex items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all cursor-help">
                    <Globe size={12} className="text-teal-500" />
                    <span>Multi-Language Active: {lang}</span>
                 </div>
                 <div className="w-1 h-1 bg-white/20 rounded-full" />
                 <span>AI v4 Multi-Engine</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
