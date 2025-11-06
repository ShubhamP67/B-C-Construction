"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] bg-gradient-to-br from-[#F5A623] to-[#F39C12] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Enhanced Animated Crane */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-12 relative"
      >
        <svg width="280" height="280" viewBox="0 0 280 280" className="drop-shadow-2xl">
          {/* Ground */}
          <motion.rect
            x="20" y="250" width="240" height="8" fill="#2C3E50" rx="2"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ transformOrigin: "center" }}
          />
          
          {/* Crane Base */}
          <motion.rect
            x="110" y="210" width="60" height="40" fill="#34495E"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ transformOrigin: "bottom" }}
          />
          <motion.polygon
            points="110,210 170,210 160,200 120,200"
            fill="#2C3E50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          />
          
          {/* Tower */}
          <motion.rect
            x="135" y="60" width="10" height="150" fill="#E67E22"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{ transformOrigin: "bottom" }}
          />
          <motion.rect
            x="132" y="60" width="16" height="6" fill="#D35400"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            style={{ transformOrigin: "center" }}
          />
          
          {/* Horizontal Arm */}
          <motion.rect
            x="50" y="58" width="180" height="10" fill="#F39C12" rx="2"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ transformOrigin: "left" }}
          />
          <motion.rect
            x="50" y="62" width="180" height="3" fill="#E67E22"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            style={{ transformOrigin: "left" }}
          />
          
          {/* Counter Weight */}
          <motion.rect
            x="40" y="48" width="25" height="20" fill="#95A5A6" rx="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            style={{ transformOrigin: "center" }}
          />
          
          {/* Hook Cable */}
          <motion.line
            x1="200" y1="68" x2="200" y2="150"
            stroke="#34495E" strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, y2: [150, 135, 150] }}
            transition={{
              pathLength: { duration: 0.8, delay: 1 },
              y2: { duration: 3, delay: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          />
          
          {/* Hook */}
          <motion.path
            d="M 195 150 L 205 150 L 205 155 L 200 160 L 195 155 Z"
            fill="#7F8C8D"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3, delay: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Building Block being lifted */}
          <motion.g
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3, delay: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect x="180" y="165" width="40" height="40" fill="#E74C3C" rx="3"/>
            <rect x="185" y="170" width="12" height="12" fill="#C0392B" rx="1"/>
            <rect x="203" y="170" width="12" height="12" fill="#C0392B" rx="1"/>
            <rect x="185" y="188" width="12" height="12" fill="#C0392B" rx="1"/>
            <rect x="203" y="188" width="12" height="12" fill="#C0392B" rx="1"/>
          </motion.g>
        </svg>
      </motion.div>

      {/* Company Name */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-zinc-900 mb-3 text-center px-4 tracking-tight"
      >
        Bhagwandas and son&apos;s Construction
      </motion.h2>
      
      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="text-xs md:text-sm font-semibold text-zinc-800 mb-8 text-center tracking-[0.3em] uppercase"
      >
        Quality is our standard.
      </motion.p>

      {/* Progress Bar */}
      <div className="w-64 h-2 bg-zinc-900/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-zinc-900"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Progress Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-zinc-900 font-semibold text-lg"
      >
        {progress}%
      </motion.p>

      {/* Animated Dots */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-zinc-900 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Diagonal Stripes Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-full w-8 bg-zinc-900"
            style={{
              left: `${i * 10}%`,
              transform: "skewX(-20deg)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{
              duration: 3,
              delay: i * 0.1,
              repeat: Infinity,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
