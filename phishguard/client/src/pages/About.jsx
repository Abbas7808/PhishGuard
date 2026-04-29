import { motion } from 'framer-motion';
import {
  HiShieldCheck, HiCpuChip, HiFingerPrint,
  HiGlobeAlt, HiExclamationTriangle, HiLockClosed,
} from 'react-icons/hi2';

const features = [
  {
    icon: HiGlobeAlt,
    title: 'Domain Analysis',
    desc: 'Examines domain age, TLD reputation, subdomain depth, and registration patterns to identify suspicious domains.',
    color: 'text-cyber-blue',
  },
  {
    icon: HiLockClosed,
    title: 'Protocol Verification',
    desc: 'Checks HTTPS encryption status and certificate validity to ensure secure connections.',
    color: 'text-cyber-green',
  },
  {
    icon: HiFingerPrint,
    title: 'Brand Impersonation',
    desc: 'Uses Levenshtein distance and homoglyph detection to identify typosquatting and brand spoofing attempts.',
    color: 'text-cyber-purple',
  },
  {
    icon: HiCpuChip,
    title: 'Heuristic Engine',
    desc: 'Analyzes URL entropy, structure, suspicious keywords, and patterns commonly used in phishing attacks.',
    color: 'text-cyber-yellow',
  },
  {
    icon: HiExclamationTriangle,
    title: 'Blacklist Scanning',
    desc: 'Cross-references URLs against known malicious domain databases and suspicious TLD registries.',
    color: 'text-cyber-red',
  },
  {
    icon: HiShieldCheck,
    title: 'Risk Scoring',
    desc: 'Combines all signals into a weighted 0-100 risk score with clear Safe, Suspicious, or Dangerous classification.',
    color: 'text-cyber-blue',
  },
];

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-bold text-white mb-3">
          How PhishGuard Works
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          PhishGuard uses a multi-layered AI-powered analysis engine to detect
          phishing websites, brand impersonation, and malicious URLs in real time.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-6 hover:border-cyber-blue/30 transition-colors"
          >
            <feature.icon className={`w-8 h-8 ${feature.color} mb-3`} />
            <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-400">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-2xl p-8 text-center"
      >
        <h2 className="text-xl font-bold text-white mb-3">Stay Safe Online</h2>
        <div className="text-sm text-gray-400 space-y-2 max-w-xl mx-auto">
          <p>Always verify URLs before entering credentials or personal information.</p>
          <p>Look for HTTPS and the padlock icon in your browser address bar.</p>
          <p>Be cautious of emails or messages containing urgent requests with links.</p>
          <p>When in doubt, navigate directly to the website instead of clicking links.</p>
        </div>
      </motion.div>
    </div>
  );
}
