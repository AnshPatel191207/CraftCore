import { useState } from 'react';
import { Sprout, Terminal, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';
import { useFarmStore } from '../../store/farmStore';
import DomainSwitcher from '../ui/DomainSwitcher';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Dashboard',       id: 'dashboard' },
  { label: 'Soil Reports',    id: 'soil'      },
  { label: 'Advisory Portal', id: 'advisory'  },
  { label: 'My Crops',        id: 'crops'     },
  { label: 'Weather',         id: 'weather'   },
];

export default function Topbar() {
  const { activePage, setActivePage, setCommandPaletteOpen } = useFarmStore();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

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
            AgriSense
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest text-teal-500">
            Live Intelligence
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

        {/* Domain Switcher */}
        <div className="hidden lg:block">
          <DomainSwitcher />
        </div>

        {/* LIVE indicator */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest"
          style={{
            background: 'var(--teal-dim)',
            color:      'var(--teal-500)',
            border:     '1px solid var(--border)',
          }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-teal-500" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-500" />
          </span>
          LIVE
        </div>

        {/* ⌘K Search button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:bg-surface-2"
          style={{
            background:   'var(--surface-2)',
            border:       '1px solid var(--border)',
            color:        'var(--text-muted)',
          }}
          title="Command Palette (Ctrl+K)"
        >
          <Terminal className="w-3.5 h-3.5" />
          <kbd className="hidden sm:block opacity-50">⌘K</kbd>
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
