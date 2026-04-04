import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  FlaskConical, 
  Droplet, 
  Leaf, 
  Zap, 
  TrendingUp, 
  Sprout,
  Wind,
  ShieldCheck,
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { fadeUp, staggerContainer } from '../lib/animations';
import { cn } from '../lib/utils';

// ─── Components ─────────────────────────────────────────────────────────────

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  icon: any;
  unit: string;
  placeholder: string;
  color: string;
}

function InputField({ label, value, onChange, icon: Icon, unit, placeholder, color }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">
        <Icon size={12} className={color} />
        {label}
      </label>
      <div className="relative group">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-surface-2 border border-white/5 rounded-2xl px-5 py-4 text-text font-bold focus:border-primary/50 outline-none transition-all group-hover:border-white/10"
        />
        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-text-muted uppercase transition-opacity opacity-40 group-hover:opacity-100">
          {unit}
        </span>
      </div>
    </div>
  );
}

function ResultCard({ title, value, status, icon: Icon, color }: any) {
  return (
    <motion.div 
      variants={fadeUp}
      className="p-6 rounded-3xl bg-surface-2 border border-white/5 hover:border-white/10 transition-all group"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all", color)}>
          <Icon size={24} />
        </div>
        <div className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest break-all", status === 'Optimal' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning')}>
          {status}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">{title}</p>
        <h3 className="text-2xl font-display font-black text-text tracking-tight">{value}</h3>
      </div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function SoilHealth() {
  const [inputs, setInputs] = useState({
    ph: '6.5',
    n: '140',
    p: '35',
    k: '180',
    moisture: '22'
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setShowResults(true);
    }, 1500);
  };

  const analysis = useMemo(() => {
    const phVal = parseFloat(inputs.ph);
    
    return {
      score: phVal > 6 && phVal < 7 ? 92 : 78,
      status: phVal > 6 && phVal < 7 ? 'Excellent' : 'Good',
      color: phVal > 6 && phVal < 7 ? 'var(--success)' : 'var(--warning)',
      recommendations: [
        { crop: 'Wheat', confidence: 98, period: '120 days' },
        { crop: 'Maize', confidence: 92, period: '110 days' },
        { crop: 'Soybean', confidence: 88, period: '95 days' }
      ],
      fertilizers: [
        { name: 'Urea', dosage: '45kg/acre', timing: 'Pre-planting' },
        { name: 'DAP', dosage: '50kg/acre', timing: 'At Sowing' }
      ]
    };
  }, [inputs]);

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto">
      {/* ── Hero Section ── */}
      <ScrollReveal direction="down">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-display font-black text-text tracking-tighter mb-4">
              Soil Wellness <span className="text-primary">Intelligence</span>
            </h1>
            <p className="text-lg text-text-muted font-medium leading-relaxed max-w-lg">
              Input your field data to unlock advanced AI analysis, crop suitability models, and precision fertilization protocols.
            </p>
          </div>
          <button 
            onClick={() => document.getElementById('input-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="group px-8 py-4 bg-white text-bg rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-[1.05] active:scale-95 shadow-2xl flex items-center gap-3 lg:mt-[-20px]"
          >
            Start Analysis
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </ScrollReveal>

      {/* ── Input Section ── */}
      <div id="input-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <ScrollReveal direction="left">
            <div className="p-8 rounded-[40px] glass border border-white/5 space-y-8 relative overflow-hidden backdrop-blur-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] -mr-16 -mt-16" />
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                  <ClipboardList size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-display font-black text-text">Data Entry</h2>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-0.5">Field measurements</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 relative z-10">
                <InputField label="Soil pH" value={inputs.ph} onChange={(v) => setInputs({...inputs, ph: v})} icon={Droplet} unit="pH" placeholder="6.5" color="text-amber-500" />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Nitrogen" value={inputs.n} onChange={(v) => setInputs({...inputs, n: v})} icon={Leaf} unit="kg/ha" placeholder="140" color="text-success" />
                  <InputField label="Phosphorus" value={inputs.p} onChange={(v) => setInputs({...inputs, p: v})} icon={FlaskConical} unit="kg/ha" placeholder="35" color="text-info" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Potassium" value={inputs.k} onChange={(v) => setInputs({...inputs, k: v})} icon={Activity} unit="kg/ha" placeholder="180" color="text-primary" />
                  <InputField label="Moisture" value={inputs.moisture} onChange={(v) => setInputs({...inputs, moisture: v})} icon={Droplet} unit="%" placeholder="22" color="text-info" />
                </div>
              </div>

              <button 
                onClick={handleAnalyze}
                disabled={analyzing}
                className={cn(
                  "w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all relative z-10 flex items-center justify-center gap-3",
                  analyzing ? "bg-white/5 text-text-muted" : "bg-primary text-bg hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20"
                )}
              >
                {analyzing ? <Activity className="animate-spin" size={20} /> : <Zap size={20} />}
                {analyzing ? 'Processing...' : 'Run Diagnostics'}
              </button>
            </div>
          </ScrollReveal>
        </div>

        {/* ── Results Section ── */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[500px] rounded-[40px] border border-dashed border-white/10 flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 relative">
                   <div className="absolute inset-0 rounded-full border border-white/5 animate-ping" />
                   <Activity size={40} className="text-text-muted opacity-20" />
                </div>
                <h3 className="text-2xl font-display font-black text-text-muted mb-4">Awaiting Data Input</h3>
                <p className="text-text-muted/40 max-w-xs mx-auto text-sm font-medium">
                  Enter your field measurements on the left to generate a comprehensive health profile.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                {/* Score Banner */}
                <div 
                  className="p-10 rounded-[40px] border relative overflow-hidden group shadow-2xl"
                  style={{ borderColor: 'var(--success-dim)', background: 'linear-gradient(135deg, var(--surface-2) 0%, rgba(0,0,0,0.4) 100%)' }}
                >
                  <div className="absolute -right-20 -top-20 w-80 h-80 bg-success/5 rounded-full blur-[100px]" />
                  
                  <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                     <div className="relative">
                        <svg width="140" height="140" viewBox="0 0 100 100">
                           <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                           <motion.circle 
                             cx="50" cy="50" r="45" fill="none" 
                             stroke="var(--success)" strokeWidth="8"
                             strokeDasharray="283"
                             initial={{ strokeDashoffset: 283 }}
                             animate={{ strokeDashoffset: 283 - (283 * analysis.score) / 100 }}
                             transition={{ duration: 2, ease: "circOut" }}
                             strokeLinecap="round"
                             transform="rotate(-90 50 50)"
                           />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <span className="text-3xl font-display font-black text-success">{analysis.score}%</span>
                        </div>
                     </div>
                     
                     <div className="flex-1 space-y-4 text-center md:text-left">
                        <div>
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-1">Health Index</p>
                          <h2 className="text-4xl font-display font-black text-text tracking-tight uppercase">
                            {analysis.status} Soil Profile
                          </h2>
                        </div>
                        <p className="text-sm text-text-muted font-medium bg-black/40 px-4 py-2 rounded-xl border border-white/5 inline-block">
                          Optimized for temperate grain production protocols.
                        </p>
                     </div>
                  </div>
                </div>

                {/* Sub Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ResultCard title="Nitrogen Balance" value={`${inputs.n} kg/ha`} status="Optimal" icon={Leaf} color="bg-success/10 text-success" />
                  <ResultCard title="pH Stability" value={`${inputs.ph} pH`} status="Sub-Optimal" icon={Droplet} color="bg-warning/10 text-warning" />
                  <ResultCard title="Energy Content" value="3.2% OC" status="Optimal" icon={Zap} color="bg-primary/10 text-primary" />
                </div>

                {/* Recommendations Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-display font-black text-text flex items-center gap-3">
                      <Sprout size={22} className="text-primary" />
                      Recommended Crops
                    </h3>
                    <div className="space-y-3">
                      {analysis.recommendations.map((crop, i) => (
                        <div key={i} className="group p-5 rounded-2xl glass border border-white/5 flex items-center justify-between hover:bg-white/5 hover:border-primary/20 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                              <Sprout size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-black text-text">{crop.crop}</p>
                              <p className="text-[10px] font-bold text-text-muted uppercase">{crop.period} cycle</p>
                            </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-black text-success">{crop.confidence}%</p>
                             <p className="text-[9px] font-bold text-text-muted uppercase">Confidence</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-display font-black text-text flex items-center gap-3">
                      <FlaskConical size={22} className="text-info" />
                      Fertilizer Protocol
                    </h3>
                    <div className="space-y-3">
                      {analysis.fertilizers.map((fert, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-black text-text">{fert.name}</p>
                            <span className="px-2 py-0.5 rounded-lg bg-info/10 text-info text-[9px] font-black uppercase tracking-widest border border-info/20">
                              {fert.timing}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
                            <TrendingUp size={14} className="text-info" />
                            Dosage: {fert.dosage}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sustainability Tips */}
                <div className="p-10 rounded-[40px] bg-white text-bg relative overflow-hidden">
                   <div className="absolute right-0 top-0 opacity-10 p-10 pointer-events-none">
                      <Wind size={120} />
                   </div>
                   <div className="relative z-10 space-y-10">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-bg flex items-center justify-center text-white">
                            <ShieldCheck size={28} />
                         </div>
                         <div>
                            <h3 className="text-2xl font-display font-black tracking-tight">Sustainability Advisor</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Preservation protocols</p>
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         <div className="space-y-2">
                            <h4 className="font-black text-lg">Crop Rotation</h4>
                            <p className="text-sm font-medium opacity-70 leading-relaxed italic">
                              "Switching between legumes and grains every cycle can naturally restore nitrogen up to 15% without chemicals."
                            </p>
                         </div>
                         <div className="space-y-2">
                            <h4 className="font-black text-lg">Mulching Efficiency</h4>
                            <p className="text-sm font-medium opacity-70 leading-relaxed italic">
                              "Apply organic mulch to retain 30% more moisture and regulate soil temperature during hot spells."
                            </p>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
