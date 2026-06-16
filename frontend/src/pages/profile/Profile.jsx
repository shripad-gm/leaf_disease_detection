import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import useLogout from '../../Hooks/useLogout';
import { FaUser, FaEnvelope, FaCalendarAlt, FaSignOutAlt, FaHome, FaHistory, FaLeaf, FaFlask } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Profile = () => {
  const { authUser } = useAuthContext();
  const { loading: loggingOut, logout } = useLogout();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ diseaseCount: 0, fertilizerCount: 0, total: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!authUser) {
      navigate('/login');
      return;
    }

    const fetchUserStats = async () => {
      try {
        const res = await fetch(`/api/history?userId=${authUser._id}`);
        if (!res.ok) throw new Error("Failed to fetch history stats");
        const data = await res.json();
        
        const diseaseCount = data.filter(item => item.type === 'disease').length;
        const fertilizerCount = data.filter(item => item.type === 'fertilizer').length;
        
        setStats({
          diseaseCount,
          fertilizerCount,
          total: data.length
        });
      } catch (error) {
        console.error("Error loading profile stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchUserStats();
  }, [authUser, navigate]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate('/login');
  };

  if (!authUser) return null;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 selection:bg-emerald-500/30 font-sans relative overflow-x-hidden">
      
      {/* Aesthetic Background Blurs */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <Navbar />

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 flex-grow w-full flex flex-col justify-center">
        
        {/* Glassmorphic Profile Card */}
        <div className="glass-card !rounded-[2.5rem] !p-10 border-white/10 shadow-2xl relative overflow-hidden group">
          
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
            
            {/* Left: Avatar Column */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-emerald-500/30 p-1 bg-slate-900 shadow-[0_0_50px_rgba(52,211,153,0.15)] group-hover:border-emerald-400 transition-all duration-500">
                <img 
                  src={authUser.profilepic || ((authUser.gender === 'female' || (authUser.profilepic && authUser.profilepic.includes('girl'))) ? '/default_girl.png' : '/default_boy.png')} 
                  alt={authUser.fullname} 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="text-center">
                <span className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-emerald-400">
                  {authUser.gender === 'male' ? 'Male User' : 'Female User'}
                </span>
              </div>
            </div>

            {/* Right: Details Column */}
            <div className="flex-1 space-y-6 w-full">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Full Name</p>
                <h2 className="text-3xl font-black uppercase tracking-tight text-white">{authUser.fullname}</h2>
              </div>

              <div className="pb-6 border-b border-white/5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Username</p>
                  <p className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <span className="text-emerald-500">@</span>{authUser.username}
                  </p>
                </div>
              </div>

              {/* Activity Stats block */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <FaHistory className="text-emerald-500 text-xs" /> Agricultural Activity Stats
                </h3>
                
                {loadingStats ? (
                  <div className="h-20 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center hover:bg-emerald-500/[0.02] transition-colors">
                      <FaLeaf className="mx-auto text-emerald-500 text-lg mb-2" />
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Diseases</p>
                      <p className="text-2xl font-black text-white mt-1">{stats.diseaseCount}</p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center hover:bg-blue-500/[0.02] transition-colors">
                      <FaFlask className="mx-auto text-blue-400 text-lg mb-2" />
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Fertilizer</p>
                      <p className="text-2xl font-black text-white mt-1">{stats.fertilizerCount}</p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center hover:bg-emerald-500/[0.04] transition-colors">
                      <FaHistory className="mx-auto text-emerald-400 text-lg mb-2 animate-pulse" />
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Total Scans</p>
                      <p className="text-2xl font-black text-emerald-400 mt-1">{stats.total}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  to="/history" 
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-xl border border-white/10 transition-all flex items-center gap-2 justify-center"
                >
                  <FaHistory className="text-xs" /> View History Log
                </Link>
                <button 
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex-1 py-4 bg-red-500 hover:bg-red-400 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all hover:shadow-[0_15px_30px_rgba(239,68,68,0.2)] flex items-center gap-2 justify-center disabled:opacity-50"
                >
                  <FaSignOutAlt className="text-xs" /> {loggingOut ? 'Logging Out...' : 'Sign Out'}
                </button>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="py-4 text-center border-t border-white/5 text-[9px] font-black uppercase tracking-[0.5em] text-slate-800 bg-slate-950/20 backdrop-blur-sm relative z-50">
        Resilient Roots Lab • Profile Operations
      </footer>
    </div>
  );
};

export default Profile;
