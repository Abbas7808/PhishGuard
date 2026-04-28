import { motion } from 'framer-motion';

export default function ScannerAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center py-16"
    >
      <div className="relative w-32 h-32">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-cyber-blue/30 border-t-cyber-blue"
        />
        {/* Middle ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-3 rounded-full border-2 border-cyber-purple/30 border-t-cyber-purple"
        />
        {/* Inner ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-6 rounded-full border-2 border-cyber-green/30 border-t-cyber-green"
        />
        {/* Center dot */}
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-cyber-blue"
          style={{ filter: 'blur(2px)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center"
      >
        <p className="text-cyber-blue font-mono text-sm">Analyzing URL...</p>
        <motion.div className="flex gap-1 justify-center mt-3">
          {['Checking protocol', 'Scanning domain', 'Detecting threats', 'Computing risk'].map((step, i) => (
            <motion.span
              key={step}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
              className="text-xs text-gray-500 font-mono"
            >
              {i > 0 && ' · '}
              {step}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
