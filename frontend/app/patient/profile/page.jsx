"use client";

import { useEffect, useState } from "react";
import { getPatientProfile, updatePatientProfile } from "../../utils/patientApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserCircle, FaCalendarAlt, FaMapMarkerAlt, FaEnvelope, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import dayjs from "dayjs";
import Skeleton from "react-loading-skeleton";

export default function PatientProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", birthDate: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getPatientProfile().then((data) => {
      setProfile(data);
      setForm({ firstName: data.firstName, lastName: data.lastName,
        birthDate: dayjs(data.birthDate).format("YYYY-MM-DD"), address: data.address || "" });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updatePatientProfile(form);
      setProfile({ ...profile, ...updated });
      toast.success("Profile updated successfully");
      setEditing(false);
    } catch { toast.error("Failed to update profile"); }
    finally { setSaving(false); }
  };

  const infoItems = profile ? [
    { icon: FaUserCircle, label: "Full Name", value: `${profile.firstName} ${profile.lastName}`, color: "text-teal-500" },
    { icon: FaCalendarAlt, label: "Date of Birth", value: dayjs(profile.birthDate).format("MMMM D, YYYY"), color: "text-blue-500" },
    { icon: FaMapMarkerAlt, label: "Address", value: profile.address || "Not provided", color: "text-orange-500" },
    { icon: FaEnvelope, label: "Email", value: profile.user?.email, color: "text-violet-500" },
  ] : [];

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="page-title">My Profile</h1>

      <div className="card-modern">
        {loading ? <Skeleton count={5} height={48} className="mb-3" /> : (
          <>
            {/* Avatar header */}
            <div className="flex items-center gap-5 pb-6 mb-6 border-b border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-2xl flex items-center justify-center text-3xl font-extrabold shadow-sm">
                {profile?.firstName?.[0]}{profile?.lastName?.[0]}
              </div>
              <div>
                <p className="text-xl font-extrabold text-gray-900">{profile?.firstName} {profile?.lastName}</p>
                <p className="text-gray-400 text-sm mt-0.5">{profile?.user?.email}</p>
                <span className="inline-block mt-2 bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full">Patient</span>
              </div>
            </div>

            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">First Name</label>
                    <input className="input-modern" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">Last Name</label>
                    <input className="input-modern" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Date of Birth</label>
                  <input type="date" className="input-modern" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Address</label>
                  <input className="input-modern" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} disabled={saving} className="btn-modern-primary flex items-center gap-2">
                    <FaCheck className="text-xs" /> {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button onClick={() => setEditing(false)} className="btn-modern-outline flex items-center gap-2">
                    <FaTimes className="text-xs" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {infoItems.map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <Icon className={`${color} text-lg flex-shrink-0`} />
                    <div>
                      <p className="text-xs text-gray-400 font-medium">{label}</p>
                      <p className="font-semibold text-gray-800 text-sm">{value}</p>
                    </div>
                  </div>
                ))}
                <button onClick={() => setEditing(true)} className="btn-modern-outline flex items-center gap-2 mt-2">
                  <FaEdit className="text-xs" /> Edit Profile
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <ToastContainer position="bottom-center" theme="colored" autoClose={3000} hideProgressBar />
    </div>
  );
}
