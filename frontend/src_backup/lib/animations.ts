import type { Variants } from 'framer-motion';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const wordAnimation: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

export const flipX: Variants = {
  hidden: { rotateX: 90, opacity: 0 },
  visible: { 
    rotateX: 0, 
    opacity: 1,
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }
  }
};

export const slideInRight: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: { 
    x: 100, 
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

export const pulseAmber: Variants = {
  initial: { backgroundColor: 'transparent' },
  flash: {
    backgroundColor: ['rgba(245, 158, 11, 0)', 'rgba(245, 158, 11, 0.15)', 'rgba(245, 158, 11, 0)'],
    transition: { duration: 0.8 }
  }
};
