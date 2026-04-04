import { FaShieldAlt, FaUsers, FaUserMd, FaUserInjured, FaCalendarAlt, FaNotesMedical, FaKey, FaHeartbeat } from "react-icons/fa";

const stats = [
  { label: "Total Users", value: "3", icon: FaUsers, bg: "bg-violet-500" },
  { label: "Doctors", value: "1", icon: FaUserMd, bg: "bg-blue-500" },
  { label: "Patients", value: "1", icon: FaUserInjured, bg: "bg-teal-500" },
  { label: "Appointments", value: "2", icon: FaCalendarAlt, bg: "bg-orange-500" },
  { label: "Records", value: "1", icon: FaNotesMedical, bg: "bg-rose-500" },
];

const navItems = [
  { label: "Dashboard", icon: FaShieldAlt, active: true },
  { label: "All Users", icon: FaUsers },
  { label: "Doctors", icon: FaUserMd },
  { label: "Patients", icon: FaUserInjured },
  { label: "Appointments", icon: FaCalendarAlt },
  { label: "Medical Records", icon: FaNotesMedical },
  { label: "Reset Requests", icon: FaKey },
];

const recent = [
  { name: "admin@meditrack.com", role: "ADMIN", color: "bg-violet-500", init: "A" },
  { name: "Dr. doctor one", role: "DOCTOR", color: "bg-blue-500", init: "D" },
  { name: "patient one", role: "PATIENT", color: "bg-teal-500", init: "P" },
];

export default function DashboardMockup() {
  return (
    <div className="w-full h-full flex overflow-hidden rounded-2xl shadow-2xl" style={{ transform: "scale(1)", transformOrigin: "top left" }}>
      {/* Mini sidebar */}
      <div className="w-28 bg-slate-900 flex flex-col flex-shrink-0 py-3 px-2">
        <div className="flex items-center gap-1.5 px-1 mb-4">
          <FaHeartbeat className="text-violet-400 text-sm" />
          <div>
            <p className="text-white font-bold text-xs leading-none">Meditrack</p>
            <p className="text-slate-400 text-[8px]">Admin Panel</p>
          </div>
        </div>
        <div className="space-y-0.5">
          {navItems.map(({ label, icon: Icon, active }) => (
            <div key={label} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg ${active ? "bg-violet-600" : "hover:bg-slate-800"}`}>
              <Icon className={`text-xs flex-shrink-0 ${active ? "text-white" : "text-slate-400"}`} />
              <span className={`text-[9px] font-medium truncate ${active ? "text-white" : "text-slate-300"}`}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-50 p-3 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-gray-900 font-bold text-sm">Admin Dashboard</p>
            <p className="text-gray-400 text-[9px]">System overview and management</p>
          </div>
          <div className="bg-violet-600 text-white text-[9px] font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
            <FaUserMd className="text-[8px]" /> Add Doctor
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-5 gap-1.5 mb-3">
          {stats.map(({ label, value, icon: Icon, bg }) => (
            <div key={label} className="bg-white rounded-xl p-2 shadow-sm">
              <div className={`${bg} w-5 h-5 rounded-lg flex items-center justify-center mb-1`}>
                <Icon className="text-white text-[9px]" />
              </div>
              <p className="text-gray-400 text-[8px] leading-none">{label}</p>
              <p className="text-gray-900 font-extrabold text-sm leading-tight">{value}</p>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-3 gap-1.5">
          {/* Pie chart mockup */}
          <div className="bg-white rounded-xl p-2 shadow-sm">
            <p className="text-gray-700 font-bold text-[9px] mb-2">User Distribution</p>
            <div className="flex items-center justify-center mb-1">
              <div className="relative w-14 h-14">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3b82f6" strokeWidth="3"
                    strokeDasharray="50 50" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#14b8a6" strokeWidth="3"
                    strokeDasharray="50 50" strokeDashoffset="-50" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="flex gap-2 justify-center">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-[8px] text-gray-500">Doctors</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-teal-500" /><span className="text-[8px] text-gray-500">Patients</span></div>
            </div>
          </div>

          {/* This month */}
          <div className="bg-white rounded-xl p-2 shadow-sm">
            <p className="text-gray-700 font-bold text-[9px] mb-2">This Month</p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between bg-violet-50 rounded-lg px-2 py-1.5">
                <span className="text-[8px] text-gray-600">New Users</span>
                <span className="text-violet-600 font-extrabold text-sm">3</span>
              </div>
              <div className="flex items-center justify-between bg-orange-50 rounded-lg px-2 py-1.5">
                <span className="text-[8px] text-gray-600">Appointments</span>
                <span className="text-orange-500 font-extrabold text-sm">2</span>
              </div>
            </div>
          </div>

          {/* Recent registrations */}
          <div className="bg-white rounded-xl p-2 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-700 font-bold text-[9px]">Recent Registrations</p>
              <span className="text-violet-500 text-[8px]">View all →</span>
            </div>
            <div className="space-y-1.5">
              {recent.map(({ name, role, color, init }) => (
                <div key={name} className="flex items-center gap-1.5">
                  <div className={`${color} w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0`}>{init}</div>
                  <div>
                    <p className="text-[8px] font-semibold text-gray-800 leading-none truncate max-w-[60px]">{name}</p>
                    <p className="text-[7px] text-gray-400">{role}</p>
                  </div>
                  <span className="text-[7px] text-gray-300 ml-auto">2d ago</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
