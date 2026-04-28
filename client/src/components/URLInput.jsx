import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiMagnifyingGlass, HiExclamationTriangle } from 'react-icons/hi2';

export default function URLInput({ onSubmit, isLoading }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validate = (value) => {
    if (!value.trim()) return 'Please enter a URL';
    const pattern = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i;
    if (!pattern.test(value.trim())) return 'Please enter a valid URL';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate(url);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    onSubmit(url.trim());
  };

  const handleChange = (e) => {
    setUrl(e.target.value);
    if (error) setError(validate(e.target.value));
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className={`relative glass rounded-2xl p-1 transition-all duration-300 ${
        error ? 'border-cyber-red/50' : 'hover:border-cyber-blue/50'
      }`}>
        <div className="flex items-center">
          <div className="pl-4 text-gray-500">
            <HiMagnifyingGlass className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={url}
            onChange={handleChange}
            placeholder="Enter URL to scan (e.g., https://example.com)"
            className="flex-1 bg-transparent px-4 py-4 text-white placeholder-gray-500 outline-none font-mono text-sm"
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="m-1 px-6 py-3 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Scanning
              </span>
            ) : (
              'Scan URL'
            )}
          </button>
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-cyber-red text-sm flex items-center gap-1 pl-2"
        >
          <HiExclamationTriangle className="w-4 h-4" />
          {error}
        </motion.p>
      )}
    </motion.form>
  );
}
