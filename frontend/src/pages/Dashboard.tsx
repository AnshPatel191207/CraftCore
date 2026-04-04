import { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Calendar, LayoutDashboard, Globe, MapPin, Target, ChevronRight, FileSearch, Sparkles, LayoutList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import StatCard from '../components/StatCard';
import { useFarmStore } from '../store/farmStore';
import { BentoGrid } from '../components/sections/BentoGrid';
import { ScrollReveal } from '../components/ScrollReveal';
import { useLanguage } from '../components/ui/LanguageSwitcher';

const yieldDataTemplate = [
  { month: 'Aug', yield: 2.1 },
  { month: 'Sep', yield: 2.4 },
  { month: 'Oct', yield: 3.2 },
  { month: 'Nov', yield: 3.8 },
  { month: 'Dec', yield: 4.1 },
  { month: 'Jan', yield: 4.5 },
];

export default function Dashboard() {
  const { crops, advisories, farmName, totalAcres, currentDomain, setPanelOpen, setActivePage, getSelectedReport } = useFarmStore();
  const { t } = useLanguage();
  
  const selectedReport = getSelectedReport();
  const { soilReports, selectReport } = useFarmStore();
  const [isDummyMode, setIsDummyMode] = useState(false);

  // Auto-select latest if none is selected and reports exist
  useEffect(() => {
    if (!selectedReport && (soilReports || []).length > 0 && !isDummyMode) {
      // Find latest completed/done report
      const latest = [...(soilReports || [])]
        .filter(r => r.status === 'done' || r.status === 'complete')
        .sort((a, b) => new Date(b.uploadDate || 0).getTime() - new Date(a.uploadDate || 0).getTime())[0];
      
      if (latest) {
        selectReport((latest._id || latest.id) as string);
      }
    }
  }, [selectedReport, soilReports, isDummyMode, selectReport]);

  // Re-derive the metrics based on the current selected report or fallbacks
  const reportResults = selectedReport?.results;
  const avgHealth = reportResults 
    ? (Number(reportResults.healthScore) || 0) 
    : (crops || []).length > 0 
      ? (crops || []).reduce((a, c) => a + (Number(c.health) || 0), 0) / (crops?.length || 1)
      : 80; // Baseline fallback
  
  const yieldData = yieldDataTemplate.map(d => ({
    ...d,
    yield: reportResults ? parseFloat((d.yield * (avgHealth / 80)).toFixed(1)) || 0 : d.yield || 0
  }));

  const handleNavigateToReports = () => {
    setActivePage('soil');
  };

  const hasNoReports = soilReports.filter(r => r.status === 'done' || r.status === 'complete').length === 0;

  if (!selectedReport && !isDummyMode && hasNoReports) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] py-12 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-card rounded-[48px] p-16 max-w-2xl w-full text-center shadow-3xl relative overflow-hidden backdrop-blur-2xl border border-white/5"
        >
          {/* Animated Background Orbs */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -top-32 -right-32 w-80 h-80 bg-teal-500 rounded-full blur-[120px] pointer-events-none" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
              x: [0, 20, 0]
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute -bottom-32 -left-32 w-80 h-80 bg-green-500 rounded-full blur-[120px] pointer-events-none" 
          />

          <div className="w-24 h-24 rounded-[36px] bg-teal-500/10 flex items-center justify-center mx-auto mb-10 text-teal-500 shadow-2xl relative z-10 border border-teal-500/20 group hover:rotate-6 transition-all duration-500">
             <FileSearch size={54} className="group-hover:scale-110 transition-transform" />
          </div>
          
          <h2 className="text-5xl font-display font-black text-white mb-6 relative z-10 leading-tight tracking-tight">Select Active Profile</h2>
          <p className="text-white/40 mb-12 text-xl leading-relaxed relative z-10 font-bold italic px-8">
            The dashboard is currently in standby. Select an analyzed report from your workspace to power the field intelligence hub.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 max-w-lg mx-auto">
            <button 
              onClick={handleNavigateToReports}
              className="group py-5 bg-teal-500 text-bg rounded-3xl font-black uppercase tracking-widest hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-teal-500/30 text-xs"
            >
              <LayoutList size={18} className="group-hover:translate-x-1 transition-transform" />
              Open Analysis Hub
            </button>
            <button 
              onClick={() => setIsDummyMode(true)}
              className="py-5 bg-white/5 text-white/50 border border-white/5 rounded-3xl font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-xs"
            >
              <Sparkles size={18} className="text-teal-500" />
              Demo Analytics
            </button>
          </div>

          <div className="mt-12 flex justify-center gap-3 relative z-10">
             <div className="w-2 h-2 rounded-full bg-teal-500" />
             <div className="w-2 h-2 rounded-full bg-white/10" />
             <div className="w-2 h-2 rounded-full bg-white/10" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedReport?._id || 'default'}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <ScrollReveal direction="left" duration={0.6}>
            <div className="flex items-center gap-3 mb-2">
              <LayoutDashboard size={20} className="text-teal-500" />
              <div className="h-px w-6 bg-white/10" />
              <span className="text-[10px] font-black text-teal-400 uppercase tracking-[0.3em] font-display">{currentDomain} {t('intelligence')} Hub</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-6">
              <h1 className="text-4xl font-display font-black text-white tracking-tighter leading-none">{t('mainCommand')}</h1>
              <div className="flex items-center gap-3 glass px-4 py-2 border border-teal-500/10 rounded-2xl group transition-all hover:bg-teal-500/5 cursor-pointer" onClick={handleNavigateToReports}>
                 <LayoutList size={14} className="text-teal-500" />
                 <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                    Active Profile: <strong className="text-white">{selectedReport?.fileName || 'Global Baseline'}</strong>
                 </span>
                 <ChevronRight size={12} className="text-white/20 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-4 text-white/30 font-bold overflow-hidden">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] uppercase tracking-[0.1em] font-black group cursor-pointer hover:bg-white/10 transition-all">
                # {farmName.toUpperCase().replace(/\s/g, '_')}
              </span>
              <span className="w-1 h-1 bg-teal-500/50 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{totalAcres} {t('ac')} {t('totalArea')} Registered</span>
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="right" duration={0.6}>
            <div className="flex items-center gap-4">
               <div 
                 onClick={handleNavigateToReports}
                 className="px-6 py-3 rounded-2xl glass border border-teal-500/20 flex items-center gap-3 group cursor-pointer hover:border-teal-500/50 transition-all bg-gradient-to-tr from-teal-500/5 to-transparent shadow-xl"
               >
                <div className="relative">
                   <Globe size={18} className="text-teal-500 group-hover:rotate-12 transition-transform" />
                   <span className="absolute -top-1 -right-1 w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">Satellite Link</p>
                  <p className="text-xs font-black text-white uppercase tracking-widest leading-none">
                    {selectedReport ? 'Report Profile Active' : 'Waiting for selection'}
                  </p>
                </div>
              </div>
              <div className="p-3.5 glass border border-white/10 rounded-2xl cursor-pointer hover:bg-teal-500/10 group transition-all shadow-lg active:scale-95">
                <Calendar className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </ScrollReveal>
        </motion.div>
      </AnimatePresence>

      {/* System Status Banner */}
      <ScrollReveal direction="down" duration={0.6}>
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/5 backdrop-blur-md shadow-inner text-white/30">
          <div className="flex items-center gap-2 pr-3 border-r border-white/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-teal-500" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
            </span>
            <span className="text-teal-400 font-display">{t('live')} Connected</span>
          </div>
          <span>{selectedReport ? `Processing metrics for independent shard: ID_${selectedReport._id?.slice(-8) || 'GLOBAL'}` : t('receivingLiveSensorData')}</span>
          <span className="hidden sm:inline-flex items-center gap-2 ml-auto">
            <TrendingUp size={12} className="text-teal-500" />
            <span>AI Consistency Hub Score: 0.992</span>
          </span>
        </div>
      </ScrollReveal>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: t('cropHealth'), value: `${Math.round(avgHealth)}%`, sub: selectedReport ? 'AI Analysis Sync' : t('systemNominal'), icon: TrendingUp, color: "teal" },
          { title: t('activeArea'), value: `${totalAcres} ac`, sub: t('digitalMapping') || 'Land Registry Active', icon: MapPin, color: "sky" },
          { title: t('yieldEst'), value: selectedReport ? `${(avgHealth / 20).toFixed(1)} t/h` : "4.5 t/h", sub: t('forecastQ1') || 'Model Prediction V3', icon: Target, color: "amber" },
          { title: t('priorityAlerts'), value: selectedReport?.results?.recommendations?.length || advisories.length, sub: t('actionRequired') || 'Neutral Condition', icon: AlertTriangle, color: "white" }
        ].map((stat, i) => (
          <ScrollReveal key={i} direction="up" delay={0.1 * i}>
            <StatCard 
              title={stat.title}
              value={stat.value}
              subtitle={stat.sub}
              icon={stat.icon}
              color={stat.color as "teal" | "sky" | "amber" | "white"}
            />
          </ScrollReveal>
        ))}
      </div>

      {/* Dynamic Bento Implementation */}
      <ScrollReveal direction="up" delay={0.4}>
        <BentoGrid />
      </ScrollReveal>

      {/* Analytics Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ScrollReveal direction="left">
          <div className="glass rounded-[40px] p-10 border border-white/5 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 pointer-events-none">
               <TrendingUp size={140} />
            </div>
            <div className="flex justify-between items-start mb-12">
               <div>
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-3 h-3 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                   <h3 className="font-display text-2xl text-white font-black tracking-tight">{t('yieldProjection')}</h3>
                </div>
                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] leading-none mb-1">Report Source: {selectedReport?.fileName || 'Hub Data'}</p>
                <div className="h-px w-full bg-gradient-to-r from-teal-500/20 to-transparent mt-3" />
              </div>
              <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
                 {['Yield', 'Growth'].map(tab => (
                    <button key={tab} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${tab === 'Yield' ? 'bg-white text-bg' : 'text-white/40 hover:text-white'}`}>{tab}</button>
                 ))}
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yieldData}>
                  <defs>
                    <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ 
                      background: 'rgba(20, 30, 25, 0.9)', 
                      backdropFilter: 'blur(20px)',
                      border: '1px border-white/10', 
                      borderRadius: '24px', 
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                      fontFamily: 'Outfit' 
                    }}
                    cursor={{ stroke: '#22c55e', strokeWidth: 2 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="yield" 
                    stroke="#22c55e" 
                    strokeWidth={5} 
                    fill="url(#yieldGrad)" 
                    dot={{ r: 5, fill: '#22c55e', strokeWidth: 3, stroke: '#0a0a0a' }} 
                    activeDot={{ r: 8, fill: '#ffffff' }} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <div className="glass rounded-[40px] p-10 border border-white/5 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-6 pointer-events-none">
               <LayoutList size={140} />
            </div>
            <div className="flex justify-between items-start mb-12">
              <div>
                 <div className="flex items-center gap-3 mb-2">
                   <div className="w-3 h-3 rounded-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
                   <h3 className="font-display text-2xl text-white font-black tracking-tight">{t('resourceCycles')}</h3>
                </div>
                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] leading-none mb-1">Active Nutrient Spectrum Sync</p>
                <div className="h-px w-full bg-gradient-to-r from-sky-500/20 to-transparent mt-3" />
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  {month: 'P', val: reportResults?.phosphorus || 20, fill: '#3b82f6'}, 
                  {month: 'N', val: reportResults?.nitrogen || 140, fill: '#22c55e'}, 
                  {month: 'K', val: reportResults?.potassium || 120, fill: '#f59e0b'}, 
                  {month: 'PH', val: (reportResults?.ph || 6)*20, fill: '#a855f7'}
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }}
                    contentStyle={{ 
                      background: 'rgba(20, 25, 30, 0.9)', 
                      backdropFilter: 'blur(20px)',
                      border: '1px border-white/10', 
                      borderRadius: '24px', 
                      fontFamily: 'Outfit' 
                    }}
                  />
                  <Bar dataKey="val" radius={[12, 12, 12, 12]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Footer Support CTA */}
      <ScrollReveal direction="up" delay={0.2}>
        <div 
          className="glass rounded-[48px] p-12 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group hover:border-teal-500/20 transition-all duration-500"
        >
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-3xl font-display font-black text-white mb-3 tracking-tight">{t('growSmarterWithAI')}</h3>
            <p className="text-white/40 font-bold max-w-lg text-lg leading-relaxed">{t('getPersonalizedYield') || 'Experience the next generation of autonomous field management and resource optimization.'}</p>
          </div>
          <button 
            onClick={() => setPanelOpen(true)}
            className="relative z-10 px-10 py-6 rounded-3xl bg-teal-500 text-bg font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-teal-500/40 flex items-center gap-3 group"
          >
            {t('openAIAdvisor')} Hub
            <ChevronRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </ScrollReveal>
    </div>
  );
}
