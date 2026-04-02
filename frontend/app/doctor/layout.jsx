"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  FaHome, FaUsers, FaCalendarAlt, FaUserMd, FaSignOutAlt,
} from "react-icons/fa";

const navItems = [
  { href: "/doctor/dashboard", label: "Dashboard", icon: FaHome },
  { href: "/doctor/patients", label: "My Patients", icon: FaUsers },
  { href: "/doctor/appointments", label: "Appointments", icon: FaCalendarAlt },
  { href: "/doctor/profile", label: "My Profile", icon: FaUserMd },
];

export default function DoctorLayout({ children }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== "DOCTOR")) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-950 text-white flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-2xl font-extrabold tracking-tight">Meditrack</h1>
          <p className="text-blue-300 text-xs mt-1">Doctor Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-blue-700 text-white"
                  : "text-blue-200 hover:bg-blue-800 hover:text-white"
              }`}
            >
              <Icon className="text-lg" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-blue-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-blue-200 hover:bg-blue-800 hover:text-white w-full transition-colors"
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
