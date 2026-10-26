import { useState } from "react";
import { NavLink } from "react-router-dom";
import closeIcon from "../assets/close.png";
import menuIcon from "../assets/menu.png";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: "Dashboard", path: "/" },
        { name: "Transactions", path: "/transactions" },
        { name: "Categories", path: "/categories" },
    ];

    const linkClass = ({ isActive }) =>
        `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
            ? "bg-blue-50 text-blue-700"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`;

    return (
        <nav className="border-b border-gray-200 bg-white">
            <div className="mx-auto px-4 sm:px-6 lg:px-10">
                <div className="flex h-16 items-center justify-between">

                    {/* Logo */}
                    <NavLink to="/" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">
                            T
                        </div>

                        <span className="text-lg font-bold text-gray-900">
                            Tewiwi Cashflow
                        </span>
                    </NavLink>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                end={link.path === "/"}
                                className={linkClass}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        <LogoutButton />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={
                            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
                        }
                        aria-expanded={isMenuOpen}
                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
                    >
                        <img
                            src={isMenuOpen ? closeIcon : menuIcon}
                            alt={isMenuOpen ? "Close menu" : "Open menu"}
                            className="h-6 w-6"
                        />
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="space-y-1 border-t border-gray-100 py-3 md:hidden">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                end={link.path === "/"}
                                onClick={() => setIsMenuOpen(false)}
                                className={linkClass}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        <LogoutButton />
                    </div>
                )}
            </div>
        </nav>
    );
}