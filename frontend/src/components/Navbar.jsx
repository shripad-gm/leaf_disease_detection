import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaLeaf, FaSignOutAlt } from 'react-icons/fa';
import { useAuthContext } from '../context/AuthContext';
import useLogout from '../Hooks/useLogout';

const Navbar = () => {
  const { authUser } = useAuthContext();
  const { logout } = useLogout();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="relative z-50 px-8 py-4 flex justify-between items-center border-b border-white/5 bg-slate-950/40 backdrop-blur-md">
      {/* Brand logo */}
      <Link to="/" className="text-xl font-black tracking-tighter flex items-center gap-2 group">
        <FaLeaf className="text-emerald-500 group-hover:rotate-12 transition-transform duration-300" />
        <span className="uppercase tracking-[0.2em] text-xs text-white">Resilient Roots AI</span>
      </Link>

      {/* Center navigation links for authenticated users */}
      {authUser && (
        <div className="hidden lg:flex items-center gap-1 bg-white/[0.02] border border-white/5 rounded-full p-1.5">
          {[
            { label: 'Home', path: '/' },
            { label: 'Prediction', path: '/detect' },
            { label: 'Fertilizer', path: '/fertilizer' },
            { label: 'Weather', path: '/weather' },
            { label: 'History', path: '/history' },
          ].map((link) => (
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
      {authUser ? (
        <div className="flex items-center gap-4">
          <Link to="/profile" className={`flex items-center gap-2 group/nav-profile px-3 py-1.5 rounded-xl border transition-all ${isActive('/profile') ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/5 hover:border-emerald-500/30'}`}>
            <img src={authUser.profilepic} alt="Profile" className="w-6 h-6 rounded-full border border-emerald-500/30" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 group-hover/nav-profile:text-white hidden md:inline">{authUser.username}</span>
          </Link>
          <button 
            onClick={logout} 
            className="px-4 py-2 rounded-xl border border-red-500/20 hover:border-red-500 bg-red-500/5 hover:bg-red-500 text-red-400 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 shadow-[0_0_20px_rgba(239,68,68,0.05)]"
          >
            <FaSignOutAlt className="text-xs" /> Sign Out
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <Link to="/login" className="px-5 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-white text-[9px] font-black uppercase tracking-widest transition-all">Login</Link>
          <Link to="/signup" className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-[9px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(52,211,153,0.2)]">Sign Up</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
