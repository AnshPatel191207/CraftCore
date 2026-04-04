import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Filter, 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowRight, 
  ShieldAlert, 
  Bug, 
  Sun, 
  Sprout, 
  TrendingUp,
  Activity,
  Import
} from 'lucide-react';
import { useFarmStore } from '../store/farmStore';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useLanguage } from '../components/ui/LanguageSwitcher';
import { ScrollReveal } from '../components/ScrollReveal';

export default function Advisory() {
  const { advisories, setActivePage } = useFarmStore();
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const [hasData, setHasData] = useState(false);
  const [isDummyMode, setIsDummyMode] = useState(false);

  const handleImport = () => {
    setActivePage('soil');
  };

  const handleDummy = () => {
    setIsDummyMode(true);
    setHasData(true);
  };

  const categories = [
    { id: 'all', label: t('filterAll'), icon: Filter },
    { id: 'weather', label: t('catWeather'), icon: Sun },
    { id: 'pest', label: t('catPest'), icon: Bug },
    { id: 'crop', label: t('catCrop'), icon: Sprout },
    { id: 'soil', label: t('catSoil'), icon: ShieldAlert },
    { id: 'market', label: t('catMarket'), icon: TrendingUp },
  ];

  const filteredAdvisories = advisories.filter(adv => {
    const matchesFilter = filter === 'all' || adv.category === filter;
    const matchesSearch = adv.title.toLowerCase().includes(search.toLowerCase()) || 
                         adv.summary.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (!hasData && !isDummyMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-900/30 backdrop-blur-lg border border-green-700/30 rounded-[40px] p-12 max-w-xl w-full text-center shadow-2xl"
        >
          <div className="w-20 h-20 rounded-[32px] bg-green-500/20 flex items-center justify-center mx-auto mb-8 text-green-400">
            <ShieldAlert size={40} />
          </div>
          
          <h2 className="text-4xl font-display font-black text-white mb-4">No Advisory Portals</h2>
          <p className="text-white/50 mb-10 text-lg leading-relaxed">
            Import your soil data to generate active advisory reports and field updates.
          </p>

          <div className="flex flex-col gap-4">
            <button 
              onClick={handleImport}
              className="w-full py-4 bg-teal-500 text-bg rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-teal-500/20"
            >
              <Import size={20} />
              Import Data
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

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <ScrollReveal direction="down">
        <div className="relative p-10 glass border border-border rounded-[40px] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
             <img src="/images/farmer_meeting_real.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl font-display font-black text-text tracking-tight mb-4">{t('portalTitle')}</h1>
            <p className="text-text-muted font-bold text-lg leading-relaxed">
              {t('portalSub')}
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Controls */}
      <ScrollReveal direction="up" delay={0.2}>
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between w-full">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                  filter === cat.id 
                    ? 'bg-teal-500 text-bg border-teal-500 shadow-lg shadow-teal-500/20' 
                    : 'glass border-border text-text-muted hover:border-teal-500/30'
                }`}
              >
                <cat.icon size={14} />
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-teal-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder={t('searchAdvisories')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 glass border border-border rounded-2xl text-sm font-bold text-text focus:outline-none focus:border-teal-500/50 transition-all"
            />
          </div>
        </div>
      </ScrollReveal>

      {/* Advisory Feed */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredAdvisories.map((adv, i) => {
            const categoryToKey: Record<string, string> = {
              weather: 'rainfall',
              pest: 'pest',
              crop: 'planting',
              soil: 'ph',
              market: 'market'
            };
            const nestedKey = categoryToKey[adv.category as keyof typeof categoryToKey];
            const titleSafe = adv?.title || '';
            const summarySafe = adv?.summary || '';
            const translatedTitle = nestedKey ? t(`advisory.${nestedKey}.title`) : (t(titleSafe.replace(/\s/g, '').replace(/[.-]/g, '') + 'Title') || titleSafe);
            const translatedDesc = nestedKey ? t(`advisory.${nestedKey}.desc`) : (t(summarySafe.replace(/\s/g, '').replace(/[.-]/g, '') + 'Desc') || summarySafe);

            return (
              <ScrollReveal direction={i % 2 === 0 ? 'left' : 'right'} delay={0.1} key={adv.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group glass border border-border rounded-[32px] overflow-hidden hover:border-teal-500/30 transition-all duration-500"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="p-8 flex-1">
                      <div className="flex items-center gap-3 mb-6">
                        <StatusBadge status={
                          adv.severity === 'critical' ? 'error' : 
                          adv.severity === 'high' ? 'warning' : 'info'
                        }>
                          {t('sev' + adv.severity.charAt(0).toUpperCase() + adv.severity.slice(1))}
                        </StatusBadge>
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                           <Clock size={12} />
                           {adv.date}
                        </span>
                      </div>

                      <h3 className="text-2xl font-display font-black text-text mb-4 group-hover:text-teal-500 transition-colors">
                        {translatedTitle}
                      </h3>
                      <p className="text-text-muted font-bold leading-relaxed mb-8 max-w-3xl text-sm">
                        {translatedDesc}
                      </p>

                      <div className="flex flex-wrap gap-3">
                        {adv.actionItems.map((action, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-surface-2 border border-border rounded-xl text-[10px] font-black text-text uppercase tracking-wider">
                             <CheckCircle2 size={12} className="text-teal-500" />
                             {t(action.replace(/\s/g, '').replace(/[.-]/g, '')) || action}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-surface-2 p-8 md:w-72 border-t md:border-t-0 md:border-l border-border flex flex-col justify-between">
                       <div className="space-y-6">
                         <div>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">{t('impactZone')}</p>
                            <div className="flex items-center gap-2 text-text font-black text-xs uppercase">
                              <MapPin size={14} className="text-teal-500" />
                              {adv.category === 'market' ? t('national') : t('GreenValleyFarm')}
                            </div>
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">{t('category')}</p>
                            <div className="flex items-center gap-2 text-text font-black text-xs uppercase">
                              {t('cat' + adv.category.charAt(0).toUpperCase() + adv.category.slice(1))}
                            </div>
                         </div>
                       </div>

                       <button className="flex items-center justify-between w-full mt-8 p-4 glass border border-border rounded-2xl group/btn hover:bg-teal-500 hover:text-bg transition-all duration-300">
                          <span className="text-[10px] font-black uppercase tracking-widest">{t('viewDetails')}</span>
                          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                       </button>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </AnimatePresence>

        {filteredAdvisories.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-20 glass border border-border rounded-[40px]"
          >
            <div className="w-20 h-20 glass rounded-[32px] border border-teal-500/20 flex items-center justify-center mx-auto mb-6">
               <AlertTriangle size={32} className="text-teal-500" />
            </div>
            <p className="text-text-muted font-black uppercase tracking-widest">{t('noAdvisories')}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
