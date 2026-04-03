import { useState } from 'react';
import { CloudRain, Bug, Sprout, FlaskConical, TrendingUp, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFarmStore } from '../store/farmStore';
import type { Advisory as AdvisoryType } from '../store/farmStore';

const categoryConfig = {
  weather: { icon: CloudRain, label: 'Weather', color: 'bg-sky-100 text-sky-700' },
  pest: { icon: Bug, label: 'Pest Alert', color: 'bg-red-100 text-red-700' },
  crop: { icon: Sprout, label: 'Crop Management', color: 'bg-leaf-100 text-leaf-700' },
  soil: { icon: FlaskConical, label: 'Soil Health', color: 'bg-earth-100 text-earth-700' },
  market: { icon: TrendingUp, label: 'Market Intel', color: 'bg-sun-100 text-sun-700' },
};

const severityConfig = {
  low: { icon: Info, label: 'Low', color: 'text-sky-600 bg-sky-50 border-sky-200' },
  medium: { icon: AlertTriangle, label: 'Medium', color: 'text-sun-600 bg-sun-50 border-sun-200' },
  high: { icon: AlertTriangle, label: 'High', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  critical: { icon: AlertOctagon, label: 'Critical', color: 'text-red-600 bg-red-50 border-red-200' },
};

function AdvisoryCard({ advisory, index }: { advisory: AdvisoryType; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const { markAdvisoryRead } = useFarmStore();
  const cat = categoryConfig[advisory.category];
  const sev = severityConfig[advisory.severity];
  const CatIcon = cat.icon;
  const SevIcon = sev.icon;

  const handleExpand = () => {
    setExpanded(!expanded);
    if (!advisory.isRead) markAdvisoryRead(advisory.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`glass-card rounded-2xl border overflow-hidden transition-all ${
        !advisory.isRead ? 'border-sun-300 shadow-md shadow-sun-100/50' : 'border-earth-200'
      }`}
    >
      <div
        className="p-5 cursor-pointer hover:bg-earth-50/30 transition-colors"
        onClick={handleExpand}
      >
        <div className="flex items-start gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${cat.color.split(' ')[0]}`}>
            <CatIcon className={cat.color.split(' ')[1]} size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-earth-800">{advisory.title}</h4>
                  {!advisory.isRead && (
                    <span className="w-2 h-2 rounded-full bg-sun-500 shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cat.color}`}>{cat.label}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${sev.color}`}>
                    <SevIcon size={10} className="inline mr-1" />
                    {sev.label}
                  </span>
                  <span className="text-xs text-earth-400">{advisory.date}</span>
                </div>
              </div>
              <button className="p-1 shrink-0">
                {expanded ? <ChevronUp size={18} className="text-earth-400" /> : <ChevronDown size={18} className="text-earth-400" />}
              </button>
            </div>
            <p className="text-sm text-earth-500 mt-2 line-clamp-2">{advisory.summary}</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-earth-100">
              <p className="text-sm text-earth-600 mt-4 leading-relaxed">{advisory.details}</p>
              <div className="mt-4">
                <p className="text-sm font-semibold text-earth-700 mb-2">Action Items:</p>
                <div className="space-y-2">
                  {advisory.actionItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-earth-600">
                      <CheckCircle2 size={16} className="text-leaf-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Advisory() {
  const { advisories } = useFarmStore();
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', 'weather', 'pest', 'crop', 'soil', 'market'];
  const filtered = filter === 'all' ? advisories : advisories.filter((a) => a.category === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-[family-name:var(--font-display)] text-earth-900">Advisory Portal</h2>
        <p className="text-earth-500 mt-1">Expert recommendations and alerts for your farm</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === cat
                ? 'bg-earth-800 text-earth-50 shadow-lg'
                : 'bg-white/60 text-earth-600 hover:bg-earth-100 border border-earth-200'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(categoryConfig).map(([key, config]) => {
          const count = advisories.filter((a) => a.category === key).length;
          const Icon = config.icon;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-3 rounded-xl text-center cursor-pointer transition-all border ${
                filter === key ? 'border-earth-400 shadow-md' : 'border-earth-200'
              } bg-white/60 hover:shadow-md`}
              onClick={() => setFilter(filter === key ? 'all' : key)}
            >
              <Icon size={20} className={`mx-auto mb-1 ${config.color.split(' ')[1]}`} />
              <p className="text-lg font-bold text-earth-800">{count}</p>
              <p className="text-xs text-earth-500">{config.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Advisories List */}
      <div className="space-y-4">
        {filtered.map((advisory, i) => (
          <AdvisoryCard key={advisory.id} advisory={advisory} index={i} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-earth-400">
            <p className="text-lg">No advisories in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
