import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'earth' | 'leaf' | 'sun' | 'sky';
  delay?: number;
}

const colorMap = {
  earth: { bg: 'bg-earth-100', icon: 'text-earth-600', border: 'border-earth-200' },
  leaf: { bg: 'bg-leaf-100', icon: 'text-leaf-600', border: 'border-leaf-200' },
  sun: { bg: 'bg-sun-100', icon: 'text-sun-600', border: 'border-sun-200' },
  sky: { bg: 'bg-sky-100', icon: 'text-sky-600', border: 'border-sky-200' },
};

export default function StatCard({ title, value, subtitle, icon: Icon, color, delay = 0 }: StatCardProps) {
  const c = colorMap[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`glass-card rounded-2xl p-5 ${c.border}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-earth-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-earth-900 mt-1 font-[family-name:var(--font-display)]">{value}</p>
          {subtitle && <p className="text-xs text-earth-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center`}>
          <Icon className={c.icon} size={24} />
        </div>
      </div>
    </motion.div>
  );
}
