"use client";

import { useEffect, useState } from "react";
import { getAdminPatients } from "../../utils/adminApi";
import { FaUserInjured, FaSearch } from "react-icons/fa";
import { BiCalendar, BiMapPin } from "react-icons/bi";
import dayjs from "dayjs";
import Skeleton from "react-loading-skeleton";

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminPatients().then(setPatients).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter((p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Patients</h1>
          <p className="text-gray-500 mt-1">{patients.length} registered patients</p>
        </div>
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input type="text" placeholder="Search patients..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="input-modern pl-10 w-64" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} height={120} className="rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-modern text-center py-16">
          <FaUserInjured className="text-5xl text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No patients found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="card-modern hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                  {p.firstName?.[0]}{p.lastName?.[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{p.firstName} {p.lastName}</p>
                  <p className="text-xs text-gray-400">{p.user?.email}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm text-gray-500">
                <p className="flex items-center gap-2"><BiCalendar className="text-gray-300" /> {dayjs(p.birthDate).format("MMM D, YYYY")}</p>
                {p.address && <p className="flex items-center gap-2 truncate"><BiMapPin className="text-gray-300 flex-shrink-0" /> {p.address}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
