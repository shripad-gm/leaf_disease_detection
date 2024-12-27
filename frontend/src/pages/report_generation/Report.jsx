// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import useReport from "../../Hooks/useReport";
import { jsPDF } from "jspdf";
import useSpeechRecognition from "../../Hooks/useSpeechRecognition"; // Import the speech recognition hook
import "./ReportGenerator.css";

const ReportGenerator = () => {
  const [diseaseName, setDiseaseName] = useState("");
  const [severity, setSeverity] = useState("mild");
  const [report, setReport] = useState("");
  const { loading, generateReport } = useReport();
  const { transcript, isListening, startRecognition, stopRecognition } = useSpeechRecognition();

  // Update disease name when transcript changes
  useEffect(() => {
    if (transcript) {
      setDiseaseName(transcript); // Set the speech-to-text result to diseaseName
    }
  }, [transcript]);

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
    <div className="report-container">
      <h1 className="title">🌾 Crop Disease Report Generator</h1>
      <div className="input-group">
        <div className="input-with-mic">
          <input
            type="text"
            placeholder="Enter Disease Name"
            value={diseaseName}
            onChange={(e) => setDiseaseName(e.target.value)}
            className="input-field"
          />
          <button
            className="microphone-button"
            onClick={isListening ? stopRecognition : startRecognition}
            aria-label={isListening ? "Stop listening" : "Start listening"}
            disabled={loading}
          >
            🎤
          </button>
        </div>
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="dropdown"
        >
          <option value="mild">Mild</option>
          <option value="moderate">Moderate</option>
          <option value="severe">Severe</option>
        </select>
      </div>
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
            rows="10"
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
  );
};

export default ReportGenerator;
