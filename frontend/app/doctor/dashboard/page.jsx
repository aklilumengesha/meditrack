"use client";

import { useEffect, useState } from "react";
import { getMyProfile, getMyStats, getMyAppointments } from "../../utils/doctorApi";
import { FaUserMd, FaCalendarCheck, FaUsers, FaClock } from "react-icons/fa";
import dayjs from "dayjs";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function DoctorDashboard() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [p, s, a] = await Promise.all([
          getMyProfile(),
          getMyStats(),
          getMyAppointments(),
        ]);
        setProfile(p);
        setStats(s);
        setAppointments(a);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const upcoming = appointments
    .filter((a) => new Date(a.date) >= new Date())
    .slice(0, 5);

  const statCards = [
    { label: "Today's Appointments", value: stats?.todayAppointments, icon: FaCalendarCheck, color: "bg-blue-500" },
    { label: "Upcoming", value: stats?.upcomingAppointments, icon: FaClock, color: "bg-indigo-500" },
    { label: "Total Patients", value: stats?.totalPatients, icon: FaUsers, color: "bg-teal-500" },
  ];

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        {loading ? (
          <Skeleton height={36} width={300} />
        ) : (
          <>
            <h2 className="text-3xl font-extrabold text-gray-800">
              Welcome, Dr. {profile?.firstName} {profile?.lastName}
            </h2>
            <p className="text-gray-500 mt-1">{profile?.specialty} · {profile?.user?.email}</p>
          </>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
            <div className={`${color} text-white p-4 rounded-xl`}>
              <Icon className="text-2xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              {loading ? (
                <Skeleton height={28} width={50} />
              ) : (
                <p className="text-2xl font-bold text-gray-800">{value ?? 0}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming appointments */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Appointments</h3>
        {loading ? (
          <Skeleton count={4} height={50} className="mb-2" />
        ) : upcoming.length === 0 ? (
          <p className="text-gray-400 text-sm">No upcoming appointments.</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((appt) => (
              <div key={appt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
                    <FaUserMd />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {appt.patient?.firstName} {appt.patient?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{appt.reason || "No reason specified"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">
                    {dayjs(appt.date).format("MMM D, YYYY")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {dayjs(appt.startTime).format("HH:mm")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
