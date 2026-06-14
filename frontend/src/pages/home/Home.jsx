import React from "react";
import "tailwindcss/tailwind.css";
import { Link } from "react-router-dom";
import { FaLeaf, FaFlask, FaCloudSun, FaArrowRight, FaChartLine, FaSeedling, FaWallet, FaHistory } from "react-icons/fa";

// Import original assets
import homeBg from "./HomeBG1.jpeg";
import featuresBg from "./pic1.jpeg";
import servicesBg from "./pic3.jpg";

const Home = () => {
  React.useEffect(() => {
    let userId = localStorage.getItem("rr_anonymous_user_id");
    if (!userId) {
      userId = `rr-user-${Math.random().toString(36).substring(2, 15)}-${Date.now().toString(36)}`;
      localStorage.setItem("rr_anonymous_user_id", userId);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30 font-sans">
      
      {/* Aesthetic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Modern Navbar (Matching Original Brand) */}
      <nav className="relative z-50 px-10 py-8 flex justify-between items-center border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
        <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-3">
          <FaLeaf className="text-emerald-500" />
          <span className="uppercase tracking-[0.2em] text-sm">Resilient Roots AI</span>
        </Link>
      </nav>

      {/* Banner Section (Modified for Visual Impact) */}
      <section className="relative h-[90vh] flex items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            onTimeUpdate={(e) => {
              if (e.target.currentTime >= 8) {
                e.target.currentTime = 0;
              }
            }}
            className="w-full h-full object-cover opacity-40 contrast-125 saturate-75 scale-105"
          >
            <source src="/resiliant_roots_ai.mp4" type="video/mp4" />
            <img src={homeBg} alt="Banner" className="w-full h-full object-cover opacity-30 contrast-125 saturate-50 scale-105" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mb-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 uppercase leading-[0.9]">
            Resilient <br /> <span className="gradient-text italic font-serif">Roots AI</span>
          </h1>
          <p className="text-lg text-slate-400 mb-8 italic font-light tracking-wide">
            Empowering Farmers with Disease Recognition Technology
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/detect" className="btn-primary !rounded-full !px-12">
              Predict the Disease
            </Link>
            <a href="#feature" className="btn-secondary !rounded-full !px-12">
              About us
            </a>
          </div>
        </div>
      </section>

      {/* Features Section (Preserving Original Content) */}
      <section id="feature" className="relative z-10 py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/features_bg.png" alt="Features Background" className="w-full h-full object-cover opacity-30 contrast-110 saturate-100 scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/40 to-slate-950"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 space-y-4">
            <p className="text-emerald-500 font-black tracking-[0.5em] text-xs uppercase">Features</p>
            <h2 className="text-4xl font-black uppercase tracking-tighter">Why is it useful?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: <FaChartLine />, title: "Quick Diagnosis", desc: "AI models make it possible to identify and treat crop diseases quickly and efficiently." },
              { icon: <FaSeedling />, title: "Increase Yield", desc: "With our precise recommendations, farmers can easily maximize the yield of their fields." },
              { icon: <FaWallet />, title: "Reduce Cost", desc: "No need for agricultural experts or advanced crop management tools, reducing production costs." }
            ].map((feature, i) => (
              <div key={i} className="glass-card group hover:bg-emerald-500/5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-light text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section (Preserving Original Content) */}
      <section id="homepg" className="relative z-10 py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={servicesBg} alt="Services Background" className="w-full h-full object-cover opacity-20 contrast-125 saturate-50 scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 space-y-4">
            <p className="text-emerald-500 font-black tracking-[0.5em] text-xs uppercase">Services</p>
            <h2 className="text-4xl font-black uppercase tracking-tighter">We Provide</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <FaLeaf />, title: "Crop Disease prediction", desc: "Predicts plant diseases based on uploaded leaf images.", link: "/detect", btnText: "Predict" },
              { icon: <FaFlask />, title: "Fertilizer Recommendation", desc: "Analyzes N-P-K levels and soil parameters to recommend fertilizers.", link: "/fertilizer", btnText: "Recommend" },
              { icon: <FaCloudSun />, title: "Weather prediction", desc: "Provides weather forecasts to optimize your farming schedules.", link: "/weather", btnText: "Check Weather" },
              { icon: <FaHistory className="text-emerald-500" />, title: "Agricultural History", desc: "View and download your past disease diagnosis and fertilizer reports.", link: "/history", btnText: "View History" }
            ].map((service, i) => (
              <div key={i} className="glass-card text-center flex flex-col items-center group">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-10 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500">
                  {service.icon}
                </div>
                <h3 className="text-xl font-black mb-4 uppercase tracking-tighter leading-tight min-h-[56px] flex items-center justify-center">{service.title}</h3>
                <p className="text-slate-500 text-xs mb-10 leading-relaxed min-h-[50px]">{service.desc}</p>
                <Link to={service.link} className="btn-primary !w-full !rounded-xl !py-4 flex items-center justify-center gap-2 mt-auto">
                  {service.btnText} <FaArrowRight className="text-[8px]" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer (Preserving Original Content) */}
      <footer className="relative z-10 py-20 bg-slate-900/50 border-t border-white/5 px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20">
          <div>
            <h4 className="text-2xl font-black uppercase tracking-tighter mb-8">Resilient Roots AI</h4>
            <div className="space-y-3 text-xs font-bold uppercase tracking-widest text-slate-500">
              <p>preethammr.is23@rvce.edu.in</p>
              <p>shripadgmaradi.cd23@rvce.edu.in</p>
              <p>rohanrgowda.is23@rvce.edu.in</p>
              <p>amoghap.ai23@rvce.edu.in</p>
              <p>navyaghebbar.cd24@rvce.edu.in</p>
            </div>
          </div>
          <div className="md:text-right">
            <h4 className="text-2xl font-black uppercase tracking-tighter mb-8 text-emerald-500">Contact Us</h4>
            <a href="https://github.com/shripad-gm/leaf_disease_detection/" className="text-xs font-black uppercase tracking-[0.3em] hover:text-white transition-colors">Access Our GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;