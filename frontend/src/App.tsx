import { Bot, Sparkles } from 'lucide-react';
import Topbar from './components/layout/Topbar';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import SoilReports from './pages/SoilReports';
import Advisory from './pages/Advisory';
import Crops from './pages/Crops';
import Weather from './pages/Weather';
import { SidePanel } from './components/ui/SidePanel';
import { CommandPalette } from './components/ui/CommandPalette';
import { useFarmStore } from './store/farmStore';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { 
    activePage, 
    isPanelOpen, 
    setPanelOpen, 
    isCommandPaletteOpen, 
    setCommandPaletteOpen 
  } = useFarmStore();

  const renderPage = () => {
    switch (activePage) {
      case 'landing': return <Landing />;
      case 'dashboard': return <Dashboard />;
      case 'soil': return <SoilReports />;
      case 'advisory': return <Advisory />;
      case 'crops': return <Crops />;
      case 'weather': return <Weather />;
      default: return <Landing />;
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text-text selection:bg-teal-500 selection:text-white overflow-x-hidden">
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

      {/* Floating AI Advisor Toggle - Premium Version */}
      {activePage !== 'landing' && (
        <motion.div
           initial={{ scale: 0, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 20 }}
           className="fixed bottom-8 right-8 z-50"
        >
             <button
                onClick={() => setPanelOpen(!isPanelOpen)}
                className="group relative w-16 h-16 rounded-[24px] bg-teal-500 shadow-2xl shadow-teal-500/50 flex items-center justify-center text-bg transition-all hover:scale-110 active:scale-95 hover:rotate-3 overflow-hidden"
              >
                {/* Background Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <AnimatePresence mode="wait">
                  {isPanelOpen ? (
                    <motion.div
                       key="close"
                       initial={{ opacity: 0, rotate: -90 }}
                       animate={{ opacity: 1, rotate: 0 }}
                       exit={{ opacity: 0, rotate: 90 }}
                    >
                       <Sparkles size={28} />
                    </motion.div>
                  ) : (
                    <motion.div
                       key="bot"
                       initial={{ opacity: 0, rotate: 90 }}
                       animate={{ opacity: 1, rotate: 0 }}
                       exit={{ opacity: 0, rotate: -90 }}
                    >
                       <Bot size={30} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Status indicator */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full border-[3px] border-bg flex items-center justify-center shadow-lg">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                </div>
              </button>
              
              {/* Tooltip on hover */}
              <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 glass border border-white/10 rounded-xl whitespace-nowrap text-[10px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-2xl">
                 Ask AI Advisor
              </div>
        </motion.div>
      )}

      {/* Global Overlays */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        setIsOpen={setCommandPaletteOpen} 
      />
      <SidePanel 
        isOpen={isPanelOpen} 
        onClose={() => setPanelOpen(false)} 
      />
      
      {/* Dynamic Background Noise/Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[200] mix-blend-overlay">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
    </div>
  );
}

export default App;
