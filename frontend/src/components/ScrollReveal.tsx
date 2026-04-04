import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

export function ScrollReveal({ 
  children, 
  direction = 'left', 
  delay = 0, 
  duration = 0.8,
  distance = 50,
  className = ""
}: ScrollRevealProps) {
  const variants = {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -distance : direction === 'right' ? distance : 0,
      y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
      scale: 0.95,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration,
        delay,
        ease: "easeOut" as any,
      },
    },
  };

  return (
    <motion.div
      initial={variants.hidden}
      whileInView={variants.visible}
      viewport={{ once: false, amount: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
