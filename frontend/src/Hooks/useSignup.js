import { useState } from "react"
import toast from "react-hot-toast"
import { useAuthContext } from "../context/AuthContext"

const useSignup = () => {
    const [loading, setLoading] = useState(false)
    const {setAuthUser}=useAuthContext();
    const signup = async ({ fullname, username, email, password, confirmpassword, gender }) => {
        const sucess = handleInputError({ fullname, username, email, password, confirmpassword, gender })
        if (!sucess) return false
        setLoading(true);
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ fullname, username, email, password, confirmpassword, gender })
            })
            const data = await res.json();
            console.log(data)
            if (data.error) {
                throw new Error(data.error);
            }
            toast.success("Signup successful! Please login.");
            return true;
        } catch (error) {
            toast.error(error.message) 
            return false;
        } finally {
            setLoading(false)
        }

    }
    return { loading, signup }
}

export default useSignup

function handleInputError({ fullname, username, email, password, confirmpassword, gender }) {
    if (!fullname || !username || !email || !password || !confirmpassword || !gender) {
        toast.error("input all fields")
        return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return false;
    }
    if (password !== confirmpassword) {
        toast.error("passwords do not match")
        return false
    }
    if (password.length < 6) {
        toast.error("passwords length is too small")
        return false
    }
    return true
}