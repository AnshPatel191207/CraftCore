import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  FlaskConical, 
  Droplet, 
  Leaf, 
  Zap, 
  AlertCircle, 
  ChevronRight,
  Info,
  Sprout,
  CheckCircle,
  FileSearch,
  LayoutList,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../components/ui/LanguageSwitcher';
import { ScrollReveal } from '../components/ScrollReveal';
import { useFarmStore } from '../store/farmStore';

const PARAMETER_MAP = [
  { id: 'nitrogen', icon: Leaf, color: '#22c55e', baseKey: 'nitrogen' },
  { id: 'phosphorus', icon: FlaskConical, color: '#3b82f6', baseKey: 'phosphorus' },
  { id: 'potassium', icon: Activity, color: '#f59e0b', baseKey: 'potassium' },
  { id: 'ph', icon: Droplet, color: '#a855f7', baseKey: 'ph' },
  { id: 'organicMatter', icon: Zap, color: '#ec4899', baseKey: 'organicMatter' },
  { id: 'moisture', icon: Droplet, color: '#06b6d4', baseKey: 'moisture' }
];

export default function SoilHealthAnalysis() {
  const { t } = useLanguage();
  const { getSelectedReport, setActivePage } = useFarmStore();

  const report = getSelectedReport();
  
  const analysis = useMemo(() => {
    if (!report?.results) return null;
    const r = report.results;
    
    // Core analysis logic
    const score = Number(r.healthScore) || 0;
    const issues = [];
    
    if (Math.max(0, Number(r.nitrogen) || 0) < 200) issues.push({ id: 'n', type: 'nitrogen', status: 'low', logic: 'lowN' });
    if (Math.max(0, Number(r.ph) || 0) < 6 || Math.max(0, Number(r.ph) || 0) > 7.5) issues.push({ id: 'ph', type: 'ph', status: 'critical', logic: 'highPH' });
    if (Math.max(0, Number(r.organicMatter) || 0) < 3) issues.push({ id: 'oc', type: 'carbon', status: 'low', logic: 'lowOC' });

    return { score, issues, data: r };
  }, [report]);

  const handleNavigateToReports = () => {
    setActivePage('soil');
  };

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] py-20 px-8 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-card rounded-[40px] p-16 max-w-xl w-full border border-white/5 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <FileSearch size={120} />
          </div>
          <div className="w-20 h-20 rounded-[28px] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 text-white/20">
            <FlaskConical size={40} />
          </div>
          
          <h2 className="text-4xl font-display font-black text-text-text mb-4">Select Soil Profile</h2>
          <p className="text-text-text-muted mb-10 text-lg leading-relaxed font-bold px-4">
            Your multi-file analysis workspace requires an active profile selection to generate deep health indices.
          </p>

          <button 
            onClick={handleNavigateToReports}
            className="w-full py-5 bg-teal-500 text-bg rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-teal-500/20 text-xs"
          >
            <LayoutList size={20} />
            Go to Selection Hub
          </button>
        </motion.div>
      </div>
    );
  }

  const getStatusConfig = (score: number) => {
    if (score >= 75) return { 
      label: t('soilHealth.status.healthy'), 
      icon: '🟢', 
      classes: 'bg-teal-500/10 text-teal-600', 
      color: 'var(--teal)',
      glow: 'shadow-[0_0_30px_rgba(34,197,94,0.1)]'
    };
    if (score >= 50) return { 
      label: t('soilHealth.status.moderate'), 
      icon: '⚠️', 
      classes: 'bg-amber-500/10 text-amber-600', 
      color: 'var(--amber)',
      glow: 'shadow-[0_0_30px_rgba(234,179,8,0.15)]'
    };
    return { 
      label: t('soilHealth.status.poor'), 
      icon: '❌', 
      classes: 'bg-red-500/20 text-red-500', 
      color: '#ef4444',
      glow: 'shadow-[0_0_30px_rgba(239,68,68,0.15)]'
    };
  };

  const status = getStatusConfig(analysis?.score || 0);

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER SECTION */}
      <ScrollReveal direction="down">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 glass rounded-[32px] p-8 border border-white/5 relative overflow-hidden group">
          {/* Background Decorative Photo */}
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-all duration-700 bg-center bg-cover" style={{ backgroundImage: 'url(/images/analysis_bg.png)' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/40 to-transparent relative z-10" />
          
          <div className="relative z-20">
            <div className="flex items-center gap-3 mb-2">
               <Activity size={18} className="text-teal-500" />
               <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Health Intelligence Engine</p>
            </div>
            <h1 className="text-5xl font-display font-black text-white tracking-tighter leading-none">{t('soilHealth.title')}</h1>
            <p className="text-teal-500/60 mt-3 font-bold italic text-lg">{t('soilHealth.sub')}</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
             <div className="px-5 py-3 glass border border-white/10 rounded-2xl flex flex-col items-start min-w-[200px]">
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Active Report Link</span>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                   <span className="text-xs font-black text-white">{report.fileName}</span>
                </div>
             </div>
             <button onClick={handleNavigateToReports} className="px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-white/60 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all shadow-xl active:scale-95">
                Switch Profile
             </button>
          </div>
        </div>
      </ScrollReveal>

      {/* OVERALL SOIL HEALTH SCORE */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className={`p-12 rounded-[48px] border border-white/10 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent flex flex-col md:flex-row items-center gap-16 transition-all duration-500 backdrop-blur-2xl ${status?.glow}`}>
          <div className="relative group shrink-0">
            <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 transition-colors duration-700`} style={{ backgroundColor: status?.color }} />
            <svg width="220" height="220" viewBox="0 0 100 100" className="relative z-10 filter drop-shadow-2xl">
               <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="10" />
               <motion.circle 
                 cx="50" cy="50" r="45" fill="none" 
                 stroke={status?.color || '#22c55e'} 
                 strokeWidth="10"
                 strokeDasharray="283"
                 initial={{ strokeDashoffset: 283 }}
                 animate={{ strokeDashoffset: 283 - (283 * (analysis?.score || 0)) / 100 }}
                 transition={{ duration: 2, ease: "circOut", delay: 0.5 }}
                 strokeLinecap="round"
                 transform="rotate(-90 50 50)"
               />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <motion.span 
                 initial={{ scale: 0.5, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ delay: 0.8, type: "spring" }}
                 className="text-7xl font-display font-black text-white mb-2"
               >
                 {analysis?.score || 0}%
               </motion.span>
               <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Health Factor</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-6 text-center md:text-left">
             <div className="space-y-4">
                <p className="text-xs font-black text-white/20 uppercase tracking-[0.4em] font-display">{t('soilHealth.scoreLabel')}</p>
                <h2 className={`text-5xl sm:text-7xl font-display font-black transition-all duration-500 leading-tight tracking-tighter`}>
                   {status?.icon} {status?.label} {t('soil')}
                </h2>
                <div className={`inline-flex items-center px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-700 shadow-xl ${status?.classes}`}>
                   Qualitative Analysis: {status?.label} Range
                </div>
             </div>
             <p className="text-white/40 text-lg leading-relaxed max-w-xl font-bold italic mx-auto md:mx-0">
                This diagnostic profile is independently derived from laboratory shard <strong>{report.fileName}</strong>. 
                Satellite calibration and local extraction metrics have been synchronized into this model.
             </p>
          </div>
        </div>
      </ScrollReveal>

      {/* PARAMETER ANALYSIS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {PARAMETER_MAP.map((p, i) => {
          const val = (analysis?.data as any)?.[p.baseKey];
          const hasVal = val !== undefined && val !== null;
          
          let pStatus = { label: 'Optimal', classes: 'bg-green-500/20 text-green-400', icon: '🟢' };
          if (p.id === 'nitrogen' && val < 200) pStatus = { label: 'Low', classes: 'bg-red-500/20 text-red-500', icon: '❌' };
          if (p.id === 'ph' && (val < 6 || val > 7.5)) pStatus = { label: 'Critical', classes: 'bg-red-500/20 text-red-500', icon: '❌' };
          if (p.id === 'organicMatter' && val < 3) pStatus = { label: 'Below Avg', classes: 'bg-yellow-500/20 text-yellow-500', icon: '⚠️' };
          
          return (
            <ScrollReveal key={p.id} direction="up" delay={0.05 * i}>
              <div className={`p-8 rounded-[32px] border border-white/5 transition-all duration-500 group relative overflow-hidden backdrop-blur-xl ${hasVal ? pStatus.classes.split(' ')[0] : 'bg-white/5 opacity-50'}`}>
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
                    <p.icon size={60} />
                 </div>
                 <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-6 relative z-10 leading-none">
                    {t(`soilHealth.parameters.${p.id}`) || p.id}
                 </p>
                 <div className="flex items-baseline gap-2 mb-8 relative z-10">
                    <span className="text-4xl font-display font-black text-white transition-all group-hover:scale-110">{hasVal ? val : '---'}</span>
                    {hasVal && <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{p.id === 'ph' ? 'log' : p.id === 'carbon' || p.id === 'moisture' || p.id === 'organicMatter' ? '%' : 'kg/ha'}</span>}
                 </div>
                 <div className="flex items-center gap-2 relative z-10">
                    {hasVal ? (
                      <>
                        <span className="text-[10px] transform group-hover:rotate-12 transition-transform">{pStatus.icon}</span>
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${pStatus.classes.split(' ')[1]}`}>
                           {pStatus.label}
                        </span>
                      </>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">Missing Extant</span>
                    )}
                 </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* IMBALANCE DETECTION PANEL */}
        <div className="lg:col-span-12">
            <ScrollReveal direction="left">
               <div className={`p-10 rounded-[48px] border transition-all duration-700 ${analysis?.issues.length ? 'border-red-500/20 bg-red-500/5 shadow-[0_0_50px_rgba(239,68,68,0.15)]' : 'border-teal-500/20 bg-teal-500/5 shadow-[0_0_50px_rgba(20,184,166,0.15)]'} relative overflow-hidden group`}>
                  <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 group-hover:rotate-6 transition-all duration-700">
                     {analysis?.issues.length ? <AlertCircle size={100} className="text-red-500" /> : <CheckCircle size={100} className="text-teal-500" />}
                  </div>
                  
                  <div className="flex items-center gap-6 mb-12 relative z-10">
                     <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-bg shadow-2xl transition-transform group-hover:scale-110 ${analysis?.issues.length ? 'bg-red-500 shadow-red-500/40' : 'bg-teal-500 shadow-teal-500/40'}`}>
                        {analysis?.issues.length ? <AlertCircle size={32} /> : <CheckCircle size={32} />}
                     </div>
                     <div>
                       <h2 className="text-4xl font-display font-black text-white tracking-tighter leading-none mb-2">
                         {analysis?.issues.length ? `${t('soilHealth.imbalanceDetected')}` : `Spectrum Balance Verified`}
                       </h2>
                       <p className="text-xs font-black text-white/30 uppercase tracking-[0.3em] italic leading-none">Diagnostic Shard: {report.fileName}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                     {analysis?.issues.length ? analysis?.issues.map((issue) => (
                        <div key={issue.id} className="p-8 rounded-[32px] bg-black/40 border border-white/5 space-y-6 hover:border-red-500/30 transition-all group/card hover:bg-black/60 shadow-inner">
                           <div className="flex justify-between items-center">
                              <span className="px-4 py-1.5 rounded-xl bg-red-500/20 border border-red-500/20 text-[10px] font-black text-red-500 uppercase tracking-widest">
                                 {issue.status} IMPACT
                              </span>
                              <Info size={16} className="text-white/20 transition-colors group-hover/card:text-red-500" />
                           </div>
                           <h3 className="text-2xl font-black text-white tracking-tight">{t(`soilHealth.parameters.${issue.type}`)}</h3>
                           <p className="text-sm text-white/40 leading-relaxed font-bold italic">"{t(`soilHealth.explanation.${issue.logic}`)}"</p>
                           <div className="h-px w-12 bg-red-500/30" />
                        </div>
                     )) : (
                       <div className="col-span-3 py-10 text-center glass rounded-[32px] border border-white/5">
                          <p className="font-display font-black text-xl text-white/10 uppercase tracking-[0.5em]">No critical nutrient imbalances detected</p>
                       </div>
                     )}
                  </div>
               </div>
            </ScrollReveal>
        </div>

        {/* CORRECTIVE ACTIONS */}
        <div className="lg:col-span-8 space-y-8">
           <div className="flex items-center gap-6">
              <h2 className="text-3xl font-display font-black text-white tracking-tight leading-none">{t('soilHealth.correctiveActions')}</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
           </div>

           <div className="grid grid-cols-1 gap-5">
              {report?.results?.recommendations?.slice(0, 3).map((rec: string, i: number) => (
                <ScrollReveal key={i} direction="right" delay={0.1 * i}>
                   <div className="p-8 rounded-[36px] border border-white/5 bg-white/5 flex items-center justify-between group hover:border-teal-500/30 transition-all duration-500 hover:bg-white/[0.08] shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 group-hover:rotate-6 transition-all duration-700 pointer-events-none">
                         <Leaf size={100} />
                      </div>
                      <div className="flex items-center gap-8 relative z-10">
                         <div className="w-16 h-16 rounded-[24px] bg-white text-bg flex items-center justify-center transition-all group-hover:scale-110 shadow-3xl text-leaf-600">
                            <Leaf size={32} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-teal-400 uppercase tracking-[0.4em] mb-2 leading-none">Corrective Protocol #{i+1}</p>
                            <h3 className="text-xl font-bold text-white tracking-tight leading-tight max-w-xl">{rec}</h3>
                         </div>
                      </div>
                      <button className="w-12 h-12 rounded-[20px] bg-white/5 flex items-center justify-center text-white/20 group-hover:text-teal-500 group-hover:bg-white/10 transition-all shadow-lg">
                         <ChevronRight size={24} />
                      </button>
                   </div>
                </ScrollReveal>
              )) || (
                <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-[40px] text-white/10 font-black uppercase tracking-[0.3em]">
                   Pending correction parsing
                </div>
              )}
           </div>
        </div>

        {/* SMART RECOMMENDATIONS */}
        <div className="lg:col-span-4 space-y-8">
           <h2 className="text-3xl font-display font-black text-white tracking-tight leading-none">{t('soilHealth.smartRecs')}</h2>
           <div className="p-10 rounded-[48px] border border-white/10 bg-white/5 space-y-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Sprout size={120} />
              </div>
              {[
                { text: t('soilHealth.recsList.irrigation'), icon: Droplet, color: 'text-sky-500' },
                { text: t('soilHealth.recsList.organic'), icon: Leaf, color: 'text-leaf-500' },
                { text: t('soilHealth.recsList.rotation'), icon: Sprout, color: 'text-teal-500' },
                { text: t('soilHealth.recsList.fertilizer'), icon: FlaskConical, color: 'text-purple-500' }
              ].map((rec, i) => (
                <div key={i} className="flex items-center gap-6 p-5 rounded-[24px] hover:bg-white/5 transition-all group cursor-pointer border border-transparent hover:border-white/5 shadow-inner">
                   <div className={`w-12 h-12 rounded-[18px] bg-white/5 flex items-center justify-center ${rec.color} transition-all group-hover:scale-110 group-hover:bg-white/10`}>
                      <rec.icon size={22} />
                   </div>
                   <p className="text-sm font-black text-white/60 group-hover:text-white transition-colors leading-relaxed tracking-tight">{rec.text}</p>
                </div>
              ))}
              
              <div className="pt-6 border-t border-white/5">
                 <button 
                  onClick={() => setActivePage('advisory')}
                  className="w-full flex items-center justify-between p-4 glass border border-white/5 rounded-2xl group/btn hover:bg-teal-500 hover:text-bg transition-all duration-300"
                 >
                    <span className="text-[10px] font-black uppercase tracking-widest">Full Action Plan</span>
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1.5 transition-transform" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
