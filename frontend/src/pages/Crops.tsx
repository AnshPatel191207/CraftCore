import { Sprout, Calendar, TrendingUp, Ruler } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFarmStore } from '../store/farmStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#3a9140', '#f99b07', '#3b92f6', '#a47a55'];

export default function Crops() {
  const { crops, totalAcres } = useFarmStore();
  const pieData = crops.map((c) => ({ name: c.name, value: c.area }));
  const usedAcres = crops.reduce((a, c) => a + c.area, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-[family-name:var(--font-display)] text-earth-900">My Crops</h2>
          <p className="text-earth-500 mt-1">Manage and monitor your active crops</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-earth-500">Land Utilization</p>
          <p className="text-2xl font-bold text-earth-900 font-[family-name:var(--font-display)]">{usedAcres}/{totalAcres} acres</p>
        </div>
      </div>

      {/* Land Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 border border-earth-200"
      >
        <h3 className="font-[family-name:var(--font-display)] text-xl text-earth-800 mb-4">Land Distribution</h3>
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
                <span className="text-sm text-earth-600">{crop.name}</span>
                <span className="text-sm font-semibold text-earth-800 ml-auto">{crop.area}ac</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-earth-200" />
              <span className="text-sm text-earth-400">Unused</span>
              <span className="text-sm font-semibold text-earth-400 ml-auto">{totalAcres - usedAcres}ac</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Crop Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {crops.map((crop, i) => (
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
                  <h4 className="font-semibold text-earth-800 text-lg">{crop.name}</h4>
                  <p className="text-xs text-earth-400">Stage: {crop.stage}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold font-[family-name:var(--font-display)]" style={{ color: COLORS[i % COLORS.length] }}>
                  {crop.health}%
                </p>
                <p className="text-xs text-earth-400">Health</p>
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
                <p className="text-xs text-earth-400">Area</p>
                <p className="text-sm font-semibold text-earth-700">{crop.area} acres</p>
              </div>
              <div className="text-center p-2.5 bg-earth-50 rounded-xl">
                <Calendar size={14} className="mx-auto text-earth-400 mb-1" />
                <p className="text-xs text-earth-400">Planted</p>
                <p className="text-sm font-semibold text-earth-700">{new Date(crop.plantedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
              <div className="text-center p-2.5 bg-earth-50 rounded-xl">
                <TrendingUp size={14} className="mx-auto text-earth-400 mb-1" />
                <p className="text-xs text-earth-400">Harvest</p>
                <p className="text-sm font-semibold text-earth-700">{new Date(crop.expectedHarvest).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
