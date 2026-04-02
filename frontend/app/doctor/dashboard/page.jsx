"use client";

import { useEffect, useState } from "react";
import { getMyProfile, getMyStats, getMyAppointments } from "../../utils/doctorApi";
import { FaCalendarCheck, FaUsers, FaClock, FaUserMd, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function DoctorDashboard() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    Promise.all([getMyProfile(), getMyStats(), getMyAppointments()])
      .then(([p, s, a]) => { setProfile(p); setStats(s); setAppointments(a); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const upcoming = appointments.filter((a) => new Date(a.date) >= new Date()).slice(0, 5);

  const statCards = [
    { label: "Today's Appointments", value: stats?.todayAppointments, icon: FaCalendarCheck, bg: "bg-blue-50", iconBg: "bg-blue-600", text: "text-blue-600" },
    { label: "Upcoming", value: stats?.upcomingAppointments, icon: FaClock, bg: "bg-violet-50", iconBg: "bg-violet-600", text: "text-violet-600" },
    { label: "Total Patients", value: stats?.totalPatients, icon: FaUsers, bg: "bg-emerald-50", iconBg: "bg-emerald-600", text: "text-emerald-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          {loading ? <Skeleton height={36} width={300} /> : (
            <>
              <h1 className="page-title">
                Good {dayjs().hour() < 12 ? "morning" : dayjs().hour() < 18 ? "afternoon" : "evening"}, Dr. {profile?.firstName} 👋
              </h1>
              <p className="text-gray-500 mt-1">{profile?.specialty} · {dayjs().format("dddd, MMMM D")}</p>
            </>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statCards.map(({ label, value, icon: Icon, bg, iconBg, text }) => (
          <div key={label} className={`${bg} rounded-2xl p-6 flex items-center gap-4`}>
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

      {/* Upcoming appointments */}
      <div className="card-modern">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title mb-0">Upcoming Appointments</h2>
          <button
            onClick={() => router.push("/doctor/appointments")}
            className="text-sm text-blue-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            View all <FaArrowRight className="text-xs" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <Skeleton key={i} height={64} className="rounded-xl" />)}
          </div>
        ) : upcoming.length === 0 ? (
          <div className="text-center py-12">
            <FaCalendarCheck className="text-4xl text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No upcoming appointments</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((appt) => (
              <div key={appt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                    {appt.patient?.firstName?.[0]}{appt.patient?.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {appt.patient?.firstName} {appt.patient?.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{appt.reason || "No reason specified"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700">{dayjs(appt.date).format("MMM D")}</p>
                  <p className="text-xs text-gray-400">{dayjs(appt.startTime).format("HH:mm")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
