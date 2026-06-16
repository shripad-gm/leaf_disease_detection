import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [step, setStep] = useState(1); // 1: request code, 2: reset password
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleRequestCode = async (e) => {
		e.preventDefault();
		if (!email) {
			return toast.error("Please enter your registered email");
		}
		setLoading(true);
		try {
			const res = await fetch("/api/auth/forgot-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}
			toast.success(data.message || "Reset code sent! Please check your email inbox.");
			setStep(2);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleResetPassword = async (e) => {
		e.preventDefault();
		if (!otp || !newPassword || !confirmPassword) {
			return toast.error("Please fill in all fields");
		}
		if (newPassword !== confirmPassword) {
			return toast.error("Passwords do not match");
		}
		if (newPassword.length < 6) {
			return toast.error("Password must be at least 6 characters");
		}
		setLoading(true);
		try {
			const res = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, otp, newPassword }),
			});
			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}
			toast.success("Password reset successful! Please log in.");
			navigate("/login");
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='p-4 min-h-screen py-12 flex items-center justify-center bg-slate-950 text-slate-100 overflow-y-auto font-sans relative'>
			{/* Background Image */}
			<div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
				<img
					src="/forgot_bg.png"
					alt="Forgot Password Background"
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

			<div className='relative z-10 flex flex-col items-center justify-center w-full max-w-[400px] px-2 mx-auto group'>
				{/* Glow effect */}
				<div className="absolute inset-0 -z-10 bg-emerald-500/30 rounded-[2rem] sm:rounded-[2.5rem] blur-3xl opacity-100 group-hover:bg-emerald-400/40 transition-all duration-700"></div>

				<div className='w-full p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-emerald-500/40 bg-slate-950/95 backdrop-blur-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8),_0_0_60px_rgba(16,185,129,0.35)]'>
					<h1 className='text-3xl font-black text-center text-white uppercase tracking-tight mb-2'>
						Recovery <span className='gradient-text italic font-serif block text-lg mt-1 tracking-normal normal-case pr-2'>Resilient Roots</span>
					</h1>
					<p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 text-center mb-6">
						{step === 1 ? "Request verification code" : "Configure new credentials"}
					</p>

					{step === 1 ? (
						<form onSubmit={handleRequestCode} className="space-y-4">
							<div className="space-y-1">
								<label className='block text-[10px] font-black uppercase tracking-widest text-slate-400'>
									Registered Email
								</label>
								<input
									type='email'
									placeholder='johndoe@example.com'
									className='w-full bg-white/[0.03] border border-white/10 rounded-xl p-3.5 outline-none focus:border-emerald-500/50 transition-colors text-white text-sm'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>

							<div className="flex justify-between items-center pt-2">
								<Link to='/login' className='text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-bold uppercase tracking-wider'>
									Back to Login
								</Link>
							</div>

							<div className="pt-2">
								<button
									type="submit"
									className='w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_30px_rgba(52,211,153,0.2)] disabled:opacity-50'
									disabled={loading}
								>
									{loading ? "Sending..." : "Request Code"}
								</button>
							</div>
						</form>
					) : (
						<form onSubmit={handleResetPassword} className="space-y-4">
							<div className="space-y-1">
								<label className='block text-[10px] font-black uppercase tracking-widest text-slate-400'>
									Verification Code (OTP)
								</label>
								<input
									type='text'
									placeholder='Enter 6-digit code'
									className='w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 outline-none focus:border-emerald-500/50 transition-colors text-white text-sm font-mono tracking-widest text-center'
									maxLength={6}
									value={otp}
									onChange={(e) => setOtp(e.target.value)}
									required
								/>
							</div>

							<div className="space-y-1">
								<label className='block text-[10px] font-black uppercase tracking-widest text-slate-400'>
									New Password
								</label>
								<input
									type='password'
									placeholder='At least 6 characters'
									className='w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 outline-none focus:border-emerald-500/50 transition-colors text-white text-sm'
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									required
								/>
							</div>

							<div className="space-y-1">
								<label className='block text-[10px] font-black uppercase tracking-widest text-slate-400'>
									Confirm New Password
								</label>
								<input
									type='password'
									placeholder='Confirm Password'
									className='w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 outline-none focus:border-emerald-500/50 transition-colors text-white text-sm'
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
								/>
							</div>

							<div className="flex justify-between items-center pt-1">
								<button
									type="button"
									onClick={() => setStep(1)}
									className='text-xs text-slate-400 hover:text-white transition-colors font-bold uppercase tracking-wider'
								>
									Back
								</button>
							</div>

							<div className="pt-2">
								<button
									type="submit"
									className='w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_30px_rgba(52,211,153,0.2)] disabled:opacity-50'
									disabled={loading}
								>
									{loading ? "Resetting..." : "Reset Password"}
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
