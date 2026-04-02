"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaHeartbeat, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "For Doctors", href: "#for-doctors" },
    { label: "For Patients", href: "#for-patients" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "navbar-blur shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/landing" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-blue-200 transition-shadow">
            <FaHeartbeat className="text-white text-lg" />
          </div>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">Meditrack</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ label, href }) => (
            <a key={label} href={href}
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              {label}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login"
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link href="/register"
            className="shimmer-btn text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-blue-200 transition-shadow">
            Get Started
          </Link>
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-700 text-xl">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden navbar-blur border-t border-gray-100 px-6 py-4 space-y-3 animate-fade-in">
          {links.map(({ label, href }) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)}
              className="block text-sm font-medium text-gray-700 hover:text-blue-600 py-2">
              {label}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <Link href="/login" className="flex-1 text-center py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700">
              Sign In
            </Link>
            <Link href="/register" className="flex-1 text-center py-2.5 rounded-xl shimmer-btn text-white text-sm font-semibold">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
