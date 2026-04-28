import { motion } from 'framer-motion';
import { HiTrash, HiClock, HiArrowTopRightOnSquare } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

const CLASSIFICATION_STYLES = {
  safe: 'bg-cyber-green/10 text-cyber-green border-cyber-green/30',
  suspicious: 'bg-cyber-yellow/10 text-cyber-yellow border-cyber-yellow/30',
  dangerous: 'bg-cyber-red/10 text-cyber-red border-cyber-red/30',
};

export default function History({ history, clearHistory }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Scan History</h1>
          <p className="text-gray-400 mt-1">Your recent URL scans stored locally</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-cyber-red hover:bg-cyber-red/10 transition-colors"
          >
            <HiTrash className="w-4 h-4" />
            Clear All
          </button>
        )}
      </motion.div>

      {history.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <HiClock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No scans yet</p>
          <p className="text-gray-500 text-sm mt-1">
            Scanned URLs will appear here
          </p>
          <Link
            to="/"
            className="inline-block mt-6 px-6 py-2.5 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Scan a URL
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {history.map((item, i) => (
            <motion.div
              key={`${item.url}-${item.analyzedAt}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-4 hover:border-cyber-blue/30 transition-colors group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        CLASSIFICATION_STYLES[item.classification]
                      }`}
                    >
                      {item.classification}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      Score: {item.score}/100
                    </span>
                  </div>
                  <p className="text-sm text-white font-mono truncate">{item.url}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.analyzedAt).toLocaleString()}
                  </p>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-cyber-blue transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Open URL"
                >
                  <HiArrowTopRightOnSquare className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
