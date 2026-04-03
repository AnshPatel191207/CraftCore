import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  Cloud, 
  Droplets, 
  LineChart, 
  ShieldCheck, 
  ChevronRight,
  Send,
  CheckCircle2,
  X,
  Globe,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../components/ui/LanguageSwitcher';
import { cn } from '../lib/utils';
import { useFarmStore } from '../store/farmStore';

export default function SaveSoilAI() {
  const { t } = useLanguage();
  const { setPanelOpen, setPendingChatQuery } = useFarmStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState('');

  const stats = [
    { label: t('saveSoil.healthScore'), value: '82%', icon: LineChart, color: 'text-emerald-500' },
    { label: t('saveSoil.carbonReduction'), value: '35%', icon: Cloud, color: 'text-sky-500' },
    { label: t('saveSoil.waterSaved'), value: '1,200L', icon: Droplets, color: 'text-blue-500' },
    { label: t('saveSoil.sustainabilityScore'), value: '88%', icon: Leaf, color: 'text-teal-500' }
  ];

  const features = [
    { 
      title: t('saveSoil.featureCarbon.title'), 
      desc: t('saveSoil.featureCarbon.desc'), 
      icon: Cloud,
      details: ['Farm size: 120 Acres', 'Fertilizer: -15%', 'Emission: Low']
    },
    { 
      title: t('saveSoil.featureHealthMeter.title'), 
      desc: t('saveSoil.featureHealthMeter.desc'), 
      icon: LineChart,
      details: ['Carbon: 3.2%', 'Moisture: 28%', 'Nitrogen: High']
    },
    { 
      title: t('saveSoil.featureIrrigation.title'), 
      desc: t('saveSoil.featureIrrigation.desc'), 
      icon: Droplets,
      details: ['Saved: 12k Liters', 'Method: Drip', 'Status: Optimal']
    },
    { 
      title: t('saveSoil.featurePractices.title'), 
      desc: t('saveSoil.featurePractices.desc'), 
      icon: Leaf,
      details: ['Rotation: Active', 'Cover Crop: Yes', 'Compost: Used']
    }
  ];

  const handleAskAI = () => {
    if (!query.trim()) return;
    setPendingChatQuery(query);
    setPanelOpen(true);
    setQuery('');
  };

  return (
    <div className="space-y-12 pb-20">
      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden rounded-[32px] min-h-[360px] flex items-center border border-white/10 group transition-all duration-700 shadow-2xl">
        {/* Banner Image with subtle parallax/zoom effect */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/lush_farming_landscape_banner_1775218096060.png" 
            alt="Sustainable Agriculture Landscape" 
            className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
          />
          {/* Multi-layered overlays for readability and premium feel */}
          <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent md:hidden" />
          <div className="absolute inset-0 bg-teal-900/10 mix-blend-overlay" />
        </div>

        <div className="relative z-10 w-full p-8 md:p-14 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="max-w-xl space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest shadow-xl"
            >
              <Globe size={14} className="animate-spin-slow" />
              Climate Smart Farming Initiative
            </motion.div>
            
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] text-white drop-shadow-lg"
              >
                {t('saveSoil.heroTitle')}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-white/80 font-bold max-w-lg leading-relaxed drop-shadow-md"
              >
                {t('saveSoil.heroSub')}
              </motion.p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'var(--teal-400)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-3 px-10 py-5 bg-teal-500 text-bg rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-teal-500/30 transition-all border border-teal-400/50"
            >
              {t('saveSoil.startSaving')}
              <ChevronRight size={18} />
            </motion.button>
          </div>

          {/* RIGHT SIDE: Floating Stat Element (Desktop Only) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:flex flex-col items-center gap-4 p-8 glass-dark border border-white/20 rounded-[40px] shadow-2xl backdrop-blur-2xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-400 border border-teal-500/40">
              <Sparkles size={32} />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-teal-400/80 uppercase tracking-widest mb-1">Global Impact</p>
              <h4 className="text-3xl font-black text-white tracking-tighter">8.4k TON</h4>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] mt-1">CO2 Sequestered</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 glass border border-white/10 rounded-[32px] group hover:border-white/20 transition-all"
          >
            <div className={cn("w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 transition-transform group-hover:scale-110", stat.color)}>
              <stat.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
            <h4 className="text-3xl font-black tracking-tight">{stat.value}</h4>
          </motion.div>
        ))}
      </div>

      {/* ── FEATURES GRID ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group relative h-full p-8 glass border border-white/10 rounded-[40px] hover:border-teal-500/30 transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <feature.icon size={120} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-500">
                <feature.icon size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight leading-none mb-3">{feature.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed font-medium">{feature.desc}</p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {feature.details.map((detail, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-text-muted">
                    {detail}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ── AI ADVISOR & BUTTON ── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass border border-white/10 rounded-[40px] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-teal-500 rounded-full" />
            <h3 className="text-2xl font-black tracking-tight">{t('saveSoil.aiAdvisorTitle')}</h3>
          </div>
          
          <div className="relative">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
              placeholder={t('saveSoil.askGlobalWarming')}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-teal-500/50 transition-all placeholder:text-text-muted"
            />
            <button 
              onClick={handleAskAI}
              className="absolute right-2 top-2 p-3 bg-teal-500 text-bg rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center glass border border-white/10 rounded-[40px] p-8 text-center space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 animate-pulse pointer-events-none" />
          <div className="relative z-10 space-y-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-[32px] bg-teal-500 shadow-2xl shadow-teal-500/30 flex items-center justify-center text-bg mb-2">
              <Leaf size={40} />
            </div>
            <h3 className="text-2xl font-black tracking-tight leading-tight">Ready to Make<br/>an Impact?</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-5 bg-bg text-teal-500 border-2 border-teal-500 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-teal-500 hover:text-bg transition-all duration-300 shadow-xl"
            >
              {t('saveSoil.saveSoilNow')}
            </button>
          </div>
        </div>
      </section>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-bg/80 backdrop-blur-xl"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl glass border border-white/20 rounded-[48px] p-8 md:p-12 shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-500 mx-auto">
                    <ShieldCheck size={32} />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight">{t('saveSoil.modalTitle')}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    'fertilizers',
                    'coverCrops',
                    'dripIrrigation',
                    'compost',
                    'tillage',
                    'agroforestry'
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                      <CheckCircle2 className="text-teal-500 shrink-0" size={20} />
                      <span className="text-sm font-bold tracking-tight">
                        {t(`saveSoil.checklist.${item}`)}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-5 bg-teal-500 text-bg rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-teal-500/20"
                >
                  I Commit to Saving Soil
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
