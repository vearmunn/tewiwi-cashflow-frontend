import { Link } from "react-router-dom";

function Error() {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">

        {/* Illustration */}
        <svg
            viewBox="0 0 400 250"
            className="w-full max-w-sm mb-8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="200" cy="120" r="100" fill="#EFF6FF" />

            <path
                d="M115 160 L145 65 L175 160 Z"
                fill="#BFDBFE"
            />
            <path
                d="M225 160 L255 65 L285 160 Z"
                fill="#BFDBFE"
            />

            <text
                x="200"
                y="145"
                textAnchor="middle"
                fontSize="100"
                fontWeight="bold"
                fill="#2563EB"
            >
                404
            </text>

            <circle cx="105" cy="65" r="8" fill="#60A5FA" />
            <circle cx="300" cy="185" r="6" fill="#93C5FD" />
            <path
                d="M95 190 L110 175 L125 190"
                stroke="#60A5FA"
                strokeWidth="4"
                strokeLinecap="round"
            />
        </svg>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Halaman tidak ditemukan
        </h1>

        <p className="text-gray-500 max-w-md mb-8">
            Oops! Halaman yang Anda cari tidak ada atau sudah dipindahkan.
        </p>

        <Link
            to="/"
            className="rounded-lg bg-primary px-6 py-3
                text-white font-medium transition
                hover:bg-blue-700"
        >
            Kembali ke Dashboard
        </Link>

    </div>
}

export default Error;