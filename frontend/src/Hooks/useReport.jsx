import { useState } from "react"
import { useAuthContext } from "../context/AuthContext"
import toast from "react-hot-toast"



const useReport =() => {

const [loading,setLoading]=useState(false)
const {setAuthUser}=useAuthContext()



const generateReport = async (severity,diseaseName,setReport) => {
    setLoading(true);
  try {
    const response = await fetch("http://127.0.0.1:5000/generate_report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ severity, disease_name: diseaseName }),
    });

    
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
    localStorage.setItem("chat-user",JSON.stringify(data))
    setAuthUser(data);
      setReport(data.report);
     
  } catch (error) {
    toast.error(error.message);
} finally {
    setLoading(false);
}
 
    }
    return { loading, generateReport }
};

export default useReport;
