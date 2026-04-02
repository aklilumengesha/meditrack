"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Link from "next/link";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-900">Meditrack</h1>
          <p className="text-gray-500 mt-1">Create your account</p>
        </div>

        {/* Role selector */}
        <div className="flex rounded-xl overflow-hidden border border-blue-200 mb-6">
          {["PATIENT", "DOCTOR"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                role === r ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-blue-50"
              }`}
            >
              {r === "PATIENT" ? "I'm a Patient" : "I'm a Doctor"}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" required className="input input-bordered w-full"
                value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" required className="input input-bordered w-full"
                value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required className="input input-bordered w-full"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required className="input input-bordered w-full"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>

          {role === "DOCTOR" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                <input type="text" required className="input input-bordered w-full"
                  value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  placeholder="e.g. Cardiology" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" className="input input-bordered w-full"
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </>
          )}

          {role === "PATIENT" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                <input type="date" required className="input input-bordered w-full"
                  value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" className="input input-bordered w-full"
                  value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
