import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, FileText, CheckCircle, AlertCircle, Loader2,
  Beaker, Droplets, Leaf, FlaskConical, Eye, Camera,
  Edit3, ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { ResponsiveContainer, RadialBarChart, PolarAngleAxis, RadialBar } from 'recharts';
import { useFarmStore } from '../store/farmStore';
import api from '../lib/axios';
import { cn } from '../lib/utils';
import { fadeUp, staggerContainer } from '../lib/animations';
import { ScrollReveal } from '../components/ScrollReveal';
import { useLanguage } from '../components/ui/LanguageSwitcher';
import { useInterval } from '../hooks/useInterval';
import { analyzeSoil } from '../lib/fertilizerLogic';
import type { SoilReport } from '../store/farmStore';


// ─── Health Gauge ─────────────────────────────────────────────────────────────

function HealthGauge({ score }: { score: number }) {
  const data = [{ value: score, fill: score > 75 ? '#11d1b1' : score > 50 ? '#f59e0b' : '#ef4444' }];
  return (
    <div className="relative w-32 h-32">
      <ResponsiveContainer>
        <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={data} startAngle={180} endAngle={0}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" cornerRadius={10} background={{ fill: 'var(--surface-3)' }} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pt-2">
        <span className="text-2xl font-black text-text font-display">{score}</span>
      </div>
    </div>
  );
}


// ─── Nutrient Bar ─────────────────────────────────────────────────────────────

function NutrientBar({
  label, value, max, unit, icon: Icon, color,
}: {
  label: string; value: number; max: number; unit: string; icon: any; color: string;
}) {
  const { t } = useLanguage();
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Icon size={14} className={color} />
          <span className="text-text-muted">{t(label) || label}</span>
        </div>
        <span className="text-text">{value} {t(unit) || unit}</span>
      </div>
      <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: pct > 70 ? '#11d1b1' : pct > 40 ? '#f59e0b' : '#ef4444' }}
        />
      </div>
    </div>
  );
}


