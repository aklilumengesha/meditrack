"use client";

import { useEffect, useState } from "react";
import { getAdminDoctors, createAdminDoctor, updateAdminDoctor, deleteUser, toggleUserActive } from "../../utils/adminApi";
import { FaUserMd, FaSearch, FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaEnvelope, FaPhone } from "react-icons/fa";
import { FaStethoscope } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";

const emptyForm = { email: "", password: "", firstName: "", lastName: "", specialty: "", phone: "" };

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit'
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetch = () => getAdminDoctors().then(setDoctors).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleCreate = async () => {
    setSaving(true);
    try {
      await createAdminDoctor(form);
      toast.success("Doctor created");
      setModal(null); setForm(emptyForm); fetch();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  const handleEdit = async () => {
    setSaving(true);
    try {
      await updateAdminDoctor(editId, { firstName: form.firstName, lastName: form.lastName, specialty: form.specialty, phone: form.phone });
      toast.success("Doctor updated");
      setModal(null); fetch();
    } catch { toast.error("Failed to update"); }
    finally { setSaving(false); }
  };

  const handleToggle = async (userId) => {
    try { await toggleUserActive(userId); toast.success("Status updated"); fetch(); }
    catch { toast.error("Failed"); }
  };

  const handleDelete = async (userId) => {
    try { await deleteUser(userId); toast.success("Doctor deleted"); setConfirmDelete(null); fetch(); }
    catch { toast.error("Failed to delete"); }
  };

  const openEdit = (doc) => {
    setForm({ firstName: doc.firstName, lastName: doc.lastName, specialty: doc.specialty, phone: doc.phone || "", email: "", password: "" });
    setEditId(doc.id); setModal("edit");
  };

  const filtered = doctors.filter((d) =>
    `${d.firstName} ${d.lastName} ${d.specialty}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Doctors</h1>
          <p className="text-gray-500 mt-1">{doctors.length} registered doctors</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-modern pl-10 w-56" />
          </div>
          <button onClick={() => { setForm(emptyForm); setModal("create"); }} className="btn-modern-primary flex items-center gap-2">
            <FaPlus className="text-xs" /> Add Doctor
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} height={160} className="rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-modern text-center py-16"><FaUserMd className="text-5xl text-gray-200 mx-auto mb-3" /><p className="text-gray-400">No doctors found</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <div key={doc.id} className={`card-modern hover:shadow-md transition-shadow ${!doc.user?.active ? "opacity-60" : ""}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-800 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                  {doc.firstName?.[0]}{doc.lastName?.[0]}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">Dr. {doc.firstName} {doc.lastName}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1"><FaStethoscope className="text-blue-400" /> {doc.specialty}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${doc.user?.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {doc.user?.active ? "Active" : "Suspended"}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-500 mb-4">
                <p className="flex items-center gap-2"><FaEnvelope className="text-gray-300" /> {doc.user?.email}</p>
                {doc.phone && <p className="flex items-center gap-2"><FaPhone className="text-gray-300" /> {doc.phone}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(doc)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-blue-100 text-blue-600 hover:bg-blue-50 text-xs font-semibold transition-colors">
                  <FaEdit /> Edit
                </button>
                <button onClick={() => handleToggle(doc.userId)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-colors">
                  {doc.user?.active ? <FaToggleOff /> : <FaToggleOn />} {doc.user?.active ? "Suspend" : "Activate"}
                </button>
                <button onClick={() => setConfirmDelete(doc.userId)} className="p-2 rounded-xl border border-red-100 text-red-400 hover:bg-red-50 transition-colors">
                  <FaTrash className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
            <h3 className="font-bold text-gray-800 text-lg mb-5">{modal === "create" ? "Add New Doctor" : "Edit Doctor"}</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">First Name</label><input className="input-modern" value={form.firstName} onChange={set("firstName")} /></div>
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Last Name</label><input className="input-modern" value={form.lastName} onChange={set("lastName")} /></div>
              </div>
              <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Specialty</label><input className="input-modern" value={form.specialty} onChange={set("specialty")} /></div>
              <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Phone</label><input className="input-modern" value={form.phone} onChange={set("phone")} /></div>
              {modal === "create" && (
                <>
                  <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Email</label><input type="email" className="input-modern" value={form.email} onChange={set("email")} /></div>
                  <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Password</label><input type="password" className="input-modern" value={form.password} onChange={set("password")} /></div>
                </>
              )}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={modal === "create" ? handleCreate : handleEdit} disabled={saving} className="btn-modern-primary flex-1 py-2.5">
                {saving ? "Saving..." : modal === "create" ? "Create Doctor" : "Save Changes"}
              </button>
              <button onClick={() => setModal(null)} className="btn-modern-outline flex-1 py-2.5">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-in">
            <h3 className="font-bold text-gray-800 mb-2">Delete Doctor</h3>
            <p className="text-gray-500 text-sm mb-5">This will permanently delete the doctor and all associated data.</p>
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
