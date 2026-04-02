"use client";

import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../../utils/doctorApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserMd, FaPhone, FaStethoscope, FaEnvelope } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", specialty: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then((data) => {
        setProfile(data);
        setForm({
          firstName: data.firstName,
          lastName: data.lastName,
          specialty: data.specialty,
          phone: data.phone || "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateMyProfile(form);
      setProfile({ ...profile, ...updated });
      toast.success("Profile updated");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">My Profile</h2>

      <div className="bg-white rounded-2xl shadow-sm p-8">
        {loading ? (
          <Skeleton count={5} height={40} className="mb-3" />
        ) : (
          <>
            {/* Avatar */}
            <div className="flex items-center gap-5 mb-8">
              <div className="bg-blue-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold">
                {profile?.firstName?.[0]}{profile?.lastName?.[0]}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">Dr. {profile?.firstName} {profile?.lastName}</p>
                <p className="text-gray-500 flex items-center gap-1 text-sm">
                  <FaEnvelope /> {profile?.user?.email}
                </p>
              </div>
            </div>

            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">First Name</label>
                    <input className="input input-bordered w-full" value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Last Name</label>
                    <input className="input input-bordered w-full" value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Specialty</label>
                  <input className="input input-bordered w-full" value={form.specialty}
                    onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Phone</label>
                  <input className="input input-bordered w-full" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} disabled={saving} className="btn btn-primary">
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button onClick={() => setEditing(false)} className="btn btn-ghost">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { icon: FaUserMd, label: "Full Name", value: `Dr. ${profile?.firstName} ${profile?.lastName}` },
                  { icon: FaStethoscope, label: "Specialty", value: profile?.specialty },
                  { icon: FaPhone, label: "Phone", value: profile?.phone || "Not provided" },
                  { icon: FaEnvelope, label: "Email", value: profile?.user?.email },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <Icon className="text-blue-500 text-lg" />
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="font-medium text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
                <button onClick={() => setEditing(true)} className="btn btn-outline btn-primary mt-2">
                  Edit Profile
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
