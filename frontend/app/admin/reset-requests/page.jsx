"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaKey, FaCheck, FaTimes, FaClock } from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";

dayjs.extend(relativeTime);

const BASE_URL = "http://localhost:3000";
const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

export default function ResetRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tempPasswords, setTempPasswords] = useState({});
  const [filter, setFilter] = useState("PENDING");

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/password-reset-requests`, authHeaders());
      setRequests(res.data);
    } catch { toast.error("Failed to load requests"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleResolve = async (id) => {
    try {
      const res = await axios.patch(`${BASE_URL}/admin/password-reset-requests/${id}/resolve`, {}, authHeaders());
      setTempPasswords((prev) => ({ ...prev, [id]: res.data.tempPassword }));
      toast.success("Password reset — share the temp password with the user");
      fetchRequests();
    } catch { toast.error("Failed to resolve request"); }
  };

  const handleDismiss = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/admin/password-reset-requests/${id}/dismiss`, {}, authHeaders());
      toast.success("Request dismissed");
      fetchRequests();
    } catch { toast.error("Failed to dismiss"); }
  };

  const filtered = requests.filter((r) => r.status === filter);
  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Password Reset Requests</h1>
          <p className="text-gray-500 mt-1">
            {pendingCount > 0 ? (
              <span className="text-amber-600 font-semibold">{pendingCount} pending request{pendingCount !== 1 ? "s" : ""}</span>
            ) : "No pending requests"}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {["PENDING", "RESOLVED"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              filter === f ? "bg-violet-600 text-white shadow-sm" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
            }`}>
            {f === "PENDING" ? `Pending${pendingCount > 0 ? ` (${pendingCount})` : ""}` : "Resolved"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} height={80} className="rounded-2xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card-modern text-center py-16">
          <FaKey className="text-5xl text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No {filter.toLowerCase()} requests</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => {
            const name = req.user?.doctor
              ? `Dr. ${req.user.doctor.firstName} ${req.user.doctor.lastName}`
              : req.user?.patient
              ? `${req.user.patient.firstName} ${req.user.patient.lastName}`
              : req.email;

            return (
              <div key={req.id} className="card-modern">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                      req.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                    }`}>
                      {req.status === "PENDING" ? <FaClock /> : <FaCheck />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{name}</p>
                      <p className="text-xs text-gray-400">{req.email} · {req.user?.role}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Requested {dayjs(req.createdAt).fromNow()}</p>
                    </div>
                  </div>

                  {req.status === "PENDING" && (
                    <div className="flex gap-2">
                      <button onClick={() => handleResolve(req.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-xs font-semibold rounded-xl hover:bg-violet-700 transition-colors">
                        <FaKey className="text-xs" /> Reset Password
                      </button>
                      <button onClick={() => handleDismiss(req.id)}
                        className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
                        <FaTimes className="text-sm" />
                      </button>
                    </div>
                  )}

                  {req.status === "RESOLVED" && req.resolvedAt && (
                    <p className="text-xs text-gray-400">Resolved {dayjs(req.resolvedAt).fromNow()}</p>
                  )}
                </div>

                {/* Show temp password after resolving */}
                {tempPasswords[req.id] && (
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between animate-fade-in">
                    <div>
                      <p className="text-xs text-amber-600 font-semibold mb-1">Temporary Password — share with user</p>
                      <code className="text-amber-800 font-bold text-lg tracking-widest">{tempPasswords[req.id]}</code>
                    </div>
                    <button
                      onClick={() => { navigator.clipboard.writeText(tempPasswords[req.id]); toast.success("Copied!"); }}
                      className="text-xs text-amber-600 font-semibold hover:underline ml-4">
                      Copy
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ToastContainer position="bottom-center" theme="colored" autoClose={3000} hideProgressBar />
    </div>
  );
}
