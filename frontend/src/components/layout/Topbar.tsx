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
  const { activePage, setActivePage, setCommandPaletteOpen, farmerName, avatar, farmName } = useFarmStore();
  const { theme, toggle } = useTheme();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: farmerName || 'Farmer',
    avatar: avatar || '',
    initials: farmerName ? farmerName.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'F'
  });

  const loadProfile = () => {
    // 1. Try generic user object
    const userJson = localStorage.getItem('user');
    const profileJson = localStorage.getItem('krishi_user_profile');
    
    if (userJson) {
      const user = JSON.parse(userJson);
      setProfile({
        name: user.name,
        avatar: user.avatar || '',
        initials: user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
      });
    } else if (profileJson) {
      const data = JSON.parse(profileJson);
      setProfile({
        name: data.name,
        avatar: data.avatar || '',
        initials: data.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
      });
    }
  };

  useEffect(() => {
    loadProfile();
    window.addEventListener('profileUpdate', loadProfile);
    return () => window.removeEventListener('profileUpdate', loadProfile);
  }, [farmerName, avatar]);

  const NAV_LINKS = [
    { label: t('dashboard'), id: 'dashboard', icon: LayoutDashboard },
    { label: t('soilReports'), id: 'soil', icon: FileText },
    { label: t('soilHealth.title'), id: 'soilhealth', icon: Activity },
    { label: t('market.title'), id: 'market', icon: TrendingUp },
    { label: t('advisoryPortal'), id: 'advisory', icon: Lightbulb },
    { label: t('myCrops'), id: 'crops', icon: Sprout },
    { label: t('weather'), id: 'weather', icon: CloudSun },
    { label: t('fertilizer'), id: 'fertilizer', icon: FlaskConical },
    { label: t('saveSoilAI'), id: 'savesoil', icon: Leaf },
  ];

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] h-20 md:h-18', // Consistent height
        'flex items-center justify-between px-6 md:px-10',
        'backdrop-blur-xl bg-surface/80 border-b border-border',
        'text-text transition-all duration-300'
      )}
    >
      {/* ── MOBILE: Left Brand ── */}
      <div
        onClick={() => setActivePage('landing')}
        className="flex md:hidden items-center gap-3 cursor-pointer py-2"
      >
        <Sprout className="w-7 h-7 text-teal-500" />
        <span className="text-teal-500 font-display font-black text-xl tracking-tight">KrishiSetu</span>
      </div>

      {/* ── LEFT: Desktop Logo ── */}
      <div
        onClick={() => setActivePage('landing')}
        className={cn(
          "items-center gap-2 mr-4 shrink-0 cursor-pointer group",
          "hidden md:flex"
        )}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ background: 'var(--teal-dim)', border: '1px solid var(--teal)' }}
        >
          <Sprout className="w-5 h-5 text-teal-500" />
        </div>
        <div className="flex flex-col leading-none">
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
                    ? 'bg-teal-500/20 text-teal-500 shadow-[0_5px_15px_rgba(34,197,94,0.2)]'
                    : 'text-text-muted hover:bg-surface-2 hover:text-teal-500'
                )}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              </button>

              {/* Floating Label / Tooltip */}
              <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-300 pointer-events-none">
                <div className="bg-surface-3 text-text text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-border shadow-xl whitespace-nowrap">
                  {link.label}
                </div>
              </div>
            </div>
          )
        })}
      </nav>

      {/* ── RIGHT: Controls ── */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0 flex-1 lg:flex-none justify-end">

        {/* Mobile Language Trigger (Mini) */}
        <div className="md:hidden pr-1 scale-90">
          <LanguageSwitcher />
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="group relative flex items-center gap-2.5 p-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-surface-2 border border-border active:scale-95 bg-surface"
            title="Search"
          >
            <Search className="w-5 h-5 text-teal-500" />
            <kbd className="hidden lg:block opacity-30 font-mono text-[9px] bg-bg px-1.5 py-0.5 rounded border border-border ml-1">⌘K</kbd>
          </button>
          <button 
            onClick={toggle} 
            className="p-2.5 rounded-xl transition-all border border-border hover:bg-surface-2 bg-surface text-text active:scale-90"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-teal-600" />}
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-1 pl-3 md:border-l border-border ml-1 group">
          <div
            onClick={() => setActivePage('profile')}
            className={cn(
              "flex items-center gap-3 hover:bg-surface-2 px-1.5 md:px-3 py-1.5 rounded-xl transition-all cursor-pointer border border-transparent",
              activePage === 'profile' ? "bg-surface-2 border-border shadow-inner" : ""
            )}
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-[10px] font-black border border-teal-500/20 shadow-lg bg-teal-500/10 text-teal-500 group-hover:scale-105 transition-all overflow-hidden">
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt="" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    setProfile({ ...profile, avatar: '' });
                  }}
                />
              ) : (
                profile.initials
              )}
            </div>
            <div className="hidden xl:flex flex-col leading-none">
              <span className="text-xs font-black text-text group-hover:text-teal-500 transition-colors">{profile.name}</span>
              <span className="text-[8px] font-black text-text-muted uppercase tracking-widest mt-0.5">{farmName || 'My Farm'}</span>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              setActivePage('landing');
            }}
            className={cn(
              "p-2.5 rounded-xl transition-all border border-border hover:bg-red-500/10 hover:text-red-500 group/logout active:scale-95 ml-1 bg-surface",
              "hidden md:block"
            )}
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* MOBILE: Hamburger Toggle */}
        <button
          className="md:hidden w-12 h-12 flex items-center justify-center rounded-2xl text-teal-500 hover:bg-teal-500/10 transition-all active:scale-90"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Full-Screen Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-bg md:hidden flex flex-col overflow-hidden"
          >
            {/* Header in Menu */}
            <div className="flex items-center justify-between px-8 h-24 border-b border-border bg-surface/50 backdrop-blur-md shrink-0">
               <div className="flex items-center gap-3">
                 <Sprout className="w-8 h-8 text-teal-500" />
                 <span className="text-teal-500 font-display font-black text-2xl tracking-tight">KrishiSetu</span>
               </div>
               <button 
                 onClick={() => setMobileOpen(false)}
                 className="w-12 h-12 flex items-center justify-center rounded-2xl bg-surface border border-border text-text active:scale-95 transition-all shadow-md"
               >
                 <X size={32} />
               </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              
              {/* Quick Profile Section */}
              <div 
                onClick={() => { setActivePage('profile'); setMobileOpen(false); }}
                className="p-6 rounded-[2rem] bg-surface border border-border flex items-center gap-5 shadow-xl"
              >
                <div className="w-16 h-16 rounded-2xl border-2 border-teal-500/30 bg-teal-500/10 flex items-center justify-center text-2xl font-black text-teal-500 overflow-hidden">
                  {profile.avatar ? <img src={profile.avatar} alt="" className="w-full h-full object-cover" /> : profile.initials}
                </div>
                <div className="flex flex-col">
                   <span className="text-xl font-black text-text">{profile.name}</span>
                   <span className="text-xs font-bold text-teal-500 uppercase tracking-[0.2em]">{t('tagline')}</span>
                </div>
              </div>

              {/* Theme & Search Shortcuts for Mobile */}
              <div className="flex gap-4">
                <button 
                  onClick={() => { setCommandPaletteOpen(true); setMobileOpen(false); }}
                  className="flex-1 flex flex-col items-center justify-center gap-3 py-6 rounded-3xl bg-surface border border-border active:scale-95 transition-all text-teal-500 shadow-md"
                >
                  <Search size={24} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('search')}</span>
                </button>
                <button 
                  onClick={() => { toggle(); setMobileOpen(false); }}
                  className="flex-1 flex flex-col items-center justify-center gap-3 py-6 rounded-3xl bg-surface border border-border active:scale-95 transition-all shadow-md"
                >
                  {theme === 'dark' ? <Sun size={24} className="text-amber-500" /> : <Moon size={24} className="text-teal-600" />}
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text">
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-4">
                <div className="px-4 mb-4">
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-text-muted opacity-50">Navigation Menu</span>
                </div>
                {NAV_LINKS.map(link => {
                  const Icon = link.icon;
                  const active = activePage === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => {
                        setActivePage(link.id);
                        setMobileOpen(false);
                      }}
                      className={cn(
                        "w-full text-left p-6 rounded-[1.5rem] text-[13px] font-black uppercase tracking-[0.15em] border transition-all flex items-center justify-between group",
                        active
                          ? "bg-teal-500 text-bg border-teal-600 shadow-[0_15px_40px_rgba(34,197,94,0.25)] scale-[1.02]"
                          : "text-text border-border bg-surface hover:bg-surface-2"
                      )}
                    >
                      <div className="flex items-center gap-6">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform group-active:scale-90",
                          active ? "bg-white/20" : "bg-surface-2"
                        )}>
                          <Icon size={24} className={active ? "text-white" : "text-teal-500"} />
                        </div>
                        <span className="font-display">{link.label}</span>
                      </div>
                      {active && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Logout Footer */}
            <div className="p-8 border-t border-border bg-surface">
               <button
                 onClick={() => {
                   localStorage.removeItem('isLoggedIn');
                   setActivePage('landing');
                   setMobileOpen(false);
                 }}
                 className="w-full flex items-center justify-center gap-4 py-6 rounded-[1.5rem] bg-red-500/5 text-red-500 text-sm font-black uppercase tracking-widest border border-red-500/10 active:scale-95 transition-all shadow-sm"
               >
                 <LogOut size={22} />
                 Sign Out Account
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
