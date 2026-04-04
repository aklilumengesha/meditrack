"use client";

import { useEffect, useState } from "react";
import { getAllUsers, deleteUser, toggleUserActive, changeUserRole, resetUserPassword } from "../../utils/adminApi";
import { FaTrash, FaSearch, FaUserMd, FaUserInjured, FaShieldAlt, FaToggleOn, FaToggleOff, FaKey, FaUserTag } from "react-icons/fa";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";

const roleBadge = {
  DOCTOR: { label: "Doctor", cls: "bg-blue-100 text-blue-700", icon: FaUserMd },
  PATIENT: { cls: "bg-teal-100 text-teal-700", label: "Patient", icon: FaUserInjured },
  ADMIN: { cls: "bg-violet-100 text-violet-700", label: "Admin", icon: FaShieldAlt },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);
  const [roleModal, setRoleModal] = useState(null);
  const [passwordModal, setPasswordModal] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const fetch = () => getAllUsers().then(setUsers).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    try { await deleteUser(id); setUsers((p) => p.filter((u) => u.id !== id)); toast.success("User deleted"); }
    catch { toast.error("Failed to delete user"); }
    finally { setConfirmId(null); }
  };

  const handleToggle = async (id) => {
    try { await toggleUserActive(id); toast.success("Status updated"); fetch(); }
    catch { toast.error("Failed"); }
  };

  const handleRoleChange = async () => {
    setSaving(true);
    try { await changeUserRole(roleModal, newRole); toast.success("Role updated"); setRoleModal(null); fetch(); }
    catch { toast.error("Failed to change role"); }
    finally { setSaving(false); }
  };

  const handlePasswordReset = async () => {
    setSaving(true);
    try {
      const res = await resetUserPassword(passwordModal);
      setTempPassword(res.tempPassword);
      toast.success("Password reset — share the temp password with the user");
    } catch { toast.error("Failed to reset password"); }
    finally { setSaving(false); }
  };

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    `${u.doctor?.firstName || u.patient?.firstName || ""} ${u.doctor?.lastName || u.patient?.lastName || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">All Users</h1>
          <p className="text-gray-500 mt-1">{users.length} registered users</p>
        </div>
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-modern pl-10 w-64" />
        </div>
      </div>

      <div className="card-modern p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["User", "Email", "Role", "Status", "Joined", "Actions"].map((h) => (
              <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? [...Array(5)].map((_, i) => (
              <tr key={i}><td colSpan={6} className="px-5 py-3"><Skeleton height={32} /></td></tr>
            )) : filtered.map((user) => {
              const name = user.doctor ? `Dr. ${user.doctor.firstName} ${user.doctor.lastName}` : user.patient ? `${user.patient.firstName} ${user.patient.lastName}` : "—";
              const badge = roleBadge[user.role];
              const Icon = badge.icon;
              return (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-slate-400 to-slate-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {name?.[0]}{name?.split(" ")?.[1]?.[0]}
                      </div>
                      <span className="font-medium text-gray-800">{name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{user.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${badge.cls}`}>
                      <Icon className="text-xs" /> {badge.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${user.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {user.active ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400">{dayjs(user.createdAt).format("MMM D, YYYY")}</td>
                  <td className="px-5 py-3.5">
                    {user.role !== "ADMIN" && (
                      <div className="flex gap-1.5">
                        <button onClick={() => handleToggle(user.id)} title={user.active ? "Suspend" : "Activate"}
                          className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                          {user.active ? <FaToggleOff className="text-sm" /> : <FaToggleOn className="text-sm text-green-500" />}
                        </button>
                        <button onClick={() => { setRoleModal(user.id); setNewRole(user.role); }} title="Change Role"
                          className="p-2 rounded-lg border border-violet-100 text-violet-500 hover:bg-violet-50 transition-colors">
                          <FaUserTag className="text-sm" />
                        </button>
                        <button onClick={() => setPasswordModal(user.id)} title="Reset Password"
                          className="p-2 rounded-lg border border-amber-100 text-amber-500 hover:bg-amber-50 transition-colors">
                          <FaKey className="text-sm" />
                        </button>
                        <button onClick={() => setConfirmId(user.id)}
                          className="p-2 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition-colors">
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Role change modal */}
      {roleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-in">
            <h3 className="font-bold text-gray-800 mb-4">Change User Role</h3>
            <select className="input-modern mb-5" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="ADMIN">Admin</option>
            </select>
            <div className="flex gap-3">
              <button onClick={handleRoleChange} disabled={saving} className="btn-modern-primary flex-1 py-2.5">{saving ? "Saving..." : "Update Role"}</button>
              <button onClick={() => setRoleModal(null)} className="btn-modern-outline flex-1 py-2.5">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Password reset modal */}
      {passwordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-in">
            <h3 className="font-bold text-gray-800 mb-2">Reset Password</h3>
            {!tempPassword ? (
              <>
                <p className="text-gray-500 text-sm mb-5">
                  A secure temporary password will be generated automatically. The user will be required to change it on next login.
                </p>
                <div className="flex gap-3">
                  <button onClick={handlePasswordReset} disabled={saving} className="btn-modern-primary flex-1 py-2.5">{saving ? "Generating..." : "Generate Temp Password"}</button>
                  <button onClick={() => { setPasswordModal(null); setTempPassword(""); }} className="btn-modern-outline flex-1 py-2.5">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-500 text-sm mb-3">Share this temporary password with the user. They will be forced to change it on next login.</p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex items-center justify-between">
                  <code className="text-amber-800 font-bold text-lg tracking-widest">{tempPassword}</code>
                  <button onClick={() => { navigator.clipboard.writeText(tempPassword); toast.success("Copied!"); }}
                    className="text-xs text-amber-600 font-semibold hover:underline ml-3">Copy</button>
                </div>
                <button onClick={() => { setPasswordModal(null); setTempPassword(""); setNewPassword(""); }} className="btn-modern-primary w-full py-2.5">Done</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-in">
            <h3 className="font-bold text-gray-800 mb-2">Delete User</h3>
            <p className="text-gray-500 text-sm mb-5">This action cannot be undone. All associated data will be removed.</p>
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
