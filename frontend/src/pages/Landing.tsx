import { motion } from 'framer-motion';
import { Sprout, Upload, Scan, Keyboard, ChevronRight, BarChart3, Clock, ShieldCheck, Leaf } from 'lucide-react';
import { useFarmStore } from '../store/farmStore';
import { fadeUp, staggerContainer, wordAnimation } from '../lib/animations';

const FEATURES = [
  { 
    title: 'Soil Intelligence Engine', 
    desc: 'Deep analysis of NPK, pH, and micronutrients using advanced AI to extract real farm competencies.',
    icon: Leaf,
    color: '#22c55e'
  },
  { 
    title: 'Multi-Input Analysis', 
    desc: 'Upload PDFs, scan images of physical reports, or enter data manually for instant processing.',
    icon: BarChart3,
    color: '#4ade80'
  },
  { 
    title: 'Plain Language Guidance', 
    desc: 'No technical jargon. Get clear, non-technical instructions designed for local Indian farming contexts.',
    icon: ShieldCheck,
    color: '#f59e0b'
  }
];

const STEPS = [
  { id: '01', title: 'Upload Data', desc: 'Submit your soil report via PDF, scan, or manual entry.' },
  { id: '02', title: 'AI Analysis', desc: 'Our engine extracts 20+ parameters including soil health score.' },
  { id: '03', title: 'Get Guidance', desc: 'Receive crop suggestions and a weekly fertilizer schedule.' }
];

export default function Landing() {
  const { setActivePage } = useFarmStore();

  const headline = "Your Soil Speaks. Are You Listening?";
  const words = headline.split(" ");

  return (
    <div className="pt-12 pb-24 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-teal-500/20 mb-6 group">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-xs font-bold text-teal-500 tracking-widest uppercase">Next-Gen Agri Intelligence</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight leading-[0.9] mb-8">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordAnimation}
                  className="inline-block mr-4 text-white"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p 
              variants={fadeUp}
              className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Transform complex soil lab reports into simple, actionable farming intelligence. 
              Built for Indian farmers to grow smarter, not harder.
            </motion.p>

            <motion.div 
              variants={fadeUp}
              className="flex flex-wrap justify-center gap-4 mb-20"
            >
              <button 
                onClick={() => setActivePage('dashboard')}
                className="px-8 py-4 rounded-2xl bg-teal-500 text-bg font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-teal-500/20 flex items-center gap-2 group"
              >
                Analyse My Soil
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 rounded-2xl glass border border-white/10 text-white font-bold text-lg hover:bg-white/5 transition-all">
                How it Works
              </button>
            </motion.div>
          </motion.div>

          {/* Floating Glass Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-md mx-auto"
          >
            <div className="glass rounded-[32px] p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6">
                <BarChart3 className="text-teal-500/20 w-12 h-12" />
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-500">
                  <Sprout size={24} />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-bold">Field A • Kharif Season</h3>
                  <p className="text-text-muted text-sm italic">Latest Analysis Result</p>
                </div>
              </div>

              <div className="flex items-end gap-2 mb-4">
                <span className="text-5xl font-display font-black text-teal-500">74</span>
                <span className="text-xl font-bold text-text-muted mb-2">/ 100</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-6">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '74%' }}
                  transition={{ delay: 1.2, duration: 1.5 }}
                  className="h-full bg-teal-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]"
                />
              </div>
              
              <div className="flex justify-between items-center text-sm font-bold text-teal-500/80">
                <span>Healthy Soil</span>
                <div className="flex items-center gap-2">
                  <BarChart3 size={14} />
                  <span>Verified by AgriSense AI</span>
                </div>
              </div>
            </div>
            
            {/* Input Method Badges */}
            <div className="absolute -bottom-6 -left-12 -right-12 flex justify-center gap-3">
              {[
                { icon: Upload, label: 'PDF' },
                { icon: Scan, label: 'SCAN' },
                { icon: Keyboard, label: 'MANUAL' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + (i * 0.1) }}
                  className="px-4 py-2 rounded-xl glass border border-white/10 text-[10px] font-black text-white/50 tracking-widest flex items-center gap-2 shadow-lg hover:border-teal-500/30 hover:text-white transition-all cursor-default"
                >
                  <item.icon size={12} />
                  {item.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Reports Analysed', value: '12K+' },
            { label: 'Crops Recommended', value: '450+' },
            { label: 'Analysis Time', value: '2.4s' },
            { label: 'Fertilizer Saved', value: '30%' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl glass border border-white/5 text-center"
            >
              <div className="text-3xl font-display font-black text-white mb-1">{stat.value}</div>
              <div className="text-xs font-bold text-text-muted uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Designed for Impact</h2>
            <p className="text-text-muted max-w-xl mx-auto">Powerful agricultural intelligence meets human-centric design for the next billion farmers.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[32px] glass border border-white/5 relative group hover:border-teal-500/30 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl mb-8 flex items-center justify-center" style={{ background: `${feature.color}15` }}>
                  <feature.icon size={28} style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-text-muted leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32 px-4 bg-teal-500/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-display font-bold text-white mb-6">Simple 3-Step Process</h2>
            <p className="text-text-muted">From raw data to actionable intelligence in seconds.</p>
          </div>

          <div className="space-y-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-8 p-8 rounded-3xl glass border border-white/5 group hover:bg-white/5 transition-all"
              >
                <div className="text-4xl font-display font-black text-teal-500/40 group-hover:text-teal-500 transition-colors">
                  {step.id}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-text-muted">{step.desc}</p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full border border-teal-500/30 flex items-center justify-center">
                    <ChevronRight className="text-teal-500" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
