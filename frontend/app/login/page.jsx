"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Link from "next/link";
import { FaEnvelope, FaLock, FaHeartbeat, FaEye, FaEyeSlash } from "react-icons/fa";
import DashboardMockup from "../components/shared/DashboardMockup";

const BASE_URL = "http://localhost:3000";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, form);
      if (res.data.mustChangePassword) {
        // Store token temporarily for the change-password page
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("role", res.data.role);
        document.cookie = `token=${res.data.access_token}; path=/`;
        document.cookie = `role=${res.data.role}; path=/`;
        window.location.href = "/change-password";
      } else {
        login(res.data.access_token, res.data.role);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — dashboard mockup */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 flex-col justify-between p-10 overflow-hidden relative">
        {/* Top branding */}
        <div className="flex items-center gap-3 relative z-10">
          <FaHeartbeat className="text-white text-2xl" />
          <span className="text-white text-xl font-extrabold tracking-tight">Meditrack</span>
        </div>

        {/* Dashboard mockup */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-4">
          <div className="w-full" style={{ height: "420px", position: "relative" }}>
            <DashboardMockup />
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10">
          <p className="text-white font-bold text-lg leading-snug mb-1">Everything you need to manage healthcare.</p>
          <p className="text-blue-300 text-sm">Patients, doctors, appointments and records — all in one place.</p>
        </div>

        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl pointer-events-none" />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <FaHeartbeat className="text-blue-600 text-2xl" />
              <span className="text-xl font-extrabold text-gray-900">Meditrack</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 mt-2">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-4 mb-6 flex items-center gap-2">
              <span className="text-red-400">⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="email"
                  required
                  className="input-modern pl-11"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-blue-600 font-semibold hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="input-modern pl-11 pr-11"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-modern-primary w-full py-3 text-base mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm"></span> Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
