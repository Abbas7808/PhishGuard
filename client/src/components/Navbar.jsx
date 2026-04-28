import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiShieldCheck } from 'react-icons/hi2';

const NAV_LINKS = [
  { to: '/', label: 'Scanner' },
  { to: '/history', label: 'History' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 glass-strong"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <HiShieldCheck className="w-8 h-8 text-cyber-blue group-hover:text-cyber-green transition-colors" />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-cyber-blue">Phish</span>
              <span className="text-white">Guard</span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === to
                    ? 'bg-cyber-blue/10 text-cyber-blue'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
