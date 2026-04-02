"use client";

import { useEffect, useState } from "react";
import { getMyPatients } from "../../utils/doctorApi";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { FaUserCircle, FaFolderOpen, FaSearch } from "react-icons/fa";
import { BiCalendar, BiMapPin } from "react-icons/bi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getMyPatients().then(setPatients).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter((p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">My Patients</h1>
          <p className="text-gray-500 mt-1">{patients.length} patient{patients.length !== 1 ? "s" : ""} under your care</p>
        </div>
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-modern pl-10 w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} height={140} className="rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-modern text-center py-16">
          <FaUserCircle className="text-6xl text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">No patients found</p>
          <p className="text-gray-300 text-sm mt-1">Patients will appear here after their first appointment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((patient) => (
            <div key={patient.id} className="card-modern hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {patient.firstName?.[0]}{patient.lastName?.[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{patient.firstName} {patient.lastName}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <BiCalendar /> {dayjs(patient.birthDate).format("DD/MM/YYYY")}
                  </p>
                </div>
              </div>

              {patient.address && (
                <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-4 truncate">
                  <BiMapPin className="text-gray-400 flex-shrink-0" /> {patient.address}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-medium">
                  {patient.medicalRecords?.length ?? 0} records
                </span>
              </div>

              <button
                onClick={() => router.push(`/medical-reports/${patient.id}`)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all"
              >
                <FaFolderOpen /> View Medical Records
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
