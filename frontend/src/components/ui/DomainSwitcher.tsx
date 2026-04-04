import { useState } from 'react';
import { Globe, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFarmStore } from '../../store/farmStore';

const DOMAINS: Array<'AgriTech' | 'FinTech' | 'Health' | 'EdTech' | 'Civic'> = ['AgriTech', 'FinTech', 'Health', 'EdTech', 'Civic'];

export default function DomainSwitcher() {
  const { currentDomain, setDomain } = useFarmStore();
  const [showDomainSwitcher, setShowDomainSwitcher] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setShowDomainSwitcher(!showDomainSwitcher)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md glass border border-border group hover:border-teal-500/30 transition-all text-xs font-bold"
      >
        <Globe size={14} className="text-teal-500" />
        <span className="text-text tracking-wide">{currentDomain}</span>
        <Zap size={10} className={`transition-transform duration-300 ${showDomainSwitcher ? 'rotate-180 text-teal-500' : 'text-text-muted'}`} />
      </button>

      <AnimatePresence>
        {showDomainSwitcher && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-2 p-2 glass border border-border rounded-xl z-50 shadow-2xl min-w-[120px]"
          >
            {DOMAINS.map((domain) => (
              <button
                key={domain}
                onClick={() => {
                  setDomain(domain);
                  setShowDomainSwitcher(false);
                }}
                className={`w-full p-2 text-left text-xs font-bold rounded-lg transition-colors ${
                  currentDomain === domain ? 'bg-teal-500 text-bg' : 'text-text-muted hover:bg-surface-2 hover:text-text'
                }`}
              >
                {domain}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
