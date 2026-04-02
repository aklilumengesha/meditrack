"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  FaHome, FaCalendarAlt, FaNotesMedical, FaUserCircle, FaSignOutAlt,
} from "react-icons/fa";

const navItems = [
  { href: "/patient/dashboard", label: "Dashboard", icon: FaHome },
  { href: "/patient/appointments", label: "My Appointments", icon: FaCalendarAlt },
  { href: "/patient/records", label: "Medical Records", icon: FaNotesMedical },
  { href: "/patient/profile", label: "My Profile", icon: FaUserCircle },
];

export default function PatientLayout({ children }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== "PATIENT")) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-teal-800 text-white flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-teal-700">
          <h1 className="text-2xl font-extrabold tracking-tight">Meditrack</h1>
          <p className="text-teal-300 text-xs mt-1">Patient Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-teal-600 text-white"
                  : "text-teal-100 hover:bg-teal-700 hover:text-white"
              }`}
            >
              <Icon className="text-lg" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-teal-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-teal-100 hover:bg-teal-700 hover:text-white w-full transition-colors"
          >
            <FaSignOutAlt className="text-lg" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
