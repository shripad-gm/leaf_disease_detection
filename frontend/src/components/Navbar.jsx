import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaLeaf, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useAuthContext } from '../context/AuthContext';
import useLogout from '../Hooks/useLogout';

const Navbar = () => {
  const { authUser } = useAuthContext();
  const { logout } = useLogout();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Prediction', path: '/detect' },
    { label: 'Fertilizer', path: '/fertilizer' },
    { label: 'Weather', path: '/weather' },
    { label: 'History', path: '/history' },
  ];

  return (
    <div className="relative z-50 w-full border-b border-white/5 bg-slate-950/75 backdrop-blur-md">
      <nav className="px-6 md:px-8 py-4 flex justify-between items-center">
        {/* Brand logo */}
        <Link to="/" className="text-xl font-black tracking-tighter flex items-center gap-2 group">
          <FaLeaf className="text-emerald-500 group-hover:rotate-12 transition-transform duration-300" />
          <span className="uppercase tracking-[0.2em] text-xs text-white">Resilient Roots AI</span>
        </Link>

        {/* Center navigation links for desktop */}
        {authUser && (
          <div className="hidden lg:flex items-center gap-1 bg-white/[0.02] border border-white/5 rounded-full p-1.5">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                  isActive(link.path)
                    ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {authUser && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
            </button>
          )}

          {authUser ? (
            <div className="flex items-center gap-2 md:gap-4">
              <Link to="/profile" className={`flex items-center gap-2 group/nav-profile px-3 py-1.5 rounded-xl border transition-all ${isActive('/profile') ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/5 hover:border-emerald-500/30'}`}>
                <img src={authUser.profilepic} alt="Profile" className="w-6 h-6 rounded-full border border-emerald-500/30" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 group-hover/nav-profile:text-white hidden md:inline">{authUser.username}</span>
              </Link>
              <button 
                onClick={logout} 
                className="px-3 md:px-4 py-2 rounded-xl border border-red-500/20 hover:border-red-500 bg-red-500/5 hover:bg-red-500 text-red-400 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 shadow-[0_0_20px_rgba(239,68,68,0.05)]"
              >
                <FaSignOutAlt className="text-xs" /> <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-white text-[9px] font-black uppercase tracking-widest transition-all">Login</Link>
              <Link to="/signup" className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-[9px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(52,211,153,0.2)]">Sign Up</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Drawer (Expandable menu) */}
      {authUser && isOpen && (
        <div className="lg:hidden border-t border-white/5 bg-slate-950/90 px-6 py-4 flex flex-col gap-2 transition-all duration-300">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`w-full px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                isActive(link.path)
                  ? 'bg-emerald-500 text-black font-bold shadow-[0_0_15px_rgba(52,211,153,0.2)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;
