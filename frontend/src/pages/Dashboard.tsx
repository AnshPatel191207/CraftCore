import React, { useState } from 'react';
import {
  Sprout, TrendingUp, AlertTriangle, Calendar,
  ChevronRight, LayoutDashboard, Globe, MapPin, Target,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import StatCard from '../components/StatCard';
import { useFarmStore } from '../store/farmStore';
import { BentoGrid } from '../components/sections/BentoGrid';
import { ScrollReveal } from '../components/ScrollReveal';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { useLanguage } from '../components/ui/LanguageSwitcher';
import { fadeUp, staggerContainer } from '../lib/animations';


// ─── Static chart data ────────────────────────────────────────────────────────

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
  { month: 'Sep', rain: 85  },
  { month: 'Oct', rain: 60  },
  { month: 'Nov', rain: 30  },
  { month: 'Dec', rain: 15  },
  { month: 'Jan', rain: 45  },
];


// ─── Circle Gauge ─────────────────────────────────────────────────────────────

function CircleGauge({ value }: { value: number }) {
  const r             = 20;
  const circumference = 2 * Math.PI * r;
  const strokeDash    = (value / 100) * circumference;

  return (
    <svg width="64" height="64" viewBox="0 0 52 52" className="drop-shadow-[0_0_8px_rgba(34,197,94,0.2)]">
      <circle cx="26" cy="26" r={r} fill="none" stroke="var(--teal-dim)" strokeWidth="4" />
      <motion.circle
        cx="26" cy="26" r={r} fill="none"
        stroke="var(--teal-500)" strokeWidth="4"
        initial={{ strokeDasharray: `0 ${circumference}` }}
        animate={{ strokeDasharray: `${strokeDash} ${circumference}` }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        strokeLinecap="round"
        transform="rotate(-90 26 26)"
      />
      <text x="26" y="30" textAnchor="middle"
        fontSize="10" fill="#22c55e" fontWeight="black" className="font-display">
        {value}%
      </text>
    </svg>
  );
}


// ─── Dashboard Page ───────────────────────────────────────────────────────────

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
    isDemoMode,
    setPanelOpen,
  } = useFarmStore();

  const navigate = useNavigate();

  const { t } = useLanguage();

  // Gate: show data-source picker until user explicitly chooses
  const [hasData, setHasData] = useState(false);

  // Fetch on mount and whenever demo mode toggles
  React.useEffect(() => {
    if (hasData || isDemoMode) {
      fetchDashboardData();
    }
  }, [isDemoMode, hasData]);

  // Prefer server-derived stats; fall back to local computation
  const avgHealth    = stats?.cropHealth ?? (crops.length > 0 ? Math.round(crops.reduce((a, c) => a + c.health, 0) / crops.length) : 0);
  const unreadAlerts = stats?.alerts     ?? advisories.filter(a => !a.isRead).length;
  const displayArea  = stats?.activeArea ?? totalAcres;
  const displayYield = stats?.yieldEst   ?? '4.5 t/ac';

  const handleImport = () => navigate('/app/soil');
  const handleDummy  = () => setHasData(true);


  // ── Data-source picker screen ─────────────────────────────────────────────
  if (!hasData && !isDemoMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] py-20 px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-900/30 backdrop-blur-lg border border-green-700/30 rounded-[40px] p-12 max-w-xl w-full text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="w-24 h-24 rounded-[32px] bg-green-500/20 flex items-center justify-center mx-auto mb-8 text-green-400 relative z-10 border border-green-500/20 shadow-xl">
            <LayoutDashboard size={48} />
          </div>

          <h2 className="text-4xl font-display font-black text-white mb-4 relative z-10">
            {t('welcomeToDashboard') || 'Welcome to Dashboard'}
          </h2>
          <p className="text-white/50 mb-10 text-lg leading-relaxed relative z-10">
            {t('selectFarmDataSource') || 'Select your farm data source to begin monitoring your field intelligence.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <button
              onClick={handleImport}
              className="flex-1 py-4 bg-teal-500 text-bg rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-teal-500/20"
            >
              <TrendingUp size={20} />
              {t('importData') || 'Import Data'}
            </button>
            <button
              onClick={handleDummy}
              className="flex-1 py-4 bg-green-500/20 text-green-300 border border-green-500/30 rounded-2xl font-black uppercase tracking-widest hover:bg-green-500/30 transition-all flex items-center justify-center gap-3"
            >
              <Sprout size={20} />
              {t('showDummyData') || 'Show Dummy Data'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }


  // ── Main dashboard ────────────────────────────────────────────────────────
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-8 pb-12"
    >

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <ScrollReveal direction="left" duration={0.6}>
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2 mb-2">
              <LayoutDashboard size={18} className="text-teal-500" />
              <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.2em]">
                {currentDomain} {t('intelligence')}
              </span>
            </div>
            <h1 className="text-4xl font-display font-black text-text tracking-tight">{t('mainCommand')}</h1>
            <div className="flex items-center gap-3 mt-2 text-text-muted font-bold">
              <span className="flex items-center gap-1.5 px-3 py-1 glass border border-border rounded-lg text-[10px] uppercase tracking-wider italic">
                {t(farmName.replace(/\s/g, '')) || farmName}
              </span>
              <span className="w-1 h-1 bg-teal-500/50 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                {totalAcres} {t('ac')} {t('totalArea')}
              </span>
            </div>
          </motion.div>
        </ScrollReveal>

        <ScrollReveal direction="right" duration={0.6}>
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl glass border border-teal-dim flex items-center gap-2 group cursor-pointer hover:border-teal-500/40 transition-all">
              <Globe size={14} className="text-teal-500" />
              <span className="text-xs font-black text-text uppercase tracking-widest">{t('globalSync')}</span>
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            </div>
            <div className="p-2.5 glass border border-border rounded-xl cursor-pointer hover:bg-teal-dim transition-colors">
              <Calendar className="w-5 h-5 text-text-muted" />
            </div>
          </motion.div>
        </ScrollReveal>
      </div>


      {/* ── System Status Bar ── */}
      <ScrollReveal direction="down" duration={0.6}>
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-teal-500" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-500" />
            </span>
            <span style={{ color: 'var(--teal-500)' }}>{t('live')}</span>
          </div>
          <span className="opacity-20">|</span>
          <span>{t('receivingLiveSensorData')} <strong className="text-text">{t('mainHub')}</strong></span>
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <span className="opacity-20">|</span>
            <span>{t('syncFrequency')}: 500ms</span>
          </span>
        </motion.div>
      </ScrollReveal>


      {/* ── Hero Banner ── */}
      <ScrollReveal direction="left">
        <motion.div
          variants={fadeUp}
          className="relative rounded-[32px] overflow-hidden min-h-[220px] shadow-lg shadow-black/20 group border transition-all duration-500 flex items-center justify-between gap-6 p-10"
          style={{ background: 'var(--banner-bg)', borderColor: 'var(--banner-border)' }}
        >
          <div className="absolute inset-0 shimmer opacity-10" />

          {/* Real field image */}
          <div className="absolute inset-0 z-0 opacity-40">
            <img src="/images/dashboard_field_real.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/40 to-transparent z-0 pointer-events-none" />

          {/* Left: season badge + title + subtitle */}
          <div className="flex-1 min-w-0 flex flex-col gap-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-500/10 backdrop-blur-md rounded-full border border-teal-500/20 max-w-fit">
              <Sprout size={14} className="text-teal-500" />
              <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest leading-none">
                {t('rabiSeasonCycle')} • {t('active')}
              </span>
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
                textOverflow: 'ellipsis',
              }}
            >
              {t('criticalGrowthPhase')}
            </h2>
            <p className="text-text-muted font-bold text-sm leading-relaxed max-w-lg">
              {t('domainSynced')} <span className="text-text">{t(currentDomain) || currentDomain}</span>.{' '}
              {t('currentlyManaging')} {crops.length} {t('distinctFields')} {t('withHighTarget')}.
            </p>
          </div>

          {/* Right: gauge */}
          <div className="hidden md:flex flex-shrink-0 w-[200px] flex-col items-center gap-3 relative z-10">
            <CircleGauge value={avgHealth} />
            <div className="text-center">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{t('avgHealthScore')}</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-display font-black text-teal-500">{avgHealth}</span>
                <span className="text-sm font-bold text-text-muted italic">%</span>
              </div>
            </div>
          </div>

          {/* Floating action */}
          <button className="absolute top-6 right-6 w-12 h-12 rounded-xl glass flex items-center justify-center border-border hover:border-teal-500/30 hover:scale-105 transition-all text-text group z-10">
            <TrendingUp className="group-hover:translate-y-[-2px] transition-transform w-5 h-5" />
          </button>
        </motion.div>
      </ScrollReveal>


      {/* ── Stats Grid — skeletons while loading ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} className="h-40" />)
        ) : (
          <>
            <ScrollReveal direction="left" delay={0.1}>
              <StatCard
                title={t('cropHealth')}
                value={`${avgHealth}%`}
                subtitle={t('systemNominal')}
                icon={TrendingUp}
                color="teal"
                delay={0.1}
                trend={{ value: '+2.4%', isUp: true }}
              />
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.2}>
              <StatCard
                title={t('activeArea')}
                value={`${displayArea} ac`}
                subtitle={t('digitalMapping')}
                icon={MapPin}
                color="sky"
                delay={0.2}
              />
            </ScrollReveal>
            <ScrollReveal direction="left" delay={0.3}>
              <StatCard
                title={t('yieldEst')}
                value={displayYield}
                subtitle={t('forecastQ1')}
                icon={Target}
                color="amber"
                delay={0.3}
                trend={{ value: '18%', isUp: true }}
              />
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.4}>
              <StatCard
                title={t('priorityAlerts')}
                value={unreadAlerts}
                subtitle={t('actionRequired')}
                icon={AlertTriangle}
                color="white"
                delay={0.4}
              />
            </ScrollReveal>
          </>
        )}
      </div>


      {/* ── Bento Grid ── */}
      <ScrollReveal direction="up">
        <BentoGrid />
      </ScrollReveal>


      {/* ── Analytics Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Yield Projection */}
        <ScrollReveal direction="left">
          <motion.div variants={fadeUp} className="glass rounded-[32px] p-8 border border-white/5 relative overflow-hidden group">
            <div className="flex justify-between items-center mb-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={14} className="text-teal-500" />
                  <h3 className="font-display text-xl text-text font-black tracking-tight">{t('yieldProjection')}</h3>
                </div>
                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">{t('multiMonthAIAnalysis')}</p>
              </div>
              <button className="px-4 py-2 rounded-xl glass border border-border text-[10px] font-black text-text-muted uppercase transition-all hover:border-teal-500/30 hover:text-text">
                {t('detailedLog')}
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={yieldData}>
                <defs>
                  <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#7b9080', fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
                <YAxis                 tick={{ fill: '#7b9080', fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '20px', boxShadow: 'var(--shadow-lg)', fontFamily: 'Outfit' }} />
                <Area type="monotone" dataKey="yield" stroke="#22c55e" strokeWidth={4} fill="url(#yieldGrad)"
                  dot={{ r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#111a13' }}
                  activeDot={{ r: 6, fill: '#ffffff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </ScrollReveal>

        {/* Resource Cycles */}
        <ScrollReveal direction="right">
          <motion.div variants={fadeUp} className="glass rounded-[32px] p-8 border border-white/5 relative overflow-hidden group">
            <div className="flex justify-between items-center mb-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-teal-500" />
                  <h3 className="font-display text-xl text-text font-black tracking-tight">{t('resourceCycles')}</h3>
                </div>
                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">{t('precipitationSyncIndex')}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rainfallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#7b9080', fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
                <YAxis                 tick={{ fill: '#7b9080', fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '20px', fontFamily: 'Outfit' }} />
                <Bar dataKey="rain" fill="#22c55e" radius={[8, 8, 8, 8]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </ScrollReveal>

      </div>


      {/* ── Footer CTA ── */}
      <ScrollReveal direction="up" delay={0.2}>
        <motion.div
          variants={fadeUp}
          className="glass rounded-[32px] p-10 border border-border flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Globe size={180} />
          </div>
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-2xl font-display font-black text-text mb-2">{t('growSmarterWithAI')}</h3>
            <p className="text-text-muted font-bold max-w-md">{t('getPersonalizedYield')}</p>
          </div>
          <button
            onClick={() => setPanelOpen(true)}
            className="relative z-10 px-8 py-4 rounded-2xl bg-teal-500 text-bg font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2 group"
          >
            {t('openAIAdvisor')}
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </ScrollReveal>

    </motion.div>
  );
}