// ─── Report Detail ────────────────────────────────────────────────────────────

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
      <div className="pt-8 mt-6 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Vitality index */}
          <div className="flex flex-col items-center p-6 rounded-3xl glass border border-white/5">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">{t('healthIndex')}</p>
            <HealthGauge score={r.healthScore} />
            <p className="text-xs font-bold mt-4 uppercase tracking-wider" style={{ color: 'var(--teal-500)' }}>
              {t(r.texture) || r.texture} {t('soil')}
            </p>
            <p className="text-[10px] font-black text-text-muted mt-1">pH {r.ph}</p>
          </div>

          {/* Chemical profile */}
          <div className="space-y-6">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">{t('nutrientLevels')}</p>
            <div className="space-y-5">
              <NutrientBar label="nitrogen"      value={r.nitrogen}      max={400} unit="kg/ha" icon={Leaf}        color="text-teal-500"   />
              <NutrientBar label="phosphorus"    value={r.phosphorus}    max={50}  unit="kg/ha" icon={FlaskConical} color="text-amber-500" />
              <NutrientBar label="potassium"     value={r.potassium}     max={300} unit="kg/ha" icon={Beaker}       color="text-teal-500"  />
              <NutrientBar label="organicMatter" value={r.organicMatter} max={6}   unit="%"     icon={Droplets}     color="text-text-muted" />
            </div>
          </div>

          {/* Protocol adjustments */}
          <div>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1 mb-4">{t('recs')}</p>
            <div className="space-y-3">
              {r.recommendations.map((rec, i) => (
                <div key={i} className="flex gap-3 text-xs font-bold text-text bg-surface-2 p-4 rounded-2xl border border-white/5">
                  <div className="w-5 h-5 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle size={12} className="text-teal-500" />
                  </div>
                  <span className="leading-relaxed">
                    {t(rec) || rec}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}


// ─── Shared dropzone background style ────────────────────────────────────────

const dropzoneBgStyle = {
  backgroundImage: 'linear-gradient(rgba(0,15,0,0.75), rgba(0,0,0,0.80)), url("/images/soil_test_real.png")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};


// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SoilReports() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const {
    soilReports,
    addSoilReport,
    updateSoilReport,
    isDemoMode,
    updateAdvisory,
    fetchDashboardData,
  } = useFarmStore();

  // Load backend data if not in demo mode
  useEffect(() => {
    if (!isDemoMode) {
      fetchDashboardData();
    }
  }, [isDemoMode, fetchDashboardData]);

  // Polling for processing reports
  const processingReports = soilReports.filter(r => r.status === 'processing');
  
  useInterval(() => {
    if (processingReports.length > 0 && !isDemoMode) {
      processingReports.forEach(async (report) => {
        try {
          const res = await api.get(`/soil-reports/${report.id}`);
          const updatedReport = res.data.data.report || res.data.data;
          if (updatedReport.status !== 'processing') {
            updateSoilReport(report.id, {
              status: updatedReport.status,
              results: updatedReport.results
            });
            
            // If completed, update advisory
            if (updatedReport.status === 'complete' && updatedReport.results) {
              const advisory = analyzeSoil({
                ph: updatedReport.results.ph,
                n: updatedReport.results.nitrogen,
                p: updatedReport.results.phosphorus,
                k: updatedReport.results.potassium,
                moisture: updatedReport.results.moisture
              });
              updateAdvisory(advisory);
            }
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      });
    }
  }, processingReports.length > 0 ? 5000 : null);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [uploading,  setUploading]  = useState(false);
  const [mode, setMode] = useState<'upload' | 'ocr' | 'manual'>('upload');

  // OCR state
  const [ocrImage,   setOcrImage]   = useState<string | null>(null);
  const [ocrStatus,  setOcrStatus]  = useState<'idle' | 'processing' | 'success'>('idle');
  const [ocrResults, setOcrResults] = useState<any>(null);

  // Manual form state
  const [manualData, setManualData] = useState({ ph: '', n: '', p: '', k: '', moisture: '' });


  // ── Demo simulation ──────────────────────────────────────────────────────
  const simulateAnalysis = useCallback((id: string) => {
    setTimeout(() => {
      const results = {
        ph:            +(5.5 + Math.random() * 2.5).toFixed(1),
        nitrogen:      Math.round(150 + Math.random() * 250),
        phosphorus:    Math.round(10  + Math.random() * 40),
        potassium:     Math.round(100 + Math.random() * 200),
        organicMatter: +(1.5 + Math.random() * 3.5).toFixed(1),
        moisture:      Math.round(15  + Math.random() * 25),
        texture: ['Sandy', 'Loamy', 'Clay', 'Sandy Loam', 'Silt Loam'][Math.floor(Math.random() * 5)],
        healthScore: Math.round(45 + Math.random() * 50),
        recommendations: [
          'Monitor soil pH levels regularly and adjust with lime if needed.',
          'Consider adding organic compost to improve soil structure.',
          'Rotate crops to maintain nutrient balance in the soil.',
          'Test micronutrient levels (Zinc, Iron, Manganese) for complete analysis.',
        ],
      };

      updateSoilReport(id, {
        status: 'complete',
        results,
      });

      const advisory = analyzeSoil({ 
        ph: results.ph, 
        n: results.nitrogen, 
        p: results.phosphorus, 
        k: results.potassium, 
        moisture: results.moisture 
      });
      updateAdvisory(advisory);
    }, 3000);
  }, [updateSoilReport, updateAdvisory]);


  // ── Upload dropzone ───────────────────────────────────────────────────────
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setUploading(true);

    for (const file of acceptedFiles) {
      const tempId = `sr-temp-${Date.now()}`;
      try {
        if (isDemoMode) {
          addSoilReport({
            id: tempId,
            fileName: file.name,
            uploadDate: new Date().toISOString().split('T')[0],
            status: 'processing',
          });
          simulateAnalysis(tempId);
        } else {
          const formData = new FormData();
          formData.append('file', file);
          const res = await api.post('/soil-reports', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          const newReport = res.data.data.report || res.data.data;
          addSoilReport({ 
            ...newReport, 
            id: newReport._id || newReport.id,
            status: newReport.status || 'processing' 
          });
        }
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }
    setUploading(false);
  }, [addSoilReport, simulateAnalysis, isDemoMode]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg'] },
    disabled: uploading,
  });


  // ── OCR dropzone ──────────────────────────────────────────────────────────
  const handleOcrDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setOcrImage(reader.result as string);
      setOcrStatus('processing');
      setTimeout(() => {
        setOcrStatus('success');
        const results = { nitrogen: 125, phosphorus: 42, potassium: 180, moisture: 24 };
        setOcrResults(results);
        const advisory = analyzeSoil({ n: results.nitrogen, p: results.phosphorus, k: results.potassium, ph: 6.5, moisture: results.moisture });
        updateAdvisory(advisory);
      }, 2000);
    };
    reader.readAsDataURL(file);
  }, [updateAdvisory]);

  const { getRootProps: getOcrProps, getInputProps: getOcrInput } = useDropzone({
    onDrop: handleOcrDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    multiple: false,
  });


  // ── Manual submit ─────────────────────────────────────────────────────────
  const handleManualSubmit = () => {
    const { ph, n, p, k, moisture } = manualData;
    if (!ph || !n || !p || !k || !moisture) {
      alert('Please fill in all fields');
      return;
    }
    const advisory = analyzeSoil({
      ph:       parseFloat(ph),
      n:        parseFloat(n),
      p:        parseFloat(p),
      k:        parseFloat(k),
      moisture: parseFloat(moisture),
    });
    updateAdvisory(advisory);
    navigate('/app/fertilizer');
  };


  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-20"
    >

      {/* ── Header + Mode Toggle ── */}
      <ScrollReveal direction="down">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <motion.div variants={fadeUp}>
            <h1 className="text-5xl font-display font-black text-text tracking-tighter mb-2">
              {t('soilAnalysisPortal') || 'Soil Intelligence'}
            </h1>
            <p className="text-text-muted font-bold uppercase tracking-[0.2em] text-[10px]">
              {t('soilAnalysisPortalSub') || 'Machine Learning Analysis • Field Optimization Protocols'}
            </p>
          </motion.div>

          {/* Mode Toggles */}
          <motion.div variants={fadeUp}>
            <div className="flex p-1 glass rounded-2xl border border-white/10 shadow-inner gap-1">
              {([
                { id: 'upload', icon: Upload,  label: t('uploadFile')   || 'Upload File'   },
                { id: 'ocr',    icon: Camera,  label: t('ocrImage')     || 'OCR Image'     },
                { id: 'manual', icon: Edit3,   label: t('manualEntry')  || 'Manual Entry'  },
              ] as const).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300',
                    mode === m.id
                      ? 'bg-teal-500 text-bg shadow-lg shadow-teal-500/20'
                      : 'text-text-muted hover:text-text hover:bg-white/5'
                  )}
                >
                  <m.icon size={13} />
                  {m.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </ScrollReveal>


      {/* ── Mode Panels ── */}
      <AnimatePresence mode="wait">

        {/* ── Upload Mode ── */}
        {mode === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div
              {...getRootProps()}
              style={dropzoneBgStyle}
              className={cn(
                'relative rounded-[40px] border-2 border-dashed p-16 text-center cursor-pointer transition-all duration-500 overflow-hidden group',
                isDragActive  ? 'border-teal-500 scale-[0.99]' : 'border-white/10 hover:border-white/20',
                uploading     && 'cursor-not-allowed opacity-70'
              )}
            >
              <input {...getInputProps()} />

              {/* Orbs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[80px] -mr-32 -mt-32 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 blur-[80px] -ml-32 -mb-32 pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className={cn(
                  'w-20 h-20 mx-auto rounded-3xl glass flex items-center justify-center transition-all duration-500 border',
                  'group-hover:scale-110 group-hover:rotate-3',
                  isDragActive ? 'border-teal-500 shadow-teal-500/20 shadow-2xl' : 'border-white/10'
                )}>
                  {uploading
                    ? <Loader2 className="text-teal-500 animate-spin" size={32} />
                    : <Upload className={isDragActive ? 'text-teal-500' : 'text-text-muted'} size={32} />
                  }
                </div>
                <div>
                  <p className="text-2xl font-display font-black text-text tracking-tight drop-shadow-md">
                    {isDragActive ? (t('resultsFor') || 'Release to Scan') : (t('uploadReport') || 'Initialize Soil Scan')}
                  </p>
                  <p className="text-sm font-bold text-text-muted mt-2">
                    {t('dropPdf') || 'Drag & drop field reports, or click to browse'}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-6 pt-2">
                  <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-widest bg-white/5 py-2 px-4 rounded-full border border-white/5">
                    <FileText size={12} className="text-teal-500" />
                    {t('pdfReports') || 'PDF Reports'}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-widest bg-white/5 py-2 px-4 rounded-full border border-white/5">
                    <Eye size={12} className="text-amber-500" />
                    {t('imageScans') || 'Image Scans'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}


        {/* ── OCR Mode ── */}
        {mode === 'ocr' && (
          <motion.div
            key="ocr"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {ocrStatus === 'idle' ? (
              <div
                {...getOcrProps()}
                style={dropzoneBgStyle}
                className="relative rounded-[40px] border-2 border-dashed border-white/10 p-16 text-center cursor-pointer hover:border-teal-500/40 transition-all overflow-hidden group"
              >
                <input {...getOcrInput()} />
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[80px] -mr-32 -mt-32 pointer-events-none" />
                <div className="relative z-10 space-y-6">
                  <div className="w-20 h-20 mx-auto rounded-3xl glass flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Camera className="text-text-muted group-hover:text-teal-500 transition-colors" size={32} />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-black text-text tracking-tight drop-shadow-md">Scan Your Report</p>
                    <p className="text-sm font-bold text-text-muted mt-2">Upload a clear photo of your soil lab report</p>
                    <p className="text-[10px] font-black text-text-muted/50 mt-2 uppercase tracking-widest">PNG · JPG · JPEG</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass rounded-[32px] p-8 border border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                  {/* Image preview */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Image Preview</p>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 bg-surface-2 relative">
                      <img src={ocrImage!} alt="Soil Report" className="w-full h-full object-cover" />
                      {ocrStatus === 'processing' && (
                        <div className="absolute inset-0 bg-bg/70 backdrop-blur-sm flex flex-col items-center justify-center">
                          <Loader2 className="w-10 h-10 animate-spin mb-4 text-teal-500" />
                          <p className="font-black tracking-widest uppercase text-xs text-text-muted">Extracting Data…</p>
                          <div className="w-48 h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 2 }}
                              className="h-full bg-teal-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Results panel */}
                  <div className="space-y-6">
                    {ocrStatus === 'processing' ? (
                      <div className="flex flex-col items-center gap-4 py-12 text-center">
                        <div className="w-20 h-20 rounded-3xl glass border border-white/5 flex items-center justify-center">
                          <FlaskConical className="text-teal-500 animate-pulse" size={32} />
                        </div>
                        <h3 className="text-xl font-display font-black text-text">AI Analysis in Progress</h3>
                        <p className="text-sm font-bold text-text-muted max-w-xs">
                          Our vision model is reading your report values and structure.
                        </p>
                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20">
                          <CheckCircle size={22} className="text-teal-500 shrink-0" />
                          <div>
                            <p className="font-black text-text text-sm">Report Parsed Successfully</p>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mt-0.5">
                              All key metrics extracted and verified by AI
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'Nitrogen',   value: ocrResults.nitrogen,   unit: 'kg/ha', color: 'text-teal-500'  },
                            { label: 'Phosphorus', value: ocrResults.phosphorus, unit: 'kg/ha', color: 'text-amber-500' },
                            { label: 'Potassium',  value: ocrResults.potassium,  unit: 'kg/ha', color: 'text-teal-500'  },
                            { label: 'Moisture',   value: ocrResults.moisture,   unit: '%',     color: 'text-sky-400'   },
                          ].map((item) => (
                            <div key={item.label} className="p-4 glass border border-white/5 rounded-2xl">
                              <p className="text-[9px] font-black text-text-muted uppercase tracking-wider mb-1">{item.label}</p>
                              <div className="flex items-baseline gap-1">
                                <span className={cn('text-xl font-black font-display', item.color)}>{item.value}</span>
                                <span className="text-[10px] font-bold text-text-muted">{item.unit}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => navigate('/app/fertilizer')}
                          className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-95"
                          style={{ background: 'var(--teal-500)', color: 'var(--bg)', boxShadow: '0 8px 32px rgba(var(--teal-rgb,20 184 166)/0.25)' }}
                        >
                          View Fertilizer Advisory
                          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                          onClick={() => { setOcrStatus('idle'); setOcrImage(null); setOcrResults(null); }}
                          className="w-full text-[10px] font-black text-text-muted hover:text-text transition-colors uppercase tracking-widest"
                        >
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


        {/* ── Manual Mode ── */}
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
                backgroundImage: 'linear-gradient(rgba(0,25,0,0.90), rgba(0,0,0,0.92)), url("/images/crop_field_real.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className="glass rounded-[32px] p-8 border border-white/5 overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center">
                  <Edit3 size={22} className="text-teal-500" />
                </div>
                <div>
                  <h3 className="font-display font-black text-text text-xl">{t('manualEntry') || 'Manual Entry'}</h3>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-0.5">
                    {t('manualEntrySub') || 'Enter your soil laboratory results'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                {([
                  { key: 'ph',       label: t('phLevel') || 'pH Level',            placeholder: 'e.g. 6.5',  type: 'number', step: '0.1' },
                  { key: 'n',        label: t('nitrogen') || 'Nitrogen (kg/ha)',     placeholder: 'e.g. 120',  type: 'number' },
                  { key: 'p',        label: t('phosphorus') || 'Phosphorus (kg/ha)',   placeholder: 'e.g. 45',   type: 'number' },
                  { key: 'k',        label: t('potassium') || 'Potassium (kg/ha)',    placeholder: 'e.g. 180',  type: 'number' },
                ] as const).map((f) => (
                  <div key={f.key} className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: 'var(--teal-500)' }}>
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      step={(f as any).step}
                      placeholder={f.placeholder}
                      value={manualData[f.key]}
                      onChange={(e) => setManualData({ ...manualData, [f.key]: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/10 outline-none transition-all font-bold text-text placeholder:text-text-faint/40"
                    />
                  </div>
                ))}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: 'var(--teal-500)' }}>
                    {t('moisture') || 'Moisture (%)'}
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 24"
                    value={manualData.moisture}
                    onChange={(e) => setManualData({ ...manualData, moisture: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/10 outline-none transition-all font-bold text-text placeholder:text-text-faint/40"
                  />
                </div>
              </div>

              <button
                onClick={handleManualSubmit}
                className="w-full mt-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-95 relative z-10"
                style={{ background: 'var(--teal-500)', color: 'var(--bg)', boxShadow: '0 8px 32px rgba(var(--teal-rgb,20 184 166)/0.25)' }}
              >
                {t('analyzeWithAI') || 'Analyze with AI'}
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>


      {/* ── Reports Archive ── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">
            {t('resultsFor') || 'System Archive'} • {soilReports.length} {t('analyses') || 'Analyses'}
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--teal-500)' }}>
              Real-time Sync Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {soilReports.map((report, i) => (
              <ScrollReveal key={report.id} direction={i % 2 === 0 ? 'left' : 'right'} delay={0.05}>
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-[32px] p-6 border border-white/5 hover:border-white/10 transition-all group overflow-hidden relative"
                >
                  <div className="flex items-center gap-6 relative z-10">

                    {/* Status icon */}
                    <div className={cn(
                      'w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-colors',
                      report.status === 'complete'   ? 'bg-teal-500/10  text-teal-500'  :
                      report.status === 'processing' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-red-500/10 text-red-500'
                    )}>
                      {report.status === 'processing'
                        ? <Loader2 className="animate-spin" size={24} />
                        : report.status === 'complete'
                        ? <FileText size={24} />
                        : <AlertCircle size={24} />
                      }
                    </div>

                    {/* File info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-display font-black text-text tracking-tight uppercase truncate">
                          {report.fileName}
                        </p>
                        <span className={cn(
                          'text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border shrink-0',
                          report.status === 'complete'   ? 'bg-teal-500/10  text-teal-500  border-teal-500/20'  :
                          report.status === 'processing' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          'bg-red-500/10 text-red-500 border-red-500/20'
                        )}>
                          {report.status === 'complete'
                            ? t('active')
                            : report.status === 'processing'
                            ? t('live')
                            : t('error')
                          }
                        </span>
                      </div>
                      <p className="text-[10px] font-black text-text-muted mt-1 uppercase tracking-widest">
                        {t('uploadData') || 'Scanned'}: {report.uploadDate}
                      </p>
                    </div>

                    {/* Expand toggle */}
                    {report.status === 'complete' && (
                      <button
                        onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                        className={cn(
                          'flex items-center gap-2 pl-4 pr-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all',
                          expandedId === report.id
                            ? 'bg-teal-500 text-bg'
                            : 'bg-white/5 text-text-muted hover:bg-white/10 hover:text-text'
                        )}
                      >
                        {expandedId === report.id ? (t('closeScan') || 'Close Scan') : (t('viewProtocol') || 'View Protocol')}
                        <ChevronRight
                          size={14}
                          className={cn('transition-transform', expandedId === report.id && 'rotate-90')}
                        />
                      </button>
                    )}
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

    </motion.div>
  );
}