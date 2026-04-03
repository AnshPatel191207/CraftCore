import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useFarmStore } from '../../store/farmStore';
import { StatusBadge } from './StatusBadge';

export function NutrientChart() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { soilReports } = useFarmStore();
  const latestReport = soilReports[0]?.results;

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || (loading && !latestReport)) return <div className="h-64 bg-white/5 animate-pulse rounded-[32px]" />;
  if (!mounted || !latestReport) return <div className="h-64 bg-slate-900/50 animate-pulse rounded-[32px]" />;

  const params = [
    { name: 'Nitrogen (N)', value: latestReport.nitrogen, optimal: 300, unit: 'kg/ha', color: '#10b981' },
    { name: 'Phosphorus (P)', value: latestReport.phosphorus, optimal: 40, unit: 'kg/ha', color: '#f59e0b' },
    { name: 'Potassium (K)', value: latestReport.potassium, optimal: 250, unit: 'kg/ha', color: '#10b981' },
    { name: 'Organic Matter', value: latestReport.organicMatter, optimal: 4.5, unit: '%', color: '#10b981' },
    { name: 'Moisture Level', value: latestReport.moisture, optimal: 35, unit: '%', color: '#0ea5e9' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
            <div>
              <h3 className="text-xl font-display font-black tracking-tight" style={{ color: 'var(--text)' }}>Soil Nutrient Matrix</h3>
              <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-0.5 whitespace-nowrap">Real-time Lab Analysis • Live</p>
            </div>
         </div>
         <StatusBadge status="info">Detailed Scan</StatusBadge>
       </div>
       
       <div className="space-y-6">
         {params.map((param, i) => {
           const percentage = Math.min((param.value / param.optimal) * 100, 100);
           return (
             <div key={param.name} className="space-y-2.5">
               <div className="flex justify-between items-baseline px-1">
                 <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--text)' }}>{param.name}</span>
                 <div className="flex items-baseline gap-1.5">
                     <span className="text-sm font-black" style={{ color: 'var(--text)' }}>{param.value}</span>
                     <span className="text-[10px] font-bold text-text-muted uppercase italic">{param.unit}</span>
                 </div>
               </div>
               <div className="relative h-2.5 rounded-full overflow-hidden border" style={{ background: 'var(--surface-3)', borderColor: 'var(--border)' }}>
                 {/* Optimal zone highlight */}
                 <div 
                   className="absolute top-0 bottom-0 bg-teal-500/10 border-x border-teal-500/20"
                   style={{ left: '70%', width: '20%' }}
                 />
                 
                 {/* Progress bar */}
                 <motion.div 
                   initial={{ width: 0 }}
                   whileInView={{ width: `${percentage}%` }}
                   viewport={{ once: true }}
                   transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                   className={cn(
                     "absolute top-0 left-0 bottom-0 rounded-full relative",
                     percentage < 40 ? "bg-[var(--error)]" : percentage < 70 ? "bg-[var(--warning)]" : "bg-[var(--teal)]"
                   )}
                   style={{ boxShadow: `0 0 10px ${percentage < 40 ? 'var(--error)' : percentage < 70 ? 'var(--warning)' : 'var(--teal)'}33` }}
                 >
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer opacity-30" />
                 </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NutrientChart;
