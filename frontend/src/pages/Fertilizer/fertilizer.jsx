import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaArrowLeft, FaFlask, FaVial, FaWater, FaThermometerHalf, FaSun, FaArrowRight } from 'react-icons/fa';

const FertilizationForm = () => {
  const [soilTemp, setSoilTemp] = useState('');
  const [soilHumidity, setSoilHumidity] = useState('');
  const [soilMoisture, setSoilMoisture] = useState('');
  const [azote, setAzote] = useState('');
  const [phosphorous, setPhosphorous] = useState('');
  const [potassium, setPotassium] = useState('');
  const [soilType, setSoilType] = useState('');
  const [cropType, setCropType] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (soilTemp && soilHumidity && soilMoisture && azote && phosphorous && potassium && soilType && cropType) {
      setRecommendation(`Protocol Established: For ${cropType} in ${soilType} soil, maintain Azote at ${azote}g, Phosphorous at ${phosphorous}g, and Potassium at ${potassium}g. Monitor temperature at ${soilTemp}°C and humidity at ${soilHumidity}% for optimal yield.`);
    } else {
      setRecommendation('Error: Incomplete data profile. All parameters are required for precision calculation.');
    }
  };

  return (
    <div className="h-screen flex flex-col justify-between bg-slate-950 text-slate-100 overflow-y-auto selection:bg-emerald-500/30 font-sans">
      
      {/* Dynamic Background (Video with Image Fallback) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/fertilizer_bg.png"
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
          className="opacity-25 contrast-110 saturate-100"
        >
          <source src="/fertilizer_bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-slate-950/70"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-8 py-4 flex justify-between items-center border-b border-white/5 bg-slate-950/20 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
            <FaArrowLeft className="text-xs" />
          </div>
          <span className="uppercase tracking-[0.4em] text-[9px] font-black">Return Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black">
            <FaFlask className="text-xs" />
          </div>
          <span className="uppercase tracking-[0.3em] text-[9px] font-black">Nutrient Lab</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-4 flex-grow flex flex-col justify-center w-full">
        <div className="text-center mb-6 space-y-1">
          <p className="text-emerald-500 font-black tracking-[0.5em] text-[10px] uppercase">Soil Synthesis</p>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">Fertilizer <span className="gradient-text italic">Recommendation</span></h1>
        </div>

        <div className="glass-card !rounded-[2rem] !p-8 border-white/5 shadow-2xl flex flex-col justify-between">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl text-emerald-500 mx-auto mb-6">
            <FaFlask />
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Input fields aligned to home theme */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <FaThermometerHalf className="text-emerald-500 text-xs" /> Soil Temp (°C)
              </label>
              <input
                type="number"
                value={soilTemp}
                onChange={(e) => setSoilTemp(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3.5 outline-none focus:border-emerald-500/50 transition-colors text-white text-sm"
                placeholder="0.0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <FaSun className="text-emerald-500 text-xs" /> Soil Humidity (%)
              </label>
              <input
                type="number"
                value={soilHumidity}
                onChange={(e) => setSoilHumidity(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3.5 outline-none focus:border-emerald-500/50 transition-colors text-white text-sm"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <FaWater className="text-emerald-500 text-xs" /> Soil Moisture (%)
              </label>
              <input
                type="number"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3.5 outline-none focus:border-emerald-500/50 transition-colors text-white text-sm"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <FaVial className="text-emerald-500 text-xs" /> Azote (g)
              </label>
              <input
                type="number"
                value={azote}
                onChange={(e) => setAzote(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3.5 outline-none focus:border-emerald-500/50 transition-colors text-white text-sm"
                placeholder="0.0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phosphorous (g)</label>
              <input
                type="number"
                value={phosphorous}
                onChange={(e) => setPhosphorous(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3.5 outline-none focus:border-emerald-500/50 transition-colors text-white text-sm"
                placeholder="0.0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Potassium (g)</label>
              <input
                type="number"
                value={potassium}
                onChange={(e) => setPotassium(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3.5 outline-none focus:border-emerald-500/50 transition-colors text-white text-sm"
                placeholder="0.0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Soil Type</label>
              <select value={soilType} onChange={(e) => setSoilType(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3.5 outline-none focus:border-emerald-500/50 transition-colors text-white text-sm">
                <option value="" className="bg-slate-900">Select Type</option>
                <option value="Clay" className="bg-slate-900">Clay</option>
                <option value="Loamy" className="bg-slate-900">Loamy</option>
                <option value="Sandy" className="bg-slate-900">Sandy</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Crop Type</label>
              <select value={cropType} onChange={(e) => setCropType(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3.5 outline-none focus:border-emerald-500/50 transition-colors text-white text-sm">
                <option value="" className="bg-slate-900">Select Crop</option>
                <option value="Wheat" className="bg-slate-900">Wheat</option>
                <option value="Rice" className="bg-slate-900">Rice</option>
                <option value="Corn" className="bg-slate-900">Corn</option>
              </select>
            </div>

            <button type="submit" className="md:col-span-2 btn-primary !rounded-xl !py-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider mt-2">
              Predict <FaArrowRight className="text-[6px]" />
            </button>
          </form>

          {recommendation && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-xs leading-relaxed tracking-wide italic text-center">
              {recommendation}
            </div>
          )}
        </div>
      </main>

      <footer className="py-4 text-center border-t border-white/5 text-[9px] font-black uppercase tracking-[0.5em] text-slate-800 bg-slate-950/20 backdrop-blur-sm">
        Resilient Roots Lab • Nutrient Intel
      </footer>
    </div>
  );
};

export default FertilizationForm;
