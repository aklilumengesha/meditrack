"use client";

import { useEffect, useState } from "react";
import { getAdminPatients, updateAdminPatient, deleteUser, toggleUserActive, getPatientRecordsAdmin } from "../../utils/adminApi";
import { FaUserInjured, FaSearch, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaNotesMedical, FaTimes } from "react-icons/fa";
import { BiCalendar, BiMapPin } from "react-icons/bi";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editPatient, setEditPatient] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [recordsPatient, setRecordsPatient] = useState(null);
  const [records, setRecords] = useState([]);

  const fetch = () => getAdminPatients().then(setPatients).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const openEdit = (p) => {
    setForm({ firstName: p.firstName, lastName: p.lastName, birthDate: dayjs(p.birthDate).format("YYYY-MM-DD"), address: p.address || "" });
    setEditPatient(p);
  };

  const handleEdit = async () => {
    setSaving(true);
    try {
      await updateAdminPatient(editPatient.id, form);
      toast.success("Patient updated"); setEditPatient(null); fetch();
    } catch { toast.error("Failed to update"); }
    finally { setSaving(false); }
  };

  const handleToggle = async (userId) => {
    try { await toggleUserActive(userId); toast.success("Status updated"); fetch(); }
    catch { toast.error("Failed"); }
  };

  const handleDelete = async (userId) => {
    try { await deleteUser(userId); toast.success("Patient deleted"); setConfirmDelete(null); fetch(); }
    catch { toast.error("Failed to delete"); }
  };

  const openRecords = async (p) => {
    setRecordsPatient(p);
    const data = await getPatientRecordsAdmin(p.id);
    setRecords(data);
  };

  const filtered = patients.filter((p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Patients</h1>
          <p className="text-gray-500 mt-1">{patients.length} registered patients</p>
        </div>
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-modern pl-10 w-64" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} height={160} className="rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className={`card-modern hover:shadow-md transition-shadow ${!p.user?.active ? "opacity-60" : ""}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                  {p.firstName?.[0]}{p.lastName?.[0]}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{p.firstName} {p.lastName}</p>
                  <p className="text-xs text-gray-400">{p.user?.email}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.user?.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {p.user?.active ? "Active" : "Suspended"}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-500 mb-4">
                <p className="flex items-center gap-2"><BiCalendar className="text-gray-300" /> {dayjs(p.birthDate).format("MMM D, YYYY")}</p>
                {p.address && <p className="flex items-center gap-2 truncate"><BiMapPin className="text-gray-300 flex-shrink-0" /> {p.address}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-blue-100 text-blue-600 hover:bg-blue-50 text-xs font-semibold transition-colors">
                  <FaEdit /> Edit
                </button>
                <button onClick={() => openRecords(p)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-teal-100 text-teal-600 hover:bg-teal-50 text-xs font-semibold transition-colors">
                  <FaNotesMedical /> Records
                </button>
                <button onClick={() => handleToggle(p.userId)} className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                  {p.user?.active ? <FaToggleOff className="text-sm" /> : <FaToggleOn className="text-sm text-green-500" />}
                </button>
                <button onClick={() => setConfirmDelete(p.userId)} className="p-2 rounded-xl border border-red-100 text-red-400 hover:bg-red-50 transition-colors">
                  <FaTrash className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
            <h3 className="font-bold text-gray-800 text-lg mb-5">Edit Patient</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">First Name</label><input className="input-modern" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Last Name</label><input className="input-modern" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
              </div>
              <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Date of Birth</label><input type="date" className="input-modern" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} /></div>
              <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Address</label><input className="input-modern" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleEdit} disabled={saving} className="btn-modern-primary flex-1 py-2.5">{saving ? "Saving..." : "Save Changes"}</button>
              <button onClick={() => setEditPatient(null)} className="btn-modern-outline flex-1 py-2.5">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Records modal */}
      {recordsPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl animate-fade-in max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800 text-lg">{recordsPatient.firstName} {recordsPatient.lastName}&apos;s Records</h3>
              <button onClick={() => setRecordsPatient(null)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            {records.length === 0 ? <p className="text-gray-400 text-center py-8">No records found</p> : (
              <div className="space-y-3">
                {records.map((r) => (
                  <div key={r.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-800">{r.diagnosis}</p>
                      <span className="text-xs text-gray-400">{dayjs(r.date).format("MMM D, YYYY")}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <p>Treatment: {r.treatment}</p>
                      <p>Visit: {r.visitType}</p>
                      {r.medication && <p>Medication: {r.medication}</p>}
                      {r.bloodPressure && <p>BP: {r.bloodPressure}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-in">
            <h3 className="font-bold text-gray-800 mb-2">Delete Patient</h3>
            <p className="text-gray-500 text-sm mb-5">This will permanently delete the patient and all their data.</p>
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
