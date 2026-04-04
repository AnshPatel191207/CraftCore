import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Languages, ChevronDown, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Language } from '../../lib/translations';
import {
  LANGUAGES,
  getSavedLanguage,
  saveLanguage,
  t as translateKey,
} from '../../lib/translations';

// ── Context (optional – lets any child component read the active language) ──
interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextValue>({
  language: 'EN',
  setLanguage: () => { },
  t: (key) => key,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

// ── Provider (wrap your app root if you want global access) ──────────────────
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getSavedLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    saveLanguage(lang);
  };

  const t = (key: string): string => {
    return translateKey(key, language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ── The Switcher Button Component ────────────────────────────────────────────
export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeLang = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  return (
    <div ref={ref} className="relative" id="language-switcher">
      {/* Trigger button — matches DomainSwitcher/Command-palette button style */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Switch language"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md glass border border-border group hover:border-teal-500/30 transition-all text-xs font-bold"
      >
        <Languages size={14} className="text-teal-500 shrink-0" />
        <span className="text-text tracking-wide">{activeLang.code}</span>
        <ChevronDown
          size={10}
          className={`transition-transform duration-200 ${open ? 'rotate-180 text-teal-500' : 'text-text-muted'
            }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            className="absolute top-full right-0 mt-3 p-2 bg-[#0a1a0f] border border-green-800/50 rounded-2xl z-[100] shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-[180px] backdrop-blur-xl"
          >
            <div className="px-3 py-2 mb-1 border-b border-white/5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500/50">Select Language</span>
            </div>
            <div className="space-y-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-4 px-4 py-3 rounded-xl text-xs font-black transition-all duration-200 ${language === lang.code
                      ? 'bg-green-500 text-[#051008] shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                      : 'text-green-100 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[13px] tracking-tight">{lang.nativeLabel}</span>
                    <span className={`text-[9px] uppercase tracking-widest ${language === lang.code ? 'opacity-60' : 'opacity-30'}`}>
                      {lang.label}
                    </span>
                  </div>

                  {language === lang.code && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle size={14} strokeWidth={3} />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
