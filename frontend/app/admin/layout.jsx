"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaHome, FaUsers, FaUserMd, FaUserInjured,
  FaCalendarAlt, FaSignOutAlt, FaShieldAlt, FaBars, FaTimes,
} from "react-icons/fa";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: FaHome },
  { href: "/admin/users", label: "All Users", icon: FaUsers },
  { href: "/admin/doctors", label: "Doctors", icon: FaUserMd },
  { href: "/admin/patients", label: "Patients", icon: FaUserInjured },
  { href: "/admin/appointments", label: "Appointments", icon: FaCalendarAlt },
];

export default function AdminLayout({ children }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) router.push("/login");
  }, [user, loading]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <span className="loading loading-spinner loading-lg text-violet-600"></span>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className={`${collapsed ? "w-20" : "w-64"} bg-slate-900 text-white flex flex-col fixed h-full z-20 transition-all duration-300`}>
        <div className={`p-5 border-b border-slate-700 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-violet-400 text-xl" />
              <div>
                <p className="font-extrabold text-white text-lg leading-none">Meditrack</p>
                <p className="text-slate-400 text-xs mt-0.5">Admin Panel</p>
              </div>
            </div>
          )}
          {collapsed && <FaShieldAlt className="text-violet-400 text-xl" />}
          <button onClick={() => setCollapsed(!collapsed)} className="text-slate-400 hover:text-white transition-colors ml-auto">
            {collapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} title={collapsed ? label : ""}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  active ? "bg-violet-600 text-white shadow-sm" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <Icon className={`text-lg flex-shrink-0 ${active ? "text-white" : "text-slate-400"}`} />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-700">
          <button onClick={logout} title={collapsed ? "Sign Out" : ""}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white w-full transition-all ${collapsed ? "justify-center" : ""}`}
          >
            <FaSignOutAlt className="text-lg flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <main className={`${collapsed ? "ml-20" : "ml-64"} flex-1 transition-all duration-300`}>
        <div className="p-8 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
