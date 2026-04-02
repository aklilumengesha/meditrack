"use client";

import { useEffect, useState } from "react";
import { getPatientMedicalRecords } from "../../utils/patientApi";
import dayjs from "dayjs";
import {
  FaStethoscope, FaSyringe, FaPills, FaUserMd,
  FaHeartbeat, FaTemperatureHigh, FaWeight, FaTint,
  FaNotesMedical, FaChevronDown, FaChevronUp,
} from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const visitColors = {
  RoutineCheckUp: "bg-green-100 text-green-700",
  Consultation: "bg-blue-100 text-blue-700",
  BloodTest: "bg-red-100 text-red-700",
  Vaccination: "bg-purple-100 text-purple-700",
  Emergency: "bg-orange-100 text-orange-700",
  Specialist: "bg-indigo-100 text-indigo-700",
};

export default function PatientRecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getPatientMedicalRecords().then(setRecords).catch(console.error).finally(() => setLoading(false));
  }, []);

  const vitals = (record) => [
    { icon: FaTint, label: "Blood Pressure", value: record.bloodPressure || "N/A", color: "text-red-500" },
    { icon: FaHeartbeat, label: "Heart Rate", value: record.heartRate ? `${record.heartRate} bpm` : "N/A", color: "text-red-500" },
    { icon: FaTemperatureHigh, label: "Temperature", value: record.temperature ? `${record.temperature}°C` : "N/A", color: "text-orange-500" },
    { icon: FaWeight, label: "Weight", value: record.weight ? `${record.weight} kg` : "N/A", color: "text-teal-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Medical Records</h1>
        <p className="text-gray-500 mt-1">{records.length} record{records.length !== 1 ? "s" : ""} in your history</p>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} height={80} className="rounded-2xl" />)}</div>
      ) : records.length === 0 ? (
        <div className="card-modern text-center py-16">
          <FaNotesMedical className="text-5xl text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No medical records yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <div key={record.id} className="card-modern p-0 overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
                onClick={() => setExpanded(expanded === record.id ? null : record.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <FaStethoscope />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{record.diagnosis}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{dayjs(record.date).format("MMMM D, YYYY")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${visitColors[record.visitType] || "bg-gray-100 text-gray-600"}`}>
                    {record.visitType}
                  </span>
                  {expanded === record.id ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                </div>
              </button>

              {expanded === record.id && (
                <div className="border-t border-gray-100 p-5 space-y-5 animate-fade-in">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: FaSyringe, label: "Treatment", value: record.treatment, color: "text-green-600", bg: "bg-green-50" },
                      { icon: FaPills, label: "Medication", value: record.medication || "N/A", color: "text-blue-600", bg: "bg-blue-50" },
                      { icon: FaUserMd, label: "Visit Type", value: record.visitType, color: "text-violet-600", bg: "bg-violet-50" },
                    ].map(({ icon: Icon, label, value, color, bg }) => (
                      <div key={label} className={`${bg} rounded-xl p-3 flex items-center gap-3`}>
                        <Icon className={`${color} text-lg`} />
                        <div>
                          <p className="text-xs text-gray-400">{label}</p>
                          <p className="text-sm font-semibold text-gray-700">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Vitals</p>
                    <div className="grid grid-cols-2 gap-3">
                      {vitals(record).map(({ icon: Icon, label, value, color }) => (
                        <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <Icon className={`${color} text-lg`} />
                          <div>
                            <p className="text-xs text-gray-400">{label}</p>
                            <p className="text-sm font-semibold text-gray-700">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {record.notes && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                      <p className="text-xs font-semibold text-amber-600 mb-1">Doctor's Notes</p>
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
