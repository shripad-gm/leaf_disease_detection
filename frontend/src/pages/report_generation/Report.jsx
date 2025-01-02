// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import useReport from "../../Hooks/useReport";
import { jsPDF } from "jspdf";
import Navbar from "../detect/components/Navbar";

import "./ReportGenerator.css";
import { useLocation } from "react-router-dom";

const ReportGenerator = () => {
  const location = useLocation();
  const [diseaseName] = useState(location.state?.diseaseName || ""); // Get disease name from navigation state
  
  const [severity] = useState("mild");
  const [report, setReport] = useState("");
  const { loading, generateReport } = useReport();


  const handleClick = async (e) => {
    e.preventDefault();
    if (!diseaseName.trim()) {
      alert("Please enter a disease name.");
      return;
    }
    await generateReport(severity, diseaseName, setReport);
  };

  // Function to generate the PDF
  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 0, 0); // Red color for the title
    doc.text("CROP DISEASE REPORT", 105, 20, { align: "center" });

    doc.setTextColor(0, 0, 0); // Black color for text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Disease Name: ${diseaseName}`, 20, 40);
    doc.setFontSize(12);
    doc.text(`Severity: ${severity}`, 20, 50);
    doc.setFontSize(12);
    doc.text("Generated Report:", 20, 60);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const reportLines = doc.splitTextToSize(report, 180);
    let y = 70;

    reportLines.forEach((line) => {
      doc.text(line, 20, y);
      y += 8;
      if (y > doc.internal.pageSize.height - 20) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("crop_disease_report.pdf");
  };

  return (
    <div className="bodydiv">
      <Navbar/>
    <div className="report-container">
      <h1 className="title">🌾 Crop Disease Report Generator</h1>
 
      <div className="button-container">
        <button
          onClick={handleClick}
          className={`generate-button ${loading ? "disabled" : ""}`}
          disabled={loading}
        >
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <span className="loading-text">Loading...</span>
            </div>
          ) : (
            "✨ Generate Report ✨"
          )}
        </button>
      </div>
      {report && (
        <div className="report-box">
          <h2>🌟 Generated Report 🌟</h2>
          <textarea
            value={report}
            readOnly
            rows="30"
            className="report-textarea"
          />
          <div className="download-button-container">
            <button onClick={downloadReport} className="download-button">
              📥 Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ReportGenerator;


