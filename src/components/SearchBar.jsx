

function SearchBar({ search, placeholder = "Search...", handleChange }) {
    return (
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>

            <input
                type="text"
                value={search}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full outline-none text-sm text-gray-700 bg-transparent"
            />
        </div>
    );
}

export default SearchBar;
