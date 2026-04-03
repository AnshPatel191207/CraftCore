import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutDashboard, FileText, MessageSquareWarning, Sprout, CloudSun, Command, Globe, Zap, Cpu, ShieldCheck } from 'lucide-react';
import { useFarmStore } from '../../store/farmStore';
import { cn } from '../../lib/utils';

const commandItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Pages', shortcut: 'G D' },
  { id: 'soil', label: 'Soil Analysis', icon: FileText, group: 'Pages', shortcut: 'G S' },
  { id: 'advisory', label: 'AI Advisory', icon: MessageSquareWarning, group: 'Pages', shortcut: 'G A' },
  { id: 'crops', label: 'Crop Monitor', icon: Sprout, group: 'Pages', shortcut: 'G C' },
  { id: 'weather', label: 'Weather Forecast', icon: CloudSun, group: 'Pages', shortcut: 'G W' },
  { id: 'agritech', label: 'Switch to AgriTech', icon: Globe, group: 'Domains', shortcut: 'D A' },
  { id: 'fintech', label: 'Switch to FinTech', icon: Globe, group: 'Domains', shortcut: 'D F' },
  { id: 'health', label: 'Switch to Health', icon: Globe, group: 'Domains', shortcut: 'D H' },
  { id: 'scan-field', label: 'Scan New Field', icon: Cpu, group: 'Actions', shortcut: 'A S' },
  { id: 'run-audit', label: 'Run System Audit', icon: ShieldCheck, group: 'Actions', shortcut: 'A R' },
];

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function CommandPalette({ isOpen, setIsOpen }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const { setActivePage, currentDomain, setDomain } = useFarmStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  const filteredItems = commandItems.filter(item => 
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.group.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = (id: string) => {
    if (id.startsWith('scan-') || id === 'run-audit') {
       // Placeholder for action logic
       console.log(`Running action: ${id}`);
    } else if (['agritech', 'fintech', 'health'].includes(id)) {
       const domainMap: Record<string, 'AgriTech' | 'FinTech' | 'Health'> = {
         agritech: 'AgriTech',
         fintech: 'FinTech',
         health: 'Health'
       };
       setDomain(domainMap[id]);
    } else {
       setActivePage(id);
    }
    setIsOpen(false);
    setSearch('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-bg/80 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          className="relative w-full max-w-[640px] bg-[var(--surface)] border border-[var(--border)] rounded-[28px] shadow-2xl overflow-hidden"
        >
          <div className="flex items-center px-6 py-5 border-b border-[var(--border)]">
            <Search className="w-5 h-5 text-teal-500 mr-4" />
            <input
              autoFocus
              placeholder="Search intelligence, domains or actions..."
              className="flex-1 bg-transparent border-none outline-none text-[var(--text)] placeholder:text-text-muted text-lg font-display font-black tracking-tight"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--surface-2)] rounded-lg border border-[var(--border)] text-[10px] font-black text-text-muted uppercase tracking-widest">
              <span>ESC</span>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-3 custom-scrollbar">
            {filteredItems.length === 0 ? (
              <div className="py-16 text-center text-text-muted">
                <div className="w-16 h-16 bg-[var(--surface-2)] rounded-2xl border border-[var(--border)] flex items-center justify-center mx-auto mb-4">
                    <Command className="w-8 h-8 opacity-20" />
                </div>
                <p className="font-bold text-sm tracking-wide">No intelligence found for "{search}"</p>
                <p className="text-[10px] uppercase font-black tracking-[0.2em] mt-1 opacity-50">Try searching "Domain" or "Scan"</p>
              </div>
            ) : (
              <div className="space-y-6 py-2">
                {['Pages', 'Actions', 'Domains'].map(group => {
                  const groupItems = filteredItems.filter(i => i.group === group);
                  if (groupItems.length === 0) return null;
                  
                  return (
                    <div key={group} className="space-y-1">
                      <div className="px-4 py-1 text-[10px] font-black text-teal-500 uppercase tracking-[0.2em] mb-2">
                        {group}
                      </div>
                      <div className="space-y-1">
                        {groupItems.map(item => {
                          const Icon = item.icon;
                          const isDomainSwitch = item.group === 'Domains';
                          const isActive = isDomainSwitch && item.label.includes(currentDomain);
                          
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleAction(item.id)}
                              className={cn(
                                "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group relative overflow-hidden",
                                "hover:bg-[var(--surface-2)]"
                              )}
                            >
                              <div className="flex items-center gap-4 relative z-10">
                                <div className="p-2.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl group-hover:bg-[var(--teal)] group-hover:border-[var(--teal)] transition-all transform group-hover:rotate-6">
                                  <Icon className="w-4 h-4 text-text-muted group-hover:text-bg" />
                                </div>
                                <div className="text-left">
                                    <span className="text-sm font-black text-[var(--text)] group-hover:text-teal-500 transition-colors">{item.label}</span>
                                    {isActive && (
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <div className="w-1 h-1 bg-teal-500 rounded-full animate-pulse" />
                                            <span className="text-[9px] font-black text-teal-500 uppercase tracking-widest">Active Focus</span>
                                        </div>
                                    )}
                                </div>
                              </div>
                              <div className="relative z-10 flex items-center gap-3">
                                  <div className="text-[10px] font-black text-text-muted group-hover:text-[var(--text)] px-2 py-1 rounded bg-[var(--surface-3)] border border-[var(--border)] uppercase tracking-tighter">
                                    {item.shortcut}
                                  </div>
                                  <Zap size={14} className="text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-[var(--surface-2)] border-t border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-6 text-[10px] font-black text-text-muted uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-[var(--surface-3)] border border-[var(--border)] rounded-md text-[var(--text)]">↵</span>
                Select
              </span>
              <span className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-[var(--surface-3)] border border-[var(--border)] rounded-md text-[var(--text)]">↑↓</span>
                Navigate
              </span>
            </div>
                <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest">KrishiSetu Intelligence Command</span>
                </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
