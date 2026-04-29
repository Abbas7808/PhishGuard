import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MatrixBackground from '../components/MatrixBackground';
import URLInput from '../components/URLInput';
import ScannerAnimation from '../components/ScannerAnimation';
import RiskMeter from '../components/RiskMeter';
import ResultCard from '../components/ResultCard';
import { analyzeUrl } from '../utils/api';
import { HiShieldCheck } from 'react-icons/hi2';

export default function Home({ result, setResult, addToHistory }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async (url) => {
    setIsLoading(true);
    setResult(null);
    setError('');

    try {
      const data = await analyzeUrl(url);
      setResult(data);
      addToHistory(data);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <MatrixBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-cyber-blue text-sm font-mono mb-6"
          >
            <HiShieldCheck className="w-4 h-4" />
            AI-Powered URL Security Scanner
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-white">Detect </span>
            <span className="bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-red bg-clip-text text-transparent">
              Phishing Threats
            </span>
            <br />
            <span className="text-white">Before They Strike</span>
          </h1>

          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Analyze any URL instantly with our AI-powered engine. Get detailed risk
            scoring, brand impersonation detection, and security recommendations.
          </p>
        </motion.div>

        {/* URL Input */}
        <URLInput onSubmit={handleScan} isLoading={isLoading} />

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 max-w-2xl mx-auto p-4 glass rounded-xl border border-cyber-red/30 text-cyber-red text-sm text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanner Animation */}
        <AnimatePresence>
          {isLoading && <ScannerAnimation />}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 space-y-8"
            >
              <RiskMeter score={result.score} classification={result.classification} />
              <ResultCard result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
