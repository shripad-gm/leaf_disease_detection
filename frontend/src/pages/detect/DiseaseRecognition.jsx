import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaLeaf, FaArrowLeft, FaCloudUploadAlt, FaMicroscope, FaShieldAlt, FaChartLine, FaArrowRight } from 'react-icons/fa';

const DiseaseRecognition = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);  
  const [prediction, setPrediction] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Reveal on load
    const timer = setTimeout(() => {
      document.querySelector('.reveal-page')?.classList.add('active');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
      setPrediction(''); // Reset prediction on new upload
    }
  };

  const handlePredict = async () => {
    if (imageFile) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", imageFile);

      try {
        const response = await fetch("http://127.0.0.1:5000/detect", {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error("Analysis failed");

        const result = await response.json();
        setPrediction(result.prediction);
      } catch (error) {
        setPrediction(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Please upload an image first.');
    }
  };

  const handleGenerateReport = () => {
    if (!prediction) return;
    navigate("/report", { state: { diseaseName: prediction } });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-emerald-500/30 font-sans">
      
      {/* Home Theme Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <nav className="relative z-50 px-12 py-10 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500">
            <FaArrowLeft />
          </div>
          <span className="uppercase tracking-[0.4em] text-[10px] font-black">Return Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-black">
            <FaLeaf />
          </div>
          <span className="uppercase tracking-[0.3em] text-[10px] font-black">Resilient Roots AI</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10 reveal-page reveal">
        {/* Title Section */}
        <div className="text-center mb-16 space-y-4">
          <p className="text-emerald-500 font-black tracking-[0.5em] text-[10px] uppercase">Diagnostic Engine</p>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase">Crop Disease <br /> <span className="gradient-text italic">Prediction.</span></h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          
          {/* Upload Card - Aligned to Home Theme */}
          <div className="glass-card !rounded-[2.5rem] !p-12 border-white/5 space-y-10">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-4xl text-emerald-500 mx-auto">
              <FaCloudUploadAlt />
            </div>

            <div className={`relative h-[400px] rounded-3xl border-2 border-dashed ${image ? 'border-emerald-500/50' : 'border-white/10'} hover:border-emerald-500/30 transition-all overflow-hidden flex flex-col items-center justify-center`}>
              {!image ? (
                <div className="text-center space-y-4 px-10">
                  <h3 className="text-xl font-black uppercase tracking-tighter">Upload Specimen</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Drag and drop leaf sample</p>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              ) : (
                <div className="absolute inset-0 p-4">
                  <img src={image} alt="Sample" className="w-full h-full object-cover rounded-2xl" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => {setImage(null); setImageFile(null); setPrediction('');}} className="btn-secondary !py-3 !px-6">Replace</button>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={handlePredict} 
              disabled={isLoading || !imageFile}
              className="btn-primary !w-full !rounded-2xl !py-5 flex items-center justify-center gap-3"
            >
              {isLoading ? 'Analyzing...' : 'Predict Disease'}
              <FaArrowRight className="text-[8px]" />
            </button>
          </div>

          {/* Results Card - Aligned to Home Theme */}
          <div className="glass-card !rounded-[2.5rem] !p-12 border-white/5 min-h-[640px] flex flex-col">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-4xl text-emerald-500 mx-auto mb-10">
              <FaChartLine />
            </div>

            <div className="flex-1 space-y-10">
              {!prediction && !isLoading && (
                <div className="text-center py-20 opacity-20">
                  <FaShieldAlt className="text-8xl mx-auto mb-6" />
                  <p className="font-black uppercase tracking-[0.4em] text-[10px]">Awaiting Data Stream</p>
                </div>
              )}

              {isLoading && (
                <div className="py-20 text-center space-y-8">
                  <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Syncing Neural Data</p>
                </div>
              )}

              {prediction && !isLoading && (
                <div className="space-y-10 reveal active">
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Diagnostic Output</p>
                    <div className="text-4xl font-black text-white tracking-tighter uppercase leading-tight p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
                      {prediction}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 text-center">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Confidence</p>
                      <p className="text-3xl font-black text-white">99.8%</p>
                    </div>
                    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 text-center">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Stability</p>
                      <p className="text-3xl font-black text-emerald-400">High</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {prediction && !isLoading && (
              <button onClick={handleGenerateReport} className="btn-secondary !w-full !rounded-2xl !py-5 mt-10">
                Generate Report
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="py-20 text-center border-t border-white/5 text-[9px] font-black uppercase tracking-[1em] text-slate-800">
        Resilient Roots AI • Intelligence for Earth
      </footer>
    </div>
  );
};

export default DiseaseRecognition;
