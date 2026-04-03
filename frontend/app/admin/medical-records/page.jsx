"use client";

import { useEffect, useState } from "react";
import { getAllMedicalRecords, deleteAdminMedicalRecord } from "../../utils/adminApi";
import { FaNotesMedical, FaSearch, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";

const visitColors = {
  RoutineCheckUp: "bg-green-100 text-green-700",
  Consultation: "bg-blue-100 text-blue-700",
  BloodTest: "bg-red-100 text-red-700",
  Vaccination: "bg-purple-100 text-purple-700",
  Emergency: "bg-orange-100 text-orange-700",
  Specialist: "bg-indigo-100 text-indigo-700",
};

export default function AdminMedicalRecordsPage() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filterDiagnosis, setFilterDiagnosis] = useState("");

  const fetch = () => getAllMedicalRecords().then(setRecords).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    try { await deleteAdminMedicalRecord(id); toast.success("Record deleted"); setConfirmDelete(null); fetch(); }
    catch { toast.error("Failed to delete"); }
  };

  const diagnoses = [...new Set(records.map((r) => r.diagnosis))];

  const filtered = records.filter((r) => {
    const nameMatch = `${r.patient?.firstName} ${r.patient?.lastName}`.toLowerCase().includes(search.toLowerCase());
    const diagMatch = !filterDiagnosis || r.diagnosis === filterDiagnosis;
    return nameMatch && diagMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Medical Records</h1>
          <p className="text-gray-500 mt-1">{records.length} total records</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input type="text" placeholder="Search patient..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-modern pl-10 w-52" />
          </div>
          <select className="input-modern w-48" value={filterDiagnosis} onChange={(e) => setFilterDiagnosis(e.target.value)}>
            <option value="">All Diagnoses</option>
            {diagnoses.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} height={70} className="rounded-2xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card-modern text-center py-16"><FaNotesMedical className="text-5xl text-gray-200 mx-auto mb-3" /><p className="text-gray-400">No records found</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="card-modern p-0 overflow-hidden">
              <button className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center font-bold text-sm">
                    {r.patient?.firstName?.[0]}{r.patient?.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{r.patient?.firstName} {r.patient?.lastName}</p>
                    <p className="text-xs text-gray-400">{r.diagnosis} · {dayjs(r.date).format("MMM D, YYYY")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${visitColors[r.visitType] || "bg-gray-100 text-gray-600"}`}>{r.visitType}</span>
                  <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(r.id); }}
                    className="p-2 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition-colors">
                    <FaTrash className="text-xs" />
                  </button>
                  {expanded === r.id ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                </div>
              </button>

              {expanded === r.id && (
                <div className="border-t border-gray-100 p-5 grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fade-in">
                  {[
                    ["Treatment", r.treatment], ["Medication", r.medication || "N/A"],
                    ["Blood Pressure", r.bloodPressure || "N/A"], ["Heart Rate", r.heartRate ? `${r.heartRate} bpm` : "N/A"],
                    ["Temperature", r.temperature ? `${r.temperature}°C` : "N/A"], ["Weight", r.weight ? `${r.weight} kg` : "N/A"],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-sm font-semibold text-gray-700">{value}</p>
                    </div>
                  ))}
                  {r.notes && (
                    <div className="col-span-2 sm:col-span-3 bg-amber-50 rounded-xl p-3">
                      <p className="text-xs text-amber-600 font-semibold mb-1">Notes</p>
                      <p className="text-sm text-gray-700">{r.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-in">
            <h3 className="font-bold text-gray-800 mb-2">Delete Record</h3>
            <p className="text-gray-500 text-sm mb-5">This will permanently delete this medical record.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirmDelete)} className="btn-modern-primary flex-1 py-2.5 bg-red-600 hover:bg-red-700">Delete</button>
              <button onClick={() => setConfirmDelete(null)} className="btn-modern-outline flex-1 py-2.5">Cancel</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-center" theme="colored" autoClose={3000} hideProgressBar />
    </div>
  );
}
