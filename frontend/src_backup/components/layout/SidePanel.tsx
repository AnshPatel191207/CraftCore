import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sprout, SendHorizontal, Bot, Loader2, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useFarmStore } from '../../store/farmStore';
import { aiService } from '../../services/aiService';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function SidePanel({ isOpen, onClose, title = "AI Advisor" }: SidePanelProps) {
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { 
    chatHistory, 
    addChatMessage, 
    isAiLoading, 
    setAiLoading, 
    isDemoMode,
    pendingChatQuery,
    setPendingChatQuery,
    clearChat
  } = useFarmStore();

  // Scroll to bottom on many messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isAiLoading]);

  // Handle incoming queries from other pages
  useEffect(() => {
    if (isOpen && pendingChatQuery) {
      handleSendMessage(pendingChatQuery);
      setPendingChatQuery(null);
    }
  }, [isOpen, pendingChatQuery]);

  const handleSendMessage = async (text: string) => {
    const query = text.trim();
    if (!query || isAiLoading) return;

    // 1. Add user message
    addChatMessage({ role: 'user', text: query });
    setMessage('');
    setAiLoading(true);

    try {
      // 2. Call AI (Real or Mock)
      const response = isDemoMode 
        ? await aiService.getMockResponse(query)
        : await aiService.ask(query);

      // 3. Add bot message
      addChatMessage({ 
        role: 'bot', 
        text: response.answer, 
        sources: response.sources 
      });
    } catch (error: any) {
      addChatMessage({ 
        role: 'bot', 
        text: `Error: ${error.message || 'Something went wrong. Please check your connection.'}` 
      });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-earth-900/10 backdrop-blur-[2px] pointer-events-auto"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 bottom-0 w-full max-w-[420px] bg-white border-l border-earth-200 shadow-2xl flex flex-col pointer-events-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-earth-100 bg-earth-50/50">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                    <Bot className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-earth-900 leading-none">{title}</h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-500"></span>
                      </span>
                      <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest leading-none">
                        {isAiLoading ? 'Thinking...' : 'AI Online'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={clearChat}
                    title="Clear history"
                    className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors text-earth-300"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button 
                    onClick={onClose} 
                    className="p-2 hover:bg-earth-100 rounded-xl transition-colors text-earth-400"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
              {chatHistory.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex flex-col gap-1.5",
                    msg.role === 'user' ? "items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[88%] p-4 text-sm leading-relaxed shadow-sm whitespace-pre-wrap",
                    msg.role === 'user' 
                      ? "bg-earth-800 text-white rounded-2xl rounded-tr-none font-medium" 
                      : "bg-earth-50 text-earth-800 rounded-2xl rounded-tl-none border border-earth-100"
                  )}>
                    {msg.text}

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-earth-200/50">
                        <p className="text-[9px] font-black text-earth-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <Sprout size={10} /> Data Sources
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {msg.sources.map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-earth-200/40 text-[9px] font-bold text-earth-600">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-earth-300 px-1 uppercase">{msg.time}</span>
                </motion.div>
              ))}

              {isAiLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-start gap-1.5"
                >
                  <div className="bg-earth-50 text-earth-400 rounded-2xl rounded-tl-none border border-earth-100 p-4 flex items-center gap-3">
                    <Loader2 size={16} className="animate-spin text-teal-500" />
                    <span className="text-xs font-bold italic tracking-wide">Synthesizing intelligence...</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-earth-50/50 border-t border-earth-100">
              <div className="relative">
                <textarea
                  placeholder="Ask about crops, soil, weather..."
                  rows={2}
                  className="w-full bg-white border border-earth-200 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all shadow-sm resize-none font-medium"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(message);
                    }
                  }}
                />
                <button 
                  onClick={() => handleSendMessage(message)}
                  className={cn(
                    "absolute right-2.5 top-2.5 p-3 rounded-xl transition-all duration-300",
                    message && !isAiLoading
                      ? "bg-teal-600 text-white shadow-lg shadow-teal-500/30 scale-100 hover:bg-teal-700" 
                      : "bg-earth-100 text-earth-300 scale-95 opacity-50 cursor-not-allowed"
                  )}
                  disabled={!message || isAiLoading}
                >
                  <SendHorizontal size={20} />
                </button>
              </div>
              <p className="mt-3 text-[9px] text-center text-earth-400 font-black uppercase tracking-[0.2em]">
                {isDemoMode ? 'Demo AI Active' : 'KrishiSetu Intelligence Engine'}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
