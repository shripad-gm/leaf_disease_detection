import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FLASK_API_URL } from "../config";

const useFertilizer = () => {
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuthContext();

  const getRecommendation = async (params, setRecommendation) => {
    setLoading(true);
    const userId = authUser?._id || "anonymous";
    try {
      const response = await fetch(`${FLASK_API_URL}/recommend-fertilizer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...params, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setRecommendation(data.recommendation);

      // Save history directly through Node.js backend
      try {
        const res = await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            type: "fertilizer",
            metadata: params,
            report: data.recommendation
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
      console.error("Error getting fertilizer recommendation:", error);
      toast.error(`Failed to get recommendation: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { loading, getRecommendation };
};

export default useFertilizer;
