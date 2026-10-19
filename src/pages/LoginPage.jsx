import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true)
        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            const { access_token, user } = response.data.session;

            localStorage.setItem("access_token", access_token);

            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
            }
            navigate("/");
        } catch (err) {
            console.log(err)
            setError(
                err.response?.data?.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }

    };
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
                    Welcome Back
                </h1>

                <p className="mb-8 text-center text-gray-500">
                    Sign in to your account
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-blue-600"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {error && <p className='text-red-400'>{error}</p>}

                    {loading ? <p>Loading...</p> : <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
                    >
                        Sign In
                    </button>}
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <a
                        href="/register"
                        className="font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    )
}
export default LoginPage