import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Bot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Stores
import { useAuthStore } from './store/authStore';
import { useFarmStore } from './store/farmStore';

// Layout & Components
import Topbar from './components/layout/Topbar';
import { SidePanel } from './components/ui/SidePanel';
import { CommandPalette } from './components/ui/CommandPalette';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SoilReports from './pages/SoilReports';
import Advisory from './pages/Advisory';
import Crops from './pages/Crops';
import Weather from './pages/Weather';

// Socket
import { initSocket, disconnectSocket } from './lib/socket';

// ─── Auth Guard ───────────────────────────────────────────
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// ─── Main App Layout (authenticated) ─────────────────────
const MainAppContent = () => {
  const {
    activePage,
    isPanelOpen, setPanelOpen,
    isCommandPaletteOpen, setCommandPaletteOpen,
  } = useFarmStore();

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'soil':      return <SoilReports />;
      case 'advisory':  return <Advisory />;
      case 'crops':     return <Crops />;
      case 'weather':   return <Weather />;
      default:          return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-teal-500 selection:text-white overflow-x-hidden">
      <Topbar />

      <main className="w-full min-h-screen transition-all duration-500 ease-spring relative z-10">
        <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 pt-20 lg:pt-24">
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

      {/* Premium FAB — AI Advisor Toggle */}
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

          {/* Status dot */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full border-[3px] border-bg flex items-center justify-center shadow-lg">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          </div>
        </button>

        {/* Tooltip */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 glass border border-white/10 rounded-xl whitespace-nowrap text-[10px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-2xl">
          Ask AI Advisor
        </div>
      </motion.div>

      <SidePanel isOpen={isPanelOpen} onClose={() => setPanelOpen(false)} />
      <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setCommandPaletteOpen} />

      {/* Background noise texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[200] mix-blend-overlay">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
    </div>
  );
};

// ─── Root App ─────────────────────────────────────────────
export default function App() {
  const { checkAuth, isAuthenticated, token } = useAuthStore();

  useEffect(() => { checkAuth(); }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated && token) initSocket(token);
    else disconnectSocket();
  }, [isAuthenticated, token]);

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/"         element={<Landing />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/app/*"    element={<ProtectedRoute><MainAppContent /></ProtectedRoute>} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}