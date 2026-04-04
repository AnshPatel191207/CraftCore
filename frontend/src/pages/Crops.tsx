import { Sprout, Calendar, TrendingUp, Ruler, ChevronRight, PieChart as PieIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFarmStore } from '../store/farmStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { fadeUp, staggerContainer } from '../lib/animations';

const COLORS = ['#11d1b1', '#f59e0b', '#3b82f6', '#8b5cf6'];


export default function Crops() {
  const { crops, totalAcres } = useFarmStore();
  const pieData = crops.map((c) => ({ name: c.name, value: c.area }));
  const usedAcres = crops.reduce((a, c) => a + c.area, 0);

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
          <h1 className="text-5xl font-display font-black text-text tracking-tighter mb-4 text-glow">Crop Ecosystem</h1>
          <p className="text-text-muted font-bold uppercase tracking-[0.2em] text-[10px]">Active Cultivation Management • {crops.length} Active Varietals</p>
        </div>
        <div className="glass p-6 rounded-3xl border border-white/5 flex items-center gap-6">
           <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-500 border border-teal-500/20">
              <PieIcon size={24} />
           </div>
           <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Total Utilization</p>
              <p className="text-2xl font-black text-text font-display leading-none">
                {usedAcres}<span className="text-sm text-text-muted mx-1">/</span>{totalAcres}
                <span className="text-xs text-text-muted ml-2 font-bold uppercase">Acres</span>
              </p>
           </div>
        </div>
      </motion.div>

      {/* Land Distribution Bento */}
      <motion.div
        variants={fadeUp}
        className="glass rounded-[40px] p-10 border border-white/5 relative overflow-hidden group"
      >
        <div className="absolute inset-0 shimmer opacity-5" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="w-64 h-64 relative group">
            <div className="absolute inset-0 bg-teal-500/10 blur-[60px] rounded-full scale-75 group-hover:scale-100 transition-transform duration-700" />
            <ResponsiveContainer>
              <PieChart>
                <Pie 
                  data={pieData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={70} 
                  outerRadius={100} 
                  paddingAngle={5} 
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0a0a0b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Digital</span>
                <span className="text-2xl font-black text-text tracking-tighter">Harvest</span>
            </div>
          </div>

          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {crops.map((crop, i) => (
              <div key={crop.name} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ background: COLORS[i % COLORS.length], boxShadow: `0 0 15px ${COLORS[i % COLORS.length]}40` }} />
                <div className="flex-1">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{crop.name}</p>
                  <p className="text-sm font-black text-text">{crop.area} <span className="text-[10px] text-text-muted">acres</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-teal-500 uppercase">{Math.round((crop.area / totalAcres) * 100)}%</p>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/5 border-dashed">
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="flex-1">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Unallocated</p>
                <p className="text-sm font-black text-text-muted">{totalAcres - usedAcres} <span className="text-[10px]">acres</span></p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {crops.map((crop, i) => (
          <motion.div
            key={crop.name}
            variants={fadeUp}
            className="glass rounded-[32px] p-8 border border-white/5 hover:border-teal-500/20 transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-start justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-[24px] flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 shadow-2xl" style={{ background: `${COLORS[i % COLORS.length]}15`, border: `1px solid ${COLORS[i % COLORS.length]}30` }}>
                  <Sprout size={32} style={{ color: COLORS[i % COLORS.length] }} />
                </div>
                <div>
                  <h4 className="text-2xl font-display font-black text-text tracking-tight uppercase mb-1">{crop.name}</h4>
                  <div className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                     <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Development Stage: {crop.stage}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black font-display tracking-tighter" style={{ color: COLORS[i % COLORS.length] }}>
                  {crop.health}%
                </p>
                <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mt-1">Vitality Score</p>
              </div>
            </div>

            {/* Health Bar (Modern Version) */}
            <div className="relative h-2.5 bg-white/[0.03] rounded-full overflow-hidden mb-10 border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${crop.health}%` }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}40 0%, ${COLORS[i % COLORS.length]} 100%)` }}
              >
                <div className="absolute inset-0 shimmer opacity-20" />
              </motion.div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 relative z-10">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center group-hover:bg-white/[0.04] transition-colors">
                <Ruler size={16} className="mx-auto text-text-muted mb-2 group-hover:text-teal-500 transition-colors" />
                <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Spatial Area</p>
                <p className="text-sm font-black text-text">{crop.area} <span className="text-[10px] text-text-muted">ac</span></p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center group-hover:bg-white/[0.04] transition-colors">
                <Calendar size={16} className="mx-auto text-text-muted mb-2 group-hover:text-amber-500 transition-colors" />
                <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Initiated</p>
                <p className="text-xs font-black text-text">{new Date(crop.plantedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center group-hover:bg-white/[0.04] transition-colors">
                <TrendingUp size={16} className="mx-auto text-text-muted mb-2 group-hover:text-blue-500 transition-colors" />
                <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Est. Harvest</p>
                <p className="text-xs font-black text-text">{new Date(crop.expectedHarvest).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
            </div>

            <button className="w-full mt-6 py-4 rounded-[20px] bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:bg-white/5 hover:text-text transition-all flex items-center justify-center gap-2 group/btn">
              Diagnostic Deep-Scan
              <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

