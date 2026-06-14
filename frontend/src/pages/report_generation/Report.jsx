import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import { FaFileAlt, FaArrowLeft, FaFileDownload, FaMagic, FaShieldAlt, FaLeaf } from "react-icons/fa";
import useReport from "../../Hooks/useReport";

const ReportGenerator = () => {
  const location = useLocation();
  const [diseaseName] = useState(location.state?.diseaseName || "");
  const [imageBase64] = useState(location.state?.imageBase64 || null);
  const [severity] = useState("mild");
  const [report, setReport] = useState("");
  const { loading, generateReport } = useReport();

  const handleClick = async (e) => {
    e.preventDefault();
    if (!diseaseName.trim()) {
      alert("No disease data detected. Please perform analysis first.");
      return;
    }
    await generateReport(severity, diseaseName, setReport, imageBase64);
  };

  const formatReport = (text) => {
    if (!text) return "";
    let lines = text.split('\n');
    let html = [];
    let inTable = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      
      if (line.startsWith('|')) {
        if (!inTable) {
          html.push('<div class="overflow-x-auto my-6"><table class="w-full border-collapse border border-emerald-500/30 bg-emerald-500/5 text-sm">');
          inTable = true;
        }
        let cells = line.split('|').filter(c => c.trim() !== '' || line.indexOf('|'+c+'|') !== -1);
        if (line.includes('---')) continue;

        html.push('<tr class="border-b border-emerald-500/20">');
        cells.forEach(cell => {
          let cellContent = cell.trim()
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
            .replace(/\*(.*?)\*/g, '<b>$1</b>');
          html.push(`<td class="p-3 border-r border-emerald-500/10 text-slate-200">${cellContent}</td>`);
        });
        html.push('</tr>');
        continue;
      } else if (inTable) {
        html.push('</table></div>');
        inTable = false;
      }

      let formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-400 font-bold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<strong class="text-emerald-400 font-bold">$1</strong>');
      
      if (line.startsWith('-')) {
        html.push(`<li class="ml-6 mb-2 list-disc text-slate-300 font-light">${formattedLine.substring(1)}</li>`);
      } else if (line.length > 0) {
        html.push(`<p class="mb-4 text-slate-300 leading-relaxed font-light">${formattedLine}</p>`);
      }
    }
    return html.join('');
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let y = 50;

    const drawHeader = (pageNum) => {
      doc.setFillColor(0, 30, 20);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(0.8);
      doc.rect(5, 5, 200, 287, 'D');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(52, 211, 153);
      doc.text("RESILIENT ROOTS AI", 20, 20);
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text("GLOBAL PRECISION AGRICULTURE DIAGNOSTIC SERVICE", 20, 28);
      doc.text(`REPORT ID: RR-${Math.random().toString(36).substr(2, 9).toUpperCase()} • PAGE ${pageNum}`, 20, 34);
      doc.setDrawColor(52, 211, 153);
      doc.setFillColor(0, 50, 40);
      doc.circle(180, 20, 12, 'FD');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(6);
      doc.text("AI CERTIFIED", 180, 18, { align: "center" });
      doc.setFontSize(10);
      doc.text("VERIFIED", 180, 24, { align: "center" });
    };

    drawHeader(1);

    // Embed leaf image if available
    if (imageBase64) {
      try {
        const imgFormat = imageBase64.startsWith('data:image/png') ? 'PNG' : 'JPEG';
        doc.addImage(imageBase64, imgFormat, 15, 45, 50, 40);
        // Disease name block beside the image
        doc.setFillColor(248, 252, 250);
        doc.rect(70, 45, 125, 40, 'F');
        doc.setDrawColor(16, 185, 129);
        doc.setLineWidth(0.4);
        doc.rect(70, 45, 125, 40, 'D');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text("PRIMARY IDENTIFICATION:", 75, 54);
        doc.setFontSize(13);
        doc.setTextColor(0, 80, 60);
        doc.text(diseaseName.toUpperCase(), 75, 65);
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text("SEVERITY:", 75, 74);
        doc.setTextColor(200, 50, 50);
        doc.setFontSize(11);
        doc.text(severity.toUpperCase(), 75, 82);
        y = 97;
      } catch {
        // fallback without image
        doc.setFillColor(248, 252, 250);
        doc.rect(15, 45, 180, 25, 'F');
        doc.setDrawColor(16, 185, 129);
        doc.setLineWidth(0.4);
        doc.rect(15, 45, 180, 25, 'D');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text("PRIMARY IDENTIFICATION:", 20, 52);
        doc.setFontSize(16);
        doc.setTextColor(0, 80, 60);
        doc.text(diseaseName.toUpperCase(), 20, 63);
        y = 82;
      }
    } else {
      doc.setFillColor(248, 252, 250);
      doc.rect(15, 45, 180, 25, 'F');
      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(0.4);
      doc.rect(15, 45, 180, 25, 'D');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text("PRIMARY IDENTIFICATION:", 20, 52);
      doc.setFontSize(16);
      doc.setTextColor(0, 80, 60);
      doc.text(diseaseName.toUpperCase(), 20, 63);
      doc.setFontSize(8);
      doc.text("ANALYSIS SEVERITY:", 145, 52);
      doc.setTextColor(severity.toLowerCase() === 'mild' ? 50 : 200, 50, 50);
      doc.setFontSize(14);
      doc.text(severity.toUpperCase(), 145, 63);
      y = 82;
    }

    const rawLines = report.split('\n');
    doc.setLineHeightFactor(1.5);

    rawLines.forEach((line) => {
      line = line.trim();
      if (!line) { y += 4; return; }

      if (y > pageHeight - 35) {
        doc.addPage();
        drawHeader(doc.internal.getNumberOfPages());
        y = 50;
      }

      if (/^\d+\./.test(line) || line.startsWith('#') || line.toLowerCase().includes('summary')) {
        y += 6;
        doc.setFillColor(245, 252, 250);
        doc.setDrawColor(16, 185, 129);
        doc.rect(15, y - 5, 180, 10, 'FD');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(10, 80, 60);
        doc.text(line.replace(/[#*]/g, '').toUpperCase(), 22, y + 2);
        y += 14;
      } else if (line.startsWith('|')) {
        if (line.includes('---')) return;
        const cells = line.split('|').filter(c => c.trim().length > 0);
        if (cells.length === 0) return;
        const colWidth = 180 / cells.length;
        doc.setFontSize(8);
        let maxLines = 1;
        const cellData = cells.map(c => {
          const wrapped = doc.splitTextToSize(c.trim().replace(/\*\*/g, ''), colWidth - 4);
          if (wrapped.length > maxLines) maxLines = wrapped.length;
          return wrapped;
        });
        const rowHeight = (maxLines * 4) + 4;
        if (y + rowHeight > pageHeight - 20) { doc.addPage(); drawHeader(doc.internal.getNumberOfPages()); y = 50; }
        let x = 15;
        const isHeader = line.toLowerCase().includes('type') || line.toLowerCase().includes('product');
        cellData.forEach((wrappedText) => {
          const cleanText = wrappedText.map(t => t.replace(/\*/g, ''));
          if (isHeader) {
            doc.setFillColor(16, 185, 129);
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
          } else {
            doc.setFillColor(255, 255, 255);
            doc.setTextColor(60, 60, 60);
            doc.setFont("helvetica", "normal");
          }
          doc.setDrawColor(200, 210, 205);
          doc.rect(x, y - 4, colWidth, rowHeight, 'FD');
          doc.text(cleanText, x + 2, y);
          x += colWidth;
        });
        y += rowHeight;
      } else {
        doc.setFontSize(9.5);
        let xOffset = 15;
        const cleanContent = line.replace(/\*/g, '');
        if (line.startsWith('-')) {
          doc.setTextColor(16, 185, 129);
          doc.setFont("helvetica", "bold");
          doc.text("•", 15, y);
          xOffset = 20;
          doc.setTextColor(60, 60, 60);
          doc.setFont("helvetica", "normal");
          const wrapped = doc.splitTextToSize(cleanContent.substring(1).trim(), 175);
          doc.text(wrapped, xOffset, y);
          y += (wrapped.length * 5) + 1;
        } else {
          doc.setTextColor(60, 60, 60);
          doc.setFont("helvetica", "normal");
          const wrapped = doc.splitTextToSize(cleanContent, 180);
          doc.text(wrapped, xOffset, y);
          y += (wrapped.length * 5) + 1;
        }
      }
    });

    doc.setFontSize(6);
    doc.setTextColor(180, 180, 180);
    doc.text("DISCLAIMER: THIS AI-GENERATED REPORT IS FOR INFORMATIONAL PURPOSES ONLY. CONSULT LOCAL AGRICULTURAL AUTHORITIES BEFORE APPLYING CHEMICAL TREATMENTS.", 105, 288, { align: "center" });
    doc.save(`ResilientRoots_Certified_Report_${diseaseName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="h-screen flex flex-col justify-between bg-slate-950 text-slate-100 overflow-y-auto selection:bg-emerald-500/30 font-sans">
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/report_bg.png"
          alt="Report Background"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.15)', transformOrigin: 'top left' }}
          className="opacity-40 contrast-115 saturate-110"
        />
        <div className="absolute inset-0 bg-slate-950/45"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-8 py-4 flex justify-between items-center border-b border-white/5 bg-slate-950/20 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-emerald-400 group-hover:bg-emerald-400 group-hover:text-black transition-all shadow-[0_0_20px_rgba(52,211,153,0.2)]">
            <FaArrowLeft className="text-xs" />
          </div>
          <span className="uppercase tracking-[0.4em] text-[9px] font-black text-slate-400 group-hover:text-white transition-colors">Return</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
            <span className="uppercase tracking-[0.2em] text-[8px] font-black text-emerald-400">Live Engine</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-4 flex-grow flex flex-col justify-center w-full">
        
        {/* Header */}
        <div className="text-center mb-6 space-y-1">
           <p className="text-emerald-400 font-black tracking-[0.5em] text-[9px] uppercase italic">Precision Intelligence</p>
           <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
             Remediation <span className="gradient-text italic">Protocol</span>
           </h1>
        </div>

        <div className="grid gap-6">
          
          {/* Controls Card — shown before report is generated */}
          {!report && (
            <div className="glass-card !rounded-[2rem] !p-8 border-white/10 text-center space-y-6 shadow-2xl relative overflow-hidden group max-w-2xl mx-auto w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Show uploaded leaf image preview */}
              {imageBase64 && (
                <div className="mx-auto w-32 h-32 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-[0_0_30px_rgba(52,211,153,0.15)]">
                  <img src={imageBase64} alt="Leaf specimen" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl text-emerald-400 mx-auto shadow-[0_0_40px_rgba(52,211,153,0.1)]">
                <FaMagic className="animate-pulse" />
              </div>
              
              <div className="space-y-3 relative z-10">
                <h3 className="text-2xl font-black tracking-tighter uppercase">Generate Action Plan</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] max-w-md mx-auto leading-relaxed">
                  Synthesizing medical-grade remediation <br />
                  <span className="text-emerald-400 text-xs mt-1 block">{diseaseName || "System Idle"}</span>
                </p>
              </div>

              <button
                onClick={handleClick}
                disabled={loading || !diseaseName}
                className={`group relative px-8 py-4 bg-emerald-500 text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(52,211,153,0.3)] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="flex items-center gap-3">
                  {loading ? 'Processing Data...' : 'Initialize Generation'}
                  {!loading && <FaMagic className="text-xs group-hover:rotate-12 transition-transform" />}
                </span>
              </button>
            </div>
          )}

          {/* Report Results */}
          {report && (
            <div className="glass-card !rounded-[2rem] !p-6 border-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.1)] reveal active max-w-4xl mx-auto w-full">
               <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">

                    {/* Leaf image thumbnail in report header */}
                    {imageBase64 && (
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-emerald-500/30 flex-shrink-0">
                        <img src={imageBase64} alt="Leaf" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">
                         <FaShieldAlt className="text-emerald-400" />
                      </div>
                      <div>
                         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 block leading-none">Verified Protocol</span>
                         <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500 italic">{diseaseName.replace(/_/g, ' ')}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={downloadReport} 
                    className="group px-4 py-2 bg-white/5 hover:bg-emerald-500 hover:text-black border border-white/10 hover:border-emerald-500 rounded-lg transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em]"
                  >
                    Download PDF <FaFileDownload className="group-hover:translate-y-0.5 transition-transform" />
                  </button>
               </div>

               {/* Rich Text Area */}
               <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <div className="relative bg-slate-900/40 border border-white/5 rounded-2xl p-6 max-h-[480px] overflow-y-auto custom-scrollbar shadow-inner">
                     <div 
                       className="prose prose-invert max-w-none text-sm md:text-base"
                       dangerouslySetInnerHTML={{ __html: formatReport(report) }}
                     />
                  </div>
               </div>

               <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={downloadReport} className="group px-8 py-4 bg-emerald-500 text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all hover:shadow-[0_15px_30px_rgba(52,211,153,0.3)] flex items-center gap-2 justify-center">
                    Export Official PDF <FaFileDownload />
                  </button>
                  <button onClick={() => window.location.reload()} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-xl border border-white/10 transition-all justify-center">
                    Reset Analysis
                  </button>
               </div>
            </div>
          )}

        </div>
      </main>

      <footer className="py-4 text-center border-t border-white/5 text-[9px] font-black uppercase tracking-[0.5em] text-slate-800 bg-slate-950/20 backdrop-blur-sm">
        Resilient Roots AI • Global Registry
      </footer>
    </div>
  );
};

export default ReportGenerator;
