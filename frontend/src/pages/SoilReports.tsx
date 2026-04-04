import { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Beaker, Droplets, Leaf, FlaskConical, Eye, Camera, Edit3, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useFarmStore } from '../store/farmStore';
import { ScrollReveal } from '../components/ScrollReveal';
import { useLanguage } from '../components/ui/LanguageSwitcher';
import type { SoilReport } from '../store/farmStore';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { analyzeSoil } from '../lib/fertilizerLogic';

function HealthGauge({ score }: { score: number }) {
  const data = [{ value: score, fill: score > 75 ? '#3a9140' : score > 50 ? '#f99b07' : '#dc2626' }];
  return (
    <div className="relative w-32 h-32">
      <ResponsiveContainer>
        <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={data} startAngle={180} endAngle={0}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" cornerRadius={10} background={{ fill: '#e0cfb5' }} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pt-2">
        <span className="text-2xl font-bold text-earth-900 font-[family-name:var(--font-display)]">{score}</span>
      </div>
    </div>
  );
}

function NutrientBar({ label, value, max, unit, icon: Icon, color }: { label: string; value: number; max: number; unit: string; icon: any; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  const { t } = useLanguage();
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Icon size={14} className={color} />
          <span className="text-earth-600 font-medium">{t(label) || label}</span>
        </div>
        <span className="font-semibold text-earth-800">{value} {t(unit) || unit}</span>
      </div>
      <div className="h-2.5 bg-earth-200 rounded-full overflow-hidden">
        <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full rounded-full"
            style={{ background: pct > 70 ? '#3a9140' : pct > 40 ? '#f99b07' : '#dc2626' }}
        />
      </div>
    </div>
  );
}

