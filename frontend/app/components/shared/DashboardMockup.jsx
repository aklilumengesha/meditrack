"use client";

import {
  FaShieldAlt, FaUsers, FaUserMd, FaUserInjured, FaCalendarAlt,
  FaNotesMedical, FaKey, FaHeartbeat, FaHome, FaClock, FaUserCircle,
} from "react-icons/fa";

// ─── Admin Dashboard Mini ────────────────────────────────────────────────────
function AdminCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 w-full">
      {/* Header bar */}
      <div className="bg-slate-900 px-3 py-2 flex items-center gap-2">
        <FaShieldAlt className="text-violet-400 text-xs" />
        <span className="text-white text-[9px] font-bold">Meditrack</span>
        <span className="text-slate-400 text-[8px]">Admin Panel</span>
        <div className="ml-auto flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div className="w-2 h-2 rounded-full bg-green-400" />
        </div>
      </div>
      <div className="p-3">
        <p className="text-gray-800 font-bold text-[10px] mb-0.5">Admin Dashboard</p>
        <p className="text-gray-400 text-[8px] mb-2">System overview and management</p>
        {/* Stats row */}
        <div className="grid grid-cols-5 gap-1 mb-2">
          {[
            { label: "Users", val: "3", bg: "bg-violet-500" },
            { label: "Doctors", val: "1", bg: "bg-blue-500" },
            { label: "Patients", val: "1", bg: "bg-teal-500" },
            { label: "Appts", val: "2", bg: "bg-orange-500" },
            { label: "Records", val: "1", bg: "bg-rose-500" },
          ].map(({ label, val, bg }) => (
            <div key={label} className="bg-gray-50 rounded-lg p-1.5 text-center">
              <div className={`${bg} w-3 h-3 rounded-md mx-auto mb-0.5 flex items-center justify-center`}>
                <span className="text-white text-[6px] font-bold">{val}</span>
              </div>
              <p className="text-gray-500 text-[7px] leading-none">{label}</p>
            </div>
          ))}
        </div>
        {/* Bottom row */}
        <div className="grid grid-cols-2 gap-1">
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-gray-600 font-semibold text-[8px] mb-1">User Distribution</p>
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 relative">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="50 50" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#14b8a6" strokeWidth="4" strokeDasharray="50 50" strokeDashoffset="-50" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /><span className="text-[7px] text-gray-500">Doctors</span></div>
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-teal-500" /><span className="text-[7px] text-gray-500">Patients</span></div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-gray-600 font-semibold text-[8px] mb-1">Recent</p>
            {[
              { init: "A", color: "bg-violet-500", name: "admin@meditrack.com", role: "ADMIN" },
              { init: "D", color: "bg-blue-500", name: "Dr. doctor one", role: "DOCTOR" },
              { init: "P", color: "bg-teal-500", name: "patient one", role: "PATIENT" },
            ].map(({ init, color, name, role }) => (
              <div key={name} className="flex items-center gap-1 mb-0.5">
                <div className={`${color} w-3 h-3 rounded-full flex items-center justify-center text-white text-[6px] font-bold flex-shrink-0`}>{init}</div>
                <div className="min-w-0">
                  <p className="text-[7px] text-gray-700 truncate leading-none">{name}</p>
                  <p className="text-[6px] text-gray-400">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Doctor Dashboard Mini ───────────────────────────────────────────────────
function DoctorCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 w-full">
      <div className="bg-slate-900 px-3 py-2 flex items-center gap-2">
        <FaHeartbeat className="text-blue-400 text-xs" />
        <span className="text-white text-[9px] font-bold">Meditrack</span>
        <span className="text-slate-400 text-[8px]">Doctor Portal</span>
        <div className="ml-auto flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div className="w-2 h-2 rounded-full bg-green-400" />
        </div>
      </div>
      <div className="p-3">
        <p className="text-gray-800 font-bold text-[10px]">Good evening, Dr. doctor 👋</p>
        <p className="text-gray-400 text-[8px] mb-2">cardiology · Saturday, April 4</p>
        <div className="grid grid-cols-3 gap-1 mb-2">
          {[
            { label: "Today's Appts", val: "0", bg: "bg-blue-500" },
            { label: "Upcoming", val: "1", bg: "bg-violet-500" },
            { label: "Total Patients", val: "1", bg: "bg-teal-500" },
          ].map(({ label, val, bg }) => (
            <div key={label} className="bg-gray-50 rounded-lg p-2">
              <div className={`${bg} w-4 h-4 rounded-lg flex items-center justify-center mb-1`}>
                <span className="text-white text-[7px] font-bold">{val}</span>
              </div>
              <p className="text-gray-500 text-[7px] leading-tight">{label}</p>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-gray-600 font-semibold text-[8px] mb-1">Upcoming Appointments</p>
          <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1.5 shadow-sm">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-[7px] font-bold">po</div>
              <div>
                <p className="text-[8px] font-semibold text-gray-800">patient one</p>
                <p className="text-[7px] text-gray-400">sdsadfghw</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-semibold text-gray-700">Apr 6</p>
              <p className="text-[7px] text-gray-400">09:41</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Patient Dashboard Mini ──────────────────────────────────────────────────
function PatientCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 w-full">
      <div className="bg-slate-900 px-3 py-2 flex items-center gap-2">
        <FaHeartbeat className="text-teal-400 text-xs" />
        <span className="text-white text-[9px] font-bold">Meditrack</span>
        <span className="text-slate-400 text-[8px]">Patient Portal</span>
        <div className="ml-auto flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div className="w-2 h-2 rounded-full bg-green-400" />
        </div>
      </div>
      <div className="p-3">
        <p className="text-gray-800 font-bold text-[10px]">Hello, patient 👋</p>
        <p className="text-gray-400 text-[8px] mb-2">Saturday, April 4, 2026</p>
        <div className="grid grid-cols-2 gap-1 mb-2">
          <div className="bg-teal-50 rounded-lg p-2 flex items-center gap-2">
            <div className="bg-teal-500 w-5 h-5 rounded-lg flex items-center justify-center">
              <FaCalendarAlt className="text-white text-[8px]" />
            </div>
            <div>
              <p className="text-gray-500 text-[7px]">Total Appointments</p>
              <p className="text-teal-600 font-extrabold text-sm leading-none">2</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-2 flex items-center gap-2">
            <div className="bg-blue-500 w-5 h-5 rounded-lg flex items-center justify-center">
              <FaNotesMedical className="text-white text-[8px]" />
            </div>
            <div>
              <p className="text-gray-500 text-[7px]">Medical Records</p>
              <p className="text-blue-600 font-extrabold text-sm leading-none">1</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-2 border border-teal-100">
          <p className="text-gray-600 font-semibold text-[8px] mb-1">Next Appointment</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 bg-teal-600 text-white rounded-full flex items-center justify-center text-[7px] font-bold">do</div>
              <div>
                <p className="text-[8px] font-semibold text-gray-800">Dr. doctor one</p>
                <p className="text-[7px] text-gray-400">cardiology</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-bold text-teal-700">Apr 6, 2026</p>
              <p className="text-[7px] text-gray-400">09:41</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Merged 3-Dashboard Mockup ───────────────────────────────────────────────
export default function DashboardMockup() {
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: "420px" }}>
      {/* Admin — back left, slightly rotated */}
      <div className="absolute"
        style={{
          width: "72%",
          top: "0%",
          left: "0%",
          transform: "perspective(800px) rotateY(8deg) rotateX(2deg) scale(0.88)",
          transformOrigin: "top left",
          zIndex: 1,
          opacity: 0.85,
        }}>
        <AdminCard />
      </div>

      {/* Patient — back right, slightly rotated */}
      <div className="absolute"
        style={{
          width: "72%",
          top: "8%",
          right: "0%",
          transform: "perspective(800px) rotateY(-8deg) rotateX(2deg) scale(0.88)",
          transformOrigin: "top right",
          zIndex: 1,
          opacity: 0.85,
        }}>
        <PatientCard />
      </div>

      {/* Doctor — front center, full size */}
      <div className="absolute"
        style={{
          width: "78%",
          top: "16%",
          left: "50%",
          transform: "translateX(-50%) perspective(800px) rotateX(1deg) scale(1)",
          transformOrigin: "top center",
          zIndex: 10,
        }}>
        <DoctorCard />
      </div>
    </div>
  );
}
