import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import { FaFileAlt, FaArrowLeft, FaFileDownload, FaMagic, FaShieldAlt } from "react-icons/fa";
import useReport from "../../Hooks/useReport";

const ReportGenerator = () => {
  const location = useLocation();
  const [diseaseName] = useState(location.state?.diseaseName || "");
  const [severity] = useState("mild");
  const [report, setReport] = useState("");
  const { loading, generateReport } = useReport();

  const handleClick = async (e) => {
    e.preventDefault();
    if (!diseaseName.trim()) {
      alert("No disease data detected. Please perform analysis first.");
      return;
    }
    await generateReport(severity, diseaseName, setReport);
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(16, 185, 129); // Emerald color
    doc.text("RESILIENT ROOTS AI - DIAGNOSTIC REPORT", 105, 25, { align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Subject: ${diseaseName.toUpperCase()}`, 20, 45);
    doc.text(`Security Level: ${severity.toUpperCase()}`, 20, 55);
    doc.text(`Timestamp: ${new Date().toLocaleString()}`, 20, 65);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 70, 190, 70);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const reportLines = doc.splitTextToSize(report, 170);
    doc.text(reportLines, 20, 85);

    doc.save(`ResilientRoots_Report_${diseaseName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-emerald-500/30 font-sans">
      
      {/* Home Theme Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-10 py-8 flex justify-between items-center border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
            <FaArrowLeft />
          </div>
          <span className="uppercase tracking-[0.4em] text-[9px] font-black">Archive Access</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black">
            <FaFileAlt />
          </div>
          <span className="uppercase tracking-[0.3em] text-[10px] font-black">Report Engine</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
           <p className="text-emerald-500 font-black tracking-[0.5em] text-[10px] uppercase italic">Diagnostic Synthesis</p>
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">Automated <br /> <span className="gradient-text italic">Intelligence.</span></h1>
        </div>

        <div className="grid gap-10">
          
          {/* Controls Card */}
          <div className="glass-card !rounded-[2.5rem] !p-12 border-white/5 text-center space-y-10">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-4xl text-emerald-500 mx-auto">
              <FaMagic />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-black tracking-tighter uppercase">Generate Remediation Data</h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] max-w-md mx-auto">
                Synthesize a precision remediation report for <br />
                <span className="text-emerald-400 border-b border-emerald-500/30 pb-1">{diseaseName || "Awaiting Data"}</span>
              </p>
            </div>

            <button
              onClick={handleClick}
              disabled={loading || !diseaseName}
              className={`btn-primary !rounded-2xl !py-5 !px-16 flex items-center justify-center gap-3 mx-auto ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? 'Synthesizing...' : 'Initialize Report Generation'}
              {!loading && <FaMagic className="text-xs" />}
            </button>
          </div>

          {/* Results Box */}
          {report && (
            <div className="glass-card !rounded-[2.5rem] !p-12 border-white/5 reveal active">
               <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <FaShieldAlt className="text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Verified Analysis</span>
                  </div>
                  <button 
                    onClick={downloadReport} 
                    className="flex items-center gap-3 text-emerald-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
                  >
                    Download PDF <FaFileDownload />
                  </button>
               </div>

               <textarea
                  value={report}
                  readOnly
                  className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-10 text-slate-400 text-sm leading-relaxed font-light outline-none focus:border-emerald-500/20 transition-all"
                  rows="15"
               />

               <div className="mt-10 text-center">
                  <button onClick={downloadReport} className="btn-primary !rounded-2xl !px-12 flex items-center justify-center gap-3 mx-auto">
                    Export Official PDF <FaFileDownload className="text-xs" />
                  </button>
               </div>
            </div>
          )}

        </div>
      </main>

      <footer className="py-20 text-center border-t border-white/5 text-[9px] font-black uppercase tracking-[1em] text-slate-800">
        Resilient Roots AI • Intelligence Repository
      </footer>
    </div>
  );
};

export default ReportGenerator;
