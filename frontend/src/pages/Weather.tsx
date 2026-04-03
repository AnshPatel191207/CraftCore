import { Sun, CloudRain, Cloud, CloudSun, Wind, Droplets, Eye, Thermometer, Sunrise, Sunset } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const hourlyData = [
  { time: '6AM', temp: 22, humidity: 75 },
  { time: '9AM', temp: 25, humidity: 68 },
  { time: '12PM', temp: 30, humidity: 55 },
  { time: '3PM', temp: 32, humidity: 48 },
  { time: '6PM', temp: 28, humidity: 60 },
  { time: '9PM', temp: 24, humidity: 70 },
  { time: '12AM', temp: 21, humidity: 78 },
];

const forecast = [
  { day: 'Today', icon: Sun, high: 32, low: 21, condition: 'Sunny', rain: 5 },
  { day: 'Tomorrow', icon: CloudSun, high: 30, low: 20, condition: 'Partly Cloudy', rain: 15 },
  { day: 'Wed', icon: CloudRain, high: 26, low: 19, condition: 'Rain', rain: 80 },
  { day: 'Thu', icon: CloudRain, high: 24, low: 18, condition: 'Heavy Rain', rain: 90 },
  { day: 'Fri', icon: Cloud, high: 25, low: 18, condition: 'Overcast', rain: 40 },
  { day: 'Sat', icon: CloudSun, high: 28, low: 19, condition: 'Partly Cloudy', rain: 20 },
  { day: 'Sun', icon: Sun, high: 31, low: 20, condition: 'Sunny', rain: 5 },
];

export default function Weather() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-[family-name:var(--font-display)] text-earth-900">Weather Forecast</h2>
        <p className="text-earth-500 mt-1">7-day forecast and agricultural weather insights</p>
      </div>

      {/* Current Weather */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden"
      >
        <img src="/images/wheat-field.jpg" alt="" className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-900/90 via-earth-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-earth-200 text-sm">Current Weather • Green Valley Farm</p>
              <div className="flex items-center gap-4 mt-2">
                <Sun className="text-sun-300" size={48} />
                <div>
                  <p className="text-5xl font-bold text-white font-[family-name:var(--font-display)]">28°C</p>
                  <p className="text-earth-200">Partly Cloudy</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <Sunrise className="text-sun-300 mx-auto" size={20} />
                <p className="text-xs text-earth-300 mt-1">Sunrise</p>
                <p className="text-sm font-semibold text-white">6:12 AM</p>
              </div>
              <div className="text-center">
                <Sunset className="text-orange-400 mx-auto" size={20} />
                <p className="text-xs text-earth-300 mt-1">Sunset</p>
                <p className="text-sm font-semibold text-white">5:48 PM</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Thermometer, label: 'Feels Like', value: '31°C', color: 'text-danger' },
          { icon: Droplets, label: 'Humidity', value: '65%', color: 'text-sky-500' },
          { icon: Wind, label: 'Wind Speed', value: '12 km/h', color: 'text-earth-500' },
          { icon: Eye, label: 'Visibility', value: '10 km', color: 'text-leaf-500' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="glass-card rounded-2xl p-4 border border-earth-200 text-center"
          >
            <item.icon className={`${item.color} mx-auto mb-2`} size={24} />
            <p className="text-xs text-earth-500">{item.label}</p>
            <p className="text-lg font-bold text-earth-800 font-[family-name:var(--font-display)]">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Hourly Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6 border border-earth-200"
      >
        <h3 className="font-[family-name:var(--font-display)] text-xl text-earth-800 mb-4">Hourly Temperature & Humidity</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={hourlyData}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f99b07" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f99b07" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b92f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b92f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0cfb5" />
            <XAxis dataKey="time" tick={{ fill: '#8d6347', fontSize: 12 }} />
            <YAxis tick={{ fill: '#8d6347', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#faf6f1', border: '1px solid #e0cfb5', borderRadius: '12px', fontFamily: 'Outfit' }} />
            <Area type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#f99b07" strokeWidth={2} fill="url(#tempGrad)" />
            <Area type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#3b92f6" strokeWidth={2} fill="url(#humGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* 7-Day Forecast */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6 border border-earth-200"
      >
        <h3 className="font-[family-name:var(--font-display)] text-xl text-earth-800 mb-4">7-Day Forecast</h3>
        <div className="grid grid-cols-7 gap-2">
          {forecast.map((day, i) => {
            const Icon = day.icon;
            return (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className={`text-center p-3 rounded-xl transition-all hover:shadow-md ${
                  i === 0 ? 'bg-sun-50 border border-sun-200' : 'bg-earth-50/50 hover:bg-earth-100/50'
                }`}
              >
                <p className="text-xs font-medium text-earth-500">{day.day}</p>
                <Icon size={24} className={`mx-auto my-2 ${
                  day.condition.includes('Rain') ? 'text-sky-500' : day.condition.includes('Cloud') ? 'text-earth-400' : 'text-sun-500'
                }`} />
                <p className="text-sm font-bold text-earth-800">{day.high}°</p>
                <p className="text-xs text-earth-400">{day.low}°</p>
                <div className="flex items-center justify-center gap-0.5 mt-1">
                  <Droplets size={10} className="text-sky-400" />
                  <span className="text-xs text-sky-500">{day.rain}%</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Agricultural Advisory */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl p-6 leaf-gradient text-white"
      >
        <h3 className="font-[family-name:var(--font-display)] text-xl mb-3">🌾 Agricultural Weather Advisory</h3>
        <div className="space-y-2 text-sm text-leaf-100">
          <p>• <strong className="text-white">Irrigation:</strong> Reduce irrigation by 50% ahead of expected rainfall on Wednesday-Thursday.</p>
          <p>• <strong className="text-white">Spraying:</strong> Complete any pending pesticide applications before Tuesday evening.</p>
          <p>• <strong className="text-white">Harvesting:</strong> Expedite harvesting of mature soybeans before the rain event.</p>
          <p>• <strong className="text-white">Drainage:</strong> Ensure field drainage channels are clear to handle 80-120mm of expected rainfall.</p>
        </div>
      </motion.div>
    </div>
  );
}
