import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Bot, Sparkles } from 'lucide-react';
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
import SoilHealthAnalysis from './pages/SoilHealthAnalysis';
import MarketIntelligence from './pages/MarketIntelligence';
import Advisory from './pages/Advisory';
import Crops from './pages/Crops';
import Weather from './pages/Weather';
import SaveSoilAI from './pages/SaveSoilAI';
import FertilizerAdvisory from './pages/FertilizerAdvisory';
import Profile from './pages/Profile';

import { initSocket, disconnectSocket } from './lib/socket';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const MainAppContent = () => {
  const {
    activePage,
    isPanelOpen,
    setPanelOpen,
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    setActivePage,
  } = useFarmStore();

  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setActivePage('landing');
    setShowSplash(false);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'landing': return <Landing />;
      case 'dashboard': return <Dashboard />;
      case 'soil': return <SoilReports />;
      case 'soilhealth': return <SoilHealthAnalysis />;
      case 'market': return <MarketIntelligence />;
      case 'advisory': return <Advisory />;
      case 'crops': return <Crops />;
      case 'weather': return <Weather />;
      case 'savesoil': return <SaveSoilAI />;
      case 'fertilizer': return <FertilizerAdvisory />;
      case 'profile': return <Profile />;
      case 'login': return <Login />;
      case 'signup': return <Signup />;
      default: return <Landing />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" onComplete={handleSplashComplete} />
      ) : activePage === 'login' ? (
        <Login key="login" />
      ) : activePage === 'signup' ? (
        <Signup key="signup" />
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen bg-bg text-text selection:bg-teal-500 selection:text-white overflow-x-hidden"
        >
          {activePage !== 'landing' && <Topbar />}

          <main className={`${activePage !== 'landing' ? 'w-full' : 'ml-0'} min-h-screen transition-all duration-500 ease-spring relative z-10`}>
            <div className={`${activePage !== 'landing' ? 'max-w-6xl mx-auto p-4 md:p-6 lg:p-8 pt-20 lg:pt-24' : 'w-full'}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePage}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {renderPage()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          {activePage !== 'landing' && (
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
                      <Sparkles size={28} />
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
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const { checkAuth, isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated && token) initSocket(token);
    else disconnectSocket();
  }, [isAuthenticated, token]);

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/app/*"
            element={
              <ProtectedRoute>
                <MainAppContent />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LanguageProvider>
    </ErrorBoundary>
  );
}