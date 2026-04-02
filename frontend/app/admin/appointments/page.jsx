"use client";

import { useEffect, useState } from "react";
import { getAdminAppointments, deleteAdminAppointment } from "../../utils/adminApi";
import { FaCalendarAlt, FaTrash, FaSearch } from "react-icons/fa";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    getAdminAppointments().then(setAppointments).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteAdminAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      toast.success("Appointment deleted");
    } catch { toast.error("Failed to delete"); }
    finally { setConfirmId(null); }
  };

  const filtered = appointments.filter((a) =>
    `${a.patient?.firstName} ${a.patient?.lastName} ${a.doctor?.firstName} ${a.doctor?.lastName}`
      .toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="text-gray-500 mt-1">{appointments.length} total appointments</p>
        </div>
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input type="text" placeholder="Search..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="input-modern pl-10 w-64" />
        </div>
      </div>

      <div className="card-modern p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Patient", "Doctor", "Date", "Time", "Reason", "Actions"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-5 py-3"><Skeleton height={32} /></td></tr>
              ))
            ) : filtered.map((appt) => (
              <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs font-bold">
                      {appt.patient?.firstName?.[0]}{appt.patient?.lastName?.[0]}
                    </div>
                    <span className="font-medium text-gray-800">{appt.patient?.firstName} {appt.patient?.lastName}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-gray-600">Dr. {appt.doctor?.firstName} {appt.doctor?.lastName}</td>
                <td className="px-5 py-3.5 text-gray-500">{dayjs(appt.date).format("MMM D, YYYY")}</td>
                <td className="px-5 py-3.5 text-gray-500">{dayjs(appt.startTime).format("HH:mm")}</td>
                <td className="px-5 py-3.5 text-gray-400 max-w-xs truncate">{appt.reason || "—"}</td>
                <td className="px-5 py-3.5">
                  <button onClick={() => setConfirmId(appt.id)}
                    className="p-2 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                    <FaTrash className="text-xs" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-in">
            <h3 className="font-bold text-gray-800 mb-2">Delete Appointment</h3>
            <p className="text-gray-500 text-sm mb-5">Are you sure you want to delete this appointment?</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirmId)} className="btn-modern-primary flex-1 py-2.5 bg-red-600 hover:bg-red-700">Delete</button>
              <button onClick={() => setConfirmId(null)} className="btn-modern-outline flex-1 py-2.5">Cancel</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-center" theme="colored" autoClose={3000} hideProgressBar />
    </div>
  );
}
