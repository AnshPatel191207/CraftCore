import { NutrientChart } from '../ui/NutrientChart';
import { useFarmStore } from '../../store/farmStore';
import { StatusBadge } from '../ui/StatusBadge';
import { AlertTriangle, Activity, TrendingUp, Thermometer, Droplets, ShieldAlert, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { pulseAmber } from '../../lib/animations';

export function BentoGrid() {
  const { advisories, soilReports, activityFeed } = useFarmStore();
  const latestReport = soilReports[0];
  const criticalAdvisories = advisories.filter(a => a.severity === 'critical' || a.severity === 'high');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Nutrient Analysis - Large Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="lg:col-span-2 glass rounded-[32px] p-8 border border-border relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Cpu size={120} className="text-teal-500" />
        </div>
        <NutrientChart />
      </motion.div>

      {/* Recommended Crop */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="glass rounded-[32px] p-8 flex flex-col group overflow-hidden relative border border-border"
      >
        <div className="flex items-center gap-2 mb-8">
            <div className="w-1.5 h-4 bg-teal-500 rounded-full" />
            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Top Advisory</h3>
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <div className="text-6xl mb-6 p-6 glass rounded-3xl border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-2xl">🌾</div>
          <div className="text-2xl font-display font-black text-text mb-2 leading-tight group-hover:text-teal-500 transition-colors">
            {latestReport?.results?.recommendations[0]?.split('.')[0] || "Wheat Sowing"}
          </div>
          <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mb-6 italic">Optimal Planting Window</p>
          
          <div className="w-full p-5 glass border border-white/5 rounded-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Health Index</span>
              <span className="text-sm font-black text-teal-500">{latestReport?.results?.healthScore || 82}%</span>
            </div>
            <div className="h-2 w-full bg-surface-3 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${latestReport?.results?.healthScore || 82}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full bg-teal-500" 
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Deficiency Alerts */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="glass rounded-[32px] p-8 border border-white/5"
      >
        <div className="flex items-center gap-2 mb-8">
            <ShieldAlert size={16} className="text-amber-500" />
            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Priority Alerts</h3>
        </div>
        
        <div className="space-y-4">
          {criticalAdvisories.length > 0 ? criticalAdvisories.slice(0, 3).map((adv) => (
            <div 
              key={adv.id} 
              className="flex items-start gap-4 p-4 rounded-2xl group transition-all"
              style={{ 
                background: 'var(--surface-2)',
                borderLeft: '3px solid var(--error)'
              }}
            >
              <div className="p-2 bg-red-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-tight truncate leading-tight mb-1" style={{ color: 'var(--text)' }}>
                  {adv.title}
                </p>
                <div className="flex items-center gap-2">
                   <StatusBadge status={adv.severity === 'critical' ? 'error' : 'warning'}>{adv.severity}</StatusBadge>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 glass rounded-[32px] border border-teal-500/20 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-teal-500" size={32} />
              </div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Environment Stable</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* pH Level Widget */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="glass rounded-[32px] p-8 border border-white/5"
      >
        <div className="flex items-center gap-2 mb-10">
            <Droplets size={16} className="text-sky-500" />
            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Soil Chemistry</h3>
        </div>
        
        <div className="relative flex flex-col items-center justify-center pt-2">
          <div className="text-6xl font-display font-black text-text mb-2 leading-none">{latestReport?.results?.ph || 6.8}</div>
          <StatusBadge status="warning" className="mb-8">Slightly Acidic</StatusBadge>
          
          <div className="w-full h-2.5 bg-surface-3 rounded-full relative border border-border">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-teal-500 to-sky-500 rounded-full opacity-40 blur-[1px]" />
            <motion.div 
              initial={{ left: 0 }}
              whileInView={{ left: `${((latestReport?.results?.ph || 6.8) / 14) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 2, type: "spring", stiffness: 50 }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.5)] z-10 flex items-center justify-center"
            >
                <div className="w-1.5 h-1.5 bg-bg rounded-full" />
            </motion.div>
          </div>
          <div className="flex justify-between w-full mt-4 text-[9px] font-black text-text-muted uppercase tracking-widest">
            <span>0</span>
            <span className="text-text-muted">Neutral (7)</span>
            <span>14</span>
          </div>
        </div>
      </motion.div>

      {/* Live Intelligence Feed */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="lg:col-span-3 glass rounded-[32px] p-8 border border-border"
      >
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 glass rounded-xl flex items-center justify-center border border-teal-500/20">
                <Activity size={20} className="text-teal-500" />
             </div>
             <div>
                <h3 className="text-xl font-display font-black text-text tracking-tight">Intelligence Log</h3>
                <p className="text-[10px] text-teal-500 font-black uppercase tracking-widest mt-0.5">Live Submission Stream</p>
             </div>
          </div>
          <button className="px-4 py-2 glass border border-border rounded-xl text-[10px] font-black text-text-muted uppercase hover:text-text transition-colors">
            Audit Trail
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {activityFeed.map((activity, idx) => (
              <motion.div
                key={activity.id}
                variants={pulseAmber}
                initial="initial"
                animate={idx === 0 ? "flash" : "initial"}
                className="flex items-center justify-between p-4 glass border border-border rounded-[24px] group hover:border-teal-500/30 transition-all"
              >
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-surface-2 border border-border flex items-center justify-center font-black text-xs text-teal-500 group-hover:scale-110 transition-transform">
                      {activity.user.charAt(0)}
                   </div>
                   <div>
                      <p className="text-sm font-black text-text leading-tight">{activity.user}</p>
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-tighter">{activity.action}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-teal-500/80 uppercase tracking-widest">{activity.location}</p>
                   <p className="text-[9px] text-text-muted font-bold mt-0.5">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Environmental Status */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="glass rounded-[32px] p-8 border border-border flex flex-col justify-center items-center text-center group"
      >
          <div className="w-20 h-20 rounded-[32px] glass border border-sky-500/20 flex items-center justify-center mb-6 shadow-2xl group-hover:rotate-12 transition-transform duration-500">
             <Thermometer size={34} className="text-sky-500" />
          </div>
          <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Sensor Avg</h3>
          <div className="text-4xl font-display font-black text-text">28.4°C</div>
          <div className="mt-4 flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
             <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Normal Range</span>
          </div>
      </motion.div>
    </div>
  );
}
