import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { flipX } from '../lib/animations';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'teal' | 'amber' | 'sky' | 'white';
  delay?: number;
  trend?: {
    value: string;
    isUp: boolean;
  };
}

const colorMap = {
  teal: 'border-teal-500/20 text-teal-500',
  amber: 'border-amber-500/20 text-amber-500',
  sky: 'border-sky-500/20 text-sky-500',
  white: 'border-white/20 text-white',
};

const iconBgMap = {
  teal: 'bg-teal-500/10 text-teal-500',
  amber: 'bg-amber-500/10 text-amber-500',
  sky: 'bg-sky-500/10 text-sky-500',
  white: 'bg-white/10 text-white',
};

export default function StatCard({ title, value, subtitle, icon: Icon, color, delay = 0, trend }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-[24px] p-6 border transition-all duration-500 hover:-translate-y-1 hover:shadow-lg",
        colorMap[color]
      )}
      style={{ 
        background: 'var(--card-bg)',
        borderColor: 'var(--card-border)'
      }}
    >
      {/* Background Glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-current opacity-[0.03] blur-3xl rounded-full" />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--teal)' }}>{title}</p>
          
          <div className="flex items-baseline gap-2">
            <AnimatePresence mode="wait">
              <motion.h2 
                key={value?.toString()}
                variants={flipX}
                initial="hidden"
                animate="visible"
                className="text-3xl font-display font-black tracking-tight"
                style={{ color: 'var(--text)' }}
              >
                {value !== undefined && value !== null && value !== '' ? value : '—'}
              </motion.h2>
            </AnimatePresence>

            {trend && (
              <div className={cn(
                "flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full border",
                trend.isUp ? "bg-teal-500/10 text-teal-500 border-teal-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
              )}>
                {trend.isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {trend.value}
              </div>
            )}
          </div>
          
          {subtitle && (
            <p className="text-[10px] text-text-muted font-bold tracking-wide flex items-center gap-1.5 uppercase">
              <span className="w-1 h-1 rounded-full bg-current opacity-50" />
              {subtitle}
            </p>
          )}
        </div>

        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-black/20",
          iconBgMap[color]
        )}>
          <Icon size={24} />
        </div>
      </div>
      
      {/* Hover Shimmer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </motion.div>
  );
}
