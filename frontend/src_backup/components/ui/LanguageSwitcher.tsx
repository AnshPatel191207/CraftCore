import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Languages, ChevronDown } from 'lucide-react';
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
  setLanguage: () => {},
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
          className={`transition-transform duration-200 ${
            open ? 'rotate-180 text-teal-500' : 'text-text-muted'
          }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 p-2 glass border border-border rounded-xl z-50 shadow-2xl min-w-[140px]"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                  language === lang.code
                    ? 'bg-teal-500 text-bg'
                    : 'text-text-muted hover:bg-surface-2 hover:text-text'
                }`}
              >
                <span>{lang.nativeLabel}</span>
                <span
                  className={`text-[9px] font-black tracking-widest uppercase ${
                    language === lang.code ? 'opacity-70' : 'opacity-40'
                  }`}
                >
                  {lang.code}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
