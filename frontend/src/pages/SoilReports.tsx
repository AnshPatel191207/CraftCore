import { useState, useCallback, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, History, Sparkles, LayoutDashboard, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useFarmStore, type SoilReport } from '../store/farmStore';
import { ScrollReveal } from '../components/ScrollReveal';
import { useLanguage } from '../components/ui/LanguageSwitcher';
import api from '../lib/api';

function ReportCard({ report, onAnalyze, onGoToDashboard, onDelete }: { 
  report: SoilReport; 
  onAnalyze: (id: string) => void; 
  onGoToDashboard: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const { t } = useLanguage();
  const { selectedReportId } = useFarmStore();
  const isAnalyzing = report.status === 'analyzing';
  const isDone = report.status === 'done' || report.status === 'complete';
  const isError = report.status === 'error';
  const reportId = report._id || report.id;
  const isActive = selectedReportId === reportId;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`glass-card rounded-[32px] p-6 border shadow-xl transition-all duration-500 overflow-hidden relative group cursor-pointer ${
        isActive ? 'ring-2 ring-teal-500 border-teal-500/50 bg-teal-500/5 shadow-teal-500/10' : isDone ? 'border-leaf-300' : isError ? 'border-red-200' : 'border-white/5'
      }`}
      onClick={() => isDone && !isActive && onGoToDashboard(reportId!)}
    >
      {/* Background Decor */}
      <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[40px] opacity-10 transition-colors ${isActive ? 'bg-teal-400' : isDone ? 'bg-leaf-500' : isAnalyzing ? 'bg-sun-500' : 'bg-teal-500'}`} />

      <div className="flex items-start justify-between relative z-10 gap-4">
        <div className="flex gap-4 min-w-0">
            <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
              isActive ? 'bg-teal-500 text-bg' : isDone ? 'bg-leaf-500 text-bg' : isAnalyzing ? 'bg-sun-500 text-bg animate-pulse' : 'bg-teal-500/10 text-teal-500 border border-teal-500/20'
            }`}>
              {isAnalyzing ? <Loader2 size={28} className="animate-spin" /> : (isDone || isActive) ? <CheckCircle size={28} /> : isError ? <AlertCircle size={28} /> : <FileText size={28} />}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-display font-black text-white group-hover:text-teal-500 transition-colors truncate" title={report.fileName}>{report.fileName}</h3>
              <div className="flex items-center gap-2 mt-1">
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/30 whitespace-nowrap">
                   {new Date(report.uploadDate || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                 </span>
                 <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
                 <span className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${isActive ? 'text-teal-400' : isDone ? 'text-leaf-500' : isAnalyzing ? 'text-sun-500' : isError ? 'text-danger' : 'text-teal-500'}`}>
                    {isActive ? 'SELECTED' : report.status.toUpperCase()}
                 </span>
              </div>
              {isActive && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 rounded-md shadow-sm">
                   <span className="w-1 h-1 rounded-full bg-teal-500 animate-pulse" />
                   <span className="text-[9px] font-black text-teal-500 uppercase tracking-widest">Currently Viewing</span>
                </div>
              )}
            </div>
        </div>

        <div className="flex gap-2 relative z-30 shrink-0">
            <button 
              title="View History"
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all shadow-lg active:scale-95"
            >
               <History size={16} />
            </button>
            <button 
              title="Delete Report"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Delete this report permanently?')) {
                  onDelete(reportId!);
                }
              }}
              className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/10 active:scale-95"
            >
               <Trash2 size={16} />
            </button>
        </div>
      </div>

      <div className="mt-8 space-y-4 relative z-10">
         <AnimatePresence mode="wait">
           {isAnalyzing ? (
             <motion.div 
               key="analyzing"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="py-4 space-y-3"
             >
                <div className="flex justify-between items-end mb-1">
                   <span className="text-[10px] font-black uppercase tracking-widest text-[#f9bd07]">{t('analyzing') || 'AI Extracting Metrics...'}</span>
                   <span className="text-xs font-black text-[#f9bd07] animate-pulse">85%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: '85%' }}
                     transition={{ duration: 2, repeat: Infinity }}
                     className="h-full bg-gradient-to-r from-[#f9bd07] to-[#ec4899] rounded-full"
                   />
                </div>
                <p className="text-[10px] text-white/30 font-bold italic">Simulating neural extraction for parameters: pH, N, P, K, moisture...</p>
             </motion.div>
           ) : isDone ? (
             <motion.div
               key="done"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex flex-col gap-3"
             >
                <div className="grid grid-cols-2 gap-3 pb-2 border-b border-white/5">
                                          <div className="p-3 bg-white/5 rounded-2xl border border-white/5">

                       <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Health Score</p>
                       <p className={`text-xl font-black leading-none ${isActive ? 'text-white' : 'text-leaf-500'}`}>{report.results?.healthScore || 0}%</p>
                    </div>

                   <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center">
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Status</p>
                      <div className="flex items-center justify-center gap-1.5">
                         <span className="text-xs font-black text-white tracking-widest uppercase">Verified</span>
                         <CheckCircle size={10} className="text-leaf-500" />
                      </div>
                   </div>
                </div>
                <button
                  onClick={() => onGoToDashboard(reportId!)}
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-[10px] flex items-center justify-center gap-2 group ${
                    isActive ? 'bg-teal-500 text-bg shadow-teal-500/20' : 'bg-leaf-600 text-bg shadow-leaf-600/20'
                  }`}
                >
                   <LayoutDashboard size={14} className="group-hover:rotate-12 transition-transform" />
                   {isActive ? 'Viewing Dashboard' : 'Go to Dashboard'}
                </button>
             </motion.div>
           ) : isError ? (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                 <p className="text-xs font-bold text-red-400">{report.errorMessage || 'Analysis failed. Please check file format.'}</p>
              </div>
           ) : (
             <motion.div
               key="uploaded"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="pt-2"
             >
                <button
                  onClick={() => onAnalyze(reportId!)}
                  className="w-full py-4 bg-white text-bg rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl bg-gradient-to-br from-white to-white/90 hover:scale-[1.02] active:scale-95 transition-all text-[10px] flex items-center justify-center gap-2 group"
                >
                   <Sparkles size={14} className="text-teal-500 group-hover:animate-spin" />
                   Analyze with AI
                </button>
             </motion.div>
           )}
         </AnimatePresence>
      </div>

      {isDone && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-leaf-500/20">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: '100%' }}
             transition={{ duration: 0.8 }}
             className={`h-full ${isActive ? 'bg-teal-500' : 'bg-leaf-500'}`}
           />
        </div>
      )}
    </motion.div>
  );
}

