"use client";

import { useEffect, useState } from "react";
import { getAdminStats } from "../../utils/adminApi";
import { FaUsers, FaUserMd, FaUserInjured, FaCalendarAlt, FaNotesMedical, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

dayjs.extend(relativeTime);

const ROLE_COLORS = { DOCTOR: "#3b82f6", PATIENT: "#14b8a6", ADMIN: "#8b5cf6" };

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
    { label: "Medical Records", value: stats?.totalRecords, icon: FaNotesMedical, bg: "bg-rose-50", iconBg: "bg-rose-500", text: "text-rose-500", href: "/admin/medical-records" },
  ];

  const pieData = stats ? [
    { name: "Doctors", value: stats.totalDoctors, color: "#3b82f6" },
    { name: "Patients", value: stats.totalPatients, color: "#14b8a6" },
  ] : [];

  const monthlyData = stats ? [
    { name: "New Users This Month", value: stats.newUsersThisMonth, color: "#8b5cf6" },
    { name: "Appointments This Month", value: stats.appointmentsThisMonth, color: "#f59e0b" },
  ] : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">System overview and management</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push("/admin/doctors")} className="btn-modern-primary flex items-center gap-2 text-sm">
            <FaUserMd className="text-xs" /> Add Doctor
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map(({ label, value, icon: Icon, bg, iconBg, text, href }) => (
          <div key={label} onClick={() => href && router.push(href)}
            className={`${bg} rounded-2xl p-5 flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow`}>
            <div className={`${iconBg} text-white p-3 rounded-xl`}><Icon className="text-lg" /></div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              {loading ? <Skeleton height={28} width={40} /> : <p className={`text-2xl font-extrabold ${text}`}>{value ?? 0}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User distribution chart */}
        <div className="card-modern">
          <h2 className="section-title">User Distribution</h2>
          {loading ? <Skeleton height={200} /> : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* This month */}
        <div className="card-modern">
          <h2 className="section-title">This Month</h2>
          {loading ? <Skeleton count={2} height={60} className="mb-3" /> : (
            <div className="space-y-4">
              {monthlyData.map(({ name, value, color }) => (
                <div key={name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-700">{name}</p>
                  <p className="text-2xl font-extrabold" style={{ color }}>{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="card-modern">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0">Recent Registrations</h2>
            <button onClick={() => router.push("/admin/users")} className="text-xs text-violet-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all <FaArrowRight className="text-xs" />
            </button>
          </div>
          {loading ? <Skeleton count={5} height={40} className="mb-2" /> : (
            <div className="space-y-2">
              {stats?.recentActivity?.slice(0, 6).map((u) => {
                const name = u.doctor ? `Dr. ${u.doctor.firstName} ${u.doctor.lastName}` : u.patient ? `${u.patient.firstName} ${u.patient.lastName}` : u.email;
                return (
                  <div key={u.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: ROLE_COLORS[u.role] }}>
                        {name?.[0]}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{name}</p>
                        <p className="text-xs text-gray-400">{u.role}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">{dayjs(u.createdAt).fromNow()}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
