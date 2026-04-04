"use client";

import { useState } from "react";
import axios from "axios";
import { FaLock, FaHeartbeat, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function ChangePasswordPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ newPassword: "", confirm: "" });
  const [show, setShow] = useState({ new: false, confirm: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.newPassword.length < 6) return setError("Password must be at least 6 characters");
    if (form.newPassword !== form.confirm) return setError("Passwords do not match");

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      await axios.post(`${BASE_URL}/auth/change-password`,
        { newPassword: form.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Login normally after password changed
      login(token, role);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <FaHeartbeat className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Set New Password</h1>
            <p className="text-gray-500 text-sm mt-2">
              Your password was reset by an administrator. Please set a new secure password to continue.
            </p>
          </div>

          {/* Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <span className="text-amber-500 text-lg mt-0.5">⚠</span>
            <p className="text-amber-700 text-sm font-medium">
              You must change your password before accessing your account.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={show.new ? "text" : "password"}
                  required
                  className="input-modern pl-11 pr-11"
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  placeholder="Min. 6 characters"
                />
                <button type="button" onClick={() => setShow({ ...show, new: !show.new })}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show.new ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={show.confirm ? "text" : "password"}
                  required
                  className="input-modern pl-11 pr-11"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  placeholder="Repeat new password"
                />
                <button type="button" onClick={() => setShow({ ...show, confirm: !show.confirm })}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show.confirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Password strength hints */}
            <ul className="text-xs text-gray-400 space-y-1 pl-1">
              <li className={form.newPassword.length >= 6 ? "text-green-500" : ""}>✓ At least 6 characters</li>
              <li className={form.newPassword === form.confirm && form.confirm ? "text-green-500" : ""}>✓ Passwords match</li>
            </ul>

            <button type="submit" disabled={loading} className="btn-modern-primary w-full py-3 text-base mt-2">
              {loading ? "Updating..." : "Set New Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

