"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Link from "next/link";
import { FaHeartbeat, FaUserMd, FaUserInjured, FaEye, FaEyeSlash } from "react-icons/fa";
import DashboardMockup from "../components/shared/DashboardMockup";
import { useSearchParams } from "next/navigation";

const BASE_URL = "http://localhost:3000";

function RegisterForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const [role, setRole] = useState("PATIENT");
  const [form, setForm] = useState({
    email: "", password: "", firstName: "", lastName: "",
    specialty: "", phone: "", birthDate: "", address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  useEffect(() => {
    const r = searchParams.get("role");
    if (r === "DOCTOR" || r === "PATIENT") setRole(r);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/auth/register`, { ...form, role });
      login(res.data.access_token, res.data.role);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — dashboard mockup */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 flex-col justify-between p-10 overflow-hidden relative">
        <div className="flex items-center gap-3 relative z-10">
          <FaHeartbeat className="text-white text-2xl" />
          <span className="text-white text-xl font-extrabold tracking-tight">Meditrack</span>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center py-4">
          <div className="w-full" style={{ height: "420px", position: "relative" }}>
            <DashboardMockup />
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white font-bold text-lg leading-snug mb-1">Join thousands of doctors and patients.</p>
          <p className="text-blue-300 text-sm">Create your account and start managing healthcare smarter.</p>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl pointer-events-none" />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in py-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <FaHeartbeat className="text-blue-600 text-2xl" />
              <span className="text-xl font-extrabold text-gray-900">Meditrack</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Create account</h1>
            <p className="text-gray-500 mt-2">Choose your role to get started</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: "PATIENT", label: "Patient", icon: FaUserInjured, desc: "Book & manage care" },
              { value: "DOCTOR", label: "Doctor", icon: FaUserMd, desc: "Manage patients" },
            ].map(({ value, label, icon: Icon, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  role === value
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <Icon className={`text-xl mb-1 ${role === value ? "text-blue-600" : "text-gray-400"}`} />
                <p className={`font-semibold text-sm ${role === value ? "text-blue-700" : "text-gray-700"}`}>{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-4 mb-5">
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Name</label>
                <input type="text" required className="input-modern" value={form.firstName} onChange={set("firstName")} placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name</label>
                <input type="text" required className="input-modern" value={form.lastName} onChange={set("lastName")} placeholder="Doe" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input type="email" required className="input-modern" value={form.email} onChange={set("email")} placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} required className="input-modern pr-11" value={form.password} onChange={set("password")} placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {role === "DOCTOR" && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Specialty</label>
                  <input type="text" required className="input-modern" value={form.specialty} onChange={set("specialty")} placeholder="e.g. Cardiology" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                  <input type="text" className="input-modern" value={form.phone} onChange={set("phone")} placeholder="+1 234 567 890" />
                </div>
              </>
            )}

            {role === "PATIENT" && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date of Birth</label>
                  <input type="date" required className="input-modern" value={form.birthDate} onChange={set("birthDate")} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
                  <input type="text" className="input-modern" value={form.address} onChange={set("address")} placeholder="123 Main St" />
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className="btn-modern-primary w-full py-3 text-base mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm"></span> Creating account...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
