import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, Zap, ChevronRight, Bot } from 'lucide-react';
import { useFarmStore } from '../../store/farmStore';
import { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SidePanel({ isOpen, onClose }: SidePanelProps) {
  const { currentDomain, pendingChatQuery, setPendingChatQuery } = useFarmStore();
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Hello! I am your ${currentDomain} Advisor. How can I help optimize your operations today?` }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && pendingChatQuery) {
      const query = pendingChatQuery;
      // Clear store query immediately
      setPendingChatQuery(null);
      
      // Process the query
      const userMsg = { role: 'user' as const, content: query };
      setMessages(prev => [...prev, userMsg]);
      
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: `Analyzing ${currentDomain} climate data for your request: "${query}"... Based on our Save Soil AI metrics, I recommend implementing cover cropping to sequester more carbon and using drip irrigation to maintain moisture level above 25%.` 
        }]);
      }, 1000);
    }
  }, [isOpen, pendingChatQuery, currentDomain, setPendingChatQuery]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `Analyzing ${currentDomain} data... Based on current sensor readings, I recommend increasing irrigation by 15% in the north sector to maintain optimal root health.` 
      }]);
    }, 1500);
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
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
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

            {/* Recommended Prompts */}
            <div className="p-8 border-t border-white/5 bg-white/[0.02] space-y-4">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Suggested Guidance</p>
                <div className="flex flex-wrap gap-2">
                    {['Optimize Yield', 'Soil Deficiencies', 'Market Trends'].map(p => (
                        <button 
                            key={p}
                            onClick={() => setInput(p)}
                            className="px-4 py-2 glass border border-white/10 rounded-xl text-[10px] font-black text-white hover:border-teal-500/30 hover:bg-teal-500/5 transition-all flex items-center gap-2 group uppercase tracking-widest"
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
                  placeholder="Ask advisor anything..."
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
                    <Zap size={12} />
                    <span>Turbo Sync Active</span>
                 </div>
                 <div className="w-1 h-1 bg-white/20 rounded-full" />
                 <span>KrishiSetu AI Engine v4</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
