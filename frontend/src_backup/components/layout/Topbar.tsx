import { useState } from 'react';
import {
  Sprout, Sun, Moon, Menu, X, Search,
  LayoutDashboard, FileText,
  TrendingUp, Lightbulb, CloudSun,
  Leaf, LogOut, Activity, FlaskConical,
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTheme } from '../../providers/ThemeProvider';
import { useFarmStore } from '../../store/farmStore';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from '../ui/LanguageSwitcher';

const NAV_LINKS = [
  { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
  { label: 'Soil Reports', path: '/app/soil', icon: FileText },
  { label: 'Soil Health', path: '/app/soilhealth', icon: Activity },
  { label: 'Market', path: '/app/market', icon: TrendingUp },
  { label: 'Advisory', path: '/app/advisory', icon: Lightbulb },
  { label: 'Crops', path: '/app/crops', icon: Sprout },
  { label: 'Weather', path: '/app/weather', icon: CloudSun },
  { label: 'Research', path: '/app/fertilizer', icon: FlaskConical },
  { label: 'Environment', path: '/app/savesoil', icon: Leaf },
];

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    setCommandPaletteOpen,
    isDemoMode,
    setDemoMode,
    farmName,
  } = useFarmStore();

  const { user, logout, isAuthenticated } = useAuthStore();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-[60] h-16',
        'flex items-center justify-between px-4 sm:px-6',
        'backdrop-blur-lg bg-bg/85 border-b border-white/5',
        'text-white transition-all duration-300'
      )}
    >
      <Link
        to="/"
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
          <span className="text-[9px] font-black uppercase tracking-widest text-teal-500">
            {isDemoMode ? 'Demo Sandbox' : 'Live Intelligence'}
          </span>
        </div>
      </Link>

      <nav className="hidden md:flex items-center gap-4 flex-1 justify-center max-w-5xl">
        {NAV_LINKS.map((link) => {
          const active = location.pathname === link.path;
          const Icon = link.icon;
          return (
            <div key={link.path} className="relative group flex flex-col items-center">
              <Link
                to={link.path}
                className={cn(
                  'w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 border border-transparent',
                  active
                    ? 'bg-teal-500/20 text-teal-500 border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.2)]'
                    : 'text-text-muted hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              </Link>
              <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-300 pointer-events-none">
                <div className="bg-surface-3 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/10 shadow-xl whitespace-nowrap">
                  {link.label}
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      <div className="flex items-center gap-4 shrink-0 flex-1 lg:flex-none justify-end">
        <div className="hover:scale-105 transition-all duration-300">
          <LanguageSwitcher />
        </div>

        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="group relative flex items-center gap-2.5 p-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-green-700/30 hover:shadow-[0_0_15px_rgba(34,197,94,0.1)] border border-white/5 active:scale-95"
          style={{ background: 'var(--surface-2)' }}
          title="Search / Command Palette (Ctrl+K)"
        >
          <Search className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
          <kbd className="hidden lg:block opacity-30 font-mono text-[9px] bg-white/5 px-1.5 py-0.5 rounded border border-white/10 ml-1">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={toggle}
          className="p-2.5 rounded-xl transition-all border border-white/5 hover:bg-white/5 hover:scale-110 active:scale-95"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : (
            <Moon className="w-4 h-4 text-teal-500" />
          )}
        </button>

        {(isAuthenticated || isDemoMode) ? (
          <div className="flex items-center gap-1 pl-3 border-l border-white/10 ml-1 group">
            <Link
              to="/app/profile"
              className={cn(
                'flex items-center gap-3 hover:bg-white/5 px-3 py-1.5 rounded-xl transition-all cursor-pointer border border-transparent',
                location.pathname === '/app/profile' ? 'bg-white/10 border-white/10 shadow-lg' : ''
              )}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black border border-teal-500/20 shadow-lg bg-teal-500/10 text-teal-500 group-hover:scale-105 transition-all overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  (user?.name || (isDemoMode ? 'Rajesh Kumar' : 'RK'))
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                )}
              </div>
              <div className="hidden xl:flex flex-col leading-none">
                <span className="text-xs font-black text-white group-hover:text-teal-400 transition-colors">
                  {user?.name || 'Rajesh Kumar'}
                </span>
                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mt-0.5">
                  {user?.farmName || 'GREEN FARM'}
                </span>
              </div>
            </Link>

            <button
              onClick={() => {
                logout();
                setDemoMode(false);
                navigate('/');
              }}
              className="p-2.5 rounded-xl transition-all border border-white/5 hover:bg-red-500/10 hover:text-red-500 active:scale-95 ml-1"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-white/10 ml-1">
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="px-4 py-2 bg-teal-500 text-bg text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-teal-500/20"
            >
              Sign Up
            </button>
          </div>
        )}

        <button
          className="md:hidden p-2.5 rounded-xl text-white/40 hover:bg-white/5 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-16 z-40 flex flex-col gap-2 p-6 md:hidden overflow-y-auto"
            style={{ background: 'var(--sidebar-bg)' }}
          >
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'w-full text-left px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest border border-transparent transition-all flex items-center gap-4',
                    active
                      ? 'bg-teal-500/10 text-teal-500 border-teal-500/20'
                      : 'text-white/40 hover:bg-white/5'
                  )}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}