import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { 
  FaLeaf, FaFlask, FaArrowLeft, FaHistory, FaCalendarAlt, FaTrash, 
  FaEye, FaFileDownload, FaShieldAlt, FaTrashAlt, FaSeedling 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const HistoryPage = () => {
  const { authUser } = useAuthContext();
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const userId = authUser?._id;

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/history?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      setHistoryList(data);
    } catch (error) {
      console.error(error);
      toast.error("Error loading history: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDeleteItem = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this history item?")) return;

    try {
      const res = await fetch(`/api/history/${id}?userId=${userId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete history item");
      toast.success("History item deleted");
      if (selectedItem && selectedItem._id === id) {
        setSelectedItem(null);
      }
      fetchHistory();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear all your history from MongoDB? This action is permanent!")) return;

    try {
      const res = await fetch(`/api/history/clear?userId=${userId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to clear history");
      toast.success("All history cleared successfully");
      setSelectedItem(null);
      fetchHistory();
    } catch (error) {
      toast.error(error.message);
    }
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

  const downloadPDFReport = (item) => {
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
      const docSubtitle = item.type === "disease" 
        ? "GLOBAL PRECISION AGRICULTURE DIAGNOSTIC SERVICE"
        : "SOIL SYNTHESIS & NUTRIENT RECOMMENDATION SYSTEM";
      doc.text(docSubtitle, 20, 28);
      doc.text(`REPORT ID: RR-HIST-${Math.random().toString(36).substr(2, 9).toUpperCase()} • PAGE ${pageNum}`, 20, 34);

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

    // Header Blocks based on report type
    if (item.type === "disease") {
      if (item.metadata.imageBase64) {
        try {
          const imgFmt = item.metadata.imageBase64.startsWith('data:image/png') ? 'PNG' : 'JPEG';
          doc.addImage(item.metadata.imageBase64, imgFmt, 15, 45, 50, 40);
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
          doc.text((item.metadata.diseaseName || "Unknown Disease").toUpperCase(), 75, 65);
          doc.setFontSize(8);
          doc.setTextColor(120, 120, 120);
          doc.text("SEVERITY:", 75, 74);
          doc.setTextColor(200, 50, 50);
          doc.setFontSize(11);
          doc.text((item.metadata.severity || "MILD").toUpperCase(), 75, 82);
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
          doc.text((item.metadata.diseaseName || "Unknown Disease").toUpperCase(), 20, 63);
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
        doc.text((item.metadata.diseaseName || "Unknown Disease").toUpperCase(), 20, 63);
        doc.setFontSize(8);
        doc.text("ANALYSIS SEVERITY:", 145, 52);
        doc.setTextColor(200, 50, 50);
        doc.setFontSize(14);
        doc.text((item.metadata.severity || "MILD").toUpperCase(), 145, 63);
        y = 82;
      }
    } else {
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
      doc.text((item.metadata.cropType || "Unknown").toUpperCase(), 20, 60);

      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 120);
      doc.text("SOIL TYPE:", 20, 67);
      doc.setFontSize(11);
      doc.setTextColor(0, 80, 60);
      doc.text((item.metadata.soilType || "Unknown").toUpperCase(), 20, 72);

      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 120);
      doc.text("SOIL PARAMETERS (N-P-K):", 125, 52);
      doc.setFontSize(9);
      doc.setTextColor(0, 80, 60);
      doc.text(`N: ${item.metadata.azote || '0'}g  P: ${item.metadata.phosphorous || '0'}g  K: ${item.metadata.potassium || '0'}g`, 125, 60);
      doc.text(`Temp: ${item.metadata.soilTemp || '0'}°C  Humidity: ${item.metadata.soilHumidity || '0'}%  Moisture: ${item.metadata.soilMoisture || '0'}%`, 125, 66);
      y = 86;
    }

    const rawLines = item.report.split('\n');
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
      if (/^\d+\./.test(line) || line.startsWith('#') || line.toLowerCase().includes('summary') || line.toLowerCase().includes('diagnosis') || line.toLowerCase().includes('recommendation') || line.toLowerCase().includes('tips') || line.toLowerCase().includes('solution')) {
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
          const hasBold = originalText.includes('*');
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

    const filename = item.type === "disease" 
      ? `ResilientRoots_Certified_Report_${(item.metadata.diseaseName || "Report").replace(/\s+/g, '_')}.pdf`
      : `ResilientRoots_Fertilizer_Report_${(item.metadata.cropType || "Report").replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 overflow-y-auto selection:bg-emerald-500/30 font-sans">
      
      {/* Dynamic Image Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/history_bg.png"
          alt="History Background"
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
          className="opacity-40 contrast-110 saturate-100"
        />
        <div className="absolute inset-0 bg-slate-950/60"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-emerald-600/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]"></div>
      </div>

      {/* Navigation */}
      <Navbar />

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8 flex-grow w-full flex flex-col">
        {/* Title */}
        <div className="text-center mb-8 space-y-1">
          <p className="text-emerald-400 font-black tracking-[0.5em] text-[9px] uppercase italic">MongoDB Repository</p>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
            Agricultural <span className="gradient-text italic">History</span>
          </h1>
        </div>

        {/* Action Header */}
        {historyList.length > 0 && (
          <div className="flex justify-end mb-6">
            <button 
              onClick={handleClearHistory}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-[0_0_30px_rgba(239,68,68,0.05)]"
            >
              <FaTrashAlt /> Clear All History
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* List Section */}
          <div className={`${selectedItem ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar`}>
            {loading ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Syncing Database Streams</p>
              </div>
            ) : historyList.length === 0 ? (
              <div className="glass-card !rounded-2xl !p-12 text-center border-white/5 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl text-emerald-500 mx-auto opacity-30">
                  <FaHistory />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-300">No Records Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto uppercase tracking-wide font-light leading-relaxed">
                  Your agricultural diagnostic records are currently empty. Run disease predictions or fertilizer recommendations to populate history.
                </p>
              </div>
            ) : (
              historyList.map((item) => (
                <div 
                  key={item._id}
                  onClick={() => setSelectedItem(item)}
                  className={`glass-card !rounded-2xl !p-5 border-white/5 cursor-pointer hover:border-emerald-500/30 transition-all flex justify-between items-center group relative overflow-hidden ${selectedItem?._id === item._id ? 'bg-emerald-500/[0.04] border-emerald-500/30' : ''}`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    {/* Leaf image thumbnail or icon */}
                    {item.type === 'disease' && item.metadata.imageBase64 ? (
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-500/30 flex-shrink-0">
                        <img src={item.metadata.imageBase64} alt="Leaf" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl transition-colors duration-500 ${item.type === 'disease' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black' : 'bg-blue-500/10 border-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white'}`}>
                        {item.type === 'disease' ? <FaLeaf /> : <FaFlask />}
                      </div>
                    )}
                    <div>
                      <span className={`text-[8px] font-black uppercase tracking-[0.2em] mb-1 block ${item.type === 'disease' ? 'text-emerald-400' : 'text-blue-400'}`}>
                        {item.type === 'disease' ? 'Disease Diagnosis' : 'Fertilizer Recommendation'}
                      </span>
                      <h4 className="text-sm font-black uppercase tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                        {item.type === 'disease' 
                          ? (item.metadata.diseaseName || 'Diagnostic Report')
                          : `Crop: ${item.metadata.cropType || 'Fertilizer'}`}
                      </h4>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mt-1">
                        <FaCalendarAlt className="text-[8px]" /> {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 relative z-10">
                    <button 
                      onClick={(e) => handleDeleteItem(item._id, e)}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 flex items-center justify-center text-xs text-slate-400 hover:text-red-400 transition-all active:scale-95"
                      title="Delete entry"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Details Section */}
          {selectedItem && (
            <div className="lg:col-span-7 glass-card !rounded-[2rem] !p-6 border-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.05)] flex flex-col reveal active">
              
              {/* Detail Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">
                     <FaShieldAlt className="text-emerald-400" />
                  </div>
                  <div>
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 block leading-none">Saved Report Record</span>
                     <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500 italic">ID: {selectedItem._id.substring(selectedItem._id.length - 8)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => downloadPDFReport(selectedItem)} 
                    className="group px-4 py-2 bg-white/5 hover:bg-emerald-500 hover:text-black border border-white/10 hover:border-emerald-500 rounded-lg transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em]"
                  >
                    Download PDF <FaFileDownload className="group-hover:translate-y-0.5 transition-transform" />
                  </button>
                  <button 
                    onClick={() => setSelectedItem(null)} 
                    className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Leaf image in detail view */}
              {selectedItem.type === 'disease' && selectedItem.metadata.imageBase64 && (
                <div className="mb-6 flex justify-center">
                  <div className="w-40 h-40 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-[0_0_40px_rgba(52,211,153,0.1)]">
                    <img src={selectedItem.metadata.imageBase64} alt="Leaf specimen" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {/* Parameters block in Detail view */}
              <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-[10px]">
                <div>
                  <span className="text-slate-500 uppercase tracking-wider font-bold block">Type</span>
                  <span className="text-white font-black uppercase">{selectedItem.type}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider font-bold block">Timestamp</span>
                  <span className="text-white font-black">{new Date(selectedItem.createdAt).toLocaleString()}</span>
                </div>
                {selectedItem.type === "disease" ? (
                  <>
                    <div>
                      <span className="text-slate-500 uppercase tracking-wider font-bold block">Disease Name</span>
                      <span className="text-emerald-400 font-black uppercase">{selectedItem.metadata.diseaseName || 'Unknown'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase tracking-wider font-bold block">Severity</span>
                      <span className="text-red-400 font-black uppercase">{selectedItem.metadata.severity || 'Unknown'}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-slate-500 uppercase tracking-wider font-bold block">Crop & Soil Type</span>
                      <span className="text-blue-400 font-black uppercase">{selectedItem.metadata.cropType || 'Unknown'} • {selectedItem.metadata.soilType || 'Unknown'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase tracking-wider font-bold block">N - P - K</span>
                      <span className="text-white font-black">N: {selectedItem.metadata.azote}g • P: {selectedItem.metadata.phosphorous}g • K: {selectedItem.metadata.potassium}g</span>
                    </div>
                  </>
                )}
              </div>

              {/* Formatted Text Box */}
              <div className="relative group flex-grow">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-slate-900/40 border border-white/5 rounded-2xl p-5 max-h-[380px] overflow-y-auto custom-scrollbar shadow-inner">
                  <div 
                    className="prose prose-invert max-w-none text-xs leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatReport(selectedItem.report) }}
                  />
                </div>
              </div>

              {/* PDF Action Footer */}
              <div className="mt-6 flex gap-4">
                <button 
                  onClick={() => downloadPDFReport(selectedItem)} 
                  className="group flex-1 py-4 bg-emerald-500 text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all hover:shadow-[0_15px_30px_rgba(52,211,153,0.3)] flex items-center gap-2 justify-center"
                >
                  Export Certified PDF <FaFileDownload />
                </button>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center border-t border-white/5 text-[9px] font-black uppercase tracking-[0.5em] text-slate-800 bg-slate-950/20 backdrop-blur-sm relative z-50">
        Resilient Roots Lab • MongoDB Archives
      </footer>
    </div>
  );
};

export default HistoryPage;
