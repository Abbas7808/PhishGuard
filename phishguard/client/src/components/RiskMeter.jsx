import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

const CLASSIFICATIONS = {
  safe: { color: '#00ff88', label: 'Safe', bg: 'from-green-500/20 to-green-500/5' },
  suspicious: { color: '#ffaa00', label: 'Suspicious', bg: 'from-yellow-500/20 to-yellow-500/5' },
  dangerous: { color: '#ff3366', label: 'Dangerous', bg: 'from-red-500/20 to-red-500/5' },
};

export default function RiskMeter({ score, classification }) {
  const [displayScore, setDisplayScore] = useState(0);
  const motionScore = useMotionValue(0);
  const config = CLASSIFICATIONS[classification] || CLASSIFICATIONS.safe;

  useEffect(() => {
    const controls = animate(motionScore, score, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate: (v) => setDisplayScore(Math.round(v)),
    });
    return controls.stop;
  }, [score, motionScore]);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', bounce: 0.3 }}
      className="flex flex-col items-center"
    >
      <div className="relative w-52 h-52">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="12"
          />
          <motion.circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke={config.color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              filter: `drop-shadow(0 0 8px ${config.color}60)`,
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-5xl font-bold font-mono"
            style={{ color: config.color }}
          >
            {displayScore}
          </span>
          <span className="text-xs text-gray-400 mt-1">/ 100</span>
        </div>
      </div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`mt-4 px-6 py-2 rounded-full bg-gradient-to-r ${config.bg} border`}
        style={{ borderColor: `${config.color}40` }}
      >
        <span className="font-semibold text-sm" style={{ color: config.color }}>
          {config.label}
        </span>
      </motion.div>
    </motion.div>
  );
}
