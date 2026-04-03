import { LayoutDashboard, FileText, MessageSquareWarning, Sprout, CloudSun, Menu, X, Wheat } from 'lucide-react';
import { useFarmStore } from '../store/farmStore';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'soil', label: 'Soil Reports', icon: FileText },
  { id: 'advisory', label: 'Advisory Portal', icon: MessageSquareWarning },
  { id: 'crops', label: 'My Crops', icon: Sprout },
  { id: 'weather', label: 'Weather', icon: CloudSun },
];

export default function Sidebar() {
  const { activePage, setActivePage, sidebarOpen, toggleSidebar, advisories } = useFarmStore();
  const unreadCount = advisories.filter((a) => !a.isRead).length;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-earth-800 text-earth-50 shadow-lg"
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/40 z-30"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 z-40 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col soil-gradient text-earth-50">
          {/* Logo */}
          <div className="p-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-sun-400/20 flex items-center justify-center">
                <Wheat className="text-sun-300" size={26} />
              </div>
              <div>
                <h1 className="font-[family-name:var(--font-display)] text-xl tracking-wide">AgriSense</h1>
                <p className="text-xs text-earth-300 font-light">Smart Farm Management</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-4 py-2 space-y-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/15 text-sun-300 shadow-lg shadow-black/10'
                      : 'text-earth-200 hover:bg-white/8 hover:text-earth-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {item.id === 'advisory' && unreadCount > 0 && (
                    <span className="ml-auto bg-danger text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-3">
              <div className="w-9 h-9 rounded-full bg-leaf-500/30 flex items-center justify-center text-leaf-200 font-bold text-sm">
                RK
              </div>
              <div>
                <p className="text-sm font-medium text-earth-100">Rajesh Kumar</p>
                <p className="text-xs text-earth-300">Green Valley Farm</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
