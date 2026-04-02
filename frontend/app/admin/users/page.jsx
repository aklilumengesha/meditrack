"use client";

import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../utils/adminApi";
import { FaTrash, FaSearch, FaUserMd, FaUserInjured, FaShieldAlt } from "react-icons/fa";
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

  useEffect(() => {
    getAllUsers().then(setUsers).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted");
    } catch { toast.error("Failed to delete user"); }
    finally { setConfirmId(null); }
  };

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    `${u.doctor?.firstName || u.patient?.firstName} ${u.doctor?.lastName || u.patient?.lastName}`.toLowerCase().includes(search.toLowerCase())
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
          <input type="text" placeholder="Search users..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="input-modern pl-10 w-64" />
        </div>
      </div>

      <div className="card-modern p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["User", "Email", "Role", "Joined", "Actions"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-5 py-3"><Skeleton height={32} /></td></tr>
              ))
            ) : filtered.map((user) => {
              const name = user.doctor
                ? `Dr. ${user.doctor.firstName} ${user.doctor.lastName}`
                : user.patient
                ? `${user.patient.firstName} ${user.patient.lastName}`
                : "—";
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
                  <td className="px-5 py-3.5 text-gray-400">{dayjs(user.createdAt).format("MMM D, YYYY")}</td>
                  <td className="px-5 py-3.5">
                    {user.role !== "ADMIN" && (
                      <button onClick={() => setConfirmId(user.id)}
                        className="p-2 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <FaTrash className="text-xs" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
