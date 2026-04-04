import React from 'react';
import { Sprout, TrendingUp, AlertTriangle, Calendar, ChevronRight, LayoutDashboard, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import StatCard from '../components/StatCard';
import { useFarmStore } from '../store/farmStore';
import { BentoGrid } from '../components/sections/BentoGrid';
import { fadeUp, staggerContainer } from '../lib/animations';
import { SkeletonCard } from '../components/ui/SkeletonCard';


const yieldData = [
  { month: 'Aug', yield: 2.1 },
  { month: 'Sep', yield: 2.4 },
  { month: 'Oct', yield: 3.2 },
  { month: 'Nov', yield: 3.8 },
  { month: 'Dec', yield: 4.1 },
  { month: 'Jan', yield: 4.5 },
];

const rainfallData = [
  { month: 'Aug', rain: 120 },
  { month: 'Sep', rain: 85 },
  { month: 'Oct', rain: 60 },
  { month: 'Nov', rain: 30 },
  { month: 'Dec', rain: 15 },
  { month: 'Jan', rain: 45 },
];

function CircleGauge({ value }: { value: number }) {
  const r = 20;
  const circumference = 2 * Math.PI * r;
  const strokeDash = (value / 100) * circumference;
  return (
    <svg width="64" height="64" viewBox="0 0 52 52" className="drop-shadow-[0_0_8px_rgba(34,197,94,0.2)]">
      <circle cx="26" cy="26" r={r} fill="none" 
        stroke="var(--teal-dim)" strokeWidth="4" />
      <motion.circle 
        cx="26" cy="26" r={r} fill="none"
        stroke="var(--teal-500)" strokeWidth="4"
        initial={{ strokeDasharray: `0 ${circumference}` }}
        animate={{ strokeDasharray: `${strokeDash} ${circumference}` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        strokeLinecap="round"
        transform="rotate(-90 26 26)" />
      <text x="26" y="30" textAnchor="middle" 
        fontSize="10" fill="#22c55e" fontWeight="black" className="font-display">
        {value}%
      </text>
    </svg>
  );
}

export default function Dashboard() {
  const { 
    crops, 
    advisories, 
    farmName, 
    totalAcres, 
    currentDomain,
    stats,
    isLoading,
    fetchDashboardData,
    isDemoMode
  } = useFarmStore();

  React.useEffect(() => {
    fetchDashboardData();
  }, [isDemoMode]);

  const avgHealth = stats?.cropHealth || 
    (crops.length > 0 ? Math.round(crops.reduce((a, c) => a + c.health, 0) / crops.length) : 0);
  
  const unreadAlerts = stats?.alerts ?? advisories.filter((a) => !a.isRead).length;
  const displayArea = stats?.activeArea ?? totalAcres;
  const displayYield = stats?.yieldEst ?? '4.5 t/ac';

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-8 pb-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2 mb-2">
            <LayoutDashboard size={18} className="text-teal-500" />
            <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.2em]">{currentDomain} Intelligence</span>
          </div>
          <h1 className="text-4xl font-display font-black text-text tracking-tight">Main Command</h1>
          <div className="flex items-center gap-3 mt-2 text-text-muted font-bold">
            <span className="flex items-center gap-1.5 px-3 py-1 glass border border-border rounded-lg text-[10px] uppercase tracking-wider italic">
              {farmName}
            </span>
            <span className="w-1 h-1 bg-teal-500/50 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{totalAcres} ac TOTAL AREA</span>
          </div>
        </motion.div>
        
        <motion.div variants={fadeUp} className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl glass border border-teal-dim flex items-center gap-2 group cursor-pointer hover:border-teal-500/40 transition-all">
            <Globe size={14} className="text-teal-500" />
            <span className="text-xs font-black text-text uppercase tracking-widest">Global Sync</span>
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          </div>
          <div className="p-2.5 glass border border-border rounded-xl cursor-pointer hover:bg-teal-dim transition-colors">
            <Calendar className="w-5 h-5 text-text-muted" />
          </div>
        </motion.div>
      </div>

      {/* System Status Slim Bar */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-3 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
        style={{
          background: 'var(--surface-2)',
          border:     '1px solid var(--border)',
          color:      'var(--text-muted)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-teal-500" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-500" />
          </span>
          <span style={{ color: 'var(--teal-500)' }}>Live</span>
        </div>
        <span className="opacity-20">|</span>
        <span>Receiving live sensor data from <strong className="text-text">Main Hub</strong></span>
        <span className="hidden sm:inline-flex items-center gap-1.5">
          <span className="opacity-20">|</span>
          <span>Sync frequency: 500ms</span>
        </span>
      </motion.div>

      {/* Hero Banner upgraded to match theme */}
      <motion.div 
        variants={fadeUp}
        className="relative rounded-[32px] overflow-hidden min-h-[220px] shadow-lg shadow-black/20 group border transition-all duration-500 flex items-center justify-between gap-6 p-10"
        style={{ 
          background: 'var(--banner-bg)',
          borderColor: 'var(--banner-border)'
        }}
      >
        <div className="absolute inset-0 shimmer opacity-10" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-10 transition-opacity z-0 pointer-events-none">
            <Sprout size={320} className="text-teal-500 translate-x-1/4" />
        </div>

        {/* LEFT COLUMN: Season + Title + Subtitle */}
        <div className="flex-1 min-w-0 flex flex-col gap-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-500/10 backdrop-blur-md rounded-full border border-teal-500/20 max-w-fit">
            <Sprout size={14} className="text-teal-500" />
            <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest leading-none">Rabi Season Cycle • Active</span>
          </div>
          
          <h2 
            className="text-text font-display font-bold"
            style={{ 
              fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', 
              lineHeight: '1.2',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            Critical Growth Phase Detected
          </h2>
          
          <p className="text-text-muted font-bold text-sm leading-relaxed max-w-lg">
            Domain synced to <span className="text-text">{currentDomain || 'AgriTech'}</span>. 
            Currently managing {crops.length} distinct fields with high target yield potential.
          </p>
        </div>

        {/* RIGHT COLUMN: Gauge + Score */}
        <div className="hidden md:flex flex-shrink-0 w-[200px] flex-col items-center gap-3 relative z-10">
          <CircleGauge value={avgHealth} />
          <div className="text-center">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Avg Health Score</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-display font-black text-teal-500">{avgHealth}</span>
              <span className="text-sm font-bold text-text-muted italic">%</span>
            </div>
          </div>
        </div>
        
        {/* Floating Action Button (inside Right Column logic) */}
        <button className="absolute top-6 right-6 w-12 h-12 rounded-xl glass flex items-center justify-center border-border hover:border-teal-500/30 hover:scale-105 transition-all text-text group z-10">
          <TrendingUp className="group-hover:translate-y-[-2px] transition-transform w-5 h-5" />
        </button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            <SkeletonCard className="h-40" />
            <SkeletonCard className="h-40" />
            <SkeletonCard className="h-40" />
            <SkeletonCard className="h-40" />
          </>
        ) : (
          <>
            <StatCard title="Crop Health" value={`${avgHealth}%`} subtitle="System Nominal" icon={Sprout} color="teal" delay={0.1} trend={{ value: '+2.4%', isUp: true }} />
            <StatCard title="Active Area" value={`${displayArea} ac`} subtitle="Digital Mapping" icon={Globe} color="white" delay={0.2} />
            <StatCard title="Yield Est." value={displayYield} subtitle="Forecast Q1" icon={TrendingUp} color="amber" delay={0.3} trend={{ value: '18%', isUp: true }} />
            <StatCard title="Priority Alerts" value={unreadAlerts} subtitle="Action Required" icon={AlertTriangle} color="amber" delay={0.4} />
          </>
        )}
      </div>


      {/* Main Bento Grid Component Integration */}
      <BentoGrid />

      {/* Analytics Visualization Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Yield Projection Chart */}
        <motion.div
          variants={fadeUp}
          className="glass rounded-[32px] p-8 border border-white/5 relative overflow-hidden group"
        >
          <div className="flex justify-between items-center mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                 <TrendingUp size={14} className="text-teal-500" />
                 <h3 className="font-display text-xl text-text font-black tracking-tight">Yield Projection</h3>
              </div>
              <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Multi-month AI Analysis</p>
            </div>
            <button className="px-4 py-2 rounded-xl glass border border-border text-[10px] font-black text-text-muted uppercase transition-all hover:border-teal-500/30 hover:text-text">
                Detailed Log
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={yieldData}>
              <defs>
                <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#7b9080', fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7b9080', fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '20px', boxShadow: 'var(--shadow-lg)', fontFamily: 'Outfit' }}
              />
              <Area type="monotone" dataKey="yield" stroke="#22c55e" strokeWidth={4} fill="url(#yieldGrad)" dot={{ r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#111a13' }} activeDot={{ r: 6, fill: '#ffffff' }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Rainfall / Resource Chart */}
        <motion.div
          variants={fadeUp}
          className="glass rounded-[32px] p-8 border border-white/5 relative overflow-hidden group"
        >
          <div className="flex justify-between items-center mb-10">
            <div>
               <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 rounded-full bg-teal-500" />
                 <h3 className="font-display text-xl text-text font-black tracking-tight">Resource Cycles</h3>
              </div>
              <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Precipitation & Sync Index</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rainfallData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#7b9080', fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7b9080', fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }}
                contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '20px', fontFamily: 'Outfit' }}
              />
              <Bar dataKey="rain" fill="#22c55e" radius={[8, 8, 8, 8]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Footer CTA */}
      <motion.div 
        variants={fadeUp}
        className="glass rounded-[32px] p-10 border border-border flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Globe size={180} />
        </div>
        <div className="relative z-10 text-center md:text-left">
          <h3 className="text-2xl font-display font-black text-text mb-2">Grow Smarter with AI Advisor</h3>
          <p className="text-text-muted font-bold max-w-md">Get personalized yield optimization strategies based on your unique soil profile.</p>
        </div>
        <button className="relative z-10 px-8 py-4 rounded-2xl bg-white text-bg font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2 group">
          Open AI Advisor
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </motion.div>
  );
}
