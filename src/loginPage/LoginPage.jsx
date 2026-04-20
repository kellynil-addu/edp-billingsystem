import { useContext } from "react";
import { AppContext } from "../App";

export default function LoginPage({data}) {
    const { session } = useContext(AppContext);
    const { setCurrentPage } = data;

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const data = {
            email: formData.get("email"),
            password: formData.get("password"),
            rememberMe: formData.has("rememberme")
        };

        session.signIn(data.email, data.password, data.rememberMe)
    };

    const showSignup = () => {
        setCurrentPage("signup");
    };

    return (
        <div className="flex min-h-screen">
            <div className="grow flex items-center justify-center p-8">
                <div className="w-full max-w-100">
                
                <div className="text-center mb-8 text-[28px] font-bold">
                    <span className="text-[hsl(187,55%,42%)]">B</span>illing
                </div>

                <h2 className="text-2xl font-bold mb-2">Sign In</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                    <label className="block text-[13px] font-bold mb-1.5">
                        E-mail
                    </label>
                    <input
                        name="email"
                        type="email"
                        placeholder="Enter your email address..."
                        className="w-full px-4 py-2 rounded-full bg-[hsl(210,20%,92%)] text-sm outline-none focus:ring-2 focus:ring-[hsl(187,55%,42%)]"
                    />
                    </div>

                    <div className="mb-4">
                    <label className="block text-[13px] font-bold mb-1.5">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Enter your password..."
                        className="w-full px-4 py-2 rounded-full bg-[hsl(210,20%,92%)] text-sm outline-none focus:ring-2 focus:ring-[hsl(187,55%,42%)]"
                    />
                    </div>

                    <div className="flex items-center justify-between text-[13px] mb-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                        <input name="rememberme" type="checkbox" />
                        Remember Me
                    </label>
                    <a
                        href="#"
                        className="text-[hsl(187,55%,42%)] hover:underline"
                    >
                        Forgot your password?
                    </a>
                    </div>

                    <button
                    type="submit"
                    className="block mx-auto mt-6 px-10 py-2 rounded-full text-sm font-semibold bg-[hsl(187,55%,42%)] text-white hover:bg-[hsl(187,55%,36%)]"
                    >
                    Sign in
                    </button>
                </form>

                <div className="text-center mt-6 text-[13px] text-[hsl(215,16%,47%)] md:hidden">
                    Don't have an account?{" "}
                    <button
                    onClick={showSignup}
                    className="text-[hsl(187,55%,42%)] font-semibold"
                    >
                    Sign up
                    </button>
                </div>
                </div>
            </div>

            <div className="hidden md:flex w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-[hsl(187,55%,42%)] flex flex-col items-center justify-center text-white rounded-bl-[60%]">
                <h1 className="text-[42px] font-bold mb-2">Welcome!</h1>
                <p className="text-base opacity-80">Ready to get started!</p>

                <button
                    onClick={showSignup}
                    className="mt-8 px-10 py-2 rounded-full text-sm font-semibold border-2 border-white text-white hover:bg-white/10"
                >
                    Sign up
                </button>
                </div>
            </div>
        </div>
    );
}