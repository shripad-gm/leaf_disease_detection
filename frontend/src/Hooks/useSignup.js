import { useState } from "react"
import toast from "react-hot-toast"
import { useAuthContext } from "../context/AuthContext"

const useSignup = () => {
    const [loading, setLoading] = useState(false)
    const {setAuthUser}=useAuthContext();
    const signup = async ({ fullname, username, password, confirmpassword, gender }) => {
        const sucess = handleInputError({ fullname, username, password, confirmpassword, gender })
        if (!sucess) return false
        setLoading(true);
        try {
            const res = await fetch("api/auth/signup", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ fullname, username, password, confirmpassword, gender })
            })
            const data = await res.json();
            console.log(data)
            if (data.error) {
                throw new Error(data.error);
            }
            localStorage.setItem("chat-user",JSON.stringify(data))

            setAuthUser(data)
        } catch (error) {
            toast.error(error.message) 
        } finally {
            setLoading(false)
        }

    }
    return { loading, signup }
}

export default useSignup

function handleInputError({ fullname, username, password, confirmpassword, gender }) {
    if (!fullname || !username || !password || !confirmpassword || !gender) {
        toast.error("input all fields")
        return false
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