export default function SoilReports() {
  const { 
    soilReports, 
    addSoilReport, 
    updateSoilReport, 
    selectReport, 
    setActivePage, 
    setSoilReports,
    deleteSoilReport
  } = useFarmStore();
  const { t } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchReports = useCallback(async () => {
    try {
      const resp: any = await api.get('/soil-reports');
      if (resp?.data) {
        setSoilReports(resp.data.docs || resp.data);
      }
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    }
  }, [setSoilReports]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    setUploadProgress(10);
    
    // Simulate upload stages
    const timer = setInterval(() => {
       setUploadProgress(prev => Math.min(prev + 15, 90));
    }, 200);

    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);

    try {
      const response: any = await api.post('/soil-reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      clearInterval(timer);
      setUploadProgress(100);

      if (response && response.data) {
        const newReport = response.data.report;
        addSoilReport({
          ...newReport,
          status: 'uploaded', // Initialize as uploaded as per request
          uploadDate: new Date().toISOString()
        });
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      alert(err.response?.data?.message || 'Upload failed.');
    } finally {
       setTimeout(() => {
         setIsUploading(false);
         setUploadProgress(0);
       }, 500);
    }
  }, [addSoilReport]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg'] },
    disabled: isUploading
  });

  const handleAnalyze = async (id: string) => {
    updateSoilReport(id, { status: 'analyzing' });
    
    // Simulate complex AI analysis time
    setTimeout(async () => {
       await fetchReports();
       // Access store state directly to get updated data
       const currentReports = useFarmStore.getState().soilReports;
       const found = currentReports.find(r => (r._id === id || r.id === id));
       
       if (found && found.results) {
         updateSoilReport(id, { status: 'complete' });
       } else {
         updateSoilReport(id, { status: 'done' });
       }
    }, 3000);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/soil-reports/${id}`);
      deleteSoilReport(id);
    } catch (err) {
      console.error('Failed to delete report:', err);
    }
  };

  const handleGoToDashboard = (id: string) => {
    selectReport(id);
    setActivePage('dashboard');
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header with Stats Overview */}
      <ScrollReveal direction="down">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 glass rounded-[40px] p-10 border border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
              <History size={180} />
           </div>
           <div className="text-center md:text-left relative z-10">
              <h1 className="text-4xl font-display font-black text-white tracking-tight flex items-center gap-3">
                 <History className="text-teal-500" size={36} />
                 Multi-File Analysis Hub
              </h1>
              <p className="text-white/40 mt-3 font-bold max-w-lg text-lg leading-relaxed">
                 Manage multiple field reports independently. Each file creates a unique perspective for your dashboard.
              </p>
           </div>
           
           <div className="flex gap-4 relative z-10">
              <div className="glass px-6 py-4 rounded-3xl border border-white/5 text-center">
                 <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Reports</p>
                 <p className="text-3xl font-black text-white">{(soilReports || []).length}</p>
              </div>
              <div className="glass px-6 py-4 rounded-3xl border border-white/5 text-center">
                 <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Completed</p>
                 <p className="text-3xl font-black text-leaf-500">{soilReports.filter(r => r.status === 'done' || r.status === 'complete').length}</p>
              </div>
           </div>
        </div>
      </ScrollReveal>

      {/* Upload Zone */}
      <ScrollReveal direction="up" delay={0.1}>
        <div 
          {...getRootProps()}
          className={`relative rounded-[40px] border-2 border-dashed p-12 text-center transition-all duration-500 overflow-hidden group ${
            isDragActive ? 'border-teal-400 bg-teal-400/10 scale-[0.98]' : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
          } ${isUploading ? 'cursor-wait opacity-80' : 'cursor-pointer'}`}
        >
           <input {...getInputProps()} />
           {/* Background Decorative Image */}
           <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-all duration-700 group-hover:scale-110 pointer-events-none">
              <img src="/images/analysis_bg.png" alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-transparent to-bg/80" />
           </div>
           <div className="relative z-10 max-w-sm mx-auto">
              <div className="w-24 h-24 mx-auto rounded-[32px] bg-white text-bg flex items-center justify-center mb-6 shadow-2xl group transition-all group-hover:rotate-6">
                 {isUploading ? (
                   <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 scale-150 blur-xl bg-teal-500/30 opacity-50" />
                      <Loader2 className="animate-spin text-teal-600" size={40} />
                   </div>
                 ) : (
                    <Upload className={`${isDragActive ? 'text-teal-600 animate-bounce' : 'text-teal-600'}`} size={40} />
                 )}
              </div>
              <p className="text-2xl font-display font-black text-white mb-2 leading-tight">
                 {isUploading ? `Uploading ${uploadProgress}%` : t('uploadReport') || 'Upload Lab Report'}
              </p>
              <p className="text-sm text-white/40 font-bold mb-8">
                 Drag & drop your PDF or image here. New files will create independent analysis cards.
              </p>
              
              {isUploading && (
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-4 shadow-inner">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${uploadProgress}%` }}
                     className="h-full bg-teal-500"
                   />
                </div>
              )}

              <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-white/30">
                 <CheckCircle size={12} className="text-teal-500" />
                 Supports PDF, JPEG, PNG • Up to 10MB
              </div>
           </div>
        </div>
      </ScrollReveal>

      {/* Persistence Cards Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
           <h2 className="text-xl font-display font-black text-white flex items-center gap-3">
              Analysis Results 
              <span className="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center text-[10px] border border-teal-500/20">{(soilReports || []).length}</span>
           </h2>
           <button onClick={fetchReports} className="text-[10px] font-black uppercase tracking-widest text-teal-500 hover:text-teal-400 transition-colors flex items-center gap-2">
              <RefreshCw size={12} />
              Sync Cloud
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <AnimatePresence mode="popLayout">
             {(Array.isArray(soilReports) ? [...(soilReports || [])] : []).sort((a: any, b: any) => new Date(b.uploadDate || 0).getTime() - new Date(a.uploadDate || 0).getTime()).map((report) => (
               <ReportCard 
                 key={report._id || report.id} 
                 report={report} 
                 onAnalyze={handleAnalyze} 
                 onGoToDashboard={handleGoToDashboard} 
                 onDelete={handleDelete}
               />
             ))}
           </AnimatePresence>

           {(!Array.isArray(soilReports) || (soilReports || []).length === 0) && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="col-span-full py-20 text-center glass rounded-[40px] border border-white/5 border-dashed"
             >
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white/10">
                   <FileText size={48} />
                </div>
                <p className="font-display font-black text-xl text-white/20 uppercase tracking-widest leading-loose">
                   Your multi-file workspace is empty.<br />Upload a report to start AI modeling.
                </p>
             </motion.div>
           )}
        </div>
      </div>
    </div>
  );
}

function RefreshCw(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" 
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
