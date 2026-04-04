import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    // Total duration of animation before triggering completion
    const timer = setTimeout(() => {
      onComplete();
    }, 3300); // 2.5s hold + 0.8s zoom

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[1000] bg-[#051c0f] flex items-center justify-center overflow-hidden"
    >
      <div className="relative flex items-center justify-center">
        {/* Main Logo Text Container */}
        <div className="flex items-center">
          {/* "Krish" Part */}
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: [0, 1, 1, 1, 0],
              x: [20, 0, 0, 0, -50],
              scale: [1, 1, 1, 1, 0.8]
            }}
            transition={{ 
              duration: 3.3,
              times: [0, 0.1, 0.75, 0.8, 1],
              ease: "easeInOut"
            }}
            className="text-6xl md:text-8xl font-black text-white tracking-tight"
          >
            Krish
          </motion.span>

          {/* "i" with Dot */}
          <span className="relative inline-flex flex-col items-center mx-1 md:mx-2">
            {/* The Dot */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ 
                scale: [1, 1, 1, 1.2, 180],
                opacity: [1, 1, 1, 1, 1],
                backgroundColor: ["#22c55e", "#22c55e", "#22c55e", "#22c55e", "#051c0f"]
              }}
              transition={{ 
                duration: 3.3,
                times: [0, 0.1, 0.75, 0.8, 1],
                ease: "easeInOut"
              }}
              className="absolute -top-4 md:-top-6 left-1/2 -translate-x-1/2 w-4 md:w-5 h-4 md:h-5 bg-[#22c55e] rounded-full z-20"
              style={{ boxShadow: '0 0 30px rgba(34, 197, 94, 0.8)' }}
            />
            
            {/* The "i" Stem */}
            <motion.span
               animate={{ 
                 scale: [1, 1, 1, 1.5, 5],
                 opacity: [1, 1, 1, 1, 0],
                 y: [0, 0, 0, 0, 20]
               }}
               transition={{ 
                 duration: 3.3,
                 times: [0, 0.1, 0.75, 0.8, 1],
                 ease: "easeInOut"
               }}
               className="text-6xl md:text-8xl font-black text-white"
            >
              i
            </motion.span>
          </span>

          {/* "Setu" Part */}
          <motion.span
             initial={{ opacity: 0, x: -20 }}
             animate={{ 
               opacity: [0, 1, 1, 1, 0],
               x: [-20, 0, 0, 0, 50],
               scale: [1, 1, 1, 1, 0.8]
             }}
             transition={{ 
               duration: 3.3,
               times: [0, 0.1, 0.75, 0.8, 1],
               ease: "easeInOut"
             }}
             className="text-6xl md:text-8xl font-black text-white tracking-tight"
          >
            Setu
          </motion.span>
        </div>

        {/* Cinematic Flare */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 3, delay: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-100%] animate-shimmer"
        />
      </div>

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px]" />
      </div>
    </motion.div>
  );
}
