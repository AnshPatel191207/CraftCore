import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   TrendingUp,
   TrendingDown,
   DollarSign,
   BarChart3,
   ShoppingCart,
   MessageSquare,
   ChevronRight,
   Info,
   Calendar,
   MapPin,
   HelpCircle,
   ArrowRight
} from 'lucide-react';
import {
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
   AreaChart,
   Area
} from 'recharts';
import { useLanguage } from '../components/ui/LanguageSwitcher';
import { ScrollReveal } from '../components/ScrollReveal';
import { useFarmStore } from '../store/farmStore';

// Mock Data
const TRENDING_CROPS = [
   { id: 'wheat', name: 'Wheat', icon: '🌾', demand: 'high', trend: 'increasing', price: 2150, profit: 'high' },
   { id: 'rice', name: 'Rice', icon: '🌾', demand: 'medium', trend: 'increasing', price: 1940, profit: 'medium' },
   { id: 'cotton', name: 'Cotton', icon: '🧵', demand: 'high', trend: 'increasing', price: 6200, profit: 'high' },
   { id: 'soybean', name: 'Soybean', icon: '🌱', demand: 'medium', trend: 'decreasing', price: 4100, profit: 'medium' },
   { id: 'maize', name: 'Maize', icon: '🌽', demand: 'high', trend: 'increasing', price: 2200, profit: 'high' }
];

const PRICE_HISTORY = [
   { month: 'Jan', price: 1800 },
   { month: 'Feb', price: 1950 },
   { month: 'Mar', price: 2100 },
   { month: 'Apr', price: 2050 },
   { month: 'May', price: 2200 },
   { month: 'Jun', price: 2500 },
   { month: 'Jul', price: 2400 }
];

const MARKET_PRICES = [
   { crop: 'Wheat', current: 2150, lastWeek: 2100, trend: 'up' },
   { crop: 'Rice', current: 1940, lastWeek: 1960, trend: 'down' },
   { crop: 'Cotton', current: 6200, lastWeek: 6000, trend: 'up' },
   { crop: 'Maize', current: 2200, lastWeek: 2050, trend: 'up' },
   { crop: 'Soybean', current: 4100, lastWeek: 4150, trend: 'down' }
];

