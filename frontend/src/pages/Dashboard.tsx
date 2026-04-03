import { Sprout, Droplets, TrendingUp, AlertTriangle, Sun, CloudRain, Wind, Thermometer } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import StatCard from '../components/StatCard';
import { useFarmStore } from '../store/farmStore';

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

export default function Dashboard() {
  const { crops, advisories, farmName, totalAcres } = useFarmStore();
  const avgHealth = Math.round(crops.reduce((a, c) => a + c.health, 0) / crops.length);
  const unreadAlerts = advisories.filter((a) => !a.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden h-52">
        <img src="/images/farm-hero.jpg" alt="Farm" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-earth-900/80 via-earth-800/60 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-4xl font-[family-name:var(--font-display)] text-white"
          >
            {farmName}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-earth-200 mt-1"
          >
            {totalAcres} acres • {crops.length} active crops • Season: Rabi
          </motion.p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Crop Health" value={`${avgHealth}%`} subtitle="Average across all fields" icon={Sprout} color="leaf" delay={0.1} />
        <StatCard title="Soil Moisture" value="28%" subtitle="Last reading 2h ago" icon={Droplets} color="sky" delay={0.2} />
        <StatCard title="Yield Forecast" value="4.5 t/ha" subtitle="+12% vs last season" icon={TrendingUp} color="sun" delay={0.3} />
        <StatCard title="Active Alerts" value={unreadAlerts} subtitle={`${advisories.length} total advisories`} icon={AlertTriangle} color="earth" delay={0.4} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 border border-earth-200"
        >
          <h3 className="font-[family-name:var(--font-display)] text-xl text-earth-800 mb-4">Yield Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={yieldData}>
              <defs>
                <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3a9140" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3a9140" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0cfb5" />
              <XAxis dataKey="month" tick={{ fill: '#8d6347', fontSize: 12 }} />
              <YAxis tick={{ fill: '#8d6347', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#faf6f1', border: '1px solid #e0cfb5', borderRadius: '12px', fontFamily: 'Outfit' }}
              />
              <Area type="monotone" dataKey="yield" stroke="#3a9140" strokeWidth={2.5} fill="url(#yieldGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Rainfall */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6 border border-earth-200"
        >
          <h3 className="font-[family-name:var(--font-display)] text-xl text-earth-800 mb-4">Monthly Rainfall (mm)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={rainfallData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0cfb5" />
              <XAxis dataKey="month" tick={{ fill: '#8d6347', fontSize: 12 }} />
              <YAxis tick={{ fill: '#8d6347', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#faf6f1', border: '1px solid #e0cfb5', borderRadius: '12px', fontFamily: 'Outfit' }}
              />
              <Bar dataKey="rain" fill="#3b92f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Weather + Crops Quick View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6 border border-earth-200"
        >
          <h3 className="font-[family-name:var(--font-display)] text-xl text-earth-800 mb-4">Today's Weather</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl sun-gradient flex items-center justify-center">
              <Sun className="text-white" size={32} />
            </div>
            <div>
              <p className="text-4xl font-bold text-earth-900 font-[family-name:var(--font-display)]">28°C</p>
              <p className="text-sm text-earth-500">Partly Cloudy</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-earth-100/50 rounded-xl">
              <CloudRain size={18} className="mx-auto text-sky-500 mb-1" />
              <p className="text-xs text-earth-500">Humidity</p>
              <p className="text-sm font-semibold text-earth-800">65%</p>
            </div>
            <div className="text-center p-3 bg-earth-100/50 rounded-xl">
              <Wind size={18} className="mx-auto text-earth-500 mb-1" />
              <p className="text-xs text-earth-500">Wind</p>
              <p className="text-sm font-semibold text-earth-800">12 km/h</p>
            </div>
            <div className="text-center p-3 bg-earth-100/50 rounded-xl">
              <Thermometer size={18} className="mx-auto text-danger mb-1" />
              <p className="text-xs text-earth-500">Feels Like</p>
              <p className="text-sm font-semibold text-earth-800">31°C</p>
            </div>
          </div>
        </motion.div>

        {/* Crop Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-2xl p-6 border border-earth-200 lg:col-span-2"
        >
          <h3 className="font-[family-name:var(--font-display)] text-xl text-earth-800 mb-4">Crop Status</h3>
          <div className="space-y-3">
            {crops.map((crop) => (
              <div key={crop.name} className="flex items-center gap-4 p-3 bg-earth-50/50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-leaf-100 flex items-center justify-center">
                  <Sprout className="text-leaf-600" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-earth-800 text-sm">{crop.name}</p>
                    <span className="text-xs text-earth-500">{crop.area} acres</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex-1 h-2 bg-earth-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${crop.health}%`,
                          background: crop.health > 80 ? '#3a9140' : crop.health > 60 ? '#f99b07' : '#dc2626',
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-earth-600 w-10 text-right">{crop.health}%</span>
                  </div>
                  <p className="text-xs text-earth-400 mt-0.5">Stage: {crop.stage}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
