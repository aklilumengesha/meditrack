"use client";

import { useEffect, useState } from "react";
import { getAdminAppointments, createAdminAppointment, updateAdminAppointment, deleteAdminAppointment } from "../../utils/adminApi";
import { getAdminDoctors, getAdminPatients } from "../../utils/adminApi";
import { FaCalendarAlt, FaTrash, FaSearch, FaPlus, FaEdit } from "react-icons/fa";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";

const emptyForm = { patientId: "", doctorId: "", date: "", startTime: "", reason: "" };

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchAll = async () => {
    const [appts, docs, pats] = await Promise.all([getAdminAppointments(), getAdminDoctors(), getAdminPatients()]);
    setAppointments(appts); setDoctors(docs); setPatients(pats);
    setLoading(false);
  };
  useEffect(() => { fetchAll(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleCreate = async () => {
    setSaving(true);
    try {
      await createAdminAppointment({ ...form, patientId: Number(form.patientId), doctorId: Number(form.doctorId) });
      toast.success("Appointment created"); setModal(null); setForm(emptyForm); fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  const handleEdit = async () => {
    setSaving(true);
    try {
      await updateAdminAppointment(editId, { date: form.date, startTime: form.startTime, reason: form.reason });
      toast.success("Appointment updated"); setModal(null); fetchAll();
    } catch { toast.error("Failed to update"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteAdminAppointment(id); toast.success("Deleted"); setConfirmDelete(null); fetchAll(); }
    catch { toast.error("Failed"); }
  };

  const openEdit = (appt) => {
    setForm({ date: dayjs(appt.date).format("YYYY-MM-DDTHH:mm"), startTime: dayjs(appt.startTime).format("YYYY-MM-DDTHH:mm"), reason: appt.reason || "", patientId: "", doctorId: "" });
    setEditId(appt.id); setModal("edit");
  };

  const filtered = appointments.filter((a) =>
    `${a.patient?.firstName} ${a.patient?.lastName} ${a.doctor?.firstName} ${a.doctor?.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="text-gray-500 mt-1">{appointments.length} total appointments</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-modern pl-10 w-56" />
          </div>
          <button onClick={() => { setForm(emptyForm); setModal("create"); }} className="btn-modern-primary flex items-center gap-2">
            <FaPlus className="text-xs" /> Add Appointment
          </button>
        </div>
      </div>

      <div className="card-modern p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["Patient", "Doctor", "Date", "Time", "Reason", "Actions"].map((h) => (
              <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? [...Array(5)].map((_, i) => (
              <tr key={i}><td colSpan={6} className="px-5 py-3"><Skeleton height={32} /></td></tr>
            )) : filtered.map((appt) => (
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
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(appt)} className="p-2 rounded-lg border border-blue-100 text-blue-400 hover:bg-blue-50 transition-colors"><FaEdit className="text-xs" /></button>
                    <button onClick={() => setConfirmDelete(appt.id)} className="p-2 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition-colors"><FaTrash className="text-xs" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
            <h3 className="font-bold text-gray-800 text-lg mb-5">{modal === "create" ? "Add Appointment" : "Edit Appointment"}</h3>
            <div className="space-y-3">
              {modal === "create" && (
                <>
                  <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Patient</label>
                    <select className="input-modern" value={form.patientId} onChange={set("patientId")}>
                      <option value="">Select patient</option>
                      {patients.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Doctor</label>
                    <select className="input-modern" value={form.doctorId} onChange={set("doctorId")}>
                      <option value="">Select doctor</option>
                      {doctors.map((d) => <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName} — {d.specialty}</option>)}
                    </select>
                  </div>
                </>
              )}
              <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Date & Time</label><input type="datetime-local" className="input-modern" value={form.date} onChange={set("date")} /></div>
              <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Start Time</label><input type="datetime-local" className="input-modern" value={form.startTime} onChange={set("startTime")} /></div>
              <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Reason</label><input className="input-modern" value={form.reason} onChange={set("reason")} /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={modal === "create" ? handleCreate : handleEdit} disabled={saving} className="btn-modern-primary flex-1 py-2.5">{saving ? "Saving..." : modal === "create" ? "Create" : "Save"}</button>
              <button onClick={() => setModal(null)} className="btn-modern-outline flex-1 py-2.5">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-in">
            <h3 className="font-bold text-gray-800 mb-2">Delete Appointment</h3>
            <p className="text-gray-500 text-sm mb-5">Are you sure you want to delete this appointment?</p>
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
