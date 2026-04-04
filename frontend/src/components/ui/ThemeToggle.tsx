import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../providers/ThemeProvider'
import { motion, AnimatePresence } from 'framer-motion'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="
        relative flex items-center gap-2 px-4 py-2 rounded-2xl
        border border-border-border bg-surface-2
        text-text-text-muted hover:text-text-text
        transition-all duration-300
        hover:bg-surface-3 hover:shadow-lg
        active:scale-95 group overflow-hidden
      "
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-teal-dim to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative w-5 h-5 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {theme === 'dark' ? (
            <motion.div
              key="sun"
              initial={{ y: 20, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -20, opacity: 0, rotate: 90 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              <Sun className="w-5 h-5 text-amber-500" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ y: 20, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -20, opacity: 0, rotate: 90 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              <Moon className="w-5 h-5 text-teal-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <span className="text-xs font-black uppercase tracking-widest hidden sm:block relative z-10 transition-colors group-hover:text-teal-500">
        {theme === 'dark' ? 'Light' : 'Dark'}
      </span>
    </button>
  )
}
