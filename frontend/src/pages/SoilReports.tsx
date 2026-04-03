import { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Beaker, Droplets, Leaf, FlaskConical, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useFarmStore } from '../store/farmStore';
import type { SoilReport } from '../store/farmStore';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

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
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Icon size={14} className={color} />
          <span className="text-earth-600 font-medium">{label}</span>
        </div>
        <span className="font-semibold text-earth-800">{value} {unit}</span>
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
            <p className="text-sm font-medium text-earth-500 mb-2">Soil Health Score</p>
            <HealthGauge score={r.healthScore} />
            <p className="text-xs text-earth-400 mt-1">{r.texture} Soil • pH {r.ph}</p>
          </div>

          {/* Nutrients */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-earth-500">Nutrient Levels</p>
            <NutrientBar label="Nitrogen (N)" value={r.nitrogen} max={400} unit="kg/ha" icon={Leaf} color="text-leaf-500" />
            <NutrientBar label="Phosphorus (P)" value={r.phosphorus} max={50} unit="kg/ha" icon={FlaskConical} color="text-sky-500" />
            <NutrientBar label="Potassium (K)" value={r.potassium} max={300} unit="kg/ha" icon={Beaker} color="text-sun-500" />
            <NutrientBar label="Organic Matter" value={r.organicMatter} max={6} unit="%" icon={Droplets} color="text-earth-500" />
          </div>

          {/* Recommendations */}
          <div>
            <p className="text-sm font-medium text-earth-500 mb-3">Recommendations</p>
            <div className="space-y-2">
              {r.recommendations.map((rec, i) => (
                <div key={i} className="flex gap-2 text-xs text-earth-600 bg-earth-50 p-2.5 rounded-lg">
                  <CheckCircle size={14} className="text-leaf-500 shrink-0 mt-0.5" />
                  <span>{rec}</span>
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
  const { soilReports, addSoilReport, updateSoilReport } = useFarmStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-[family-name:var(--font-display)] text-earth-900">Soil Reports</h2>
        <p className="text-earth-500 mt-1">Upload soil test reports for AI-powered analysis and recommendations</p>
      </div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          {...getRootProps()}
          className={`relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-leaf-400 bg-leaf-50/50'
              : 'border-earth-300 bg-white/50 hover:border-earth-400 hover:bg-earth-50/50'
          }`}
        >
        <input {...getInputProps()} />
        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-earth-100 flex items-center justify-center mb-4">
            <Upload className={isDragActive ? 'text-leaf-500' : 'text-earth-500'} size={28} />
          </div>
          <p className="text-lg font-medium text-earth-700">
            {isDragActive ? 'Drop your soil report here...' : 'Upload Soil Test Report'}
          </p>
          <p className="text-sm text-earth-400 mt-2">Drag & drop PDF or image files, or click to browse</p>
          <p className="text-xs text-earth-300 mt-1">Supports: PDF, PNG, JPG • Max 10MB</p>
        </div>
        <img
          src="/images/soil-texture.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-5"
        />
        </div>
      </motion.div>

      {/* Reports List */}
      <div className="space-y-4">
        <h3 className="font-[family-name:var(--font-display)] text-xl text-earth-800">
          Analysis Results ({soilReports.length})
        </h3>

        <AnimatePresence>
          {soilReports.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
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
                  <p className="text-xs text-earth-400 mt-0.5">Uploaded: {report.uploadDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    report.status === 'complete'
                      ? 'bg-leaf-100 text-leaf-700'
                      : report.status === 'processing'
                      ? 'bg-sun-100 text-sun-700'
                      : 'bg-red-100 text-danger'
                  }`}>
                    {report.status === 'complete' ? 'Analysis Complete' : report.status === 'processing' ? 'Processing...' : 'Error'}
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
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
