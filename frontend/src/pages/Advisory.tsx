import { useState } from 'react';
import { CloudRain, Bug, Sprout, FlaskConical, TrendingUp, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, AlertOctagon, Info, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFarmStore } from '../store/farmStore';
import { cn } from '../lib/utils';
import { fadeUp, staggerContainer } from '../lib/animations';
import type { Advisory as AdvisoryType } from '../store/farmStore';

const categoryConfig = {
  weather: { icon: CloudRain, label: 'Meteorological', color: 'text-sky-400 bg-sky-400/10 border-sky-400/20' },
  pest: { icon: Bug, label: 'Bio-Security', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
  crop: { icon: Sprout, label: 'Agronomical', color: 'text-teal-400 bg-teal-400/10 border-teal-400/20' },
  soil: { icon: FlaskConical, label: 'Geological', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  market: { icon: TrendingUp, label: 'Economical', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
};

const severityConfig = {
  low: { icon: Info, label: 'Advisory', color: 'text-sky-400 bg-white/5 border-white/5' },
  medium: { icon: AlertTriangle, label: 'Precaution', color: 'text-amber-400 bg-white/5 border-white/5' },
  high: { icon: AlertTriangle, label: 'Warning', color: 'text-orange-400 bg-white/5 border-white/5' },
  critical: { icon: AlertOctagon, label: 'CRITICAL', color: 'text-red-500 bg-error/10 border-error/20' },
};

function AdvisoryCard({ advisory }: { advisory: AdvisoryType }) {
  const [expanded, setExpanded] = useState(false);
  const { markAdvisoryRead } = useFarmStore();
  const cat = categoryConfig[advisory.category];
  const sev = severityConfig[advisory.severity];
  const CatIcon = cat.icon;
  const SevIcon = sev.icon;

  const handleExpand = () => {
    setExpanded(!expanded);
    if (!advisory.isRead) markAdvisoryRead(advisory.id);
  };

  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "glass rounded-[32px] border overflow-hidden transition-all duration-500 group relative",
        !advisory.isRead ? 'border-teal-500/30 bg-teal-500/5 shadow-[0_0_40px_rgba(17,209,177,0.05)]' : 'border-white/5 bg-white/[0.02]'
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div
        className="p-8 cursor-pointer relative z-10"
        onClick={handleExpand}
      >
        <div className="flex items-start gap-6">
          <div className={cn(
            "w-16 h-16 rounded-[24px] flex items-center justify-center shrink-0 border transition-all duration-500",
            expanded ? "scale-110 rotate-3 shadow-2xl" : "group-hover:scale-105",
            cat.color
          )}>
            <CatIcon size={28} />
          </div>
          
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className="text-2xl font-display font-black text-text tracking-tight leading-tight uppercase">{advisory.title}</h4>
                  {!advisory.isRead && (
                    <span className="flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-teal-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <span className={cn("text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest leading-none border", cat.color)}>{cat.label}</span>
                  <span className={cn("text-[10px] font-black px-3 py-1.5 rounded-full border uppercase tracking-widest leading-none flex items-center gap-2", sev.color)}>
                    <SevIcon size={12} />
                    {sev.label}
                  </span>
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full">{advisory.date}</span>
                </div>
              </div>
              <button className="w-10 h-10 shrink-0 glass border border-white/10 rounded-xl flex items-center justify-center transition-all hover:bg-white/10">
                {expanded ? <ChevronUp size={20} className="text-teal-500" /> : <ChevronDown size={20} className="text-text-muted" />}
              </button>
            </div>
            {!expanded && <p className="text-sm text-text-muted mt-4 font-bold leading-relaxed italic opacity-70 truncate">{advisory.summary}</p>}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white/[0.01]"
          >
            <div className="px-8 pb-8 pt-2 border-t border-white/5">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">Situational Intelligence</p>
                  <p className="text-base text-text leading-relaxed font-bold">{advisory.details}</p>
                </div>
                <div className="lg:col-span-2 space-y-4">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">Protocol Execution</p>
                  <div className="space-y-3">
                    {advisory.actionItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs font-black text-text bg-surface-2 p-4 rounded-2xl border border-white/5">
                        <div className="w-5 h-5 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 size={12} className="text-teal-500" />
                        </div>
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Advisory() {
  const { advisories } = useFarmStore();
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', 'weather', 'pest', 'crop', 'soil', 'market'];
  const filtered = filter === 'all' ? advisories : advisories.filter((a) => a.category === filter);

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-20"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-display font-black text-text tracking-tighter mb-4 text-glow">Intelligence Nexus</h1>
          <p className="text-text-muted font-bold uppercase tracking-[0.2em] text-[10px]">Strategic Recommendations • Real-time Risk Mitigation</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="w-3 h-3 rounded-full bg-teal-500 animate-pulse shadow-[0_0_15px_rgba(17,209,177,0.5)]" />
           <span className="text-[10px] font-black text-text uppercase tracking-widest">Protocol Sync Active</span>
        </div>
      </motion.div>

      {/* Filters Hub */}
      <motion.div variants={fadeUp} className="space-y-6">
        <div className="flex gap-3 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
                filter === cat
                  ? "bg-teal-500 text-bg border-teal-500 shadow-xl shadow-teal-500/20 scale-105"
                  : "bg-surface-2 text-text-muted hover:bg-surface-3 border-white/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Global Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(categoryConfig).map(([key, config]) => {
            const count = advisories.filter((a) => a.category === key).length;
            const Icon = config.icon;
            return (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "p-6 rounded-[32px] text-center cursor-pointer transition-all border relative overflow-hidden group",
                  filter === key ? "bg-white/[0.05] border-teal-500/40" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                )}
                onClick={() => setFilter(filter === key ? 'all' : key)}
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                    <Icon size={40} className={config.color.split(' ')[0]} />
                </div>
                <Icon size={24} className={cn("mx-auto mb-3", config.color.split(' ')[0])} />
                <p className="text-3xl font-black text-text font-display tracking-tighter">{count}</p>
                <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mt-1">{config.label}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Alerts Timeline */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Advisory Stream</h3>
           <span className="text-[10px] font-black text-text-muted opacity-50 uppercase tracking-widest">{filtered.length} active notifications</span>
        </div>
        
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((advisory) => (
              <AdvisoryCard key={advisory.id} advisory={advisory} />
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 glass border border-dashed border-white/10 rounded-[40px]"
            >
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-text-muted">
                 <Sparkles size={40} className="opacity-20" />
              </div>
              <p className="text-sm font-black text-text-muted uppercase tracking-widest leading-relaxed">No strategic advisories detected <br /> for this protocol.</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

