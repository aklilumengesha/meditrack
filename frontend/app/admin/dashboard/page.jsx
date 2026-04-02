"use client";

import { useEffect, useState } from "react";
import { getAdminStats } from "../../utils/adminApi";
import { FaUsers, FaUserMd, FaUserInjured, FaCalendarAlt, FaNotesMedical } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getAdminStats().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Users", value: stats?.totalUsers, icon: FaUsers, bg: "bg-violet-50", iconBg: "bg-violet-600", text: "text-violet-600", href: "/admin/users" },
    { label: "Doctors", value: stats?.totalDoctors, icon: FaUserMd, bg: "bg-blue-50", iconBg: "bg-blue-600", text: "text-blue-600", href: "/admin/doctors" },
    { label: "Patients", value: stats?.totalPatients, icon: FaUserInjured, bg: "bg-teal-50", iconBg: "bg-teal-600", text: "text-teal-600", href: "/admin/patients" },
    { label: "Appointments", value: stats?.totalAppointments, icon: FaCalendarAlt, bg: "bg-orange-50", iconBg: "bg-orange-500", text: "text-orange-500", href: "/admin/appointments" },
    { label: "Medical Records", value: stats?.totalRecords, icon: FaNotesMedical, bg: "bg-rose-50", iconBg: "bg-rose-500", text: "text-rose-500", href: null },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">System overview and management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map(({ label, value, icon: Icon, bg, iconBg, text, href }) => (
          <div
            key={label}
            onClick={() => href && router.push(href)}
            className={`${bg} rounded-2xl p-6 flex items-center gap-4 ${href ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
          >
            <div className={`${iconBg} text-white p-3.5 rounded-xl`}>
              <Icon className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{label}</p>
              {loading ? <Skeleton height={32} width={50} /> : (
                <p className={`text-3xl font-extrabold ${text}`}>{value ?? 0}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
