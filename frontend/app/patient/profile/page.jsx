"use client";

import { useEffect, useState } from "react";
import { getPatientProfile, updatePatientProfile } from "../../utils/patientApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserCircle, FaCalendarAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import dayjs from "dayjs";
import Skeleton from "react-loading-skeleton";

export default function PatientProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", birthDate: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getPatientProfile()
      .then((data) => {
        setProfile(data);
        setForm({
          firstName: data.firstName,
          lastName: data.lastName,
          birthDate: dayjs(data.birthDate).format("YYYY-MM-DD"),
          address: data.address || "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updatePatientProfile(form);
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
        {loading ? <Skeleton count={5} height={40} className="mb-3" /> : (
          <>
            {/* Avatar */}
            <div className="flex items-center gap-5 mb-8">
              <div className="bg-teal-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold">
                {profile?.firstName?.[0]}{profile?.lastName?.[0]}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">{profile?.firstName} {profile?.lastName}</p>
                <p className="text-gray-500 text-sm flex items-center gap-1">
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
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Birth Date</label>
                  <input type="date" className="input input-bordered w-full" value={form.birthDate}
                    onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Address</label>
                  <input className="input input-bordered w-full" value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })} />
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
                  { icon: FaUserCircle, label: "Full Name", value: `${profile?.firstName} ${profile?.lastName}` },
                  { icon: FaCalendarAlt, label: "Date of Birth", value: dayjs(profile?.birthDate).format("MMMM D, YYYY") },
                  { icon: FaMapMarkerAlt, label: "Address", value: profile?.address || "Not provided" },
                  { icon: FaEnvelope, label: "Email", value: profile?.user?.email },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <Icon className="text-teal-500 text-lg" />
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
