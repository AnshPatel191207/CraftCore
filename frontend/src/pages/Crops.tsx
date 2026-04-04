import { 
  Sprout, 
  Calendar, 
  TrendingUp, 
  Ruler, 
  Upload, 
  Bug, 
  AlertCircle, 
  Leaf, 
  Activity,
  RefreshCcw,
  Search,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFarmStore } from '../store/farmStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useLanguage } from '../components/ui/LanguageSwitcher';
import { ScrollReveal } from '../components/ScrollReveal';
import { useState, useRef } from 'react';

const COLORS = ['#3a9140', '#f99b07', '#3b92f6', '#a47a55'];

export default function Crops() {
  const { 
    crops: storeCrops, 
    totalAcres: storeTotalAcres, 
    updateCrops, 
    updateTotalAcres 
  } = useFarmStore();
  
  // Local UI state for form 
  const [showForm, setShowForm] = useState(storeCrops.length === 0);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    totalLand: storeTotalAcres.toString(),
    usedLand: '',
    cropName: '',
    area: '',
    plantingDate: '',
    harvestDate: '',
    healthStatus: 'Good'
  });

  const { t } = useLanguage();

  const handleReset = () => {
    updateCrops([]);
    setShowForm(true);
  };

  const loadDummyData = () => {
    const originalCrops = [
      {
        name: "Corn (Maize)",
        area: 40,
        health: 95,
        stage: 'Growth Phase',
        plantedDate: "2024-01-10",
        expectedHarvest: "2024-04-10",
      },
      {
        name: "Winter Wheat",
        area: 30,
        health: 65,
        stage: 'Initial Phase',
        plantedDate: "2024-02-01",
        expectedHarvest: "2024-05-01",
      }
    ];
    updateCrops(originalCrops);
    setShowForm(false);
    setEditIndex(null);
  };

  const handleEdit = (index: number) => {
    const crop = storeCrops[index];
    setFormData({
      totalLand: storeTotalAcres.toString(),
      usedLand: crop.area.toString(),
      cropName: crop.name,
      area: crop.area.toString(),
      plantingDate: crop.plantedDate,
      harvestDate: crop.expectedHarvest,
      healthStatus: crop.health >= 80 ? 'Good' : crop.health >= 50 ? 'Moderate' : 'Poor'
    });
    setEditIndex(index);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const areaVal = Number(formData.area) || 0;
    const totalLandVal = Number(formData.totalLand) || storeTotalAcres;
    
    const newCrop = {
      name: formData.cropName,
      area: areaVal,
      health: formData.healthStatus === 'Good' ? 95 : formData.healthStatus === 'Moderate' ? 65 : 35,
      stage: 'Growth Phase',
      plantedDate: formData.plantingDate,
      expectedHarvest: formData.harvestDate
    };

    updateTotalAcres(totalLandVal);

    if (editIndex !== null) {
      const updated = [...storeCrops];
      updated[editIndex] = newCrop;
      updateCrops(updated);
      setEditIndex(null);
    } else {
      updateCrops([...storeCrops, newCrop]);
    }
    
    setShowForm(false);
  };

  // Logic to determine which data to use
  const displayTotalLand = Number(storeTotalAcres) || 0;
  const displayCrops = (storeCrops || []).map(c => ({
    ...c,
    area: Number(c.area) || 0,
    health: Number(c.health) || 0,
  }));

  const pieData = displayCrops.map((c) => ({ name: c.name, value: c.area }));
  const usedAcres = displayCrops.reduce((a, c) => a + c.area, 0);

  // --- Plant States ---
  const [plantImage, setPlantImage] = useState<File | null>(null);
  const [plantPreview, setPlantPreview] = useState<string | null>(null);
  const [plantLoading, setPlantLoading] = useState(false);
  const [plantResult, setPlantResult] = useState<any>(null);
  const [plantDisease, setPlantDisease] = useState<any>(null);
  const plantInputRef = useRef<HTMLInputElement>(null);

  // --- Crop States ---
  const [cropImage, setCropImage] = useState<File | null>(null);
  const [cropPreview, setCropPreview] = useState<string | null>(null);
  const [cropLoading, setCropLoading] = useState(false);
  const [cropResult, setCropResult] = useState<any>(null);
  const [cropDisease, setCropDisease] = useState<any>(null);
  const cropInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---
  const handlePlantUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPlantImage(file);
      setPlantPreview(URL.createObjectURL(file));
      setPlantResult(null);
      setPlantDisease(null);
    }
  };

  const handleCropUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCropImage(file);
      setCropPreview(URL.createObjectURL(file));
      setCropResult(null);
      setCropDisease(null);
    }
  };

  const analyzePlant = () => {
    if (!plantImage) {
      alert(t('analyzer.pleaseUpload'));
      return;
    }
    setPlantLoading(true);
    setTimeout(() => {
      setPlantResult({
        nameKey: "analyzer.mock.tomato",
        scientificName: "Solanum lycopersicum",
        confidence: "92%",
        descriptionKey: "analyzer.mock.tomatoDesc"
      });
      setPlantLoading(false);
    }, 1500);
  };

  const checkPlantDisease = () => {
    if (!plantImage) {
      alert(t('analyzer.pleaseUpload'));
      return;
    }
    setPlantLoading(true);
    setTimeout(() => {
      setPlantDisease({
        nameKey: "analyzer.mock.leafSpot",
        probability: "85%",
        reasonKey: "analyzer.mock.leafSpotReason",
        solutionKey: "analyzer.mock.leafSpotSolution"
      });
      setPlantLoading(false);
    }, 1800);
  };

  const analyzeCrop = () => {
    if (!cropImage) {
      alert(t('analyzer.pleaseUpload'));
      return;
    }
    setCropLoading(true);
    setTimeout(() => {
      setCropResult({
        nameKey: "analyzer.mock.wheat",
        scientificName: "Triticum aestivum",
        confidence: "95%",
        descriptionKey: "analyzer.mock.wheatDesc"
      });
      setCropLoading(false);
    }, 1500);
  };

  const checkCropDisease = () => {
    if (!cropImage) {
      alert(t('analyzer.pleaseUpload'));
      return;
    }
    setCropLoading(true);
    setTimeout(() => {
      setCropDisease({
        nameKey: "analyzer.mock.rust",
        probability: "78%",
        reasonKey: "analyzer.mock.rustReason",
        solutionKey: "analyzer.mock.rustSolution"
      });
      setCropLoading(false);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <ScrollReveal direction="down">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-[family-name:var(--font-display)] text-white">{t('myCropsTitle')}</h2>
            <p className="text-white/60 mt-1">{t('manageAndMonitor')}</p>
          </div>
          <div className="flex items-center gap-4">
             {storeCrops.length > 0 && (
               <button 
                 onClick={() => {
                   setEditIndex(null);
                   setFormData({ ...formData, cropName: '', area: '', plantingDate: '', harvestDate: '', healthStatus: 'Good' });
                   setShowForm(true);
                 }}
                 className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl text-[10px] font-black text-green-400 hover:bg-green-500/30 transition-all flex items-center gap-2"
               >
                 <Sprout size={14} />
                 Add New Crop
               </button>
             )}
             {storeCrops.length > 0 && (
               <button 
                 onClick={handleReset}
                 className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-black text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2"
               >
                 <RefreshCcw size={14} />
                 Reset All
               </button>
             )}
             <button 
               onClick={loadDummyData}
               className="px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-xl text-[10px] font-black text-teal-400 hover:bg-teal-500/20 transition-all flex items-center gap-2"
             >
               <Zap size={14} />
               Restore Defaults
             </button>
             <div className="text-right ml-4">
               <p className="text-sm text-white/40">{t('landUtilization')}</p>
               <p className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">{usedAcres}/{displayTotalLand} {t('acres')}</p>
             </div>
          </div>
        </div>
      </ScrollReveal>

      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-green-900/40 backdrop-blur-lg border border-green-700/30 rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl relative"
          >
            {storeCrops.length > 0 && (
              <button 
                onClick={() => setShowForm(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white"
              >
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest">Cancel</div>
              </button>
            )}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-500">
                <Sprout size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-display font-black text-white">{editIndex !== null ? 'Edit Crop Details' : 'Manual Crop Entry'}</h3>
                <p className="text-white/40 text-sm italic">{editIndex !== null ? 'Update your current crop information' : 'Enter your field details to start tracking'}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Land utilization */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-2">Total Land (Acres)</label>
                  <input 
                    type="number"
                    value={formData.totalLand}
                    onChange={(e) => setFormData({...formData, totalLand: e.target.value})}
                    placeholder="e.g. 120"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500/50 outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-2">Used Land (Acres)</label>
                  <input 
                    type="number"
                    value={formData.usedLand}
                    onChange={(e) => setFormData({...formData, usedLand: e.target.value})}
                    placeholder="e.g. 80"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500/50 outline-none transition-all"
                    required
                  />
                </div>

                {/* Crop details */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-2">Crop Name</label>
                  <input 
                    type="text"
                    value={formData.cropName}
                    onChange={(e) => setFormData({...formData, cropName: e.target.value})}
                    placeholder="e.g. Wheat"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500/50 outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-2">Area Used (Acres)</label>
                  <input 
                    type="number"
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                    placeholder="e.g. 40"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500/50 outline-none transition-all"
                    required
                  />
                </div>

                {/* Dates */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-2">Planting Date</label>
                  <input 
                    type="date"
                    value={formData.plantingDate}
                    onChange={(e) => setFormData({...formData, plantingDate: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-2">Harvest Date</label>
                  <input 
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => setFormData({...formData, harvestDate: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500/50 outline-none transition-all"
                  />
                </div>

                {/* Crop Health */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-2">Crop Health Status</label>
                  <select 
                    value={formData.healthStatus}
                    onChange={(e) => setFormData({...formData, healthStatus: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500/50 outline-none transition-all appearance-none"
                    required
                  >
                    <option value="Good" className="bg-green-950">Good 🟢</option>
                    <option value="Moderate" className="bg-green-950">Moderate 🟡</option>
                    <option value="Poor" className="bg-green-950">Poor 🔴</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-green-500 text-bg rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-green-500/20"
              >
                Save Crop Data
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Land Distribution */}
            <ScrollReveal direction="left" delay={0.1}>
              <div 
                className="rounded-2xl p-6 border border-white/10 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
                style={{ background: 'rgba(10, 40, 20, 0.6)' }}
              >
                <h3 className="font-[family-name:var(--font-display)] text-xl text-white mb-4">{t('landDistribution')}</h3>
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
                    {displayCrops.map((crop, i) => (
                      <div key={crop.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-sm text-white/70">{t('crop' + crop.name.split(' ')[0].replace(/\(.*\)/g, '')) || crop.name}</span>
                        <span className="text-sm font-semibold text-white ml-auto">{crop.area}{t('acres')}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-white/20" />
                      <span className="text-sm text-white/40">{t('unused')}</span>
                      <span className="text-sm font-semibold text-white/60 ml-auto">{displayTotalLand - usedAcres}{t('acres')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Crop Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayCrops.map((crop, i) => {
                const cropKey = 'crop' + crop.name.split(' ')[0];
                const stageKey = 'stage' + crop.stage.replace(/\s/g, '');
                
                // Health Color Logic
                const healthColor = crop.health >= 80 ? '#22c55e' : crop.health >= 50 ? '#eab308' : '#ef4444';

                return (
                  <ScrollReveal direction={i % 2 === 0 ? 'left' : 'right'} delay={0.1} key={crop.name}>
                    <div
                      className="rounded-2xl p-6 border border-white/10 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                      style={{ background: 'rgba(10, 40, 20, 0.9)' }}
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `${healthColor}20` }}>
                            <Sprout size={24} style={{ color: healthColor, filter: `drop-shadow(0 0 8px ${healthColor}60)` }} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white text-lg leading-tight mb-1">{t(cropKey) || crop.name}</h4>
                            <p className="text-xs text-white/50 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: healthColor }} />
                              {t('stage')}: {t(stageKey) || crop.stage}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold font-[family-name:var(--font-display)] tracking-tight text-white">
                            {crop.health}%
                          </p>
                          <p className="text-[10px] uppercase tracking-widest font-black text-white/40">{t('health')}</p>
                        </div>
                      </div>

                      {/* Health Bar */}
                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/30 px-0.5">
                           <span>{t('vitality')}</span>
                           <span style={{ color: healthColor }}>{crop.health}%</span>
                        </div>
                        <div className="h-2 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${crop.health}%` }}
                            transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                            className="h-full rounded-full shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                            style={{ background: healthColor, opacity: 1 }}
                          />
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="text-center p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                          <Ruler size={14} className="mx-auto mb-1.5 text-white/40" />
                          <p className="text-[10px] uppercase tracking-widest font-black text-white/30 mb-0.5">{t('area')}</p>
                          <p className="text-sm font-bold text-white leading-none">{crop.area} {t('acres')}</p>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                          <Calendar size={14} className="mx-auto mb-1.5 text-white/40" />
                          <p className="text-[10px] uppercase tracking-widest font-black text-white/30 mb-0.5">{t('planted')}</p>
                          <p className="text-sm font-bold text-white leading-none">
                            {crop.plantedDate ? new Date(crop.plantedDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short' }) : 'TBD'}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                          <TrendingUp size={14} className="mx-auto mb-1.5 text-white/40" />
                          <p className="text-[10px] uppercase tracking-widest font-black text-white/30 mb-0.5">{t('harvest')}</p>
                          <p className="text-sm font-bold text-white leading-none">
                            {crop.expectedHarvest ? new Date(crop.expectedHarvest).toLocaleDateString(undefined, { day: '2-digit', month: 'short' }) : 'TBD'}
                          </p>
                        </div>
                      </div>

                      {storeCrops.length > 0 && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(i)}
                            className="flex-1 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white hover:bg-white/10 transition-colors uppercase tracking-widest"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌿 Plant and Crop Analyzer Section */}
      <ScrollReveal direction="up" delay={0.2}>
        <div className="space-y-8 mt-12 bg-white/5 p-8 rounded-[32px] border border-white/10 backdrop-blur-xl">
          {/* Section Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <Sprout size={12} className="text-green-500" />
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">{t('analyzer.plantBadge')}</span>
            </div>
            <h2 className="text-3xl font-display font-black text-white">{t('analyzer.title')}</h2>
            <p className="text-white/50 max-w-2xl">{t('analyzer.sub')}</p>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {/* 1. Plant Analysis Card */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-bold text-white">{t('analyzer.plantTitle')}</h3>
                  <p className="text-sm text-white/40">{t('analyzer.plantSub')}</p>
                </div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{t('analyzer.supports')}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload & Actions */}
                <div 
                  className="p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center space-y-8"
                  style={{ background: 'rgba(10, 30, 20, 0.4)' }}
                >
                  <input 
                    type="file" 
                    ref={plantInputRef} 
                    onChange={handlePlantUpload} 
                    className="hidden" 
                    accept="image/*" 
                  />

                  <div 
                    onClick={() => plantInputRef.current?.click()}
                    className="relative w-full aspect-video rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer group hover:border-green-500/40 transition-all overflow-hidden"
                  >
                    {plantPreview ? (
                      <>
                        <img src={plantPreview} alt="Plant Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm">
                           <RefreshCcw size={32} className="text-white mb-2" />
                           <span className="text-xs font-black text-white uppercase tracking-widest">Change Image</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Upload size={32} className="text-green-500" />
                        </div>
                        <p className="text-xs font-black text-white uppercase tracking-widest mb-1">{t('analyzer.uploadPlant')}</p>
                        <p className="text-[10px] text-white/40 text-center max-w-[200px]">{t('analyzer.uploadDesc')}</p>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full">
                    <button 
                      onClick={analyzePlant}
                      disabled={plantLoading}
                      className="flex items-center justify-center gap-3 py-4 bg-green-600/20 border border-green-500/30 rounded-2xl text-green-400 font-bold text-xs uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      {plantLoading ? <RefreshCcw size={16} className="animate-spin" /> : <Search size={16} />}
                      {plantLoading ? t('analyzer.analyzing') : t('analyzer.analyzePlant')}
                    </button>
                    <button 
                      onClick={checkPlantDisease}
                      disabled={plantLoading}
                      className="flex items-center justify-center gap-3 py-4 bg-black/40 border border-white/10 rounded-2xl text-white/60 font-bold text-xs uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      {plantLoading ? <RefreshCcw size={16} className="animate-spin" /> : <Bug size={16} />}
                      {plantLoading ? t('analyzer.analyzing') : t('analyzer.checkPlantDisease')}
                    </button>
                  </div>
                </div>

                {/* Results Panel */}
                <div className="space-y-4">
                  {/* Identification Result */}
                  <div className="p-6 rounded-3xl border border-white/5 min-h-[160px]" style={{ background: 'rgba(10, 30, 20, 0.4)' }}>
                    <div className="flex items-center gap-2 mb-6">
                      <Sprout size={14} className="text-green-500" />
                      <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">{t('analyzer.plantResult')}</span>
                    </div>
                    
                    <AnimatePresence mode="wait">
                      {plantResult ? (
                        <motion.div 
                          key="result"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4"
                        >
                          <div>
                            <p className="text-2xl font-black text-white">{t(plantResult.nameKey)}</p>
                            <p className="text-sm text-white/40 italic">{plantResult.scientificName}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
                              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-0.5">{t('analyzer.confidence')}</p>
                              <p className="text-sm font-black text-green-500">{plantResult.confidence}</p>
                            </div>
                            <p className="text-xs text-white/60 leading-relaxed flex-1">{t(plantResult.descriptionKey)}</p>
                          </div>
                        </motion.div>
                      ) : (
                        <p className="text-sm text-white/20 font-bold italic">{t('analyzer.placeholderPlant')}</p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Disease Result */}
                  <div className="p-6 rounded-3xl border border-white/5 flex-1 min-h-[220px]" style={{ background: 'rgba(10, 30, 20, 0.4)' }}>
                    <div className="flex items-center gap-2 mb-6">
                      <Bug size={14} className="text-yellow-500" />
                      <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">{t('analyzer.plantDiseaseResult')}</span>
                    </div>

                    <AnimatePresence mode="wait">
                      {plantDisease ? (
                        <motion.div 
                          key="disease"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xl font-black text-white">{t(plantDisease.nameKey)}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="bg-red-500 w-1.5 h-1.5 rounded-full animate-pulse" />
                                <p className="text-xs font-black text-red-400 uppercase tracking-widest">{t('analyzer.probability')} {plantDisease.probability}</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            {/* Reason Card */}
                            <div className="flex gap-4 bg-green-900/40 backdrop-blur-lg border border-green-700/30 rounded-xl p-4">
                              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-500 shrink-0">
                                <AlertCircle size={20} />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{t('analyzer.reason')}</p>
                                <p className="text-xs font-bold text-white/90">{t(plantDisease.reasonKey)}</p>
                              </div>
                            </div>
                            
                            {/* Solution Card */}
                            <div className="flex gap-4 bg-green-900/40 backdrop-blur-lg border border-green-700/30 rounded-xl p-4">
                              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                                <Leaf size={20} />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{t('analyzer.solution')}</p>
                                <p className="text-xs font-bold text-white/90">{t(plantDisease.solutionKey)}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <p className="text-sm text-white/20 font-bold italic">{t('analyzer.placeholderPlantDisease')}</p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-white/5" />

            {/* 2. Crop Analysis Card */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-bold text-white">{t('analyzer.cropTitle')}</h3>
                  <p className="text-sm text-white/40">{t('analyzer.cropSub')}</p>
                </div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{t('analyzer.supports')}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload & Actions */}
                <div 
                  className="p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center space-y-8"
                  style={{ background: 'rgba(10, 30, 20, 0.4)' }}
                >
                  <input 
                    type="file" 
                    ref={cropInputRef} 
                    onChange={handleCropUpload} 
                    className="hidden" 
                    accept="image/*" 
                  />

                  <div 
                    onClick={() => cropInputRef.current?.click()}
                    className="relative w-full aspect-video rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer group hover:border-teal-500/40 transition-all overflow-hidden"
                  >
                    {cropPreview ? (
                      <>
                        <img src={cropPreview} alt="Crop Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm">
                           <RefreshCcw size={32} className="text-white mb-2" />
                           <span className="text-xs font-black text-white uppercase tracking-widest">Change Image</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Upload size={32} className="text-teal-500" />
                        </div>
                        <p className="text-xs font-black text-white uppercase tracking-widest mb-1">{t('analyzer.uploadCrop')}</p>
                        <p className="text-[10px] text-white/40 text-center max-w-[200px]">{t('analyzer.uploadDesc')}</p>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full">
                    <button 
                      onClick={analyzeCrop}
                      disabled={cropLoading}
                      className="flex items-center justify-center gap-3 py-4 bg-teal-600/20 border border-teal-500/30 rounded-2xl text-teal-400 font-bold text-xs uppercase tracking-widest hover:bg-teal-600 hover:text-white transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      {cropLoading ? <RefreshCcw size={16} className="animate-spin" /> : <Search size={16} />}
                      {cropLoading ? t('analyzer.analyzing') : t('analyzer.analyzeCrop')}
                    </button>
                    <button 
                      onClick={checkCropDisease}
                      disabled={cropLoading}
                      className="flex items-center justify-center gap-3 py-4 bg-black/40 border border-white/10 rounded-2xl text-white/60 font-bold text-xs uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      {cropLoading ? <RefreshCcw size={16} className="animate-spin" /> : <Bug size={16} />}
                      {cropLoading ? t('analyzer.analyzing') : t('analyzer.checkCropDisease')}
                    </button>
                  </div>
                </div>

                {/* Results Panel */}
                <div className="space-y-4">
                  {/* Identification Result */}
                  <div className="p-6 rounded-3xl border border-white/5 min-h-[160px]" style={{ background: 'rgba(10, 30, 20, 0.4)' }}>
                    <div className="flex items-center gap-2 mb-6">
                      <Zap size={14} className="text-teal-500" />
                      <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest">{t('analyzer.cropResult')}</span>
                    </div>
                    
                    <AnimatePresence mode="wait">
                      {cropResult ? (
                        <motion.div 
                          key="result"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4"
                        >
                          <div>
                            <p className="text-2xl font-black text-white">{t(cropResult.nameKey)}</p>
                            <p className="text-sm text-white/40 italic">{cropResult.scientificName}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
                              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-0.5">{t('analyzer.confidence')}</p>
                              <p className="text-sm font-black text-teal-500">{cropResult.confidence}</p>
                            </div>
                            <p className="text-xs text-white/60 leading-relaxed flex-1">{t(cropResult.descriptionKey)}</p>
                          </div>
                        </motion.div>
                      ) : (
                        <p className="text-sm text-white/20 font-bold italic">{t('analyzer.placeholderCrop')}</p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Disease Result */}
                  <div className="p-6 rounded-3xl border border-white/5 flex-1 min-h-[220px]" style={{ background: 'rgba(10, 30, 20, 0.4)' }}>
                    <div className="flex items-center gap-2 mb-6">
                      <Bug size={14} className="text-amber-500" />
                      <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{t('analyzer.cropDiseaseResult')}</span>
                    </div>

                    <AnimatePresence mode="wait">
                      {cropDisease ? (
                        <motion.div 
                          key="disease"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xl font-black text-white">{t(cropDisease.nameKey)}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="bg-amber-500 w-1.5 h-1.5 rounded-full animate-pulse" />
                                <p className="text-xs font-black text-amber-400 uppercase tracking-widest">{t('analyzer.probability')} {cropDisease.probability}</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            {/* Reason Card */}
                            <div className="flex gap-4 bg-green-900/40 backdrop-blur-lg border border-green-700/30 rounded-xl p-4">
                              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-500 shrink-0">
                                <AlertCircle size={20} />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{t('analyzer.reason')}</p>
                                <p className="text-xs font-bold text-white/90">{t(cropDisease.reasonKey)}</p>
                              </div>
                            </div>
                            
                            {/* Solution Card */}
                            <div className="flex gap-4 bg-green-900/40 backdrop-blur-lg border border-green-700/30 rounded-xl p-4">
                              <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-500 shrink-0">
                                <Activity size={20} />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{t('analyzer.solution')}</p>
                                <p className="text-xs font-bold text-white/90">{t(cropDisease.solutionKey)}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <p className="text-sm text-white/20 font-bold italic">{t('analyzer.placeholderCropDisease')}</p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
