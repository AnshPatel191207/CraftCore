import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  FlaskConical, 
  Droplet, 
  Leaf, 
  Zap, 
  TrendingUp, 
  AlertCircle, 
  ChevronRight,
  Info,
  Sprout,
  Import
} from 'lucide-react';
import { useLanguage } from '../components/ui/LanguageSwitcher';
import { ScrollReveal } from '../components/ScrollReveal';
import { useNavigate } from 'react-router-dom';
import { useFarmStore } from '../store/farmStore';

const PARAMETER_MAP = [
  { id: 'nitrogen', icon: Leaf, color: 'var(--success)', baseKey: 'n' },
  { id: 'phosphorus', icon: FlaskConical, color: 'var(--info)', baseKey: 'p' },
  { id: 'potassium', icon: Activity, color: 'var(--warning)', baseKey: 'k' },
  { id: 'ph', icon: Droplet, color: '#a855f7', baseKey: 'ph' },
  { id: 'carbon', icon: Zap, color: '#ec4899', baseKey: 'oc' },
  { id: 'moisture', icon: Droplet, color: 'var(--info)', baseKey: 'moisture' }
];

export default function SoilHealthAnalysis() {
  const { t } = useLanguage();
  const { soilReports } = useFarmStore();
  const navigate = useNavigate();

  const [hasData, setHasData] = useState(false);
  const [isDummyMode, setIsDummyMode] = useState(false);
  
  // Use the most recent completed report or dummy report
  const realReport = soilReports.find(r => r.status === 'complete');
  
  const dummyReport = {
    id: 'dummy-1',
    status: 'complete',
    results: {
      healthScore: 82,
      nitrogen: 280,
      phosphorus: 22,
      potassium: 185,
      ph: 6.8,
      organicMatter: 3.2,
      moisture: 28,
      organicCarbon: 0.8
    }
  };

  const report: any = isDummyMode ? dummyReport : realReport;

  const handleDummy = () => {
    setIsDummyMode(true);
    setHasData(true);
  };

  const analysis = useMemo(() => {
    if (!report?.results) return null;
    const r = report.results;
    
    // Core analysis logic
    const score = r.healthScore;
    const issues = [];
    
    if (r.nitrogen < 200) issues.push({ id: 'n', type: 'nitrogen', status: 'low', logic: 'lowN' });
    if (r.ph < 6 || r.ph > 7.5) issues.push({ id: 'ph', type: 'ph', status: 'critical', logic: 'highPH' });
    if (r.organicMatter < 3) issues.push({ id: 'oc', type: 'carbon', status: 'low', logic: 'lowOC' });

    return { score, issues, data: r };
  }, [report]);

  if (!hasData && !isDummyMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-900/30 backdrop-blur-lg border border-green-700/30 rounded-[40px] p-12 max-w-xl w-full text-center shadow-2xl"
        >
          <div className="w-20 h-20 rounded-[32px] bg-green-500/20 flex items-center justify-center mx-auto mb-8 text-green-400">
            <FlaskConical size={40} />
          </div>
          
          <h2 className="text-4xl font-display font-black text-white mb-4">No Data Available</h2>
          <p className="text-white/50 mb-10 text-lg leading-relaxed">
            Import your soil data or technical reports to get deep insights into your field health.
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate('/app/soil')}
              className="px-8 py-4 bg-teal-500 text-bg rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-teal-500/20"
            >
              <Import size={20} />
              Initialize Soil Scan
            </button>
            <button 
              onClick={handleDummy}
              className="w-full py-4 bg-green-500/20 text-green-300 border border-green-500/30 rounded-2xl font-black uppercase tracking-widest hover:bg-green-500/30 transition-all flex items-center justify-center gap-3"
            >
              <Activity size={20} />
              Show Dummy Data
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const getStatusConfig = (score: number) => {
    if (score >= 75) return { 
      label: t('soilHealth.status.healthy'), 
      icon: '🟢', 
      classes: 'bg-success/20 text-success', 
      color: 'var(--success)',
      glow: 'shadow-[0_0_30px_rgba(34,197,94,0.2)]'
    };
    if (score >= 50) return { 
      label: t('soilHealth.status.moderate'), 
      icon: '⚠️', 
      classes: 'bg-warning/20 text-warning', 
      color: 'var(--warning)',
      glow: 'shadow-[0_0_30px_rgba(234,179,8,0.15)]'
    };
    return { 
      label: t('soilHealth.status.poor'), 
      icon: '❌', 
      classes: 'bg-error/20 text-error', 
      color: 'var(--error)',
      glow: 'shadow-[0_0_30px_rgba(239,68,68,0.15)]'
    };
  };

  const status = getStatusConfig(analysis?.score || 0);

  return (
    <div className="space-y-8 pb-20">
      {/* 🟢 1. HEADER SECTION */}
      <ScrollReveal direction="down">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-display font-black text-white tracking-tight">{t('soilHealth.title')}</h1>
            <p className="text-white/50 mt-2 font-bold italic">{t('soilHealth.sub')}</p>
          </div>
          <div className="px-4 py-2 glass border border-white/10 rounded-xl text-[10px] font-black text-white/40 uppercase tracking-widest">
            {t('soilHealth.analysisReport')}: #{report?.id?.slice(-4) || '----'}
          </div>
        </div>
      </ScrollReveal>

      {/* 📊 2. OVERALL SOIL HEALTH SCORE */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className={`p-10 rounded-[40px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent flex flex-col md:flex-row items-center gap-12 transition-all duration-500 ${status?.glow}`}>
          <div className="relative group">
            <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 transition-colors duration-500`} style={{ backgroundColor: status?.color }} />
            <svg width="200" height="200" viewBox="0 0 100 100" className="relative z-10">
               <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
               <motion.circle 
                 cx="50" cy="50" r="45" fill="none" 
                 stroke={status?.color || '#22c55e'} 
                 strokeWidth="8"
                 strokeDasharray="283"
                 initial={{ strokeDashoffset: 283 }}
                 animate={{ strokeDashoffset: 283 - (283 * (analysis?.score || 0)) / 100 }}
                 transition={{ duration: 2, ease: "circOut" }}
                 strokeLinecap="round"
                 transform="rotate(-90 50 50)"
               />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <motion.span 
                 initial={{ scale: 0.5, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="text-6xl font-display font-black text-white"
               >
                 {analysis?.score || 0}%
               </motion.span>
            </div>
          </div>
          
          <div className="flex-1 space-y-6">
             <div className="space-y-2">
                <p className="text-xs font-black text-white/30 uppercase tracking-[0.3em] font-display">{t('soilHealth.scoreLabel')}</p>
                <div className="flex items-center gap-3">
                   <h2 className={`text-5xl font-display font-black transition-colors duration-500`}>
                      {status?.icon} {status?.label} {t('soil')}
                   </h2>
                </div>
                <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${status?.classes}`}>
                   {status?.label}
                </div>
             </div>
             <p className="text-white/40 text-sm leading-relaxed max-w-lg font-medium">
                Your soil health is determined by the balance of essential nutrients and environmental factors. 
                The current status is <span className="text-white">{(status?.label || '').toLowerCase()}</span> based on automated logic analysis of your parameters.
             </p>
          </div>
        </div>
      </ScrollReveal>

      {/* 🧪 3. PARAMETER ANALYSIS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {PARAMETER_MAP.map((p, i) => {
          const val = analysis?.data ? (analysis.data as any)[p.baseKey] || 0 : 0;
          
          // Parameter specific status logic
          let pStatus = { label: 'Optimal', classes: 'bg-success/20 text-success', icon: '🟢' };
          if (p.id === 'nitrogen' && val < 200) pStatus = { label: 'Low', classes: 'bg-error/20 text-error', icon: '❌' };
          if (p.id === 'ph' && (val < 6 || val > 7.5)) pStatus = { label: 'Critical', classes: 'bg-error/20 text-error', icon: '❌' };
          if (p.id === 'carbon' && val < 3) pStatus = { label: 'Moderate', classes: 'bg-warning/20 text-warning', icon: '⚠️' };
          
          return (
            <ScrollReveal key={p.id} direction="up" delay={0.05 * i}>
              <div className={`p-6 rounded-2xl border border-white/5 transition-all duration-300 group ${pStatus.classes.split(' ')[0]}`}>
                 <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">
                    {t(`soilHealth.parameters.${p.id}`)}
                 </p>
                 <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-2xl font-display font-black text-white">{val}</span>
                    <span className="text-[10px] font-bold text-white/20 uppercase">{p.id === 'ph' ? '' : p.id === 'carbon' || p.id === 'moisture' ? '%' : 'kg/ha'}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px]">{pStatus.icon}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${pStatus.classes.split(' ')[1]}`}>
                       {pStatus.label}
                    </span>
                 </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ⚠️ 4. IMBALANCE DETECTION PANEL */}
        <div className="lg:col-span-12">
            <ScrollReveal direction="left">
               <div className={`p-8 rounded-[32px] border border-red-500/10 bg-red-500/5 relative overflow-hidden group shadow-[0_0_30px_rgba(239,68,68,0.1)]`}>
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                     <AlertCircle size={80} className="text-red-500" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 rounded-2xl bg-error flex items-center justify-center text-bg shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                        <AlertCircle size={24} />
                     </div>
                     <h2 className="text-2xl font-display font-black text-white tracking-tight">❌ {t('soilHealth.imbalanceDetected')}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {analysis?.issues.map((issue) => (
                        <div key={issue.id} className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4 hover:border-red-500/30 transition-colors">
                           <div className="flex justify-between items-center">
                              <span className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/20 text-[10px] font-black text-red-400 uppercase tracking-widest">
                                 ❌ {issue.status}
                              </span>
                              <Info size={14} className="text-white/20" />
                           </div>
                           <h3 className="text-lg font-bold text-white">{t(`soilHealth.parameters.${issue.type}`)}</h3>
                           <p className="text-xs text-white/50 leading-relaxed italic">"{t(`soilHealth.explanation.${issue.logic}`)}"</p>
                        </div>
                     ))}
                  </div>
               </div>
            </ScrollReveal>
        </div>

        {/* 🌱 5. CORRECTIVE ACTIONS */}
        <div className="lg:col-span-8 space-y-6">
           <div className="flex items-center gap-3">
              <h2 className="text-2xl font-display font-black text-white">{t('soilHealth.correctiveActions')}</h2>
              <div className="h-px flex-1 bg-white/10" />
           </div>

           <div className="grid grid-cols-1 gap-4">
              {[
                { title: t('soilHealth.actions.nitrogen'), logic: 'needsN', icon: Leaf, color: '#22c55e' },
                { title: t('soilHealth.actions.phBalance'), logic: 'highPH_UX', icon: FlaskConical, color: '#a855f7' }
              ].map((act, i) => (
                <ScrollReveal key={i} direction="right" delay={0.1 * i}>
                   <div className="p-6 rounded-3xl border border-white/5 bg-white/5 flex items-center justify-between group hover:border-white/20 transition-all">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110" style={{ color: act.color }}>
                            <act.icon size={28} />
                         </div>
                         <div>
                            <h3 className="text-lg font-bold text-white mb-1">{act.title}</h3>
                            <p className="text-xs text-white/40 leading-relaxed italic">{t(`soilHealth.ux.${act.logic}`)}</p>
                         </div>
                      </div>
                      <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-teal-500 transition-colors">
                         <ChevronRight size={20} />
                      </button>
                   </div>
                </ScrollReveal>
              ))}
           </div>
        </div>

        {/* 💡 6. SMART RECOMMENDATIONS */}
        <div className="lg:col-span-4 space-y-6">
           <h2 className="text-2xl font-display font-black text-white">{t('soilHealth.smartRecs')}</h2>
           <div className="p-8 rounded-[32px] border border-white/10 bg-white/5 space-y-6">
              {[
                { text: t('soilHealth.recsList.irrigation'), icon: Droplet },
                { text: t('soilHealth.recsList.organic'), icon: Leaf },
                { text: t('soilHealth.recsList.rotation'), icon: Sprout },
                { text: t('soilHealth.recsList.fertilizer'), icon: FlaskConical }
              ].map((rec, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group cursor-default">
                   <div className="w-2 h-2 rounded-full bg-teal-500 group-hover:scale-150 transition-transform" />
                   <p className="text-sm font-bold text-white/70 group-hover:text-white transition-colors">{rec.text}</p>
                </div>
              ))}
           </div>
        </div>

        {/* 📈 7. SOIL IMPROVEMENT PLAN (Timeline) */}
        <div className="lg:col-span-12">
            <ScrollReveal direction="up">
               <div className="p-10 rounded-[40px] border border-white/10 bg-gradient-to-br from-teal-500/5 to-transparent relative overflow-hidden">
                  <div className="absolute -right-20 -top-20 w-64 h-64 bg-teal-500/10 rounded-full blur-[100px]" />
                  
                  <div className="flex items-center gap-4 mb-12">
                      <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-bg shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                        <TrendingUp size={24} />
                      </div>
                      <h2 className="text-3xl font-display font-black text-white">{t('soilHealth.improvementPlan')}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
                     <div className="absolute top-12 left-0 right-0 h-px bg-white/10 hidden md:block" />
                     
                     {[
                       { week: 'week1', task: 'addCompost', color: '#22c55e' },
                       { week: 'week2', task: 'applyFert', color: '#3b82f6' },
                       { week: 'week4', task: 'monitor', color: '#a855f7' }
                     ].map((step, i) => (
                       <div key={i} className="relative space-y-6 text-center md:text-left">
                          <div className="mx-auto md:mx-0 w-10 h-10 rounded-full bg-bg border-4 border-white/10 flex items-center justify-center relative z-10" style={{ borderColor: step.color }}>
                             <div className="w-2 h-2 rounded-full bg-white animate-pulse" style={{ backgroundColor: step.color }} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: step.color }}>{t(`soilHealth.timeline.${step.week}`)}</p>
                             <h3 className="text-xl font-bold text-white mb-2">{t(`soilHealth.timeline.${step.task}`)}</h3>
                             <p className="text-xs text-white/40 leading-relaxed italic">{t('soilHealth.timelineDesc')}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
