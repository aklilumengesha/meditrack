"use client";

import { useEffect, useState } from "react";
import { getPatientDashboard, getPatientProfile } from "../../utils/patientApi";
import { FaCalendarCheck, FaNotesMedical, FaCalendarAlt, FaUserMd, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function PatientDashboard() {
  const [summary, setSummary] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    Promise.all([getPatientDashboard(), getPatientProfile()])
      .then(([s, p]) => { setSummary(s); setProfile(p); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Appointments", value: summary?.totalAppointments, bg: "bg-teal-50", iconBg: "bg-teal-600", icon: FaCalendarAlt, text: "text-teal-600" },
    { label: "Medical Records", value: summary?.totalRecords, bg: "bg-blue-50", iconBg: "bg-blue-600", icon: FaNotesMedical, text: "text-blue-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        {loading ? <Skeleton height={36} width={280} /> : (
          <>
            <h1 className="page-title">
              Hello, {profile?.firstName} 👋
            </h1>
            <p className="text-gray-500 mt-1">{dayjs().format("dddd, MMMM D, YYYY")}</p>
          </>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

      {/* Next appointment */}
      <div className="card-modern">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title mb-0">Next Appointment</h2>
          <button
            onClick={() => router.push("/patient/appointments")}
            className="text-sm text-teal-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            View all <FaArrowRight className="text-xs" />
          </button>
        </div>

        {loading ? <Skeleton height={80} className="rounded-xl" /> :
          !summary?.nextAppointment ? (
            <div className="text-center py-10">
              <FaCalendarCheck className="text-4xl text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm mb-4">No upcoming appointments</p>
              <button
                onClick={() => router.push("/patient/appointments")}
                className="btn-modern-primary"
              >
                Book an Appointment
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                  {summary.nextAppointment.doctor?.firstName?.[0]}{summary.nextAppointment.doctor?.lastName?.[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-800">
                    Dr. {summary.nextAppointment.doctor?.firstName} {summary.nextAppointment.doctor?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{summary.nextAppointment.doctor?.specialty}</p>
                  {summary.nextAppointment.reason && (
                    <p className="text-xs text-gray-400 mt-0.5">{summary.nextAppointment.reason}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-teal-700">{dayjs(summary.nextAppointment.date).format("MMM D, YYYY")}</p>
                <p className="text-sm text-gray-500">{dayjs(summary.nextAppointment.startTime).format("HH:mm")}</p>
              </div>
            </div>
          )
        }
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Appointments", sub: "Book or view", icon: FaCalendarAlt, color: "text-teal-500", href: "/patient/appointments" },
          { label: "Medical Records", sub: "View history", icon: FaNotesMedical, color: "text-blue-500", href: "/patient/records" },
        ].map(({ label, sub, icon: Icon, color, href }) => (
          <button
            key={label}
            onClick={() => router.push(href)}
            className="card-modern flex items-center gap-4 hover:shadow-md transition-shadow text-left"
          >
            <Icon className={`${color} text-2xl`} />
            <div>
              <p className="font-bold text-gray-800">{label}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
