"use client";

import { useEffect, useState } from "react";
import { getPatientDashboard, getPatientProfile } from "../../utils/patientApi";
import { FaCalendarCheck, FaNotesMedical, FaCalendarAlt, FaUserMd } from "react-icons/fa";
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
    { label: "Total Appointments", value: summary?.totalAppointments, icon: FaCalendarAlt, color: "bg-teal-500" },
    { label: "Medical Records", value: summary?.totalRecords, icon: FaNotesMedical, color: "bg-blue-500" },
  ];

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        {loading ? <Skeleton height={36} width={280} /> : (
          <>
            <h2 className="text-3xl font-extrabold text-gray-800">
              Hello, {profile?.firstName} {profile?.lastName}
            </h2>
            <p className="text-gray-500 mt-1">Here's your health summary</p>
          </>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
            <div className={`${color} text-white p-4 rounded-xl`}>
              <Icon className="text-2xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              {loading ? <Skeleton height={28} width={50} /> : (
                <p className="text-2xl font-bold text-gray-800">{value ?? 0}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Next appointment */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Next Appointment</h3>
        {loading ? <Skeleton height={80} /> : !summary?.nextAppointment ? (
          <div className="text-center py-8 text-gray-400">
            <FaCalendarCheck className="text-4xl mx-auto mb-2 opacity-30" />
            <p className="text-sm">No upcoming appointments.</p>
            <button
              onClick={() => router.push("/patient/appointments")}
              className="btn btn-sm btn-primary mt-3"
            >
              Book an Appointment
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-teal-50 rounded-xl border border-teal-100">
            <div className="flex items-center gap-4">
              <div className="bg-teal-500 text-white p-3 rounded-xl">
                <FaUserMd className="text-xl" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  Dr. {summary.nextAppointment.doctor?.firstName} {summary.nextAppointment.doctor?.lastName}
                </p>
                <p className="text-sm text-gray-500">{summary.nextAppointment.doctor?.specialty}</p>
                {summary.nextAppointment.reason && (
                  <p className="text-xs text-gray-400 mt-0.5">{summary.nextAppointment.reason}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-teal-700">
                {dayjs(summary.nextAppointment.date).format("MMM D, YYYY")}
              </p>
              <p className="text-sm text-gray-500">
                {dayjs(summary.nextAppointment.startTime).format("HH:mm")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => router.push("/patient/appointments")}
          className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3 hover:shadow-md transition-shadow text-left"
        >
          <FaCalendarAlt className="text-teal-500 text-2xl" />
          <div>
            <p className="font-semibold text-gray-800">Appointments</p>
            <p className="text-xs text-gray-400">View or book</p>
          </div>
        </button>
        <button
          onClick={() => router.push("/patient/records")}
          className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3 hover:shadow-md transition-shadow text-left"
        >
          <FaNotesMedical className="text-blue-500 text-2xl" />
          <div>
            <p className="font-semibold text-gray-800">Medical Records</p>
            <p className="text-xs text-gray-400">View your history</p>
          </div>
        </button>
      </div>
    </div>
  );
}
