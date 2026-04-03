import { Sprout, Calendar, TrendingUp, Ruler } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFarmStore } from '../store/farmStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useLanguage } from '../components/ui/LanguageSwitcher';

const COLORS = ['#3a9140', '#f99b07', '#3b92f6', '#a47a55'];

export default function Crops() {
  const { crops, totalAcres } = useFarmStore();
  const { t } = useLanguage();
  const pieData = crops.map((c) => ({ name: c.name, value: c.area }));
  const usedAcres = crops.reduce((a, c) => a + c.area, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-[family-name:var(--font-display)] text-earth-900">{t('myCropsTitle')}</h2>
          <p className="text-earth-500 mt-1">{t('manageAndMonitor')}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-earth-500">{t('landUtilization')}</p>
          <p className="text-2xl font-bold text-earth-900 font-[family-name:var(--font-display)]">{usedAcres}/{totalAcres} {t('acres')}</p>
        </div>
      </div>

      {/* Land Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 border border-earth-200"
      >
        <h3 className="font-[family-name:var(--font-display)] text-xl text-earth-800 mb-4">{t('landDistribution')}</h3>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-48 h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#faf6f1', border: '1px solid #e0cfb5', borderRadius: '12px', fontFamily: 'Outfit' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3">
            {crops.map((crop, i) => (
              <div key={crop.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-sm text-earth-600">{t('crop' + crop.name.split(' ')[0].replace(/\(.*\)/g, ''))}</span>
                <span className="text-sm font-semibold text-earth-800 ml-auto">{crop.area}{t('acres')}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-earth-200" />
              <span className="text-sm text-earth-400">{t('unused')}</span>
              <span className="text-sm font-semibold text-earth-400 ml-auto">{totalAcres - usedAcres}{t('acres')}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Crop Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {crops.map((crop, i) => {
          const cropKey = 'crop' + crop.name.split(' ')[0];
          const stageKey = 'stage' + crop.stage.replace(/\s/g, '');
          
          return (
            <motion.div
              key={crop.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 border border-earth-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${COLORS[i % COLORS.length]}20` }}>
                    <Sprout size={24} style={{ color: COLORS[i % COLORS.length] }} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-earth-800 text-lg">{t(cropKey)}</h4>
                    <p className="text-xs text-earth-400">{t('stage')}: {t(stageKey)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold font-[family-name:var(--font-display)]" style={{ color: COLORS[i % COLORS.length] }}>
                    {crop.health}%
                  </p>
                  <p className="text-xs text-earth-400">{t('health')}</p>
                </div>
              </div>

              {/* Health Bar */}
              <div className="h-3 bg-earth-200 rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${crop.health}%` }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                  className="h-full rounded-full"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2.5 bg-earth-50 rounded-xl">
                  <Ruler size={14} className="mx-auto text-earth-400 mb-1" />
                  <p className="text-xs text-earth-400">{t('area')}</p>
                  <p className="text-sm font-semibold text-earth-700">{crop.area} {t('acres')}</p>
                </div>
                <div className="text-center p-2.5 bg-earth-50 rounded-xl">
                  <Calendar size={14} className="mx-auto text-earth-400 mb-1" />
                  <p className="text-xs text-earth-400">{t('planted')}</p>
                  <p className="text-sm font-semibold text-earth-700">{new Date(crop.plantedDate).toLocaleDateString()}</p>
                </div>
                <div className="text-center p-2.5 bg-earth-50 rounded-xl">
                  <TrendingUp size={14} className="mx-auto text-earth-400 mb-1" />
                  <p className="text-xs text-earth-400">{t('harvest')}</p>
                  <p className="text-sm font-semibold text-earth-700">{new Date(crop.expectedHarvest).toLocaleDateString()}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
