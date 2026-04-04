import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Filter, 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  Bug, 
  Sun, 
  Sprout, 
  TrendingUp,
  Import,
  RefreshCw,
  FlaskConical,
  ArrowRight
} from 'lucide-react';
import { useFarmStore } from '../store/farmStore';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ScrollReveal } from '../components/ScrollReveal';

export default function Advisory() {
  const { advisories, setActivePage, getSelectedReport } = useFarmStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const report = getSelectedReport();

  const categories = [
    { id: 'all', label: 'All Portals', icon: Filter },
    { id: 'weather', label: 'Weather', icon: Sun },
    { id: 'pest', label: 'Pest Alert', icon: Bug },
    { id: 'crop', label: 'Crop Growth', icon: Sprout },
    { id: 'soil', label: 'Soil Health', icon: ShieldAlert },
    { id: 'market', label: 'Market Intelligence', icon: TrendingUp },
  ];

  const filteredAdvisories = advisories.filter(adv => {
    const matchesFilter = filter === 'all' || adv.category === filter;
    const matchesSearch = adv.title.toLowerCase().includes(search.toLowerCase()) || 
                         adv.summary.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleImport = () => {
    setActivePage('soil');
  };

  const refreshAdvisories = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate real fetching logic
    setTimeout(() => setIsRefreshing(false), 1500);
  }, []);

  if (!report && advisories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface-2 border border-border rounded-[40px] p-12 max-w-xl w-full text-center shadow-2xl"
        >
          <div className="w-20 h-20 rounded-[32px] bg-teal-500/10 flex items-center justify-center mx-auto mb-8 text-teal-500">
            <ShieldAlert size={40} />
          </div>
          
          <h2 className="text-4xl font-display font-black text-text-text mb-4">No Active Advisories</h2>
          <p className="text-text-text-muted mb-10 text-lg leading-relaxed">
            Please verify your soil data to generate active advisory reports, growth monitoring, and field updates based on your specific condition.
          </p>

          <div className="flex flex-col gap-4">
            <button 
              onClick={handleImport}
              className="w-full py-4 bg-teal-500 text-bg rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-teal-500/20"
            >
              <Import size={20} />
              Verify Soil Data
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <ScrollReveal direction="down">
        <div className="relative p-10 glass border border-border rounded-[40px] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
             <img src="/images/farmer_meeting_real.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-2">
                   <div className="px-3 py-1 bg-[#22c55e]/10 text-[#22c55e] text-[10px] font-black uppercase tracking-widest rounded-lg border border-[#22c55e]/20">
                      Live Advisor 
                   </div>
                   {report && (
                     <div className="px-3 py-1 bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/5">
                        Synced with {report.fileName}
                     </div>
                   )}
                </div>
                <h1 className="text-4xl font-display font-black text-text tracking-tight mb-4">Field Advisory Portal</h1>
                <p className="text-text-muted font-bold text-lg leading-relaxed">
                   Critical intelligence, weather warnings, and crop management strategies synchronized for your farm.
                </p>
             </div>
             
             <button 
               onClick={refreshAdvisories}
               className={`p-4 rounded-2xl glass border border-border group ${isRefreshing ? 'opacity-50 pointer-events-none' : ''}`}
             >
                <RefreshCw size={24} className={`text-teal-500 transition-all ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
             </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Controls */}
      <ScrollReveal direction="up" delay={0.2}>
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between w-full">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                  filter === cat.id 
                    ? 'bg-teal-500 text-bg border-teal-500 shadow-lg shadow-teal-500/20' 
                    : 'glass border-border text-text-muted hover:border-teal-500/30'
                }`}
              >
                <cat.icon size={14} />
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-teal-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder='Search intelligence reports...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 glass border border-border rounded-2xl text-sm font-bold text-text focus:outline-none focus:border-teal-500/50 transition-all shadow-inner"
            />
          </div>
        </div>
      </ScrollReveal>

      {/* Advisory Feed */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {report && filter === 'soil' && filteredAdvisories.length === 0 && (
            <motion.div
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="group glass border border-teal-500/20 bg-teal-500/5 rounded-[32px] overflow-hidden p-8"
            >
               <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-16 h-16 rounded-2xl bg-teal-500 flex items-center justify-center text-bg shrink-0">
                     <FlaskConical size={32} />
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center gap-3 mb-2">
                        <StatusBadge status="info">Healthy</StatusBadge>
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Linked Report: {report.fileName}</span>
                     </div>
                     <h3 className="text-2xl font-display font-black text-text mb-4">Baseline Soil Recommendations Active</h3>
                     <p className="text-text-muted font-bold text-sm leading-relaxed mb-6">
                        Your soil health score is <strong>{report.results?.healthScore || 0}%</strong>. Our AI has generated 
                        {report.results?.recommendations?.length || 0} primary action items to maintain your field's current condition.
                     </p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {report.results?.recommendations?.map((rec: string, i: number) => (
                           <div key={i} className="flex gap-3 p-4 bg-bg/40 border border-white/5 rounded-2xl items-start">
                              <CheckCircle2 size={16} className="text-teal-500 mt-1 shrink-0" />
                              <span className="text-xs font-bold text-text/80">{rec}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {filteredAdvisories.map((adv, i) => (
            <ScrollReveal direction={i % 2 === 0 ? 'left' : 'right'} delay={0.1} key={adv.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group glass border border-border rounded-[32px] overflow-hidden hover:border-teal-500/30 transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="p-8 flex-1">
                    <div className="flex items-center gap-3 mb-6">
                      <StatusBadge status={
                        adv.severity === 'critical' ? 'error' : 
                        adv.severity === 'high' ? 'warning' : 'info'
                      }>
                        {adv.severity.toUpperCase()}
                      </StatusBadge>
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                         <Clock size={12} />
                         {adv.date}
                      </span>
                    </div>

                    <h3 className="text-2xl font-display font-black text-text mb-4 group-hover:text-teal-500 transition-colors">
                      {adv.title}
                    </h3>
                    <p className="text-text-muted font-bold leading-relaxed mb-8 max-w-3xl text-sm">
                      {adv.summary}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {adv.actionItems.map((action, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-surface-2 border border-border rounded-xl text-[10px] font-black text-text uppercase tracking-wider">
                           <CheckCircle2 size={12} className="text-teal-500" />
                           {action}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-surface-2 p-8 md:w-72 border-t md:border-t-0 md:border-l border-border flex flex-col justify-between">
                     <div className="space-y-6">
                       <div>
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Impact Zone</p>
                          <div className="flex items-center gap-2 text-text font-black text-xs uppercase">
                            <MapPin size={14} className="text-teal-500" />
                            {adv.category === 'market' ? 'Domestic' : 'Your Field'}
                          </div>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Verified Logic</p>
                          <div className="flex items-center gap-2 text-text font-black text-xs uppercase">
                            {adv.category.toUpperCase()} Intel
                          </div>
                       </div>
                     </div>

                     <button className="flex items-center justify-between w-full mt-8 p-4 glass border border-border rounded-2xl group/btn hover:bg-teal-500 hover:text-bg transition-all duration-300">
                        <span className="text-[10px] font-black uppercase tracking-widest">Full Intelligence</span>
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                     </button>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </AnimatePresence>

        {filteredAdvisories.length === 0 && (!report || filter !== 'soil') && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-20 glass border border-border rounded-[40px]"
          >
            <div className="w-20 h-20 glass rounded-[32px] border border-teal-500/20 flex items-center justify-center mx-auto mb-6">
               <AlertTriangle size={32} className="text-teal-500" />
            </div>
            <p className="text-text-muted font-black uppercase tracking-widest">No matching advisories found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
