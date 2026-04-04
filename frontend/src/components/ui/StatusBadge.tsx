import React from 'react';
import { cn } from '../../lib/utils';

interface StatusBadgeProps {
  status: 'success' | 'error' | 'warning' | 'info' | 'leaf' | 'earth' | 'sun' | 'sky';
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const styles = {
    success: 'bg-success/10 text-success border-success/20',
    error:   'bg-danger/10 text-danger border-danger/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    info:    'bg-sky-500/10 text-sky-600 border-sky-500/20',
    leaf:    'bg-leaf-500/10 text-leaf-700 border-leaf-500/20',
    earth:   'bg-earth-500/10 text-earth-700 border-earth-500/20',
    sun:     'bg-sun-500/10 text-sun-700 border-sun-500/20',
    sky:     'bg-sky-500/10 text-sky-700 border-sky-500/20',
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider",
      styles[status],
      className
    )}>
      {children}
    </span>
  );
}