export default function MarketIntelligence() {
   const { t } = useLanguage();
   const { setPanelOpen, setPendingChatQuery } = useFarmStore();

   // Calculator State
   const [calc, setCalc] = useState({
      cropId: 'wheat',
      area: 5,
      yieldPerAcre: 15,
      price: 2150
   });

   const results = useMemo(() => {
      const totalYield = calc.area * calc.yieldPerAcre;
      const revenue = totalYield * calc.price;
      const estCost = totalYield * (calc.price * 0.4); // Mock cost: 40% of revenue
      const profit = revenue - estCost;
      return { revenue, estCost, profit };
   }, [calc]);

   // AI Advisor State
   const [query, setQuery] = useState('');

   const handleAskAI = (e: React.FormEvent) => {
      e.preventDefault();
      if (!query.trim()) return;

      setPendingChatQuery(`Market Inquiry: ${query}`);
      setPanelOpen(true);
      setQuery('');
   };

   return (
      <div className="space-y-10 pb-20">
         {/* 🟢 1. HEADER SECTION */}
         <ScrollReveal direction="down">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
               <div>
                  <h1 className="text-4xl font-display font-black text-white tracking-tight uppercase">
                     {t('market.title')}
                  </h1>
                  <p className="text-white/50 mt-2 font-bold italic">
                     {t('market.sub')}
                  </p>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 glass border border-white/10 rounded-xl">
                  <Calendar size={16} className="text-teal-400" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">
                     Live Updates: April 2026
                  </span>
               </div>
            </div>
         </ScrollReveal>

         {/* 📈 2. TRENDING CROPS SECTION */}
         <section className="space-y-6">
            <div className="flex items-center gap-3">
               <h2 className="text-2xl font-display font-black text-green-400 uppercase">{t('market.trendingCrops')}</h2>
               <div className="h-px flex-1 bg-green-800/20" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
               {TRENDING_CROPS.map((crop, i) => (
                  <ScrollReveal key={crop.id} direction="up" delay={i * 0.1}>
                     <div className="group relative bg-green-900/40 backdrop-blur-lg p-4 md:p-6 rounded-[32px] border border-green-800/30 hover:bg-green-800/30 transition-all duration-300 overflow-hidden">
                        <div className="absolute -right-4 -top-4 text-6xl opacity-10 group-hover:scale-125 transition-transform">
                           {crop.icon}
                        </div>
                        <div className="relative z-10 space-y-4">
                           <div className="flex justify-between items-center">
                              <div>
                                 <span className="text-2xl">{crop.icon}</span>
                                 <h3 className="text-xl font-black text-white">{t(`crops.${crop.id}`)}</h3>
                              </div>
                           </div>
                           <div className="space-y-2">
                              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                                 <span className="text-white/30">{t('market.demand')}</span>
                                 <span className={crop.demand === 'high' ? 'text-green-400' : 'text-amber-400'}>
                                    {t(`market.${crop.demand}`)}
                                 </span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                                 <span className="text-white/30">{t('market.priceTrend')}</span>
                                 <span className="flex items-center gap-1 text-green-400">
                                    {crop.trend === 'increasing' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {t(`market.${crop.trend}`)}
                                 </span>
                              </div>
                           </div>
                           <div className="pt-4 border-t border-white/5">
                              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">{t('market.currentPrice')}</p>
                              <p className="text-2xl font-display font-black text-white">₹{crop.price}<span className="text-xs text-white/40 ml-1">/{t('market.quintal')}</span></p>
                           </div>
                           <div className={`mt-2 py-1 px-3 rounded-full inline-block text-[8px] font-black uppercase tracking-[0.2em] ${crop.profit === 'high' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                              }`}>
                              {crop.profit === 'high' ? '🟢' : '🟡'} {t('market.profitIndicator')}: {t(`market.${crop.profit}`)}
                           </div>
                        </div>
                     </div>
                  </ScrollReveal>
               ))}
            </div>
         </section>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 💰 3. PROFIT ESTIMATION CALCULATOR */}
            <div className="lg:col-span-8 flex flex-col gap-6">
               <div className="glass p-10 rounded-[40px] border border-white/10 bg-gradient-to-br from-teal-500/5 to-transparent relative overflow-hidden flex-1">
                  <div className="absolute top-0 right-0 p-8 opacity-5 text-green-500">
                     <DollarSign size={160} />
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center text-bg shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                           <BarChart3 size={24} />
                        </div>
                        <h2 className="text-2xl font-display font-black text-white uppercase">{t('market.profitCalc')}</h2>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                        <div className="space-y-6">
                           <div className="space-y-2">
                              <label className="text-xs font-black text-green-400/50 uppercase tracking-widest">{t('market.cropType')}</label>
                              <select
                                 value={calc.cropId}
                                 onChange={(e) => {
                                    const crop = TRENDING_CROPS.find(c => c.id === e.target.value);
                                    setCalc(prev => ({ ...prev, cropId: e.target.value, price: crop?.price || 0 }));
                                 }}
                                 className="w-full rounded-xl p-4 bg-green-950/40 border border-green-700/30 text-white font-bold focus:outline-none focus:border-green-500/50 shadow-inner"
                              >
                                 {TRENDING_CROPS.map(c => <option key={c.id} value={c.id} className="bg-green-950">{t(`crops.${c.id}`)}</option>)}
                              </select>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-xs font-black text-green-400/50 uppercase tracking-widest">{t('market.landArea')}</label>
                                 <input
                                    type="number"
                                    value={calc.area}
                                    onChange={(e) => setCalc(prev => ({ ...prev, area: Number(e.target.value) }))}
                                    className="w-full rounded-xl p-4 bg-green-950/40 border border-green-700/30 text-white font-bold focus:outline-none focus:border-green-500/50 shadow-inner"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-xs font-black text-green-400/50 uppercase tracking-widest">{t('market.expectedYield')}</label>
                                 <input
                                    type="number"
                                    value={calc.yieldPerAcre}
                                    onChange={(e) => setCalc(prev => ({ ...prev, yieldPerAcre: Number(e.target.value) }))}
                                    className="w-full rounded-xl p-4 bg-green-950/40 border border-green-700/30 text-white font-bold focus:outline-none focus:border-green-500/50 shadow-inner"
                                 />
                              </div>
                           </div>

                           <div className="space-y-2">
                              <label className="text-xs font-black text-green-400/50 uppercase tracking-widest">{t('market.marketPrice')}</label>
                              <input
                                 type="number"
                                 value={calc.price}
                                 onChange={(e) => setCalc(prev => ({ ...prev, price: Number(e.target.value) }))}
                                 className="w-full rounded-xl p-4 bg-green-950/40 border border-green-700/30 text-white font-bold focus:outline-none focus:border-green-500/50 shadow-inner"
                              />
                           </div>
                        </div>

                        <div className="bg-green-950/40 rounded-[32px] p-8 space-y-8 border border-green-800/30 flex flex-col justify-center">
                           <div className="flex justify-between items-center group">
                              <div>
                                 <p className="text-[10px] font-black text-green-400/30 uppercase tracking-widest mb-1">{t('market.totalRevenue')}</p>
                                 <p className="text-3xl font-display font-black text-white">₹{results.revenue.toLocaleString()}</p>
                              </div>
                              <div className="p-3 rounded-xl bg-green-500/10 text-green-400 opacity-80 group-hover:opacity-100 transition-opacity">
                                 <TrendingUp size={24} />
                              </div>
                           </div>
                           <div className="flex justify-between items-center group">
                              <div>
                                 <p className="text-[10px] font-black text-red-400/30 uppercase tracking-widest mb-1">{t('market.estimatedCost')}</p>
                                 <p className="text-3xl font-display font-black text-white/80">₹{results.estCost.toLocaleString()}</p>
                              </div>
                              <div className="p-3 rounded-xl bg-red-500/10 text-red-400 opacity-80 group-hover:opacity-100 transition-opacity">
                                 <TrendingDown size={24} />
                              </div>
                           </div>
                           <div className="pt-8 border-t border-green-800/20 flex justify-between items-end">
                              <div>
                                 <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">{t('market.netProfit')}</p>
                                 <p className="text-5xl font-display font-black text-white">₹{results.profit.toLocaleString()}</p>
                              </div>
                              <div className="w-16 h-16 rounded-[24px] bg-green-500 flex items-center justify-center text-bg shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                                 <DollarSign size={32} />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* 📉 6. PRICE TREND GRAPH */}
            <div className="lg:col-span-4 space-y-6">
               <div className="bg-green-900/40 backdrop-blur-lg p-4 md:p-8 rounded-[40px] border border-green-800/30 h-full flex flex-col shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-xl font-display font-black text-white uppercase tracking-tight">{t('market.priceTrendGraph')}</h2>
                     <div className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest">
                        {t('crops.maize')}
                     </div>
                  </div>

                  <div className="flex-1 min-h-[300px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={PRICE_HISTORY}>
                           <defs>
                              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                 <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,197,94,0.1)" vertical={false} />
                           <XAxis
                              dataKey="month"
                              stroke="rgba(255,255,255,0.2)"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                           />
                           <YAxis
                              hide
                           />
                           <Tooltip
                              contentStyle={{ backgroundColor: '#06160e', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '16px' }}
                              itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                           />
                           <Area
                              type="monotone"
                              dataKey="price"
                              stroke="#22c55e"
                              strokeWidth={3}
                              fillOpacity={1}
                              fill="url(#colorPrice)"
                              animationDuration={2000}
                           />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>

                  <div className="mt-8 p-4 md:p-6 rounded-3xl bg-green-950/40 border border-green-800/20">
                     <div className="flex items-center gap-3">
                        <Info size={16} className="text-green-400" />
                        <p className="text-xs font-bold text-white/50">{t('market.wheatIncreasing')}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* 📊 4. MARKET PRICE TABLE */}
            <div className="lg:col-span-12">
               <ScrollReveal direction="up">
                  <div className="glass p-10 rounded-[40px] border border-white/10 bg-gradient-to-br from-teal-500/5 to-transparent overflow-hidden">
                     <div className="p-8 border-b border-green-800/20 flex items-center justify-between bg-green-950/[0.02]">
                        <h2 className="text-2xl font-display font-black text-white uppercase">{t('market.priceTable')}</h2>
                        <button className="text-xs font-black text-green-400 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                           View All <ChevronRight size={16} />
                        </button>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead>
                              <tr className="border-b border-green-800/20">
                                 <th className="px-8 py-6 text-[10px] font-black text-green-400/30 uppercase tracking-[0.2em]">Crop</th>
                                 <th className="px-8 py-6 text-[10px] font-black text-green-400/30 uppercase tracking-[0.2em]">{t('market.currentPrice')}</th>
                                 <th className="px-8 py-6 text-[10px] font-black text-green-400/30 uppercase tracking-[0.2em]">{t('market.lastWeek')}</th>
                                 <th className="px-8 py-6 text-[10px] font-black text-green-400/30 uppercase tracking-[0.2em]">{t('market.trend')}</th>
                                 <th className="px-8 py-6 text-[10px] font-black text-green-400/30 uppercase tracking-[0.2em]">Live Market</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-green-800/10">
                              {MARKET_PRICES.map((item, i) => (
                                 <tr key={i} className="hover:bg-green-800/10 transition-colors group cursor-default">
                                    <td className="px-8 py-6">
                                       <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-xl bg-green-950/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                                             <span className="text-lg">🌾</span>
                                          </div>
                                          <span className="text-lg font-bold text-white">{t(`crops.${item.crop.toLowerCase()}`)}</span>
                                       </div>
                                    </td>
                                    <td className="px-8 py-6 text-lg font-black text-white">₹{item.current}</td>
                                    <td className="px-8 py-6 text-lg font-black text-white/40">₹{item.lastWeek}</td>
                                    <td className="px-4 py-8 flex justify-between items-center">
                                       <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                          }`}>
                                          {item.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                          {Math.abs(Math.round(((item.current - item.lastWeek) / item.lastWeek) * 100))}%
                                       </div>
                                    </td>
                                    <td className="px-8 py-6">
                                       <div className="flex items-center gap-4">
                                          <div className="flex items-center gap-2">
                                             <MapPin size={14} className="text-white/20" />
                                             <span className="text-xs font-bold text-white/40">Ahmedabad APMC</span>
                                          </div>
                                          <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </ScrollReveal>
            </div>

            {/* 🤖 7. AI MARKET ADVISOR */}
            <div className="lg:col-span-7">
               <ScrollReveal direction="left">
                  <div className="glass p-10 rounded-[40px] border border-white/10 relative overflow-hidden h-full">
                     <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-teal-500/10 rounded-full blur-[80px]" />

                     <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 rounded-3xl bg-indigo-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                           <MessageSquare size={28} />
                        </div>
                        <div>
                           <h2 className="text-2xl font-display font-black text-white uppercase">{t('market.aiAdvisor')}</h2>
                           <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{t('market.askAdvisor')}</p>
                        </div>
                     </div>

                     <form onSubmit={handleAskAI} className="relative mb-8">
                        <input
                           type="text"
                           value={query}
                           onChange={(e) => setQuery(e.target.value)}
                           placeholder="Ask about market trends..."
                           className="w-full bg-white/5 border border-white/10 rounded-[28px] px-8 py-6 text-white font-bold placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all pr-32"
                        />
                        <button
                           type="submit"
                           className="absolute right-3 top-3 bottom-3 px-6 bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                        >
                           Ask {t('krishiSetu')}
                        </button>
                     </form>

                     <AnimatePresence mode="wait">
                        <div className="grid grid-cols-2 gap-4">
                           {['Market trends for Wheat?', 'Best crop for high profit?', 'When to sell Maize?'].map((q, i) => (
                              <button
                                 key={i}
                                 onClick={() => { 
                                    setPendingChatQuery(`Inquiry: ${q}`);
                                    setPanelOpen(true);
                                 }}
                                 className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left text-xs font-bold text-white/40 hover:bg-white/10 hover:text-white transition-all font-display uppercase tracking-widest"
                              >
                                 {q}
                              </button>
                           ))}
                        </div>
                     </AnimatePresence>
                  </div>
               </ScrollReveal>
            </div>

            {/* 🛒 5. SELLING OPTIONS PANEL */}
            <div className="lg:col-span-5">
               <ScrollReveal direction="right">
                  <div className="glass p-10 rounded-[40px] border border-white/10 bg-gradient-to-br from-teal-500/5 to-transparent h-full flex flex-col">
                     <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 rounded-3xl bg-teal-500 flex items-center justify-center text-bg shadow-[0_0_30px_rgba(20,184,166,0.3)]">
                           <ShoppingCart size={28} />
                        </div>
                        <h2 className="text-2xl font-display font-black text-white uppercase">{t('market.sellSmartly')}</h2>
                     </div>

                     <div className="space-y-6 flex-1">
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                           <div className="flex items-center gap-3">
                              <TrendingUp size={20} className="text-teal-400" />
                              <h3 className="text-sm font-black text-white uppercase tracking-widest">{t('market.bestTimeToSell')}</h3>
                           </div>
                           <p className="text-xs font-bold text-white/50 italic leading-relaxed">
                              "Prices for major grains are expected to peak in the second week of May. Consider warehousing until then."
                           </p>
                        </div>

                        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                           <div className="flex items-center gap-3">
                              <MapPin size={20} className="text-teal-400" />
                              <h3 className="text-sm font-black text-white uppercase tracking-widest">{t('market.suggestedMarkets')}</h3>
                           </div>
                           <div className="grid grid-cols-2 gap-3">
                              <div className="px-4 py-3 rounded-xl bg-bg border border-white/10 text-[10px] font-black text-white/60">RAJKOT APMC</div>
                              <div className="px-4 py-3 rounded-xl bg-bg border border-white/10 text-[10px] font-black text-white/60">GANDHINAGAR</div>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <div className="flex items-center gap-3 px-2">
                              <HelpCircle size={16} className="text-amber-400" />
                              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Expert Tips</p>
                           </div>
                           {[
                              { text: 'Store crops for better price', icon: ArrowRight },
                              { text: 'Sell during peak demand', icon: ArrowRight }
                           ].map((tip, i) => (
                              <div key={i} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-colors group">
                                 <tip.icon size={14} className="text-teal-500 group-hover:translate-x-1 transition-transform" />
                                 <span className="text-sm font-bold text-white/70">{tip.text}</span>
                              </div>
                           ))}
                        </div>
                     </div>

                     <button className="w-full mt-10 px-8 py-5 bg-teal-500 text-bg rounded-[24px] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.02] shadow-[0_20px_40px_rgba(20,184,166,0.2)] transition-all">
                        {t('market.listForSale')} <ArrowRight size={20} />
                     </button>
                  </div>
               </ScrollReveal>
            </div>
         </div>
      </div>
   );
}
