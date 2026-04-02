"use client";

import { useEffect, useState } from "react";
import { getAdminDoctors } from "../../utils/adminApi";
import { FaUserMd, FaSearch, FaPhone, FaEnvelope } from "react-icons/fa";
import { FaStethoscope } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDoctors().then(setDoctors).catch(console.error).finally(() => setLoading(false));
  }, []);

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
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input type="text" placeholder="Search doctors..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="input-modern pl-10 w-64" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} height={130} className="rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-modern text-center py-16">
          <FaUserMd className="text-5xl text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No doctors found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <div key={doc.id} className="card-modern hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-800 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                  {doc.firstName?.[0]}{doc.lastName?.[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-800">Dr. {doc.firstName} {doc.lastName}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <FaStethoscope className="text-blue-400" /> {doc.specialty}
                  </p>
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-gray-500">
                <p className="flex items-center gap-2"><FaEnvelope className="text-gray-300" /> {doc.user?.email}</p>
                {doc.phone && <p className="flex items-center gap-2"><FaPhone className="text-gray-300" /> {doc.phone}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
