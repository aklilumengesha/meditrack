"use client";

import {
  FaShieldAlt, FaUsers, FaUserMd, FaUserInjured, FaCalendarAlt,
  FaNotesMedical, FaHeartbeat, FaClock, FaKey,
} from "react-icons/fa";

// ─── Stat Pill ───────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, label, value, color, bg }) {
  return (
    <div className={`${bg} rounded-xl px-2.5 py-2 flex items-center gap-2`}>
      <div className={`${color} w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0`}>
        <Icon className="text-white text-[9px]" />
      </div>
      <div>
        <p className="text-gray-400 text-[8px] leading-none">{label}</p>
        <p className="text-gray-800 font-extrabold text-sm leading-tight">{value}</p>
      </div>
    </div>
  );
}

// ─── Role Badge ──────────────────────────────────────────────────────────────
function RoleBadge({ color, init, name, role, time }) {
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
      <div className={`${color} w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0`}>{init}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-semibold text-gray-800 truncate leading-none">{name}</p>
        <p className="text-[7px] text-gray-400">{role}</p>
      </div>
      <p className="text-[7px] text-gray-300 flex-shrink-0">{time}</p>
    </div>
  );
}

export default function DashboardMockup() {
  return (
    <div className="w-full h-full flex flex-col gap-3 p-1">

      {/* ── Row 1: Header label + 5 stat pills ── */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 bg-violet-600 rounded-lg flex items-center justify-center">
            <FaShieldAlt className="text-white text-[9px]" />
          </div>
          <div>
            <p className="text-gray-800 font-extrabold text-xs leading-none">Admin Dashboard</p>
            <p className="text-gray-400 text-[8px]">System overview</p>
          </div>
          <div className="ml-auto flex gap-1">
            <span className="bg-green-100 text-green-600 text-[7px] font-semibold px-1.5 py-0.5 rounded-full">Live</span>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {[
            { icon: FaUsers, label: "Users", value: "3", color: "bg-violet-500", bg: "bg-violet-50" },
            { icon: FaUserMd, label: "Doctors", value: "1", color: "bg-blue-500", bg: "bg-blue-50" },
            { icon: FaUserInjured, label: "Patients", value: "1", color: "bg-teal-500", bg: "bg-teal-50" },
            { icon: FaCalendarAlt, label: "Appts", value: "2", color: "bg-orange-500", bg: "bg-orange-50" },
            { icon: FaNotesMedical, label: "Records", value: "1", color: "bg-rose-500", bg: "bg-rose-50" },
          ].map((s) => <StatPill key={s.label} {...s} />)}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-[8px] text-gray-300 font-medium">3 portals · 1 platform</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* ── Row 2: Doctor + Patient side by side ── */}
      <div className="grid grid-cols-2 gap-2 flex-1">

        {/* Doctor card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-3 border border-blue-100">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-5 h-5 bg-blue-600 rounded-lg flex items-center justify-center">
              <FaUserMd className="text-white text-[9px]" />
            </div>
            <div>
              <p className="text-gray-800 font-bold text-[9px] leading-none">Doctor Portal</p>
              <p className="text-gray-400 text-[7px]">cardiology</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1 mb-2">
            {[
              { label: "Today", val: "0", color: "bg-blue-500" },
              { label: "Upcoming", val: "1", color: "bg-violet-500" },
              { label: "Patients", val: "1", color: "bg-teal-500" },
            ].map(({ label, val, color }) => (
              <div key={label} className="bg-white rounded-xl p-1.5 text-center shadow-sm">
                <p className={`${color.replace("bg-", "text-")} font-extrabold text-sm leading-none`}>{val}</p>
                <p className="text-gray-400 text-[7px] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl p-2 shadow-sm">
            <p className="text-[8px] font-semibold text-gray-500 mb-1.5">Upcoming Appointments</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-[7px] font-bold">po</div>
                <div>
                  <p className="text-[8px] font-semibold text-gray-800">patient one</p>
                  <p className="text-[7px] text-gray-400 flex items-center gap-0.5"><FaClock className="text-[6px]" /> Apr 6 · 09:41</p>
                </div>
              </div>
              <span className="bg-amber-100 text-amber-600 text-[7px] font-semibold px-1.5 py-0.5 rounded-full">Pending</span>
            </div>
          </div>
        </div>

        {/* Patient card */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-3 border border-teal-100">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-5 h-5 bg-teal-600 rounded-lg flex items-center justify-center">
              <FaUserInjured className="text-white text-[9px]" />
            </div>
            <div>
              <p className="text-gray-800 font-bold text-[9px] leading-none">Patient Portal</p>
              <p className="text-gray-400 text-[7px]">Hello, patient 👋</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1 mb-2">
            <div className="bg-white rounded-xl p-1.5 text-center shadow-sm">
              <p className="text-teal-600 font-extrabold text-sm leading-none">2</p>
              <p className="text-gray-400 text-[7px] mt-0.5">Appointments</p>
            </div>
            <div className="bg-white rounded-xl p-1.5 text-center shadow-sm">
              <p className="text-blue-600 font-extrabold text-sm leading-none">1</p>
              <p className="text-gray-400 text-[7px] mt-0.5">Records</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-2 shadow-sm">
            <p className="text-[8px] font-semibold text-gray-500 mb-1.5">Next Appointment</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 bg-teal-600 text-white rounded-full flex items-center justify-center text-[7px] font-bold">do</div>
                <div>
                  <p className="text-[8px] font-semibold text-gray-800">Dr. doctor one</p>
                  <p className="text-[7px] text-gray-400">cardiology</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-bold text-teal-700">Apr 6</p>
                <p className="text-[7px] text-gray-400">09:41</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Recent registrations strip ── */}
      <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[9px] font-bold text-gray-700">Recent Registrations</p>
          <span className="text-violet-500 text-[8px] font-semibold">View all →</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { init: "A", color: "bg-violet-500", name: "admin@meditrack.com", role: "ADMIN", time: "2d ago" },
            { init: "D", color: "bg-blue-500", name: "Dr. doctor one", role: "DOCTOR", time: "2d ago" },
            { init: "P", color: "bg-teal-500", name: "patient one", role: "PATIENT", time: "2d ago" },
          ].map((r) => (
            <div key={r.name} className="bg-white rounded-xl p-2 shadow-sm flex items-center gap-1.5">
              <div className={`${r.color} w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0`}>{r.init}</div>
              <div className="min-w-0">
                <p className="text-[8px] font-semibold text-gray-800 truncate leading-none">{r.name}</p>
                <p className="text-[7px] text-gray-400">{r.role} · {r.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