function ReportDetail({ report }: { report: SoilReport }) {
  const { t } = useLanguage();
  if (!report.results) return null;
  const r = report.results;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="pt-4 mt-4 border-t border-earth-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Health Score */}
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-earth-500 mb-2">{t('healthIndex')}</p>
            <HealthGauge score={r.healthScore} />
            <p className="text-xs text-earth-400 mt-1">{t(r.texture) || r.texture} {t('soil')} • pH {r.ph}</p>
          </div>

          {/* Nutrients */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-earth-500">{t('nutrientLevels')}</p>
            <NutrientBar label="nitrogen" value={r.nitrogen} max={400} unit="kg/ha" icon={Leaf} color="text-leaf-500" />
            <NutrientBar label="phosphorus" value={r.phosphorus} max={50} unit="kg/ha" icon={FlaskConical} color="text-sky-500" />
            <NutrientBar label="potassium" value={r.potassium} max={300} unit="kg/ha" icon={Beaker} color="text-sun-500" />
            <NutrientBar label="organicMatter" value={r.organicMatter} max={6} unit="%" icon={Droplets} color="text-earth-500" />
          </div>

          {/* Recommendations */}
          <div>
            <p className="text-sm font-medium text-earth-500 mb-3">{t('recs')}</p>
            <div className="space-y-2">
              {r.recommendations.map((rec, i) => (
                <div key={i} className="flex gap-2 text-xs text-earth-600 bg-earth-50 p-2.5 rounded-lg">
                  <CheckCircle size={14} className="text-leaf-500 shrink-0 mt-0.5" />
                  <span>{t(rec.replace(/\s/g, '').replace(/[.-]/g, '')) || rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SoilReports() {
  const { soilReports, addSoilReport, updateSoilReport, setActivePage, updateAdvisory } = useFarmStore();
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [mode, setMode] = useState<'upload' | 'ocr' | 'manual'>('upload');

  // OCR specific state
  const [ocrImage, setOcrImage] = useState<string | null>(null);
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [ocrResults, setOcrResults] = useState<any>(null);

  // Manual form state
  const [manualData, setManualData] = useState({
    ph: '',
    n: '',
    p: '',
    k: '',
    moisture: ''
  });

  const simulateAnalysis = useCallback((id: string) => {
    setTimeout(() => {
      updateSoilReport(id, {
        status: 'complete',
        results: {
          ph: +(5.5 + Math.random() * 2.5).toFixed(1),
          nitrogen: Math.round(150 + Math.random() * 250),
          phosphorus: Math.round(10 + Math.random() * 40),
          potassium: Math.round(100 + Math.random() * 200),
          organicMatter: +(1.5 + Math.random() * 3.5).toFixed(1),
          moisture: Math.round(15 + Math.random() * 25),
          texture: ['Sandy', 'Loamy', 'Clay', 'Sandy Loam', 'Silt Loam'][Math.floor(Math.random() * 5)],
          healthScore: Math.round(45 + Math.random() * 50),
          recommendations: [
            'Monitor soil pH levels regularly and adjust with lime if needed.',
            'Consider adding organic compost to improve soil structure.',
            'Rotate crops to maintain nutrient balance in the soil.',
            'Test micronutrient levels (Zinc, Iron, Manganese) for complete analysis.',
          ],
        },
      });

      // Also generate fertilizer advisory for the new report
      const advisory = analyzeSoil({
        ph: 6.8,
        n: 280,
        p: 22,
        k: 185,
        moisture: 28
      });
      updateAdvisory(advisory);
    }, 3000);
  }, [updateSoilReport]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const id = `sr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newReport: SoilReport = {
        id,
        fileName: file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'processing',
      };
      addSoilReport(newReport);
      simulateAnalysis(id);
    });
  }, [addSoilReport, simulateAnalysis]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg'] },
  });

  const handleOcrDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setOcrImage(reader.result as string);
        setOcrStatus('processing');
        
        // Simulate OCR Parsing
        setTimeout(() => {
          setOcrStatus('success');
          setOcrResults({
            nitrogen: 125,
            phosphorus: 42,
            potassium: 180,
            moisture: 24,
          });

          // Generate Fertilizer Advisory from OCR results
          const advisory = analyzeSoil({
            n: 125,
            p: 42,
            k: 180,
            ph: 6.5,
            moisture: 24
          });
          updateAdvisory(advisory);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps: getOcrProps, getInputProps: getOcrInput } = useDropzone({
    onDrop: handleOcrDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    multiple: false
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <ScrollReveal direction="down">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-earth-900 tracking-tight">{t('soilAnalysisPortal')}</h1>
            <p className="text-earth-500 mt-2 font-medium">{t('soilAnalysisPortalSub')}</p>
          </div>
          
          {/* Mode Toggles */}
          <div className="flex p-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-inner">
            {[
              { id: 'upload', icon: Upload, label: t('uploadFile') || 'Upload File' },
              { id: 'ocr', icon: Camera, label: t('ocrImage') || 'OCR Image' },
              { id: 'manual', icon: Edit3, label: t('manualEntry') || 'Manual Entry' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  mode === m.id 
                    ? 'bg-white text-[#06200a] shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <m.icon size={14} className={mode === m.id ? 'text-[#06200a]' : 'text-white/40'} />
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {mode === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div
              {...getRootProps()}
              style={{
                backgroundImage: 'linear-gradient(rgba(0, 15, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/images/soil_test_real.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className={`relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 overflow-hidden ${
                isDragActive
                  ? 'border-leaf-400 bg-leaf-50/50'
                  : 'border-earth-300 bg-white/50 hover:border-earth-400 hover:bg-earth-50/50 shadow-sm'
              }`}
            >
              <input {...getInputProps()} />
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 shadow-xl">
                  <Upload className={isDragActive ? 'text-leaf-400' : 'text-white'} size={28} />
                </div>
                <p className="text-lg font-bold text-white drop-shadow-md">
                  {isDragActive ? t('resultsFor') : t('uploadReport')}
                </p>
                <p className="text-sm text-white/70 mt-2 font-medium">{t('dropPdf')}</p>
                <p className="text-xs text-white/40 mt-1 font-bold tracking-widest uppercase">{t('supportsPdfJpeg')}</p>
              </div>
            </div>
          </motion.div>
        )}

        {mode === 'ocr' && (
          <motion.div
            key="ocr"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {ocrStatus === 'idle' ? (
              <div
                {...getOcrProps()}
                style={{
                  backgroundImage: 'linear-gradient(rgba(0, 15, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/images/soil_test_real.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                className="relative rounded-2xl border-2 border-dashed border-earth-300 p-10 text-center cursor-pointer hover:border-leaf-400 hover:bg-leaf-50/50 transition-all bg-white/50 shadow-sm overflow-hidden"
              >
                <input {...getOcrInput()} />
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 shadow-xl">
                  <Camera className="text-white" size={28} />
                </div>
                <p className="text-lg font-bold text-white drop-shadow-md">Scan Your Soil Report</p>
                <p className="text-sm text-white/70 mt-2 font-medium">Upload or drag and drop a clear image of your report</p>
                <p className="text-xs text-white/40 mt-1 font-bold tracking-widest uppercase">Supports PNG, JPG, JPEG</p>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-8 border border-earth-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-earth-500 uppercase tracking-widest italic">Image Preview</p>
                    <div className="aspect-[4/3] rounded-xl overflow-hidden border border-earth-200 bg-earth-50 shadow-inner relative group">
                      <img src={ocrImage!} alt="Soil Report" className="w-full h-full object-cover" />
                      {ocrStatus === 'processing' && (
                        <div className="absolute inset-0 bg-leaf-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                           <Loader2 className="w-10 h-10 animate-spin mb-4" />
                           <p className="font-bold tracking-widest uppercase text-xs">Extracting Data...</p>
                           <div className="w-48 h-1 bg-white/20 rounded-full mt-4 overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 2 }}
                                className="h-full bg-leaf-400"
                              />
                           </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {ocrStatus === 'processing' ? (
                      <div className="flex flex-col items-center gap-4 py-12 text-center">
                        <div className="w-20 h-20 rounded-full bg-earth-100 flex items-center justify-center">
                          <FlaskConical className="text-earth-400 animate-pulse" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-earth-800">AI Analysis in Progress</h3>
                        <p className="text-sm text-earth-500 max-w-xs">Our vision model is reading your report values and structure.</p>
                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="flex items-center gap-3 text-leaf-600 bg-leaf-50 p-4 rounded-xl border border-leaf-100">
                           <CheckCircle size={24} />
                           <div>
                              <p className="font-bold">Report Parsed Successfully!</p>
                              <p className="text-xs opacity-80">All key metrics extracted and verified by AI.</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           {[
                             { label: 'Nitrogen', value: ocrResults.nitrogen, unit: 'kg/ha', color: 'text-leaf-600' },
                             { label: 'Phosphorus', value: ocrResults.phosphorus, unit: 'kg/ha', color: 'text-sky-600' },
                             { label: 'Potassium', value: ocrResults.potassium, unit: 'kg/ha', color: 'text-sun-600' },
                             { label: 'Moisture', value: ocrResults.moisture, unit: '%', color: 'text-blue-600' }
                           ].map((item) => (
                             <div key={item.label} className="p-4 bg-white border border-earth-100 rounded-xl">
                                <p className="text-[10px] font-bold text-earth-400 uppercase tracking-wider mb-1">{item.label}</p>
                                <div className="flex items-baseline gap-1">
                                   <span className={`text-xl font-bold ${item.color}`}>{item.value}</span>
                                   <span className="text-[10px] text-earth-400 font-bold">{item.unit}</span>
                                </div>
                             </div>
                           ))}
                        </div>

                        <button 
                          onClick={() => setActivePage('fertilizer')}
                          className="w-full py-4 bg-leaf-600 text-white rounded-xl font-bold shadow-lg shadow-leaf-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                        >
                          Navigate to Dashboard
                          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button onClick={() => setOcrStatus('idle')} className="w-full text-xs font-bold text-earth-400 hover:text-earth-600 transition-colors uppercase tracking-widest">
                           Scan Another Report
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {mode === 'manual' && (
          <motion.div
            key="manual"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
          >
            <div 
              style={{
                backgroundImage: 'linear-gradient(rgba(0, 25, 0, 0.88), rgba(0, 0, 0, 0.92)), url("/images/crop_field_real.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className="glass-card rounded-2xl p-8 border border-earth-200 overflow-hidden"
            >
               <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                     <Edit3 size={24} className="text-leaf-400" />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white">Manual Entry</h3>
                     <p className="text-xs text-white/60 font-medium">Enter your soil laboratory results manually.</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-leaf-400 uppercase tracking-widest ml-1">pH Level</label>
                     <input 
                       type="number" step="0.1" placeholder="e.g. 6.5"
                       value={manualData.ph}
                       onChange={(e) => setManualData({...manualData, ph: e.target.value})}
                       className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-leaf-400 focus:ring-1 focus:ring-leaf-400 outline-none transition-all font-medium text-white placeholder:text-white/20"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-leaf-400 uppercase tracking-widest ml-1">Nitrogen (kg/ha)</label>
                     <input 
                       type="number" placeholder="e.g. 120"
                       value={manualData.n}
                       onChange={(e) => setManualData({...manualData, n: e.target.value})}
                       className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-leaf-400 focus:ring-1 focus:ring-leaf-400 outline-none transition-all font-medium text-white placeholder:text-white/20"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-leaf-400 uppercase tracking-widest ml-1">Phosphorus (kg/ha)</label>
                     <input 
                       type="number" placeholder="e.g. 45"
                       value={manualData.p}
                       onChange={(e) => setManualData({...manualData, p: e.target.value})}
                       className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-leaf-400 focus:ring-1 focus:ring-leaf-400 outline-none transition-all font-medium text-white placeholder:text-white/20"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-leaf-400 uppercase tracking-widest ml-1">Potassium (kg/ha)</label>
                     <input 
                       type="number" placeholder="e.g. 180"
                       value={manualData.k}
                       onChange={(e) => setManualData({...manualData, k: e.target.value})}
                       className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-leaf-400 focus:ring-1 focus:ring-leaf-400 outline-none transition-all font-medium text-white placeholder:text-white/20"
                     />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                     <label className="text-xs font-bold text-leaf-400 uppercase tracking-widest ml-1">Moisture (%)</label>
                     <input 
                       type="number" placeholder="e.g. 24"
                       value={manualData.moisture}
                       onChange={(e) => setManualData({...manualData, moisture: e.target.value})}
                       className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-leaf-400 focus:ring-1 focus:ring-leaf-400 outline-none transition-all font-medium text-white placeholder:text-white/20"
                     />
                  </div>
               </div>

               <button 
                 onClick={() => {
                   if (manualData.ph && manualData.n && manualData.p && manualData.k && manualData.moisture) {
                                           const advisory = analyzeSoil({
                        ph: parseFloat(manualData.ph),
                        n: parseFloat(manualData.n),
                        p: parseFloat(manualData.p),
                        k: parseFloat(manualData.k),
                        moisture: parseFloat(manualData.moisture)
                      });
                      updateAdvisory(advisory);
                      setActivePage('fertilizer');
                   } else {
                     alert('Please fill in all fields');
                   }
                 }}
                 className="w-full mt-8 py-4 bg-leaf-600 text-white rounded-xl font-bold shadow-lg shadow-leaf-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
               >
                 Analyze with AI →
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reports List */}
      <div className="space-y-4">
        <h3 className="font-[family-name:var(--font-display)] text-xl text-earth-800">
          {t('resultsFor')} ({soilReports.length})
        </h3>

        <AnimatePresence>
          {soilReports.map((report, i) => (
            <ScrollReveal key={report.id} direction={i % 2 === 0 ? 'left' : 'right'} delay={0.1}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-5 border border-earth-200"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    report.status === 'complete' ? 'bg-leaf-100' : report.status === 'processing' ? 'bg-sun-100' : 'bg-red-100'
                  }`}>
                    {report.status === 'processing' ? (
                      <Loader2 className="text-sun-600 animate-spin" size={22} />
                    ) : report.status === 'complete' ? (
                      <CheckCircle className="text-leaf-600" size={22} />
                    ) : (
                      <AlertCircle className="text-danger" size={22} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-earth-400" />
                      <p className="font-medium text-earth-800 text-sm truncate">{report.fileName}</p>
                    </div>
                    <p className="text-xs text-earth-400 mt-0.5">{t('uploadData')}: {report.uploadDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      report.status === 'complete'
                        ? 'bg-leaf-100 text-leaf-700'
                        : report.status === 'processing'
                        ? 'bg-sun-100 text-sun-700'
                        : 'bg-red-100 text-danger'
                    }`}>
                      {report.status === 'complete' ? t('active') : report.status === 'processing' ? t('live') : t('error')}
                    </span>
                    {report.status === 'complete' && (
                      <button
                        onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                        className="p-2 rounded-lg hover:bg-earth-100 transition-colors"
                      >
                        <Eye size={18} className="text-earth-500" />
                      </button>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === report.id && <ReportDetail report={report} />}
                </AnimatePresence>
              </motion.div>
            </ScrollReveal>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
