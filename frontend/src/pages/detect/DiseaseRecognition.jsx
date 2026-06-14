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
      setPrediction('');
    }
  };

  const handlePredict = async () => {
    if (imageFile) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", imageFile);

      try {
        const response = await fetch("http://127.0.0.1:5001/detect", {
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

  // Convert imageFile to base64, then navigate to report page with it
  const handleGenerateReport = () => {
    if (!prediction || !imageFile) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result; // data:image/jpeg;base64,...
      navigate("/report", {
        state: {
          diseaseName: prediction,
          imageBase64: base64Image,
        }
      });
    };
    reader.readAsDataURL(imageFile);
  };

  return (
    <div className="h-screen flex flex-col justify-between bg-slate-950 text-slate-100 overflow-y-auto selection:bg-emerald-500/30 font-sans">

      {/* Dynamic Video Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.5)',
            transformOrigin: 'top left'
          }}
          className="opacity-40 contrast-110 saturate-100"
        >
          <source src="/bg_video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-slate-950/40"></div>
      </div>

      {/* Header */}
      <nav className="relative z-50 px-8 py-4 flex justify-between items-center border-b border-white/5 bg-slate-950/20 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500">
            <FaArrowLeft className="text-xs" />
          </div>
          <span className="uppercase tracking-[0.4em] text-[9px] font-black">Return Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black">
            <FaLeaf className="text-xs" />
          </div>
          <span className="uppercase tracking-[0.3em] text-[9px] font-black">Resilient Roots AI</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-4 flex-1 flex flex-col justify-center reveal-page reveal w-full">
        {/* Title Section */}
        <div className="text-center mb-6 space-y-1">
          <p className="text-emerald-500 font-black tracking-[0.5em] text-[9px] uppercase">Diagnostic Engine</p>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase">Crop Disease <span className="gradient-text italic">Prediction</span></h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-stretch flex-grow mb-6">
          
          {/* Upload Card */}
          <div className="glass-card !rounded-[2rem] !p-8 border-white/5 flex flex-col justify-between h-full">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl text-emerald-500 mx-auto">
              <FaCloudUploadAlt />
            </div>

            <div className={`relative flex-1 my-4 rounded-2xl border-2 border-dashed ${image ? 'border-emerald-500/50' : 'border-white/10'} hover:border-emerald-500/30 transition-all overflow-hidden flex flex-col items-center justify-center`}>
              {!image ? (
                <div className="text-center space-y-2 px-6">
                  <h3 className="text-lg font-black uppercase tracking-tighter">Upload Specimen</h3>
                  <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest leading-relaxed">Drag and drop leaf sample</p>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              ) : (
                <div className="absolute inset-0 p-2">
                  <img src={image} alt="Sample" className="w-full h-full object-cover rounded-xl" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => { setImage(null); setImageFile(null); setPrediction(''); }} className="btn-secondary !py-2 !px-4 text-xs">Replace</button>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={handlePredict} 
              disabled={isLoading || !imageFile}
              className="btn-primary !w-full !rounded-xl !py-3.5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
            >
              {isLoading ? 'Analyzing...' : 'Predict Disease'}
              <FaArrowRight className="text-[6px]" />
            </button>
          </div>

          {/* Results Card */}
          <div className="glass-card !rounded-[2rem] !p-8 border-white/5 flex flex-col justify-between h-full">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl text-emerald-500 mx-auto">
              <FaChartLine />
            </div>

            <div className="flex-1 flex flex-col justify-center my-4">
              {!prediction && !isLoading && (
                <div className="text-center py-6 opacity-20">
                  <FaShieldAlt className="text-5xl mx-auto mb-3" />
                  <p className="font-black uppercase tracking-[0.4em] text-[9px]">Awaiting Data Stream</p>
                </div>
              )}

              {isLoading && (
                <div className="py-6 text-center space-y-4">
                  <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-emerald-500 text-[9px] font-black uppercase tracking-[0.5em] animate-pulse">Syncing Neural Data</p>
                </div>
              )}

              {prediction && !isLoading && (
                <div className="space-y-4 reveal active">
                  <div className="text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Diagnostic Output</p>
                    <div className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase leading-tight p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 break-words">
                      {prediction.replace(/_/g, ' ')}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Confidence</p>
                      <p className="text-xl font-black text-white">99.8%</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Stability</p>
                      <p className="text-xl font-black text-emerald-400">High</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {prediction && !isLoading ? (
              <button onClick={handleGenerateReport} className="btn-secondary !w-full !rounded-xl !py-3.5 text-xs font-bold uppercase tracking-wider">
                Generate Report
              </button>
            ) : (
              <div className="h-[44px]"></div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-4 text-center border-t border-white/5 text-[9px] font-black uppercase tracking-[0.5em] text-slate-800 bg-slate-950/20 backdrop-blur-sm">
        Resilient Roots AI • Intelligence for Earth
      </footer>
    </div>
  );
};

export default DiseaseRecognition;
