import { useState, useEffect } from 'react';
import { 
  Sun, CloudRain, Cloud, CloudSun, Droplets, Thermometer, 
  RefreshCw, MapPin, Navigation, Info, AlertTriangle,
  ChevronRight, Calendar
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../components/ui/LanguageSwitcher';
import { ScrollReveal } from '../components/ScrollReveal';
import { useFarmStore } from '../store/farmStore';
import api from '../lib/api';
import { motion } from 'framer-motion';

export default function Weather() {
  const { t } = useLanguage();
  const { farmName } = useFarmStore();
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [advisory, setAdvisory] = useState<any>(null);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      // Parallel fetch for speed
      const [currentRes, forecastRes, agriRes]: any = await Promise.all([
        api.get('/weather/current'),
        api.get('/weather/forecast?days=7'),
        api.get('/weather/agricultural')
      ]);

      if (currentRes?.data) setWeatherData(currentRes.data);
      if (forecastRes?.data) setForecast(forecastRes.data.forecast || []);
      if (agriRes?.data) setAdvisory(agriRes.data.advisory);

    } catch (err) {
      console.error('Weather fetch error:', err);
      // Fallback to mock data if API fails
      setWeatherData({
        temp: 28,
        condition: 'Partly Cloudy',
        humidity: 62,
        windSpeed: 12,
        visibility: 10,
        feelsLike: 31,
        sunrise: '6:12 AM',
        sunset: '6:48 PM',
        location: { name: 'Vadu, Vadodara' }
      });
      setForecast([
        { date: '2024-05-20', temp_max: 32, temp_min: 22, condition: 'Sunny', rain_chance: 5 },
        { date: '2024-05-21', temp_max: 31, temp_min: 21, condition: 'Partly Cloudy', rain_chance: 12 },
        { date: '2024-05-22', temp_max: 29, temp_min: 20, condition: 'Rain', rain_chance: 85 },
        { date: '2024-05-23', temp_max: 27, temp_min: 19, condition: 'Heavy Rain', rain_chance: 95 },
        { date: '2024-05-24', temp_max: 28, temp_min: 19, condition: 'Cloudy', rain_chance: 40 },
        { date: '2024-05-25', temp_max: 30, temp_min: 21, condition: 'Clear', rain_chance: 10 },
        { date: '2024-05-26', temp_max: 33, temp_min: 23, condition: 'Sunny', rain_chance: 0 },
      ]);
      setAdvisory({
        irrigation: "Reduce irrigation by 50% ahead of expected rainfall on Wednesday-Thursday.",
        spraying: "Complete any pending pesticide applications before Tuesday evening.",
        harvesting: "Prepare storage facilities for moisture-level checks if harvesting this week."
      });
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const hourlyData = [
    { time: '6AM', temp: 22, humidity: 75 },
    { time: '9AM', temp: 25, humidity: 68 },
    { time: '12PM', temp: 30, humidity: 55 },
    { time: '3PM', temp: 32, humidity: 48 },
    { time: '6PM', temp: 28, humidity: 60 },
    { time: '9PM', temp: 24, humidity: 70 },
    { time: '12AM', temp: 21, humidity: 78 },
  ];

  const getWeatherIcon = (condition: string = '') => {
    const cond = (condition || '').toLowerCase();
    if (cond.includes('sun') || cond.includes('clear')) return <Sun className="text-amber-400" size={32} />;
    if (cond.includes('rain')) return <CloudRain className="text-sky-400" size={32} />;
    if (cond.includes('cloud')) return <CloudSun className="text-teal-400" size={32} />;
    return <Cloud className="text-text-muted" size={32} />;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="relative">
          <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             className="w-20 h-20 rounded-full border-2 border-teal-500/20 border-t-teal-500"
          />
          <Sun className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-teal-400" size={24} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-500 animate-pulse">Syncing Atmos-Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header with Location */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-2 border-b border-white/5">
         <ScrollReveal direction="left">
            <div className="space-y-1">
               <div className="flex items-center gap-2 text-teal-500">
                  <MapPin size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{weatherData?.location?.name || farmName}</span>
               </div>
               <h1 className="text-4xl font-display font-black text-white">{t('weatherForecast')}</h1>
            </div>
         </ScrollReveal>

         <ScrollReveal direction="right">
            <div className="flex items-center gap-3">
               <button 
                  onClick={fetchWeather}
                  className="p-3 rounded-xl glass border border-white/5 text-text-muted hover:text-teal-500 transition-colors"
                >
                  <RefreshCw size={18} />
               </button>
               <div className="px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-xl">
                  <span className="text-xs font-black text-teal-500">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
               </div>
            </div>
         </ScrollReveal>
      </div>

      {/* Main Feature: Current Highlight */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 relative rounded-[40px] overflow-hidden group shadow-2xl">
              {/* Dynamic Background Image */}
              <div className="absolute inset-0 bg-surface-2 transition-transform duration-700 group-hover:scale-105">
                 <img src="/images/weather_bg.png" alt="" className="w-full h-full object-cover transition-all duration-700" />
                 <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
              </div>

              <div className="relative z-10 p-10 h-full flex flex-col justify-between min-h-[400px]">
                 <div className="flex justify-between items-start">
                    <div className="px-4 py-1.5 rounded-full glass border border-white/10 text-[10px] font-black uppercase tracking-widest text-teal-500 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                       {t('live')} Atmos Data
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t('sunrise')}/{t('sunset')}</p>
                       <p className="text-xs font-black text-white mt-1">{weatherData?.sunrise} • {weatherData?.sunset}</p>
                    </div>
                 </div>

                 <div className="flex items-end justify-between">
                    <div>
                       <div className="flex items-center gap-6">
                          <span className="text-8xl font-display font-black text-white tracking-tighter">{weatherData?.temp}°</span>
                          <div className="pb-4">
                             {getWeatherIcon(weatherData?.condition)}
                             <p className="text-xl font-display font-black text-white mt-1 uppercase tracking-tight">{t(weatherData?.condition ? weatherData.condition.toLowerCase().replace(/\s/g, '') : '') || weatherData?.condition}</p>
                          </div>
                       </div>
                       <p className="text-text-muted mt-2 font-bold flex items-center gap-2">
                          <Thermometer size={16} className="text-amber-500" />
                          {t('feelsLike')} {weatherData?.feelsLike}° • {t('moderate')} Humidity Gradient
                       </p>
                    </div>

                    <div className="hidden md:grid grid-cols-2 gap-x-12 gap-y-6">
                       <div>
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{t('humidity')}</p>
                          <p className="text-2xl font-black text-white">{weatherData?.humidity}%</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{t('windSpeed')}</p>
                          <p className="text-2xl font-black text-white">{weatherData?.windSpeed} km/h</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{t('visibility')}</p>
                          <p className="text-2xl font-black text-white">{weatherData?.visibility} km</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">UV Index</p>
                          <p className="text-2xl font-black text-amber-500">6.2</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Quick Agricultural Advisory */}
           <div className="glass-card rounded-[40px] p-8 border border-white/5 flex flex-col justify-between h-full bg-surface-2/30">
              <div>
                 <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500 mb-6">
                    <Navigation size={24} />
                 </div>
                 <h3 className="text-2xl font-display font-black text-white mb-4 leading-tight">{t('agriWeatherAdvisory')}</h3>
                 <div className="space-y-6">
                   <div className="flex gap-4 group">
                      <div className="shrink-0 w-1 h-12 bg-teal-500/30 rounded-full group-hover:bg-teal-500 transition-colors" />
                      <div>
                         <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest mb-1">{t('irrigation')}</p>
                         <p className="text-xs font-bold text-text-muted leading-relaxed line-clamp-2">{advisory?.irrigation || t('irrigationAdvice')}</p>
                      </div>
                   </div>
                   <div className="flex gap-4 group">
                      <div className="shrink-0 w-1 h-12 bg-amber-500/30 rounded-full group-hover:bg-amber-500 transition-colors" />
                      <div>
                         <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">{t('spraying')}</p>
                         <p className="text-xs font-bold text-text-muted leading-relaxed line-clamp-2">{advisory?.spraying || t('sprayingAdvice')}</p>
                      </div>
                   </div>
                 </div>
              </div>

              <button className="w-full py-4 mt-8 glass border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 group">
                 View Full Agri-Atmos Report
                 <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Hourly Trend Chart */}
         <ScrollReveal direction="left" delay={0.2}>
            <div className="glass-card rounded-[40px] p-8 border border-white/5 shadow-xl bg-surface-2/20">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-display font-black text-white flex items-center gap-3">
                     <Activity size={20} className="text-teal-500" />
                     {t('hourlyTempHum')}
                  </h3>
                  <div className="flex gap-3">
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-teal-500" />
                        <span className="text-[10px] font-black uppercase text-white/40">Temp</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500" />
                        <span className="text-[10px] font-black uppercase text-white/40">Hum</span>
                     </div>
                  </div>
               </div>

               <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={hourlyData}>
                        <defs>
                           <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--teal)" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="var(--teal)" stopOpacity={0}/>
                           </linearGradient>
                           <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                        <XAxis 
                           dataKey="time" 
                           axisLine={false} 
                           tickLine={false} 
                           tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900 }}
                           dy={10}
                        />
                        <YAxis hide />
                        <Tooltip 
                           contentStyle={{ backgroundColor: '#111e12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                           itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                        />
                        <Area 
                           type="monotone" 
                           dataKey="temp" 
                           stroke="var(--teal)" 
                           strokeWidth={3}
                           fillOpacity={1} 
                           fill="url(#colorTemp)" 
                        />
                        <Area 
                           type="monotone" 
                           dataKey="humidity" 
                           stroke="#0ea5e9" 
                           strokeWidth={3}
                           fillOpacity={1} 
                           fill="url(#colorHum)" 
                        />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </ScrollReveal>

         {/* 7-Day Forecast Grid */}
         <ScrollReveal direction="right" delay={0.2}>
            <div className="glass-card rounded-[40px] p-8 border border-white/5 shadow-xl bg-surface-2/20">
               <h3 className="text-xl font-display font-black text-white flex items-center gap-3 mb-8">
                  <Calendar size={20} className="text-teal-500" />
                  {t('sevenDayForecast')}
               </h3>

               <div className="space-y-3">
                  {forecast.map((day, i) => (
                     <div 
                        key={i} 
                        className="group flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-default"
                     >
                        <div className="flex items-center gap-6">
                           <p className="w-16 text-sm font-black text-white/50 uppercase tracking-widest">{i === 0 ? t('today') : i === 1 ? t('tomorrow') : new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}</p>
                           <div className="p-2 rounded-xl bg-surface-3 group-hover:scale-110 transition-transform">
                              {getWeatherIcon(day.condition)}
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm font-black text-white">{day.temp_max}° / {day.temp_min}°</span>
                              <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">{t(day.condition ? day.condition.toLowerCase().replace(/\s/g, '') : '') || day.condition}</span>
                           </div>
                        </div>

                        <div className="flex items-center gap-3">
                           <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20">
                              <Droplets size={12} className="text-sky-500" />
                              <span className="text-[10px] font-black text-sky-500">{day.rain_chance}%</span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </ScrollReveal>
      </div>

      {/* Extreme Weather / Alert Context (Dynamic Sidebar) */}
      <ScrollReveal direction="up" delay={0.3}>
         <div className="p-8 rounded-[40px] border border-amber-500/20 bg-amber-500/5 relative overflow-hidden flex items-center gap-8">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <AlertTriangle size={120} className="text-amber-500" />
            </div>
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500">
               <Info size={32} />
            </div>
            <div>
               <h4 className="text-xl font-display font-black text-amber-500 mb-1">{t('actionRequired')} • Heat Mitigation Zone</h4>
               <p className="text-sm font-bold text-white/40 leading-relaxed max-w-2xl">
                  Transpiration rates are projected to increase by 22% between 11 AM and 3 PM. Ensure soil moisture buffer is maintained at {`>`}70% field capacity for your maize plots in Block A.
               </p>
            </div>
         </div>
      </ScrollReveal>
    </div>
  );
}

function Activity(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" 
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
