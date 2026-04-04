import { useState, useEffect } from 'react';
import { Sprout, Terminal, Sun, Moon, Menu, X, WifiOff, Database, FlaskConical, LogOut } from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';
import { useFarmStore } from '../../store/farmStore';
import { useAuthStore } from '../../store/authStore';
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
  const { activePage, setActivePage, setCommandPaletteOpen, isDemoMode, setDemoMode, farmName } = useFarmStore();
  const { user, logout } = useAuthStore();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 h-14',
        'flex items-center gap-2 px-4 sm:px-6',
        'border-b border-border transition-all duration-300',
      )}
      style={{ background: 'var(--sidebar-bg)', backdropFilter: 'blur(8px)' }}
    >
      {/* ── LEFT: Logo ── */}
      <div
        onClick={() => setActivePage('dashboard')}
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
            {isDemoMode ? 'Demo Sandbox' : 'Live Intelligence'}
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

        {/* Demo Mode Toggle (Dev Utility) */}
        <button
          onClick={() => setDemoMode(!isDemoMode)}
          className={cn(
            "hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all",
            isDemoMode 
              ? "bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20" 
              : "bg-surface-2 border-border text-text-muted hover:text-text"
          )}
          title={isDemoMode ? "Switch to Live API" : "Switch to Demo Mode"}
        >
          {isDemoMode ? <FlaskConical size={12} /> : <Database size={12} />}
          {isDemoMode ? "Demo Mode" : "Live API"}
        </button>

        {/* Online Status */}
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
          isOnline ? "bg-teal-500/10 border-teal-500/20 text-teal-500" : "bg-error/10 border-error/20 text-error"
        )}>
          {isOnline ? (
            <>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-teal-500" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-500" />
              </span>
              Connected
            </>
          ) : (
            <>
              <WifiOff size={12} />
              Offline
            </>
          )}
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

        {/* User Profile & Logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-border ml-1 group relative">
          <div className="flex flex-col leading-none text-right hidden lg:flex">
            <span className="text-xs font-black text-text uppercase tracking-tight">
              {user?.name || 'Farmer'}
            </span>
            <span className="text-[9px] font-black text-text-muted uppercase tracking-widest mt-0.5">
              {user?.farmName || farmName || 'AgriSense'}
            </span>
          </div>
          <button 
            onClick={logout}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-teal-500/10 border border-teal-500/20 text-teal-500 hover:bg-error/10 hover:border-error/20 hover:text-error transition-all"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 top-14 z-40 flex flex-col gap-1 p-6 md:hidden overflow-y-auto"
            style={{ background: 'var(--sidebar-bg)' }}
          >
            <div className="flex flex-col gap-2">
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
            </div>
            
            <div className="mt-auto pt-6 border-t border-border flex flex-col gap-4">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Environment</span>
                  <button
                    onClick={() => setDemoMode(!isDemoMode)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                      isDemoMode ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-teal-500/10 border-teal-500/20 text-teal-500"
                    )}
                  >
                    {isDemoMode ? "Demo Mode" : "Live API"}
                  </button>
               </div>
               <div className="p-4 rounded-2xl glass border border-border flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500 text-xs font-black">
                        {(user?.name || 'F').charAt(0)}
                      </div>
                      <div>
                          <p className="text-xs font-black text-text capitalize">{user?.name || 'Farmer'}</p>
                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">{user?.farmName || farmName}</p>
                      </div>
                   </div>
                   <button onClick={logout} className="p-3 rounded-xl bg-error/10 text-error"><LogOut size={18} /></button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

