import { useState } from 'react';
import { Sprout, Sun, Moon, Menu, X, Search } from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';
import { useFarmStore } from '../../store/farmStore';
import DomainSwitcher from '../ui/DomainSwitcher';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher, { useLanguage } from '../ui/LanguageSwitcher';

export default function Topbar() {
  const { activePage, setActivePage, setCommandPaletteOpen } = useFarmStore();
  const { theme, toggle } = useTheme();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NAV_LINKS = [
    { label: t('dashboard'),       id: 'dashboard' },
    { label: t('soilReports'),    id: 'soil'      },
    { label: t('advisoryPortal'), id: 'advisory'  },
    { label: t('myCrops'),        id: 'crops'     },
    { label: t('weather'),         id: 'weather'   },
    { label: t('saveSoilAI'),      id: 'savesoil'  },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 h-14',
        'flex items-center gap-2 px-4 sm:px-6',
        'border-b border-border',
      )}
      style={{ background: 'var(--sidebar-bg)', backdropFilter: 'blur(8px)' }}
    >
      {/* ── LEFT: Logo ── */}
      <div
        onClick={() => setActivePage('landing')}
        className="flex items-center gap-2 mr-4 shrink-0 cursor-pointer group"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ background: 'var(--teal-dim)', border: '1px solid var(--teal)' }}
        >
          <Sprout className="w-5 h-5 text-teal-500" />
        </div>
        <div className="hidden sm:flex flex-col leading-none">
          <span
            className="text-sm font-black tracking-tight text-text"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            KrishiSetu
          </span>
          <span className="text-[7px] font-black uppercase tracking-widest text-teal-500 mt-0.5">
            {t('tagline')}
          </span>
        </div>
      </div>

      {/* ── CENTER: Nav links (Desktop) ── */}
      <nav className="hidden md:flex items-center gap-1 flex-1 overflow-x-auto scrollbar-none">
        {NAV_LINKS.map(link => {
          const active = activePage === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActivePage(link.id)}
              className={cn(
                'relative flex items-center px-4 py-2 rounded-lg',
                'text-[11px] font-black uppercase tracking-widest',
                'transition-all duration-200',
                active ? 'text-teal-500 bg-teal-500/10' : 'text-text-muted hover:bg-surface-2 hover:text-text'
              )}
            >
              {link.label}
              {active && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-500 rounded-full"
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* ── RIGHT: Controls ── */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* ⌘K Search button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="group flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-teal-500/10 hover:border-teal-500/40 relative overflow-hidden"
          style={{
            background:   'var(--surface-2)',
            border:       '1px solid var(--border)',
            color:        'var(--text-muted)',
          }}
          title="Search / Command Palette (Ctrl+K)"
        >
          <div className="absolute inset-0 bg-teal-500/0 group-hover:bg-teal-500/5 transition-colors" />
          <Search className="w-4 h-4 text-teal-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(20,184,166,0.5)] transition-all" />
          <span className="hidden lg:block group-hover:text-text transition-colors">Search</span>
          <kbd className="hidden sm:block opacity-30 group-hover:opacity-60 transition-opacity font-mono text-[9px] bg-white/5 px-1.5 py-0.5 rounded border border-white/10 ml-1">⌘K</kbd>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggle}
          className="p-2 rounded-lg transition-all active:scale-95 border border-border hover:bg-surface-2"
          aria-label="Toggle theme"
        >
          {theme === 'dark'
            ? <Sun  className="w-4 h-4 text-amber-500" />
            : <Moon className="w-4 h-4 text-teal-500" />
          }
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-3 border-l border-border ml-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-border shadow-sm bg-teal-500/10 text-teal-500"
          >
            RK
          </div>
          <div className="hidden xl:flex flex-col leading-none">
            <span className="text-xs font-black text-text">
              Rajesh Kumar
            </span>
            <span className="text-[9px] font-black text-text-muted uppercase tracking-widest mt-0.5">
              Green Valley Farm
            </span>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-text-muted hover:bg-surface-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-14 z-40 flex flex-col gap-1 p-6 md:hidden overflow-y-auto"
            style={{ background: 'var(--sidebar-bg)' }}
          >
            {NAV_LINKS.map(link => (
              <button
                key={link.id}
                onClick={() => {
                  setActivePage(link.id);
                  setMobileOpen(false);
                }}
                className={cn(
                    "w-full text-left px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest border border-transparent transition-all",
                    activePage === link.id 
                        ? "bg-teal-500/10 text-teal-500 border-border" 
                        : "text-text-muted hover:bg-surface-2"
                )}
              >
                {link.label}
              </button>
            ))}
            <div className="mt-6 pt-6 border-t border-border flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Active Domain</span>
                <DomainSwitcher />
              </div>
              <div className="p-4 rounded-xl glass border border-border">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-500 text-xs font-black">RK</div>
                      <div>
                          <p className="text-xs font-black text-text">Rajesh Kumar</p>
                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Green Valley Farm</p>
                      </div>
                  </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
