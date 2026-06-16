import { createContext, useContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext=createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext=()=>{
    return useContext(AuthContext)
}

const isFemale = (user) => {
    if (!user) return false;
    if (user.gender === "female") return true;
    if (user.profilepic && (user.profilepic.includes("girl") || user.profilepic.includes("female"))) return true;
    return false;
};

const ensureProfilePic = (user) => {
    if (!user) return null;
    if (!user.profilepic || user.profilepic.includes("avatar.iran.liara.run")) {
        user.profilepic = isFemale(user) ? "/default_girl.png" : "/default_boy.png";
    }
    return user;
};

export const AuthContextProvider=({children})=>{

    const [authUser, setAuthUser] = useState(() => {
        const storedUser = localStorage.getItem("resilient-roots-user");
        return storedUser ? ensureProfilePic(JSON.parse(storedUser)) : null;
    });

    const setAuthUserWithFallback = (user) => {
        if (user) {
            const updatedUser = ensureProfilePic(user);
            setAuthUser(updatedUser);
        } else {
            setAuthUser(null);
        }
    };
    
    return <AuthContext.Provider value={{authUser, setAuthUser: setAuthUserWithFallback}}>
        {children}
    </AuthContext.Provider>
}