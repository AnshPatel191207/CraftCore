import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FlaskConical,
  AlertCircle,
  Info,
  Beaker,
  Lightbulb,
  TrendingUp,
  Activity,
  Leaf,
  Target,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../components/ui/LanguageSwitcher';
import { ScrollReveal } from '../components/ScrollReveal';
import { useNavigate } from 'react-router-dom';
import { useFarmStore } from '../store/farmStore';
import { analyzeSoil } from '../lib/fertilizerLogic';

const ICON_MAP: Record<string, any> = {
  Beaker,
  Leaf,
  TrendingUp,
  FlaskConical,
  AlertCircle
};

const FERTILIZER_PRICING = [
  {
    name: "Urea",
    price: "₹270 / 50kg",
    provider: "IFFCO",
    rating: 4.8
  },
  {
    name: "DAP",
    price: "₹1350 / 50kg",
    provider: "NFL",
    rating: 4.3
  },
  {
    name: "Potash (MOP)",
    price: "₹1700 / 50kg",
    provider: "MCFL",
    rating: 4.5
  }
];

export default function FertilizerAdvisory() {
  const { t } = useLanguage();
  const { currentAdvisory, updateAdvisory } = useFarmStore();
  const navigate = useNavigate();
  const [isDummyMode, setIsDummyMode] = useState(false);
  const realAdvisoryRef = useRef<any>(null);

  const handleSoilRedirect = () => {
    navigate('/app/soil');
  };

  const loadDummyData = () => {
    // Preserve real data before overwriting with dummy
    if (!isDummyMode) {
      realAdvisoryRef.current = currentAdvisory;
    }
    
    const dummyData = {
      n: 180,
      p: 25,
      k: 140,
      ph: 6.5,
      moisture: 60,
      organicCarbon: 0.8
    };

    const result = analyzeSoil(dummyData);
    updateAdvisory(result);
    setIsDummyMode(true);
  };

  const handleBack = () => {
    updateAdvisory(realAdvisoryRef.current);
    setIsDummyMode(false);
  };

  // Handle case where no analysis has been run yet
  if (!currentAdvisory && !isDummyMode) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center bg-white/5 rounded-[32px] border border-white/10">
        <FlaskConical size={64} className="text-white/20 mb-6" />
        <h2 className="text-3xl font-display font-black text-white mb-2">{t('fertilizerAdvisory.noSoilData')}</h2>
        <p className="text-white/40 max-w-md mb-8">{t('fertilizerAdvisory.noSoilDataSub')}</p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={handleSoilRedirect}
            className="px-8 py-3 bg-teal-500 text-bg rounded-xl font-bold hover:scale-105 transition-all flex items-center gap-2"
          >
            {t('fertilizerAdvisory.goToSoilAnalysis')}
            <ArrowRight size={18} />
          </button>

          <button
            onClick={loadDummyData}
            className="px-8 py-3 bg-green-500/20 text-green-300 border border-green-500/30 rounded-xl font-bold hover:bg-green-500/30 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Activity size={18} />
            Show Dummy Data
          </button>
        </div>
      </div>
    );
  }

  const { nutrients, deficiencies, recommendations, timeline, soilHealth } = currentAdvisory;

  return (
    <div className="space-y-8 pb-20">
      {/* 🟢 1. HEADER SECTION */}
      <ScrollReveal direction="down">
        <div
          className="relative p-8 rounded-[32px] border border-white/10 shadow-2xl overflow-hidden"
          style={{ background: 'rgba(10, 40, 20, 0.95)', backdropFilter: 'blur(20px)' }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-4xl font-display font-black text-white tracking-tight">
                  {t('fertilizerAdvisory.title')}
                </h1>
                <button
                  onClick={loadDummyData}
                  className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-black text-teal-400 uppercase tracking-widest transition-all flex items-center gap-2"
                >
                  <Activity size={12} />
                  Test Dummy
                </button>
                {isDummyMode && (
                  <button 
                    onClick={handleBack}
                    className="px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-full text-[10px] font-black text-red-400 uppercase tracking-widest transition-all flex items-center gap-2"
                  >
                    <RotateCcw size={12} />
                    Back to Real Data
                  </button>
                )}
              </div>
              <p className="text-white/50 font-bold italic">
                {t('fertilizerAdvisory.sub')}
              </p>
            </div>
            <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
              <div className="text-right">
                <p className="text-xs font-black text-white/40 uppercase tracking-widest leading-none mb-1">{t('fertilizerAdvisory.soilHealth')}</p>
                <p className="text-3xl font-black text-white">{soilHealth}%</p>
              </div>
              <div className="h-10 w-px bg-white/10 mx-2" />
              <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  {t('fertilizerAdvisory.healthy')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 🧪 2. NUTRIENT STATUS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {nutrients.map((n: any, i: number) => (
          <ScrollReveal key={n.id} direction="up" delay={0.1 * i}>
            <div
              className="p-5 rounded-2xl border border-white/5 shadow-xl group hover:border-white/20 transition-all duration-300"
              style={{ background: 'rgba(15, 45, 25, 0.8)' }}
            >
              <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center bg-white/5 group-hover:scale-110 transition-transform">
                <FlaskConical size={20} style={{ color: n.color }} />
              </div>
              <p className="text-xs font-black text-white/30 uppercase tracking-tight mb-1">
                {t(`fertilizerAdvisory.${n.id}`)}
              </p>
              <div className="flex items-baseline gap-1 mb-3">
                <p className="text-xl font-black text-white">{n.value}</p>
                <p className="text-[10px] text-white/40 font-bold">{n.unit}</p>
              </div>

              <div className="h-1.5 bg-black/40 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: n.status === 'optimal' ? '85%' : n.status === 'moderate' ? '60%' : '30%' }}
                  className="h-full rounded-full"
                  style={{ background: n.color }}
                />
              </div>
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: n.color }}>
                {t(`fertilizerAdvisory.${n.status}`)}
              </span>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* ⚠️ 3. DEFICIENCY ALERT PANEL */}
      <ScrollReveal direction="left">
        <div className="p-1 rounded-3xl bg-gradient-to-r from-red-500/20 via-transparent to-transparent">
          <div className="p-8 rounded-[22px] border border-red-500/20" style={{ background: 'rgba(30, 10, 10, 0.9)', backdropFilter: 'blur(10px)' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                <AlertCircle size={28} />
              </div>
              <h2 className="text-2xl font-display font-black text-white tracking-tight">
                {t('fertilizerAdvisory.deficiencyDetected')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deficiencies.map((d: any, i: number) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-2 h-full rounded-full bg-red-500" />
                  <div>
                    <p className="text-xs font-black text-white mb-1 uppercase tracking-wide">
                      {t('fertilizerAdvisory.low')} {t(`fertilizerAdvisory.${d.nutrient}`)}
                    </p>
                    <p className="text-xs text-white/60 mb-3">{t(`fertilizerAdvisory.${d.impact}`)}</p>
                    <div className="flex items-center gap-2 text-[10px] font-black text-red-400 bg-red-400/10 px-3 py-1.5 rounded-lg border border-red-400/20">
                      <Info size={12} />
                      {t(`fertilizerAdvisory.${d.fix}`)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 🌱 4. FERTILIZER RECOMMENDATION CARDS */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-display font-black text-white">{t('fertilizerAdvisory.recs')}</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {recommendations.map((r: any, i: number) => (
              <ScrollReveal key={r.name} direction="right" delay={0.1 * i}>
                <div
                  className="p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-white/20 transition-all group"
                  style={{ background: 'rgba(10, 30, 15, 0.8)' }}
                >
                  <div className="flex items-center gap-5 flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110" style={{ color: r.color }}>
                      <FlaskConical size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{r.name}</h3>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{r.type}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-end items-center gap-4">
                    <div className="text-center px-6 py-3 bg-black/40 rounded-2xl border border-white/5 min-w-[120px]">
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">{t('fertilizerAdvisory.dosage')}</p>
                      <p className="text-lg font-black text-white tracking-tight">{r.dosage} <span className="text-[10px] font-bold text-white/40">{t('fertilizerAdvisory.kgAcre')}</span></p>
                    </div>
                    <div className="text-center px-6 py-3 bg-black/40 rounded-2xl border border-white/5 min-w-[160px]">
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">{t('fertilizerAdvisory.timing')}</p>
                      <p className="text-xs font-black text-white tracking-widest truncate">{t(`fertilizerAdvisory.${r.timing}`)}</p>
                    </div>
                    <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:bg-teal-500 hover:text-bg transition-all">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* 📅 5. APPLICATION SCHEDULE TIMELINE */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-2xl font-display font-black text-white">{t('fertilizerAdvisory.timeline')}</h2>
          <div className="p-8 rounded-[32px] border border-white/10 relative overflow-hidden" style={{ background: 'rgba(10, 40, 20, 0.95)' }}>
            <div className="absolute left-12 top-8 bottom-8 w-px bg-white/10" />

            <div className="space-y-10 relative">
              {timeline.map((item: any, i: number) => {
                const IconComp = ICON_MAP[item.icon] || Info;
                return (
                  <div key={i} className="flex items-center gap-6 group">
                    <div className="relative z-10 w-8 h-8 rounded-full border-2 border-white/10 bg-black flex items-center justify-center transition-all group-hover:scale-125 group-hover:border-white/40" style={{ color: item.color }}>
                      <IconComp size={14} />
                    </div>
                    <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: item.color }}>Day {item.day}</p>
                      <p className="text-xs font-bold text-white">{t(`fertilizerAdvisory.${item.label}`)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 💰 8. PRICING SECTION (DUMMY MODE ONLY) */}
      {isDummyMode && (
        <ScrollReveal direction="up">
          <div className="space-y-6 pt-12 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
                <Target size={24} />
              </div>
              <h2 className="text-2xl font-display font-black text-white">💰 Recommended Fertilizer Pricing</h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            
            <p className="text-white/60 text-sm italic">
              👉 Based on your soil condition, we recommend these fertilizers from trusted providers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FERTILIZER_PRICING.map((item, i) => (
                <div 
                  key={i}
                  className="bg-green-900/40 backdrop-blur-lg border border-green-700/30 rounded-2xl p-6 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all group relative overflow-hidden"
                >
                  {item.rating > 4.4 && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-bg text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-lg">
                      Best Choice
                    </div>
                  )}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                      <FlaskConical size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{item.name}</h4>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, idx) => (
                          <span key={idx} className={`text-[10px] ${idx < Math.floor(item.rating) ? 'text-yellow-500' : 'text-white/20'}`}>★</span>
                        ))}
                        <span className="text-[10px] text-white/40 ml-1">({item.rating})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Official Price</p>
                      <p className="text-lg font-black text-white">{item.price}</p>
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Provider</p>
                      <p className="text-xs font-bold text-teal-400">{item.provider}</p>
                    </div>
                  </div>

                  <p className="text-[10px] text-white/40 italic mb-4">
                    👉 Recommended to buy from official provider
                  </p>

                  <button className="w-full py-3 bg-green-500/20 text-green-300 border border-green-500/30 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-green-500 hover:text-bg transition-all">
                    View Provider
                  </button>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 🌾 6. SMART SUGGESTIONS PANEL */}
        <ScrollReveal direction="up">
          <div className="p-8 rounded-[32px] border border-white/5 h-full" style={{ background: 'rgba(15, 45, 25, 0.8)' }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                <Lightbulb size={24} />
              </div>
              <h2 className="text-2xl font-display font-black text-white">{t('fertilizerAdvisory.aiSuggestions')}</h2>
            </div>

            <div className="space-y-4">
              {[
                t('fertilizerAdvisory.suggestion1'),
                t('fertilizerAdvisory.suggestion2'),
                t('fertilizerAdvisory.suggestion3')
              ].map((s, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 group-hover:scale-150 transition-transform" />
                  <p className="text-sm font-bold text-white/70 group-hover:text-white transition-colors">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* 📊 7. SUMMARY CARD */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="p-8 rounded-[32px] border border-white/10 h-full relative overflow-hidden" style={{ background: 'rgba(10, 40, 20, 0.95)' }}>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-teal-500/10 rounded-full blur-[100px]" />

            <h2 className="text-2xl font-display font-black text-white mb-8">{t('fertilizerAdvisory.summary')}</h2>

            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <Target size={18} className="text-white/40" />
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t('fertilizerAdvisory.soilQuality')}</p>
                </div>
                <p className="text-lg font-black text-white">82/100</p>
              </div>

              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <Activity size={18} className="text-white/40" />
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t('fertilizerAdvisory.totalRequired')}</p>
                </div>
                <p className="text-lg font-black text-white">115 {t('fertilizerAdvisory.kgAcre')}</p>
              </div>

              <div className="flex justify-between items-center p-5 rounded-2xl bg-teal-500 shadow-[0_10px_30px_rgba(20,184,166,0.3)]">
                <div className="flex items-center gap-3">
                  <TrendingUp size={24} className="text-bg" />
                  <p className="text-[11px] font-black text-bg uppercase tracking-[0.15em]">{t('fertilizerAdvisory.yieldImp')}</p>
                </div>
                <p className="text-2xl font-black text-bg">+18%</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
