import { useState } from 'react';
import { 
  Sprout, Sun, Moon, Menu, X, Search, 
  LayoutDashboard, FileText, Activity, 
  TrendingUp, Lightbulb, CloudSun, 
  FlaskConical, Leaf, LogOut 
} from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';
import { useFarmStore } from '../../store/farmStore';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher, { useLanguage } from '../ui/LanguageSwitcher';
import { useEffect } from 'react';

export default function Topbar() {
  const { activePage, setActivePage, setCommandPaletteOpen } = useFarmStore();
  const { theme, toggle } = useTheme();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Rajesh Kumar',
    avatar: '',
    initials: 'RK'
  });

  const loadProfile = () => {
    const saved = localStorage.getItem('krishi_user_profile');
    if (saved) {
      const data = JSON.parse(saved);
      setProfile({
        name: data.name,
        avatar: data.avatar,
        initials: data.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
      });
    }
  };

  useEffect(() => {
    loadProfile();
    window.addEventListener('profileUpdate', loadProfile);
    return () => window.removeEventListener('profileUpdate', loadProfile);
  }, []);

  const NAV_LINKS = [
    { label: t('dashboard'),       id: 'dashboard',  icon: LayoutDashboard },
    { label: t('soilReports'),    id: 'soil',       icon: FileText },
    { label: t('soilHealth.title'), id: 'soilhealth', icon: Activity },
    { label: t('market.title'),    id: 'market',     icon: TrendingUp },
    { label: t('advisoryPortal'), id: 'advisory',   icon: Lightbulb },
    { label: t('myCrops'),        id: 'crops',      icon: Sprout },
    { label: t('weather'),         id: 'weather',    icon: CloudSun },
    { label: t('fertilizer'),      id: 'fertilizer', icon: FlaskConical },
    { label: t('saveSoilAI'),      id: 'savesoil',   icon: Leaf },
  ];

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 h-16',
        'flex items-center justify-between px-6 md:px-10',
        'backdrop-blur-lg bg-green-950/80 border-b border-green-800/30',
        'text-white transition-all duration-300'
      )}
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

      {/* ── CENTER: Icon-based Minimal Nav (Desktop) ── */}
      <nav className="hidden md:flex items-center gap-4 flex-1 justify-center max-w-5xl">
        {NAV_LINKS.map(link => {
          const active = activePage === link.id;
          const Icon = link.icon;
          return (
            <div key={link.id} className="relative group flex flex-col items-center">
               <button
                 onClick={() => setActivePage(link.id)}
                 className={cn(
                   'w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110',
                   active 
                     ? 'bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                     : 'text-green-300/50 hover:bg-green-700/30 hover:text-green-300'
                 )}
               >
                 <Icon size={22} strokeWidth={active ? 2.5 : 2} />
               </button>
               
               {/* Floating Label / Tooltip */}
               <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-300 pointer-events-none">
                  <div className="bg-green-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-green-700/50 shadow-xl whitespace-nowrap">
                     {link.label}
                  </div>
               </div>
            </div>
          )
        })}
      </nav>

      {/* ── RIGHT: Controls ── */}
      <div className="flex items-center gap-4 shrink-0 flex-1 lg:flex-none justify-end">

        {/* Language Switcher */}
        <div className="hover:scale-105 transition-all duration-300">
           <LanguageSwitcher />
        </div>

        {/* ⌘K Search button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="group relative flex items-center gap-2.5 p-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-green-700/30 hover:shadow-[0_0_15px_rgba(34,197,94,0.1)] border border-white/5 active:scale-95"
          style={{ background: 'var(--surface-2)' }}
          title="Search / Command Palette (Ctrl+K)"
        >
          <Search className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
          <kbd className="hidden lg:block opacity-30 font-mono text-[9px] bg-white/5 px-1.5 py-0.5 rounded border border-white/10 ml-1">⌘K</kbd>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggle}
          className="p-2.5 rounded-xl transition-all border border-white/5 hover:bg-white/5 hover:scale-110 active:scale-95"
          aria-label="Toggle theme"
        >
          {theme === 'dark'
            ? <Sun  className="w-4 h-4 text-amber-500" />
            : <Moon className="w-4 h-4 text-teal-500" />
          }
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-1 pl-3 border-l border-white/10 ml-1 group">
          <div 
            onClick={() => setActivePage('profile')}
            className={cn(
              "flex items-center gap-3 hover:bg-white/5 px-3 py-1.5 rounded-xl transition-all cursor-pointer border border-transparent",
              activePage === 'profile' ? "bg-white/10 border-white/10 shadow-lg" : ""
            )}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black border border-green-500/20 shadow-lg bg-green-500/10 text-green-400 group-hover:scale-105 transition-all overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                profile.initials
              )}
            </div>
            <div className="hidden xl:flex flex-col leading-none">
              <span className="text-xs font-black text-white group-hover:text-green-300 transition-colors">{profile.name}</span>
              <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mt-0.5">Green Farm</span>
            </div>
          </div>
          
          <button 
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              setActivePage('landing');
            }}
            className="p-2.5 rounded-xl transition-all border border-white/5 hover:bg-red-500/10 hover:text-red-500 group/logout active:scale-95 ml-1"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2.5 rounded-xl text-white/40 hover:bg-white/5 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-16 z-40 flex flex-col gap-2 p-6 md:hidden overflow-y-auto"
            style={{ background: 'var(--sidebar-bg)' }}
          >
            {NAV_LINKS.map(link => {
              const Icon = link.icon;
              return (
              <button
                key={link.id}
                onClick={() => {
                  setActivePage(link.id);
                  setMobileOpen(false);
                }}
                className={cn(
                  "w-full text-left px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest border border-transparent transition-all flex items-center gap-4",
                  activePage === link.id
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "text-white/40 hover:bg-white/5"
                )}
              >
                <Icon size={18} />
                {link.label}
              </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
