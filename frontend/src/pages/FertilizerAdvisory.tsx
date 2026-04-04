import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FlaskConical,
  AlertCircle,
  Beaker,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Truck,
  Info,
  LayoutList
} from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { useFarmStore } from '../store/farmStore';
import { analyzeSoil } from '../lib/fertilizerLogic';

const ICON_MAP: Record<string, any> = {
  Beaker,
  TrendingUp,
  FlaskConical,
  AlertCircle,
  Info
};

export default function FertilizerAdvisory() {
  const { currentAdvisory, updateAdvisory, setActivePage, getSelectedReport } = useFarmStore();
  
  const latestReport = getSelectedReport();

  useEffect(() => {
    if (latestReport && !currentAdvisory) {
      const data = {
        n: Number(latestReport.results?.nitrogen) || 0,
        p: Number(latestReport.results?.phosphorus) || 0,
        k: Number(latestReport.results?.potassium) || 0,
        ph: Number(latestReport.results?.ph) || 7,
        moisture: Number(latestReport.results?.moisture) || 0,
        organicCarbon: Number(latestReport.results?.organicCarbon) || 0.8
      };
      const result = analyzeSoil(data);
      updateAdvisory(result);
    }
  }, [latestReport, currentAdvisory, updateAdvisory]);

  const handleSoilRedirect = () => {
    setActivePage('soil');
  };

  if (!currentAdvisory || !latestReport) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] py-20 px-8 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-card rounded-[40px] p-16 max-w-xl w-full border border-white/5 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <FlaskConical size={120} />
          </div>
          <div className="w-20 h-20 rounded-[28px] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 text-white/20">
            <Beaker size={40} />
          </div>
          
          <h2 className="text-4xl font-display font-black text-text-text mb-4">Calculate Fertilizer Strategy</h2>
          <p className="text-text-text-muted mb-10 text-lg leading-relaxed font-bold px-4">
             Fertilizer dosage requires high-precision lab metrics. Select an analyzed profile to generate your application plan.
          </p>

          <button 
            onClick={handleSoilRedirect}
            className="w-full py-5 bg-teal-500 text-bg rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-teal-500/20 text-xs"
          >
            <LayoutList size={20} />
            Selection Hub
          </button>
        </motion.div>
      </div>
    );
  }

  const { nutrients, deficiencies, recommendations, timeline, soilHealth } = currentAdvisory;

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER SECTION */}
      <ScrollReveal direction="down">
        <div
          className="relative p-10 rounded-[40px] border border-white/10 shadow-2xl overflow-hidden"
          style={{ background: 'rgba(10, 40, 20, 0.95)', backdropFilter: 'blur(20px)' }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
                 <div className="px-3 py-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">
                    Real Analysis Profile
                 </div>
                 <h1 className="text-4xl font-display font-black text-white tracking-tight">
                    Fertilizer Strategy
                 </h1>
              </div>
              <p className="text-white/50 font-bold italic leading-relaxed max-w-xl">
                 Optimizing NPK balance for target yields based on laboratory data from <strong>{latestReport.fileName}</strong>.
              </p>
            </div>
            <div className="flex items-center gap-6 bg-black/40 p-5 rounded-3xl border border-white/5">
              <div className="text-right">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Soil Health</p>
                <p className="text-4xl font-black text-white leading-none">{soilHealth}%</p>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div className="px-5 py-3 bg-green-500/10 border border-green-500/20 rounded-2xl flex flex-col items-center">
                 <div className="flex items-center gap-2 mb-1">
                    <CheckCircle size={14} className="text-green-500" />
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Optimized</span>
                 </div>
                 <span className="text-[8px] font-black text-white/20 uppercase tracking-tighter">AI AGENT ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* NUTRIENT STATUS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {nutrients.map((n: any, i: number) => (
          <ScrollReveal key={n.id} direction="up" delay={0.1 * i}>
            <div
              className="p-6 rounded-2xl border border-white/5 shadow-xl group hover:border-white/20 transition-all duration-300"
              style={{ background: 'rgba(15, 45, 25, 0.8)' }}
            >
              <div className="w-10 h-10 rounded-[14px] mb-5 flex items-center justify-center bg-white/5 group-hover:scale-110 transition-transform">
                <FlaskConical size={20} style={{ color: n.color }} />
              </div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">
                {(n.id || '').split('_').pop().toUpperCase()}
              </p>
              <div className="flex items-baseline gap-1 mb-4">
                <p className="text-2xl font-black text-white">{n.value}</p>
                <p className="text-[10px] text-white/40 font-bold">{n.unit}</p>
              </div>

              <div className="h-1.5 bg-black/40 rounded-full overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: n.status === 'optimal' ? '85%' : (Math.min(100, Math.max(0, (Number(n.value) || 0)/400*100))) + '%' }}
                  className="h-full rounded-full"
                  style={{ background: n.color }}
                />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: n.color }}>
                 {(n.status || 'Checking')}
              </span>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* DEFICIENCY ALERT PANEL */}
      <ScrollReveal direction="left">
        <div className={`p-1 rounded-[40px] ${deficiencies.length > 0 ? 'bg-gradient-to-r from-red-500/20 via-transparent to-transparent' : 'bg-gradient-to-r from-teal-500/20 via-transparent to-transparent'}`}>
          <div className="p-10 rounded-[38px] border border-white/5" style={{ background: 'rgba(15, 15, 15, 0.9)', backdropFilter: 'blur(10px)' }}>
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl ${deficiencies.length > 0 ? 'bg-red-500 shadow-red-500/20' : 'bg-teal-500 shadow-teal-500/20'}`}>
                {deficiencies.length > 0 ? <AlertCircle size={32} /> : <CheckCircle size={32} />}
              </div>
              <div>
                <h2 className="text-3xl font-display font-black text-white tracking-tight leading-none mb-2">
                  {deficiencies.length > 0 ? `Detected Nutrients Deficiencies` : `Nutrient Inventory Balanced`}
                </h2>
                <p className="text-xs text-white/40 font-bold italic">Deep analysis system monitoring {latestReport.fileName}</p>
              </div>
            </div>

            {deficiencies.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {deficiencies.map((d: any, i: number) => (
                 <div key={i} className="flex gap-4 p-6 rounded-[24px] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-red-500/20 transition-all group">
                   <div className="w-1 h-full rounded-full bg-red-500 group-hover:scale-y-110 transition-transform" />
                   <div>
                     <p className="text-xs font-black text-white mb-2 uppercase tracking-widest">
                       CRITICAL: LOW {d.nutrient.toUpperCase()}
                     </p>
                     <p className="text-xs text-white/50 mb-4 leading-relaxed italic">{d.impact}</p>
                     <div className="flex items-center gap-2 text-[10px] font-black text-red-500 bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20">
                       {d.fix}
                     </div>
                   </div>
                 </div>
               ))}
             </div>
            ) : (
               <div className="py-8 text-center text-white/20 font-black uppercase tracking-[0.3em] text-sm">
                  Soil nutrient spectrum is currently within the optimal range for healthy yields.
               </div>
            )}
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FERTILIZER RECOMMENDATION CARDS */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-display font-black text-white">Application Targets</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-1 gap-5">
            {recommendations.length > 0 ? recommendations.map((r: any, i: number) => (
              <ScrollReveal key={r.name} direction="right" delay={0.1 * i}>
                <div
                  className="p-8 rounded-[32px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-white/20 transition-all group relative overflow-hidden"
                  style={{ background: 'rgba(15, 35, 20, 0.8)' }}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                     <Truck size={60} />
                  </div>
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner" style={{ color: r.color }}>
                      <FlaskConical size={30} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-black text-white mb-1 leading-none">{r.name}</h3>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em]">{r.type}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 relative z-10 w-full md:w-auto">
                    <div className="text-center px-6 py-4 bg-black/60 rounded-[22px] border border-white/5 min-w-[130px] shadow-inner">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Target Dosage</p>
                      <p className="text-xl font-black text-white leading-none">{r.dosage} <span className="text-[10px] text-white/30 tracking-widest ml-1">KG/ACRE</span></p>
                    </div>
                    <div className="text-center px-6 py-4 bg-black/60 rounded-[22px] border border-white/5 min-w-[170px] shadow-inner">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Best Timing</p>
                      <p className="text-xs font-black text-white tracking-widest truncate">{r.timing.toUpperCase()}</p>
                    </div>
                    <button className="w-14 h-14 rounded-[22px] bg-teal-500 text-bg flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-teal-500/20">
                      <ArrowRight size={24} />
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            )) : (
               <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-[40px] opacity-40">
                  <p className="font-display font-black text-xl uppercase tracking-widest">No target recommendations</p>
               </div>
            )}
          </div>
        </div>

        {/* APPLICATION SCHEDULE TIMELINE */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-2xl font-display font-black text-white">Application Cycle</h2>
          <div className="p-10 rounded-[40px] border border-white/10 relative overflow-hidden h-full" style={{ background: 'rgba(10, 30, 20, 0.9)' }}>
            <div className="absolute left-[3.25rem] top-12 bottom-12 w-px bg-white/10" />

            <div className="space-y-12 relative h-full">
              {timeline.map((item: any, i: number) => {
                const IconComp = ICON_MAP[item.icon] || Info;
                return (
                  <div key={i} className="flex items-center gap-8 group">
                    <div className="relative z-10 w-10 h-10 rounded-[14px] border border-white/10 bg-bg flex items-center justify-center transition-all group-hover:scale-110 group-hover:border-teal-500/40 shadow-xl" style={{ color: item.color }}>
                      <IconComp size={18} />
                    </div>
                    <div className="flex-1 p-5 rounded-[22px] bg-white/5 border border-white/5 hover:border-white/10 transition-all shadow-inner">
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: item.color }}>T-Minus Day {item.day}</p>
                      <p className="text-xs font-black text-white/70 leading-relaxed uppercase tracking-tighter">{item.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
