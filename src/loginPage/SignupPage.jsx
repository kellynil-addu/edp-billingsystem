export default function SignupPage({data}) {
    const { setCurrentPage } = data;
  
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const showSignin = () => {
        setCurrentPage("signin");
    };

    return (
        <div className="flex min-h-screen">
        {/* Decorative Side */}
        <div className="hidden md:flex w-1/2 relative overflow-hidden">
            <div className="absolute inset-0 bg-[hsl(187,55%,42%)] flex flex-col items-center justify-center text-white rounded-br-[60%]">
            <h1 style={{color: "white"}} className="text-[42px] font-bold mb-2">Welcome Back!</h1>
            <p style={{color: "white"}} className="text-base opacity-80">
                Sign in With Email & Password
            </p>

            <button
                onClick={showSignin}
                className="mt-8 px-10 py-2 rounded-full text-sm font-semibold border-2 border-white text-white hover:bg-white/10"
            >
                Sign in
            </button>
            </div>
        </div>

        {/* Form Side */}
        <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-[400px]">
            
            {/* Logo */}
            <div className="text-center mb-8 text-[28px] font-bold">
                <span className="text-[hsl(187,55%,42%)]">B</span>illing
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-2 text-center">
                Create your account
            </h2>
            <p className="text-sm text-[hsl(215,16%,47%)] mb-6 text-center">
                Register with email
            </p>

            <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-4">
                <label className="block text-[13px] font-bold mb-1.5">
                    Name
                </label>
                <input
                    type="text"
                    placeholder="Enter your name..."
                    className="w-full px-4 py-2 rounded-full bg-[hsl(210,20%,92%)] text-sm outline-none focus:ring-2 focus:ring-[hsl(187,55%,42%)]"
                />
                </div>

                {/* Email */}
                <div className="mb-4">
                <label className="block text-[13px] font-bold mb-1.5">
                    E-mail
                </label>
                <input
                    type="email"
                    placeholder="Enter your email address..."
                    className="w-full px-4 py-2 rounded-full bg-[hsl(210,20%,92%)] text-sm outline-none focus:ring-2 focus:ring-[hsl(187,55%,42%)]"
                />
                </div>

                {/* Password */}
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

                {/* Button */}
                <button
                type="submit"
                className="block mx-auto mt-6 px-10 py-2 rounded-full text-sm font-semibold bg-[hsl(187,55%,42%)] text-white hover:bg-[hsl(187,55%,36%)]"
                >
                Sign up
                </button>
            </form>

            {/* Mobile Link */}
            <div className="text-center mt-6 text-[13px] text-[hsl(215,16%,47%)] md:hidden">
                Already have an account?{" "}
                <button
                onClick={showSignin}
                className="text-[hsl(187,55%,42%)] font-semibold"
                >
                Sign in
                </button>
            </div>
            </div>
        </div>
        </div>
    );
}