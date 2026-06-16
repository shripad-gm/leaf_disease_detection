import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FLASK_API_URL } from "../config";

const useReport = () => {
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuthContext();

  const generateReport = async (severity, diseaseName, setReport, imageBase64 = null) => {
    setLoading(true);
    const userId = authUser?._id || "anonymous";
    try {
      const response = await fetch(`${FLASK_API_URL}/generate-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          severity,
          disease_name: diseaseName,
          userId,
          imageBase64,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setReport(data.report);

      // Save history directly through Node.js backend
      try {
        const res = await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            type: "disease",
            metadata: { diseaseName, severity, imageBase64 },
            report: data.report
          })
        });
        if (!res.ok) {
          const resData = await res.json();
          throw new Error(resData.error || `Failed to save history: ${res.statusText}`);
        }
      } catch (err) {
        console.error("Failed to save history to database:", err);
        toast.error(`History saving failed: ${err.message}`);
      }
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
