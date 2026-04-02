"use client";

import { useEffect, useState } from "react";
import { getMyPatients } from "../../utils/doctorApi";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { FaUserCircle, FaFolderOpen } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getMyPatients()
      .then(setPatients)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter((p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800">My Patients</h2>
        <div className="relative">
          <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered pl-9 w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} height={120} className="rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FaUserCircle className="text-6xl mx-auto mb-4 opacity-30" />
          <p>No patients found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((patient) => (
            <div key={patient.id} className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-700 rounded-full p-3">
                  <FaUserCircle className="text-2xl" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{patient.firstName} {patient.lastName}</p>
                  <p className="text-xs text-gray-500">
                    DOB: {dayjs(patient.birthDate).format("DD/MM/YYYY")}
                  </p>
                </div>
              </div>
              {patient.address && (
                <p className="text-sm text-gray-500 truncate">{patient.address}</p>
              )}
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => router.push(`/medical-reports/${patient.id}`)}
                  className="btn btn-sm btn-outline btn-primary flex-1 flex items-center gap-1"
                >
                  <FaFolderOpen /> Medical Records
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
