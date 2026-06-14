import { useState } from "react";
import toast from "react-hot-toast";

const useFertilizer = () => {
  const [loading, setLoading] = useState(false);

  const getRecommendation = async (params, setRecommendation) => {
    setLoading(true);
    const userId = localStorage.getItem("rr_anonymous_user_id") || "anonymous";
    try {
      const response = await fetch("http://127.0.0.1:5001/recommend-fertilizer", {
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
