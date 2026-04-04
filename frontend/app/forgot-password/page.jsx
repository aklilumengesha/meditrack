"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaEnvelope, FaHeartbeat, FaCheckCircle } from "react-icons/fa";

const BASE_URL = "http://localhost:3000";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/auth/forgot-password`, { email });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
              <FaHeartbeat className="text-white text-lg" />
            </div>
            <span className="text-xl font-extrabold text-gray-900">Meditrack</span>
          </div>

          {!submitted ? (
            <>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Forgot your password?</h1>
              <p className="text-gray-500 text-sm mb-6">
                Enter your email address and we&apos;ll submit a reset request to the administrator. You&apos;ll receive a temporary password once it&apos;s processed.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-3 mb-5">
                  ⚠ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="email"
                      required
                      className="input-modern pl-11"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-modern-primary w-full py-3 text-base">
                  {loading ? "Submitting..." : "Submit Reset Request"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Request Submitted</h2>
              <p className="text-gray-500 text-sm mb-6">
                Your password reset request has been sent to the administrator. You will receive a temporary password shortly. Please check back and use it to log in.
              </p>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-left mb-6">
                <p className="text-blue-700 text-sm font-semibold mb-1">What happens next?</p>
                <ol className="text-blue-600 text-sm space-y-1 list-decimal list-inside">
                  <li>Admin reviews your request</li>
                  <li>Admin generates a temporary password</li>
                  <li>You log in with the temp password</li>
                  <li>You set your new permanent password</li>
                </ol>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-blue-600 font-semibold hover:underline">
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
