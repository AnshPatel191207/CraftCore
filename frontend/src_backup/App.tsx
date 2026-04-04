import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { Bot, AlertCircle, X, ArrowRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuthStore } from './store/authStore';
import { useFarmStore } from './store/farmStore';

import Topbar from './components/layout/Topbar';
import { SidePanel } from './components/ui/SidePanel';
import { CommandPalette } from './components/ui/CommandPalette';
import { VoiceAssistant } from './components/ui/VoiceAssistant';
import SplashScreen from './components/SplashScreen';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { LanguageProvider } from './components/ui/LanguageSwitcher';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import SoilReports from './pages/SoilReports';
import SoilHealth from './pages/SoilHealth';
import MarketIntelligence from './pages/MarketIntelligence';
import Advisory from './pages/Advisory';
import Crops from './pages/Crops';
import Weather from './pages/Weather';
import SaveSoilAI from './pages/SaveSoilAI';
import FertilizerAdvisory from './pages/FertilizerAdvisory';
import Profile from './pages/Profile';
import AuthCallback from './pages/AuthCallback';

import { initSocket, disconnectSocket } from './lib/socket';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  const { isDemoMode } = useFarmStore();
  return (isAuthenticated || isDemoMode) ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  const { isDemoMode } = useFarmStore();
  return (isAuthenticated || isDemoMode) ? <Navigate to="/app/dashboard" replace /> : <>{children}</>;
};

const MainAppLayout = () => {
  const {
    isPanelOpen,
    setPanelOpen,
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    isDemoMode,
    setDemoMode,
  } = useFarmStore();

  const location = useLocation();
  const isLanding = location.pathname === '/';
  const [showSplash, setShowSplash] = useState(true);
  const [showBanner, setShowBanner] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-bg text-text selection:bg-teal-500 selection:text-white overflow-x-hidden"
    >
      {!isLanding && <Topbar />}

      {isDemoMode && showBanner && !isLanding && (
        <div className="fixed top-16 left-0 right-0 z-50 px-4 pt-2">
          <div className="max-w-7xl mx-auto">
            <div className="bg-amber-500/10 border border-amber-500/20 backdrop-blur-md rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl shadow-amber-500/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-white leading-tight">
                    ⚡ Demo Mode Active
                  </p>
                  <p className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest mt-0.5">
                    Data is simulated. Create Account to save your real farm data.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => {
                    setDemoMode(false);
                    window.location.href = '/register';
                  }}
                  className="flex-1 md:flex-none px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-bg text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  Create Free Account
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => setShowBanner(false)}
                  className="p-2.5 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className={`${!isLanding ? 'w-full' : 'ml-0'} min-h-screen transition-all duration-500 ease-spring relative z-10`}>
        <div className={`${!isLanding ? 'max-w-7xl mx-auto p-4 md:p-6 lg:p-8 pt-24' : 'w-full'}`}>
          <Outlet />
        </div>
      </main>

      {!isLanding && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 20 }}
          className="fixed bottom-8 right-8 z-50 group"
        >
          <button
            onClick={() => setPanelOpen(!isPanelOpen)}
            className="relative w-16 h-16 rounded-[24px] bg-teal-500 shadow-2xl shadow-teal-500/50 flex items-center justify-center text-bg transition-all hover:scale-110 active:scale-95 hover:rotate-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <AnimatePresence mode="wait">
              {isPanelOpen ? (
                <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
                  <CheckCircle size={28} />
                </motion.div>
              ) : (
                <motion.div key="bot" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }}>
                  <Bot size={30} />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full border-[3px] border-bg flex items-center justify-center shadow-lg">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </div>
          </button>
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 glass border border-white/10 rounded-xl whitespace-nowrap text-[10px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-2xl">
            Ask AI Advisor
          </div>
        </motion.div>
      )}

      <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setCommandPaletteOpen} />
      <VoiceAssistant />
      <SidePanel isOpen={isPanelOpen} onClose={() => setPanelOpen(false)} />

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[200] mix-blend-overlay">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
    </motion.div>
  );
};

export default function App() {
  const { checkAuth, isAuthenticated, token, user } = useAuthStore();
  const { syncIdentity } = useFarmStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated && user) {
      syncIdentity(user);
    }
  }, [isAuthenticated, user, syncIdentity]);

  useEffect(() => {
    if (isAuthenticated && token) initSocket(token);
    else disconnectSocket();
  }, [isAuthenticated, token]);

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Routes>
          {/* Public Landing */}
          <Route path="/" element={<MainAppLayout />}>
            <Route index element={<Landing />} />
          </Route>

          {/* Auth: Public Only */}
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
          <Route path="/signup" element={<Navigate to="/register" replace />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Core App: Protected */}
          <Route path="/app" element={<ProtectedRoute><MainAppLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="soil" element={<SoilReports />} />
            <Route path="soilhealth" element={<SoilHealth />} />
            <Route path="market" element={<MarketIntelligence />} />
            <Route path="advisory" element={<Advisory />} />
            <Route path="crops" element={<Crops />} />
            <Route path="weather" element={<Weather />} />
            <Route path="savesoil" element={<SaveSoilAI />} />
            <Route path="fertilizer" element={<FertilizerAdvisory />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LanguageProvider>
    </ErrorBoundary>
  );
}