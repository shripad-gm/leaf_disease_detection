import { useState } from "react";
import GenderCheckbox from "./GenderCheckbox";
import { Link, useNavigate } from "react-router-dom";
import useSignup from "../../Hooks/useSignup";

const SignUp = () => {
	const navigate = useNavigate();
	
	const [inputs,setInputs]=useState({
		fullname:'',
		username:'',
		password:'',
		confirmpassword:'',
		gender:''
	})
	const {signup}=useSignup()

	const handlecheckboxchange=(gender)=>{
		setInputs({...inputs,gender})
	}

	const handleSubmit=async(e)=>{
		e.preventDefault()
		const success = await signup(inputs)
		if (success) {
			navigate("/login")
		}
	}
  return (
    <div className='p-4 h-screen flex items-center justify-center bg-slate-950 text-slate-100 overflow-hidden font-sans relative'>
      
      {/* Background Image */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/login_signup_bg.png"
          alt="SignUp Background"
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
          className="opacity-70 contrast-110 saturate-100"
        />
        <div className="absolute inset-0 bg-slate-950/40"></div>
      </div>

      <div className='relative z-10 flex flex-col items-center justify-center min-w-[420px] mx-auto'>
        <div className='w-full p-10 rounded-[2.5rem] border border-emerald-500/20 bg-slate-950/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),_0_0_40px_rgba(16,185,129,0.15)]'>
          <h1 className='text-3xl font-black text-center text-white uppercase tracking-tight mb-4'>
            Sign Up <span className='gradient-text italic font-serif block text-lg mt-1 tracking-normal normal-case'>Resilient Roots</span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className='block text-[10px] font-black uppercase tracking-widest text-slate-400'>
                Full Name
              </label>
              <input
                type='text'
                placeholder='John Doe'
                className='w-full bg-white/[0.03] border border-white/10 rounded-xl p-2.5 outline-none focus:border-emerald-500/50 transition-colors text-white text-sm'
                value={inputs.fullname}
                onChange={(e)=>setInputs({...inputs,fullname:e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className='block text-[10px] font-black uppercase tracking-widest text-slate-400'>
                Username
              </label>
              <input
                type='text'
                placeholder='johndoe'
                className='w-full bg-white/[0.03] border border-white/10 rounded-xl p-2.5 outline-none focus:border-emerald-500/50 transition-colors text-white text-sm'
                value={inputs.username}
                onChange={(e)=>setInputs({...inputs,username:e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className='block text-[10px] font-black uppercase tracking-widest text-slate-400'>
                Password
              </label>
              <input
                type='password'
                placeholder='Enter Password'
                className='w-full bg-white/[0.03] border border-white/10 rounded-xl p-2.5 outline-none focus:border-emerald-500/50 transition-colors text-white text-sm'
                value={inputs.password}
                onChange={(e)=>setInputs({...inputs,password:e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className='block text-[10px] font-black uppercase tracking-widest text-slate-400'>
                Confirm Password
              </label>
              <input
                type='password'
                placeholder='Confirm Password'
                className='w-full bg-white/[0.03] border border-white/10 rounded-xl p-2.5 outline-none focus:border-emerald-500/50 transition-colors text-white text-sm'
                value={inputs.confirmpassword}
                onChange={(e)=>setInputs({...inputs,confirmpassword:e.target.value})}
              />
            </div>

            <div className="py-1">
              <GenderCheckbox onCheckboxChange={handlecheckboxchange} selectedGender={inputs.gender}/>
            </div>
            
            <div className="flex justify-between items-center">
              <Link className='text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-bold uppercase tracking-wider' to="/login">
                Already have an account?
              </Link>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                className='w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_30px_rgba(52,211,153,0.2)]'
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default SignUp;