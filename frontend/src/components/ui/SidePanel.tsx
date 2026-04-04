import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Bot, Sparkles, Send, Trash2, ChevronRight, Zap, Loader2 } from 'lucide-react';
import { useFarmStore } from '../../store/farmStore';
import { useState, useRef, useEffect } from 'react';
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

export function SidePanel({ isOpen, onClose }: SidePanelProps) {
  const { currentDomain, isDemoMode } = useFarmStore();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: `Hello! I am your ${currentDomain} Advisor. How can I help optimize your operations today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      if (isDemoMode) {
        // Simulate AI response in demo mode
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            role: 'ai', 
            content: `[Demo Mode] Analyzing ${currentDomain} data... Based on current simulations, I recommend increasing nitrogen levels by 10% in Field A.` 
          }]);
          setLoading(false);
        }, 1200);
      } else {
        const res = await api.post('/rag/ask', { question: input });
        setMessages(prev => [...prev, { role: 'ai', content: res.data.data.answer }]);
        setLoading(false);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: `Error: ${getApiError(err)}` }]);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-bg/40 backdrop-blur-sm z-[110]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-[480px] bg-surface border-l border-white/5 shadow-2xl z-[120] flex flex-col"
          >
            {/* Header */}
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
                        <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest">{currentDomain} Focus Mode</span>
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
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
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
                    {m.role === 'user' ? 'You' : 'AgriSense AI'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
              ))}
              
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-4">
                  <div className="p-5 glass border border-white/5 rounded-[24px] rounded-tl-none flex items-center gap-3">
                    <Loader2 size={16} className="animate-spin text-teal-500" />
                    <span className="text-xs font-bold text-text-muted">Analyzing knowledge base...</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Suggested Guidance */}
            <div className="p-8 border-t border-white/5 bg-white/[0.02] space-y-4">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Suggested Guidance</p>
                <div className="flex flex-wrap gap-2">
                    {['Optimize Yield', 'Soil Deficiencies', 'Market Trends'].map(p => (
                        <button 
                            key={p}
                            onClick={() => setInput(p)}
                            disabled={loading}
                            className="px-4 py-2 glass border border-white/10 rounded-xl text-[10px] font-black text-white hover:border-teal-500/30 hover:bg-teal-500/5 transition-all flex items-center gap-2 group uppercase tracking-widest disabled:opacity-50"
                        >
                            <ChevronRight size={12} className="text-teal-500" />
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-8 border-t border-white/5">
              <div className="relative group">
                <input
                  type="text"
                  placeholder={loading ? "AI is thinking..." : "Ask advisor anything..."}
                  disabled={loading}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full pl-6 pr-14 py-4 glass border border-white/10 rounded-2xl outline-none text-white font-medium focus:border-teal-500/40 transition-all placeholder:text-text-muted shadow-2xl disabled:opacity-50"
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
                 <div className="flex items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all cursor-help">
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

