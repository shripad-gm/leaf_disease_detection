import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../Hooks/useLogin";


const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { loading, login } = useLogin();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login(username, password);
	};

  return (
    <div className='p-4 h-screen flex items-center justify-center bg-slate-950 text-slate-100 overflow-hidden font-sans relative'>
      
      {/* Background Image */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/login_bg.png"
          alt="Login Background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.15)',
            transformOrigin: 'top left'
          }}
          className="opacity-45 contrast-105 saturate-90"
        />
        <div className="absolute inset-0 bg-slate-950/60"></div>
      </div>

      <div className='relative z-10 flex flex-col items-center justify-center min-w-[400px] mx-auto group'>
        {/* Glow effect */}
        <div className="absolute inset-0 -z-10 bg-emerald-500/30 rounded-[2.5rem] blur-3xl opacity-100 group-hover:bg-emerald-400/40 transition-all duration-700"></div>

        <div className='w-full p-10 rounded-[2.5rem] border border-emerald-500/40 bg-slate-950/95 backdrop-blur-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8),_0_0_60px_rgba(16,185,129,0.35)]'>
          <h1 className='text-3xl font-black text-center text-white uppercase tracking-tight mb-6'>
            Login <span className='gradient-text italic font-serif block text-lg mt-1 tracking-normal normal-case pr-2'>Resilient Roots</span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className='block text-[10px] font-black uppercase tracking-widest text-slate-400'>
                Username
              </label>
              <input
                type='text'
                placeholder='Enter username'
                className='w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 outline-none focus:border-emerald-500/50 transition-colors text-white text-sm'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className='block text-[10px] font-black uppercase tracking-widest text-slate-400'>
                Password
              </label>
              <input
                type='password'
                placeholder='Enter Password'
                className='w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 outline-none focus:border-emerald-500/50 transition-colors text-white text-sm'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <Link to='/signup' className='text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-bold uppercase tracking-wider'>
                Create Account
              </Link>
              <Link to='/forgot-password' className='text-xs text-slate-400 hover:text-emerald-400 transition-colors font-bold uppercase tracking-wider'>
                Forgot Password?
              </Link>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                className='w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_30px_rgba(52,211,153,0.2)]'
                disabled={loading}
              >
                {loading ? <span className="loading loading-spinner loading-xs"></span> : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

};
export default Login;

 