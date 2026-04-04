import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useFarmStore } from './store/farmStore';
import { AnimatePresence, motion } from 'framer-motion';

// Layout & Components
import Topbar from './components/layout/Topbar';
import { SidePanel } from './components/ui/SidePanel';
import { CommandPalette } from './components/ui/CommandPalette';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Pages
import Dashboard from './pages/Dashboard';
import SoilReports from './pages/SoilReports';
import Advisory from './pages/Advisory';
import Crops from './pages/Crops';
import Weather from './pages/Weather';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';

// Auth Guard
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Main Authenticated Layout
const MainAppContent = () => {
  const { activePage, isPanelOpen, setPanelOpen, isCommandPaletteOpen, setCommandPaletteOpen } = useFarmStore();

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
    <div className="min-h-screen bg-bg text-text selection:bg-teal-500/30">
      <Topbar />
      <main className="pt-20 px-6 max-w-[1600px] mx-auto pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <SidePanel 
        isOpen={isPanelOpen} 
        onClose={() => setPanelOpen(false)} 
      />
      
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        setIsOpen={setCommandPaletteOpen} 
      />
      
      {/* AI Trigger FAB (Desktop) */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setPanelOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-[24px] bg-teal-500 text-bg shadow-2xl shadow-teal-500/40 flex items-center justify-center z-50 border-4 border-bg group"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-[20px] bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
        />
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8V4H8" />
          <rect width="16" height="12" x="4" y="8" rx="2" />
          <path d="M2 14h2" />
          <path d="M20 14h2" />
          <path d="M15 13v2" />
          <path d="M9 13v2" />
        </svg>
      </motion.button>
    </div>
  );
};

import { initSocket, disconnectSocket } from './lib/socket';

export default function App() {
  const { checkAuth, isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated && token) {
      initSocket(token);
    } else {
      disconnectSocket();
    }
  }, [isAuthenticated, token]);

  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard */}
        <Route
          path="/app/*"
          element={
            <ProtectedRoute>
              <MainAppContent />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
