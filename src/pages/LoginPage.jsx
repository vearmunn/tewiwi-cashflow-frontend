import { useState } from 'react'
import api from "../api/axios";
import supabase from '../api/supabase';
import { useNavigate } from "react-router-dom";
import tewiwiLogo from '../assets/tewiwi.png'

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

            const { accessToken, refreshToken } = response.data.data;

            const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            });

            if (error) {
                throw error;
            }

            navigate("/", { replace: true });
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }

    };
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <div className='w-full flex items-center justify-center mb-8'>
                    <img src={tewiwiLogo} className='w-32 h-32' alt="" srcset="" />
                </div>
                <h1 className="text-center text-3xl font-bold text-gray-800 mb-2">
                    Selamat Datang
                </h1>

                <p className="mb-8 text-center text-gray-500">
                    Silakan masuk ke Akun Anda
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
                            placeholder="anda@example.com"
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
                                placeholder="Masukkan password Anda"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-300 hover:font-semibold hover:text-blue-400"
                            >
                                {showPassword ? "Sembunyi" : "Lihat"}
                            </button>
                        </div>
                    </div>

                    {error && <p className='text-red-400'>{error}</p>}

                    {loading ? <p>Loading...</p> : <button
                        type="submit"
                        className="w-full rounded-lg bg-primary py-3 font-semibold text-white transition hover:bg-secondary active:scale-[0.98]"
                    >
                        Login
                    </button>}
                </form>


            </div>
        </div>
    )
}
export default LoginPage