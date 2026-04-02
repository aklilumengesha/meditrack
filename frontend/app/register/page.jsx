"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Link from "next/link";
import { FaHeartbeat, FaUserMd, FaUserInjured } from "react-icons/fa";

const BASE_URL = "http://localhost:3000";

export default function RegisterPage() {
  const { login } = useAuth();
  const [role, setRole] = useState("PATIENT");
  const [form, setForm] = useState({
    email: "", password: "", firstName: "", lastName: "",
    specialty: "", phone: "", birthDate: "", address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

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
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <FaHeartbeat className="text-white text-3xl" />
          <span className="text-white text-2xl font-extrabold tracking-tight">Meditrack</span>
        </div>
        <div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Join Meditrack<br />today.
          </h2>
          <p className="text-blue-200 text-lg">
            Create your account and start managing your health journey.
          </p>
        </div>
        <div className="space-y-3">
          {[
            { icon: FaUserMd, text: "Doctors — manage patients and appointments" },
            { icon: FaUserInjured, text: "Patients — book appointments and view records" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-blue-100 text-sm">
              <Icon className="text-blue-300 text-lg flex-shrink-0" />
              <span>{text}</span>
            </div>
          ))}
        </div>
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
              <input type="password" required className="input-modern" value={form.password} onChange={set("password")} placeholder="Min. 6 characters" />
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
