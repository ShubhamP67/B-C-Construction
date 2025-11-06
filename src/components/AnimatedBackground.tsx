"use client";

import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  variant?: "particles" | "geometric" | "waves" | "grid" | "bricks";
  color?: string;
}

export default function AnimatedBackground({ 
  variant = "particles",
  color = "#F5A623"
}: AnimatedBackgroundProps) {
  
  if (variant === "particles") {
    const particles = [
      { size: 8, left: 10, top: 20, x: 5, duration: 6, delay: 0 },
      { size: 12, left: 25, top: 60, x: -10, duration: 8, delay: 1 },
      { size: 6, left: 40, top: 15, x: 15, duration: 7, delay: 0.5 },
      { size: 10, left: 55, top: 80, x: -5, duration: 9, delay: 2 },
      { size: 14, left: 70, top: 35, x: 10, duration: 6.5, delay: 1.5 },
      { size: 7, left: 85, top: 70, x: -15, duration: 8.5, delay: 0.8 },
      { size: 11, left: 15, top: 45, x: 8, duration: 7.5, delay: 2.5 },
      { size: 9, left: 32, top: 90, x: -12, duration: 6.8, delay: 1.2 },
      { size: 13, left: 48, top: 50, x: 12, duration: 8.2, delay: 0.3 },
      { size: 8, left: 63, top: 10, x: -8, duration: 7.2, delay: 2.8 },
      { size: 10, left: 78, top: 55, x: 6, duration: 6.3, delay: 1.8 },
      { size: 12, left: 92, top: 25, x: -10, duration: 9.5, delay: 0.6 },
      { size: 7, left: 8, top: 75, x: 14, duration: 7.8, delay: 2.2 },
      { size: 15, left: 20, top: 40, x: -7, duration: 8.8, delay: 1.4 },
      { size: 9, left: 38, top: 65, x: 9, duration: 6.6, delay: 2.6 },
      { size: 11, left: 52, top: 30, x: -11, duration: 7.4, delay: 0.9 },
      { size: 6, left: 68, top: 85, x: 13, duration: 8.4, delay: 1.7 },
      { size: 14, left: 82, top: 48, x: -6, duration: 6.9, delay: 2.3 },
      { size: 10, left: 95, top: 62, x: 8, duration: 7.6, delay: 0.4 },
      { size: 8, left: 12, top: 88, x: -9, duration: 8.6, delay: 2.9 },
    ];
    
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: color,
              left: `${p.left}%`,
              top: `${p.top}%`,
              filter: 'blur(2px)',
              willChange: 'transform',
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, p.x, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "geometric") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        {/* Rotating squares */}
        <motion.div
          className="absolute w-48 h-48 border-4"
          style={{ borderColor: color, top: "10%", left: "5%", filter: 'blur(1px)', willChange: 'transform' }}
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-40 h-40 border-4"
          style={{ borderColor: color, top: "60%", right: "10%", filter: 'blur(1px)', willChange: 'transform' }}
          animate={{ rotate: -360, scale: [1, 0.8, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-32 h-32 border-3"
          style={{ borderColor: color, bottom: "10%", left: "40%", filter: 'blur(1px)', willChange: 'transform' }}
          animate={{ rotate: 360, x: [0, 50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating circles */}
        <motion.div
          className="absolute w-56 h-56 rounded-full border-4"
          style={{ borderColor: color, top: "30%", right: "20%", filter: 'blur(1px)', willChange: 'transform' }}
          animate={{ y: [0, -30, 0], scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-40 h-40 rounded-full border-3"
          style={{ borderColor: color, bottom: "20%", left: "15%", filter: 'blur(1px)', willChange: 'transform' }}
          animate={{ y: [0, 25, 0], scale: [1, 0.85, 1], rotate: [0, -180, -360] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    );
  }

  if (variant === "waves") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-[500px]"
            style={{
              background: `radial-gradient(ellipse at center, ${color} 0%, transparent 60%)`,
              top: `${i * 20}%`,
              filter: 'blur(40px)',
            }}
            animate={{
              x: ["-100%", "100%"],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear",
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke={color}
                strokeWidth="2"
              />
            </pattern>
          </defs>
          <motion.rect
            width="100%"
            height="100%"
            fill="url(#grid)"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </svg>
        {/* Animated lines */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1"
            style={{
              backgroundColor: color,
              width: '100%',
              top: `${i * 12.5}%`,
              opacity: 0.3,
            }}
            animate={{
              scaleX: [0, 1, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "bricks") {
    return (
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none opacity-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.2 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Brick pattern */}
            <pattern
              id="bricks"
              x="0"
              y="0"
              width="120"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              {/* First row of bricks */}
              <rect x="2" y="2" width="56" height="26" fill="none" stroke={color} strokeWidth="2" rx="2" />
              <rect x="62" y="2" width="56" height="26" fill="none" stroke={color} strokeWidth="2" rx="2" />
              {/* Second row offset */}
              <rect x="-28" y="32" width="56" height="26" fill="none" stroke={color} strokeWidth="2" rx="2" />
              <rect x="32" y="32" width="56" height="26" fill="none" stroke={color} strokeWidth="2" rx="2" />
              <rect x="92" y="32" width="56" height="26" fill="none" stroke={color} strokeWidth="2" rx="2" />
            </pattern>
          </defs>
          <motion.rect
            width="100%"
            height="100%"
            fill="url(#bricks)"
            animate={{ 
              opacity: [0.5, 0.8, 0.5],
              x: [0, 10, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
        
        {/* Animated individual bricks falling/building up */}
        {[
          { left: 5, top: 15, duration: 5, delay: 0 },
          { left: 25, top: 45, duration: 6, delay: 1 },
          { left: 45, top: 75, duration: 7, delay: 2 },
          { left: 65, top: 25, duration: 5.5, delay: 1.5 },
          { left: 85, top: 55, duration: 6.5, delay: 0.5 },
          { left: 15, top: 65, duration: 6, delay: 2.5 },
          { left: 55, top: 35, duration: 5, delay: 3 },
          { left: 75, top: 10, duration: 7, delay: 1 },
        ].map((brick, i) => (
          <motion.div
            key={i}
            className="absolute rounded"
            style={{
              width: '60px',
              height: '30px',
              border: `2px solid ${color}`,
              left: `${brick.left}%`,
              top: `${brick.top}%`,
              willChange: 'transform',
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: brick.duration,
              repeat: Infinity,
              delay: brick.delay,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Construction crane silhouette */}
        <motion.svg
          className="absolute"
          style={{ right: '5%', top: '10%', width: '80px', height: '80px' }}
          viewBox="0 0 100 100"
          animate={{
            rotate: [0, 3, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <line x1="50" y1="20" x2="50" y2="80" stroke={color} strokeWidth="2" />
          <line x1="50" y1="20" x2="90" y2="20" stroke={color} strokeWidth="2" />
          <line x1="50" y1="20" x2="20" y2="20" stroke={color} strokeWidth="2" />
          <rect x="45" y="75" width="10" height="15" fill={color} opacity="0.3" />
        </motion.svg>
      </motion.div>
    );
  }

  return null;
}
