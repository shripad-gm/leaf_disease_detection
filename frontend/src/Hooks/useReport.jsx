import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useReport = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const generateReport = async (severity, diseaseName, setReport) => {
    setLoading(true);
    const userId = localStorage.getItem("rr_anonymous_user_id") || "anonymous";
    try {
      const response = await fetch("http://127.0.0.1:5001/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ severity, disease_name: diseaseName, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setReport(data.report);
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
