import { createContext, useContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext=createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext=()=>{
    return useContext(AuthContext)
}

export const AuthContextProvider=({children})=>{

    const [authUser, setAuthUser] = useState(() => {
        const storedUser = localStorage.getItem("chat-user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    
    return <AuthContext.Provider value={{authUser,setAuthUser}}>
        {children}
    </AuthContext.Provider>
}