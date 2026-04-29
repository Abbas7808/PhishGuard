import { motion } from 'framer-motion';
import {
  HiLockClosed, HiLockOpen, HiCalendar, HiGlobeAlt,
  HiShieldExclamation, HiExclamationTriangle, HiCpuChip,
  HiMagnifyingGlass, HiShieldCheck, HiExclamationCircle,
} from 'react-icons/hi2';

const ICONS = {
  'lock': HiLockClosed,
  'lock-open': HiLockOpen,
  'calendar': HiCalendar,
  'globe': HiGlobeAlt,
  'shield-x': HiShieldExclamation,
  'alert-triangle': HiExclamationTriangle,
  'alert-circle': HiExclamationCircle,
  'cpu': HiCpuChip,
  'search': HiMagnifyingGlass,
  'verified': HiShieldCheck,
};

const SEVERITY_STYLES = {
  safe: 'border-cyber-green/30 bg-cyber-green/5 text-cyber-green',
  info: 'border-cyber-blue/30 bg-cyber-blue/5 text-cyber-blue',
  warning: 'border-cyber-yellow/30 bg-cyber-yellow/5 text-cyber-yellow',
  danger: 'border-cyber-red/30 bg-cyber-red/5 text-cyber-red',
  critical: 'border-cyber-red/50 bg-cyber-red/10 text-cyber-red',
};

export default function ResultCard({ result }) {
  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-3xl mx-auto space-y-6"
    >
      <div className="glass rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Analysis Details
        </h3>
        <div className="space-y-3">
          {result.details.map((detail, i) => {
            const Icon = ICONS[detail.icon] || HiExclamationCircle;
            const style = SEVERITY_STYLES[detail.severity] || SEVERITY_STYLES.info;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className={`flex items-start gap-3 p-3 rounded-xl border ${style}`}
              >
                <Icon className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
                    {detail.category}
                  </span>
                  <p className="text-sm text-gray-200 mt-0.5">{detail.message}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {result.recommendations.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Recommendations
          </h3>
          <ul className="space-y-2">
            {result.recommendations.map((rec, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-start gap-2 text-sm text-gray-300"
              >
                <span className="text-cyber-blue mt-1">&#x2022;</span>
                {rec}
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      <div className="glass rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Scan Info
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Domain</span>
            <p className="text-white font-mono truncate">{result.domain}</p>
          </div>
          <div>
            <span className="text-gray-500">Protocol</span>
            <p className={result.isHttps ? 'text-cyber-green' : 'text-cyber-red'}>
              {result.isHttps ? 'HTTPS' : 'HTTP'}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Domain Age</span>
            <p className="text-white">{result.domainAge?.days || '?'} days</p>
          </div>
          <div>
            <span className="text-gray-500">Subdomains</span>
            <p className="text-white">{result.subdomainDepth}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
