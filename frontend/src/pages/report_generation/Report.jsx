// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import useReport from "../../Hooks/useReport";
const ReportGenerator = () => {

    const [diseaseName, setDiseaseName] = useState("");
    const [severity, setSeverity] = useState("mild");
    const [report, setReport] = useState("");
    const { loading,generateReport  } = useReport();

    const handleClick = async (e) => {
		e.preventDefault();
		await generateReport(severity, diseaseName,setReport);
	};

  return (
    <div style={{ padding: "20px" }}>
      <h1>Crop Disease Report Generator</h1>
      <input
        type="text"
        placeholder="Enter Disease Name"
        value={diseaseName}
        onChange={(e) => setDiseaseName(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
        <option value="mild">Mild</option>
        <option value="moderate">Moderate</option>
        <option value="severe">Severe</option>
      </select>
      <button onClick={handleClick} style={{ marginLeft: "10px" }}>
        {loading ? <span className='loading loading-spinner '></span> : "Login"}
        Generate Report
      </button>

      {report && (
        <div style={{ marginTop: "20px" }}>
          <h2>Generated Report</h2>
          <textarea
            value={report}
            readOnly
            rows="10"
            cols="50"
            style={{ width: "100%", marginTop: "10px" }}
          />
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
