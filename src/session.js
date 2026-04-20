// Handles signin and signout, this only uses a dummy session without any authentication.

import { useState } from "react";

export function useSession() {
    const [current, setCurrent] = useState(JSON.parse(localStorage.getItem("session")) || {});
    
    const signOut = () => {
        setCurrent({});
        sessionStorage.setItem("session", {});
    }

    const signIn = (email, password, rememberMe) => {
        const newSession = {email, username: "User"}; 
        
        setCurrent(newSession)
        if (rememberMe) {
            sessionStorage.setItem("session", localStorage.setItem("session", JSON.stringify(newSession)));
            alert("saved");
        }
    }

    return {
        current,
        signOut,
        signIn
    }
}