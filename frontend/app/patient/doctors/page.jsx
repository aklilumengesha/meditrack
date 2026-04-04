"use client";

import { useEffect, useState } from "react";
import { getAllDoctors } from "../../utils/doctorApi";
import { useRouter } from "next/navigation";
import { FaSearch, FaStethoscope, FaStar, FaUserMd, FaCalendarAlt } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function PatientDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getAllDoctors(specialty)
      .then(setDoctors)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [specialty]);

  const specialties = [...new Set(doctors.map((d) => d.specialty))].sort();

  const filtered = doctors.filter((d) =>
    `${d.firstName} ${d.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <FaStar key={s} className={`text-xs ${s <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">Find a Doctor</h1>
        <p className="text-gray-500 mt-1">Browse our verified specialists and view their profiles</p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-modern pl-10 w-full"
          />
        </div>
        <select
          className="input-modern w-52"
          value={specialty}
          onChange={(e) => { setSpecialty(e.target.value); setLoading(true); }}
        >
          <option value="">All Specialties</option>
          {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Doctors grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} height={200} className="rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-modern text-center py-16">
          <FaUserMd className="text-5xl text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No doctors found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <div key={doc.id} className="card-modern hover:shadow-md transition-all group cursor-pointer"
              onClick={() => router.push(`/patient/doctors/${doc.id}`)}>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                  {doc.photoUrl ? (
                    <img src={doc.photoUrl} alt={`Dr. ${doc.firstName}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-800 text-white flex items-center justify-center text-2xl font-extrabold">
                      {doc.firstName?.[0]}{doc.lastName?.[0]}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Dr. {doc.firstName} {doc.lastName}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <FaStethoscope className="text-blue-400 text-xs" /> {doc.specialty}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                {renderStars(doc.averageRating || 0)}
                <span className="text-sm font-semibold text-gray-700">{doc.averageRating || 0}</span>
                <span className="text-xs text-gray-400">({doc.totalRatings || 0} review{doc.totalRatings !== 1 ? "s" : ""})</span>
              </div>

              {/* Bio preview */}
              {doc.bio && (
                <p className="text-xs text-gray-400 line-clamp-2 mb-4">{doc.bio}</p>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={(e) => { e.stopPropagation(); router.push(`/patient/doctors/${doc.id}`); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all"
                >
                  <FaUserMd className="text-xs" /> View Profile
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); router.push("/patient/appointments"); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors"
                >
                  <FaCalendarAlt className="text-xs" /> Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
