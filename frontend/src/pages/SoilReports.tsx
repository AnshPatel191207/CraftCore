import { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Beaker, Droplets, Leaf, FlaskConical, Eye, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { ResponsiveContainer, RadialBarChart, PolarAngleAxis, RadialBar } from 'recharts';
import { useFarmStore } from '../store/farmStore';
import api from '../lib/axios';
import { cn } from '../lib/utils';
import { fadeUp } from '../lib/animations';
import type { SoilReport } from '../store/farmStore';


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

function NutrientBar({ label, value, max, unit, icon: Icon, color }: { label: string; value: number; max: number; unit: string; icon: any; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Icon size={14} className={color} />
          <span className="text-text-muted">{label}</span>
        </div>
        <span className="text-text">{value} {unit}</span>
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

function ReportDetail({ report }: { report: SoilReport }) {
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
          {/* Health Score */}
          <div className="flex flex-col items-center p-6 rounded-3xl glass border border-white/5">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Vitality Index</p>
            <HealthGauge score={r.healthScore} />
            <p className="text-xs font-bold text-teal-500 mt-4 uppercase tracking-wider">{r.texture} Composition</p>
            <p className="text-[10px] font-black text-text-muted mt-1">Scentific pH: {r.ph}</p>
          </div>

          {/* Nutrients */}
          <div className="space-y-6">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Chemical Profile</p>
            <div className="space-y-5">
              <NutrientBar label="Nitrogen (N)" value={r.nitrogen} max={400} unit="kg/ac" icon={Leaf} color="text-teal-500" />
              <NutrientBar label="Phosphorus (P)" value={r.phosphorus} max={50} unit="kg/ac" icon={FlaskConical} color="text-amber-500" />
              <NutrientBar label="Potassium (K)" value={r.potassium} max={300} unit="kg/ac" icon={Beaker} color="text-teal-500" />
              <NutrientBar label="Organic Matter" value={r.organicMatter} max={6} unit="%" icon={Droplets} color="text-text-muted" />
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1 mb-4">Protocol Adjustments</p>
            <div className="space-y-3">
              {r.recommendations.map((rec, i) => (
                <div key={i} className="flex gap-3 text-xs font-bold text-text bg-surface-2 p-4 rounded-2xl border border-white/5">
                  <div className="w-5 h-5 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle size={12} className="text-teal-500" />
                  </div>
                  <span className="leading-relaxed">{rec}</span>
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
  const { soilReports, addSoilReport, updateSoilReport, isDemoMode } = useFarmStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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
          ],
        },
      });
    }, 3000);
  }, [updateSoilReport]);

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
            status: 'processing'
          });
          simulateAnalysis(tempId);
        } else {
          const formData = new FormData();
          formData.append('file', file);
          const res = await api.post('/soil-reports', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          addSoilReport(res.data.data);
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
    disabled: uploading
  });

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-5xl font-display font-black text-text tracking-tighter mb-4">Soil Intelligence</h1>
        <p className="text-text-muted font-bold uppercase tracking-[0.2em] text-[10px]">Machine Learning Analysis • Field Optimization Protocols</p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <div
          {...getRootProps()}
          className={cn(
            "relative rounded-[40px] border-2 border-dashed p-16 text-center cursor-pointer transition-all duration-500 overflow-hidden group",
            isDragActive
              ? "border-teal-500 bg-teal-500/5 scale-[0.99]"
              : "border-white/10 bg-surface-2 hover:border-white/20 hover:bg-surface-3"
          )}
        >
          <input {...getInputProps()} />
          
          {/* Decorative background orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[80px] -mr-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 blur-[80px] -ml-32 -mb-32 pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className={cn(
              "w-20 h-20 mx-auto rounded-3xl glass flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
              isDragActive ? "border-teal-500 shadow-teal-500/20 shadow-2xl" : "border-white/10"
            )}>
              {uploading ? (
                <Loader2 className="text-teal-500 animate-spin" size={32} />
              ) : (
                <Upload className={isDragActive ? 'text-teal-500' : 'text-text-muted'} size={32} />
              )}
            </div>
            <div>
              <p className="text-2xl font-display font-black text-text tracking-tight">
                {isDragActive ? 'Release to Scan' : 'Initialize Soil Scan'}
              </p>
              <p className="text-sm font-bold text-text-muted mt-2">
                Drag & drop field reports, or click to browse system
              </p>
            </div>
            <div className="flex items-center justify-center gap-6 pt-4">
               <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-widest bg-white/5 py-2 px-4 rounded-full border border-white/5">
                  <FileText size={12} className="text-teal-500" />
                  PDF Reports
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-widest bg-white/5 py-2 px-4 rounded-full border border-white/5">
                  <Eye size={12} className="text-amber-500" />
                  Image Scans
               </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reports List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">
             System Archive • {soilReports.length} Analyses
           </h3>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-[9px] font-black text-teal-500 uppercase tracking-widest">Real-time Sync Active</span>
           </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {soilReports.map((report, i) => (
              <motion.div
                key={report.id}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-[32px] p-6 border border-white/5 hover:border-white/10 transition-all group overflow-hidden relative"
              >
                <div className="flex items-center gap-6 relative z-10">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors shadow-xl",
                    report.status === 'complete' ? 'bg-teal-500/10 text-teal-500' : 
                    report.status === 'processing' ? 'bg-amber-500/10 text-amber-500' : 'bg-error/10 text-error'
                  )}>
                    {report.status === 'processing' ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : report.status === 'complete' ? (
                      <FileText size={24} />
                    ) : (
                      <AlertCircle size={24} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <p className="font-display font-black text-text tracking-tight uppercase">{report.fileName}</p>
                      <span className={cn(
                        "text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border",
                        report.status === 'complete' ? 'bg-teal-500/10 text-teal-500 border-teal-500/20' : 
                        report.status === 'processing' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                      )}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-[10px] font-black text-text-muted mt-1 uppercase tracking-widest">Scanned: {report.uploadDate}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {report.status === 'complete' && (
                      <button
                        onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                        className={cn(
                          "flex items-center gap-2 pl-4 pr-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          expandedId === report.id ? "bg-teal-500 text-bg" : "bg-white/5 text-text-muted hover:bg-white/10 hover:text-text"
                        )}
                      >
                        {expandedId === report.id ? 'Close Scan' : 'View Protocol'}
                        <ChevronRight size={14} className={cn("transition-transform", expandedId === report.id && "rotate-90")} />
                      </button>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === report.id && <ReportDetail report={report} />}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

