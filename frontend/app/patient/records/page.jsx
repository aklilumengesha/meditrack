"use client";

import { useEffect, useState } from "react";
import { getPatientMedicalRecords } from "../../utils/patientApi";
import dayjs from "dayjs";
import {
  FaStethoscope, FaSyringe, FaPills, FaUserMd,
  FaHeartbeat, FaTemperatureHigh, FaWeight, FaTint, FaNotesMedical,
} from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function PatientRecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getPatientMedicalRecords()
      .then(setRecords)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">My Medical Records</h2>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} height={100} className="rounded-2xl" />)}
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FaNotesMedical className="text-5xl mx-auto mb-3 opacity-30" />
          <p>No medical records found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Header */}
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === record.id ? null : record.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                    <FaStethoscope />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{record.diagnosis}</p>
                    <p className="text-xs text-gray-500">{dayjs(record.date).format("MMMM D, YYYY")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="badge badge-outline text-xs">{record.visitType}</span>
                  <span className="text-gray-400 text-sm">{expanded === record.id ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* Expanded details */}
              {expanded === record.id && (
                <div className="border-t border-gray-100 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: FaSyringe, label: "Treatment", value: record.treatment, color: "text-green-600" },
                    { icon: FaPills, label: "Medication", value: record.medication || "N/A", color: "text-blue-600" },
                    { icon: FaUserMd, label: "Visit Type", value: record.visitType, color: "text-yellow-600" },
                    { icon: FaTint, label: "Blood Pressure", value: record.bloodPressure || "N/A", color: "text-red-500" },
                    { icon: FaHeartbeat, label: "Heart Rate", value: record.heartRate ? `${record.heartRate} bpm` : "N/A", color: "text-red-500" },
                    { icon: FaTemperatureHigh, label: "Temperature", value: record.temperature ? `${record.temperature} °C` : "N/A", color: "text-orange-500" },
                    { icon: FaWeight, label: "Weight", value: record.weight ? `${record.weight} kg` : "N/A", color: "text-teal-600" },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <Icon className={`${color} text-lg`} />
                      <div>
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className="text-sm font-medium text-gray-700">{value}</p>
                      </div>
                    </div>
                  ))}
                  {record.notes && (
                    <div className="col-span-2 bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Notes</p>
                      <p className="text-sm text-gray-700">{record.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
