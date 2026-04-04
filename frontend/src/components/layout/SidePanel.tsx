import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sprout, SendHorizontal, Bot } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const mockMessages = [
  { role: 'bot', text: 'Hello! I\'m your KrishiSetu AI advisor. How can I help with your fields today?', time: '9:00 AM' },
  { role: 'user', text: 'Should I start sowing wheat in Field A?', time: '9:02 AM' },
  { 
    role: 'bot', 
    text: 'Based on current soil moisture (28%) and the 7-day forecast showing moderate rain, I recommend waiting 3-4 days for optimal conditions.',
    time: '9:02 AM',
    hasRecommendation: true 
  },
];

export function SidePanel({ isOpen, onClose, title = "AI Advisor" }: SidePanelProps) {
  const [message, setMessage] = useState('');

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
            className="absolute top-0 right-0 bottom-0 w-full max-w-[400px] bg-white border-l border-earth-200 shadow-2xl flex flex-col pointer-events-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-earth-100 bg-earth-50/50">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl leaf-gradient flex items-center justify-center shadow-lg shadow-leaf-500/20">
                    <Bot className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-earth-900">{title}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-leaf-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-leaf-500"></span>
                      </span>
                      <p className="text-[10px] font-bold text-leaf-600 uppercase tracking-widest leading-none">Online</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 hover:bg-earth-100 rounded-xl transition-colors text-earth-400"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {mockMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className={cn(
                    "flex flex-col gap-1.5",
                    msg.role === 'user' ? "items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[85%] p-4 text-sm leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? "bg-earth-800 text-white rounded-2xl rounded-tr-none font-medium" 
                      : "bg-earth-50 text-earth-800 rounded-2xl rounded-tl-none border border-earth-100"
                  )}>
                    {msg.text}
                  </div>
                  {msg.hasRecommendation && (
                    <div className="w-full mt-2 p-4 bg-leaf-50 rounded-2xl border border-leaf-100 space-y-3">
                      <div className="flex items-center gap-2">
                        <Sprout className="text-leaf-600" size={18} />
                        <span className="font-bold text-leaf-700 text-sm">Optimal Sowing Window</span>
                      </div>
                      <p className="text-xs text-leaf-600 font-medium">
                        Targeting Oct 24 - Oct 28 based on soil temp and moisture trends.
                      </p>
                      <div className="pt-2 border-t border-leaf-200/50 flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase text-leaf-500 tracking-wider">Confidence Level</span>
                        <span className="text-xs font-bold text-leaf-700">89%</span>
                      </div>
                    </div>
                  )}
                  <span className="text-[10px] font-bold text-earth-300 px-1 uppercase">{msg.time}</span>
                </motion.div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-earth-50/50 border-t border-earth-100">
              <div className="relative">
                <textarea
                  placeholder="Ask about crops, soil, weather..."
                  rows={1}
                  className="w-full bg-white border border-earth-200 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/5 transition-all shadow-sm resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button 
                  className={cn(
                    "absolute right-2 top-2 p-2.5 rounded-xl transition-all duration-300",
                    message 
                      ? "bg-leaf-600 text-white shadow-lg shadow-leaf-500/30 scale-100" 
                      : "bg-earth-200 text-earth-400 scale-95 opacity-50"
                  )}
                  disabled={!message}
                >
                  <SendHorizontal size={18} />
                </button>
              </div>
              <p className="mt-3 text-[10px] text-center text-earth-400 font-bold uppercase tracking-widest">
                Powered by AgriSense Core AI
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
