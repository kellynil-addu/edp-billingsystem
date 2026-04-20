import { useContext, useState } from "react";
import { AppContext } from "../App";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";

export default function LoginGuard({children}) {
    const { session } = useContext(AppContext);

    const [currentPage, setCurrentPage] = useState("signin");

    return (
        <>
            {session.current?.username ? children :
                currentPage === "signin" ? <LoginPage data={{setCurrentPage}} /> :
                currentPage === "signup" ? <SignupPage data={{setCurrentPage}}/> : null
            }
        </>
    );
}