import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { FaLeaf, FaArrowLeft, FaFlask, FaVial, FaWater, FaThermometerHalf, FaSun, FaArrowRight, FaFileDownload, FaShieldAlt } from 'react-icons/fa';
import useFertilizer from '../../Hooks/useFertilizer';

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

  const { loading, getRecommendation } = useFertilizer();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (soilTemp && soilHumidity && soilMoisture && azote && phosphorous && potassium && soilType && cropType) {
      getRecommendation({
        soilTemp: Number(soilTemp),
        soilHumidity: Number(soilHumidity),
        soilMoisture: Number(soilMoisture),
        azote: Number(azote),
        phosphorous: Number(phosphorous),
        potassium: Number(potassium),
        soilType,
        cropType
      }, async (recText) => {
        setRecommendation(recText);
        try {
          let userId = localStorage.getItem("rr_anonymous_user_id");
          if (!userId) {
            userId = `rr-user-${Math.random().toString(36).substring(2, 15)}-${Date.now().toString(36)}`;
            localStorage.setItem("rr_anonymous_user_id", userId);
          }
          await fetch("/api/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              type: "fertilizer",
              metadata: {
                soilTemp,
                soilHumidity,
                soilMoisture,
                azote,
                phosphorous,
                potassium,
                soilType,
                cropType
              },
              report: recText
            })
          });
        } catch (err) {
          console.error("Failed to save history to MongoDB:", err);
        }
      });
    } else {
      setRecommendation('Error: Incomplete data profile. All parameters are required for precision calculation.');
    }
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let y = 50;

    const drawHeader = (pageNum) => {
      // Header Bar
      doc.setFillColor(0, 30, 20);
      doc.rect(0, 0, 210, 40, 'F');
      
      // Page Border
      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(0.8);
      doc.rect(5, 5, 200, 287, 'D');

      // Title & Branding
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(52, 211, 153);
      doc.text("RESILIENT ROOTS AI", 20, 20);
      
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text("SOIL SYNTHESIS & NUTRIENT RECOMMENDATION SYSTEM", 20, 28);
      doc.text(`REPORT ID: RR-FERT-${Math.random().toString(36).substr(2, 9).toUpperCase()} • PAGE ${pageNum}`, 20, 34);

      // Diagnostic Seal
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

    // 1. Soil Parameters Header Block
    doc.setFillColor(248, 252, 250);
    doc.rect(15, 45, 180, 30, 'F');
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.4);
    doc.rect(15, 45, 180, 30, 'D');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.text("TARGET CROP:", 20, 52);
    doc.setFontSize(13);
    doc.setTextColor(0, 80, 60);
    doc.text(cropType.toUpperCase(), 20, 60);

    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.text("SOIL TYPE:", 20, 67);
    doc.setFontSize(11);
    doc.setTextColor(0, 80, 60);
    doc.text(soilType.toUpperCase(), 20, 72);

    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.text("SOIL PARAMETERS (N-P-K):", 125, 52);
    doc.setFontSize(9);
    doc.setTextColor(0, 80, 60);
    doc.text(`N: ${azote}g  P: ${phosphorous}g  K: ${potassium}g`, 125, 60);
    doc.text(`Temp: ${soilTemp}°C  Humidity: ${soilHumidity}%  Moisture: ${soilMoisture}%`, 125, 66);

    y = 86;

    const rawLines = recommendation.split('\n');
    doc.setLineHeightFactor(1.5);

    rawLines.forEach((line) => {
      line = line.trim();
      if (!line) { y += 4; return; }

      if (y > pageHeight - 35) {
        doc.addPage();
        drawHeader(doc.internal.getNumberOfPages());
        y = 50;
      }

      // --- SECTION HEADINGS ---
      if (/^\d+\./.test(line) || line.startsWith('#') || line.toLowerCase().includes('summary') || line.toLowerCase().includes('diagnosis') || line.toLowerCase().includes('recommendation') || line.toLowerCase().includes('tips')) {
        y += 6;
        if (y > pageHeight - 35) { doc.addPage(); drawHeader(doc.internal.getNumberOfPages()); y = 50; }
        doc.setFillColor(245, 252, 250);
        doc.setDrawColor(16, 185, 129);
        doc.rect(15, y - 5, 180, 10, 'FD');
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(10, 80, 60);
        doc.text(line.replace(/[#*]/g, '').toUpperCase(), 22, y + 2);
        y += 14;
      } 
      // --- TABLES ---
      else if (line.startsWith('|')) {
        if (line.includes('---')) return;
        const cells = line.split('|').filter(c => c.trim().length > 0 || line.indexOf('|'+c+'|') !== -1);
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
        const isHeader = line.toLowerCase().includes('fertilizer') || line.toLowerCase().includes('type') || line.toLowerCase().includes('product') || line.toLowerCase().includes('dosage');
        
        cellData.forEach((wrappedText) => {
          const originalText = wrappedText.join(' ');
          const hasBold = originalText.includes('*'); // Detects * or **
          const cleanText = wrappedText.map(t => t.replace(/\*/g, ''));
          
          if (isHeader) {
            doc.setFillColor(16, 185, 129);
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
          } else {
            doc.setFillColor(255, 255, 255);
            doc.setTextColor(hasBold ? 10 : 60, hasBold ? 80 : 60, hasBold ? 60 : 60);
            doc.setFont("helvetica", hasBold ? "bold" : "normal");
          }
          
          doc.setDrawColor(200, 210, 205);
          doc.rect(x, y - 4, colWidth, rowHeight, 'FD');
          doc.text(cleanText, x + 2, y);
          x += colWidth;
        });
        y += rowHeight;
      } 
      // --- BULLETS & TEXT ---
      else {
        doc.setFontSize(9.5);
        let xOffset = 15;
        const hasBold = line.includes('*');
        const cleanContent = line.replace(/\*/g, '');

        if (line.startsWith('-')) {
          doc.setTextColor(16, 185, 129);
          doc.setFont("helvetica", "bold");
          doc.text("•", 15, y);
          xOffset = 20;
          
          doc.setTextColor(hasBold ? 10 : 60, hasBold ? 80 : 60, hasBold ? 60 : 60);
          doc.setFont("helvetica", hasBold ? "bold" : "normal");
          const wrapped = doc.splitTextToSize(cleanContent.substring(1).trim(), 175);
          doc.text(wrapped, xOffset, y);
          y += (wrapped.length * 5) + 1;
        } else {
          doc.setTextColor(hasBold ? 10 : 60, hasBold ? 80 : 60, hasBold ? 60 : 60);
          doc.setFont("helvetica", hasBold ? "bold" : "normal");
          const wrapped = doc.splitTextToSize(cleanContent, 180);
          doc.text(wrapped, xOffset, y);
          y += (wrapped.length * 5) + 1;
        }
      }
    });

    // Final Disclaimer
    doc.setFontSize(6);
    doc.setTextColor(180, 180, 180);
    doc.text("DISCLAIMER: THIS AI-GENERATED REPORT IS FOR INFORMATIONAL PURPOSES ONLY. CONSULT LOCAL AGRICULTURAL AUTHORITIES BEFORE APPLYING CHEMICAL TREATMENTS.", 105, 288, { align: "center" });

    doc.save(`ResilientRoots_Fertilizer_Report_${cropType.replace(/\s+/g, '_')}.pdf`);
  };


  const formatReport = (text) => {
    if (!text) return "";
    let lines = text.split('\n');
    let html = [];
    let inTable = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      
      // Handle Markdown Tables
      if (line.startsWith('|')) {
        if (!inTable) {
          html.push('<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-emerald-500/30 bg-emerald-500/5 text-xs">');
          inTable = true;
        }
        let cells = line.split('|').filter(c => c.trim() !== '' || line.indexOf('|'+c+'|') !== -1);
        if (line.includes('---')) continue;

        html.push('<tr class="border-b border-emerald-500/20">');
        cells.forEach(cell => {
          let cellContent = cell.trim()
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
            .replace(/\*(.*?)\*/g, '<b>$1</b>');
          html.push(`<td class="p-2.5 border-r border-emerald-500/10 text-slate-200">${cellContent}</td>`);
        });
        html.push('</tr>');
        continue;
      } else if (inTable) {
        html.push('</table></div>');
        inTable = false;
      }

      // Handle normal lines with support for ** and *
      let formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-400 font-bold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<strong class="text-emerald-400 font-bold">$1</strong>');
      
      if (line.startsWith('-')) {
        html.push(`<li class="ml-4 mb-1 list-disc text-slate-300 font-light">${formattedLine.substring(1).trim()}</li>`);
      } else if (line.length > 0) {
        html.push(`<p class="mb-2 text-slate-300 leading-relaxed font-light">${formattedLine}</p>`);
      }
    }
    return html.join('');
  };


  return (
    <div className="h-screen flex flex-col justify-between bg-slate-950 text-slate-100 overflow-y-auto selection:bg-emerald-500/30 font-sans">
      
      {/* Dynamic Background Image */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/fertilizer_bg.png"
          alt="Fertilizer Background"
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
          className="opacity-40 contrast-115 saturate-110"
        />
        <div className="absolute inset-0 bg-slate-950/45"></div>
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
                <option value="Potato" className="bg-slate-900">Potato</option>
                <option value="Tomato" className="bg-slate-900">Tomato</option>
                <option value="Soybean" className="bg-slate-900">Soybean</option>
                <option value="Apple" className="bg-slate-900">Apple</option>
                <option value="Grape" className="bg-slate-900">Grape</option>
                <option value="Pepper" className="bg-slate-900">Pepper</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="md:col-span-2 btn-primary !rounded-xl !py-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider mt-2">
              {loading ? 'Synthesizing...' : 'Predict'} {loading ? <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div> : <FaArrowRight className="text-[6px]" />}
            </button>
          </form>

          {recommendation && (
            <div className="mt-8 p-6 rounded-2xl bg-slate-900/60 border border-emerald-500/20 text-slate-200 text-xs leading-relaxed tracking-wide text-left relative overflow-hidden">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">
                     <FaShieldAlt className="text-emerald-400" />
                  </div>
                  <div>
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 block leading-none">Verified Protocol</span>
                     <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500 italic">Optimized Recommendation</span>
                  </div>
                </div>
                <button 
                  onClick={downloadReport} 
                  className="group px-4 py-2 bg-white/5 hover:bg-emerald-500 hover:text-black border border-white/10 hover:border-emerald-500 rounded-lg transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em]"
                >
                  Download PDF <FaFileDownload className="group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>

              <div 
                className="prose prose-invert max-w-none text-[13px] font-light text-slate-300 space-y-4"
                dangerouslySetInnerHTML={{ __html: formatReport(recommendation) }}
              />

              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={downloadReport} className="group px-8 py-4 bg-emerald-500 text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all hover:shadow-[0_15px_30px_rgba(52,211,153,0.3)] flex items-center gap-2 justify-center w-full sm:w-auto">
                  Export Official PDF <FaFileDownload />
                </button>
                <button onClick={() => {
                  setSoilTemp('');
                  setSoilHumidity('');
                  setSoilMoisture('');
                  setAzote('');
                  setPhosphorous('');
                  setPotassium('');
                  setSoilType('');
                  setCropType('');
                  setRecommendation('');
                }} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-xl border border-white/10 transition-all justify-center w-full sm:w-auto">
                  Reset Analysis
                </button>
              </div>
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
