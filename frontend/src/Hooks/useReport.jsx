import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useReport = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const generateReport = async (severity, diseaseName, setReport) => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ severity, disease_name: diseaseName }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAuthUser(data); // Update AuthContext with response data
      setReport(data.report); // Set the report content in state
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error(`Failed to generate report: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { loading, generateReport };
};

export default useReport;
