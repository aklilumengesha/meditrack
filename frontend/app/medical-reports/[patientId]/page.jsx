"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMedicalRecordsByPatientId, getPatientById, createMedicalRecord, deleteMedicalRecord } from "../../utils/api";
import { FaArrowLeft, FaPlus, FaStethoscope, FaSyringe, FaPills, FaUserMd, FaHeartbeat, FaTemperatureHigh, FaWeight, FaTint, FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AddMedicalRecord from "../../components/medical-report/AddMedicalRecord";

const visitColors = {
  RoutineCheckUp: "bg-green-100 text-green-700",
  Consultation: "bg-blue-100 text-blue-700",
  BloodTest: "bg-red-100 text-red-700",
  Vaccination: "bg-purple-100 text-purple-700",
  Emergency: "bg-orange-100 text-orange-700",
  Specialist: "bg-indigo-100 text-indigo-700",
};

export default function MedicalReportsPage() {
  const { patientId } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filterType, setFilterType] = useState("date");
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchDiagnosis, setSearchDiagnosis] = useState("");

  const diagnosisOptions = ["All", "Hypertension", "Diabetes", "Asthma", "Flu", "Covid19", "HeartDisease", "Headache", "Allergy", "Gastroenteritis", "Migraine"];

  const fetchRecords = async () => {
    try {
      const [p, r] = await Promise.all([getPatientById(patientId), getMedicalRecordsByPatientId(patientId)]);
      setPatient(p);
      setRecords(r);
    } catch (err) { toast.error("Failed to load records"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRecords(); }, [patientId]);

  const handleDelete = async () => {
    try {
      await deleteMedicalRecord(confirmDelete);
      toast.success("Record deleted");
      setRecords(records.filter((r) => r.id !== confirmDelete));
      setConfirmDelete(null);
    } catch { toast.error("Failed to delete"); }
  };

  const filtered = records.filter((r) => {
    if (filterType === "date" && selectedDate) {
      return dayjs(r.date).format("DD/MM/YYYY") === dayjs(selectedDate).format("DD/MM/YYYY");
    }
    if (filterType === "diagnosis" && searchDiagnosis && searchDiagnosis !== "All") {
      return r.diagnosis.toLowerCase().includes(searchDiagnosis.toLowerCase());
    }
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back + Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <FaArrowLeft className="text-xs" /> Back
          </button>
        </div>

        {/* Patient info bar */}
        <div className="card-modern flex items-center justify-between">
          <div className="flex items-center gap-4">
            {loading ? <Skeleton circle width={56} height={56} /> : (
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-2xl flex items-center justify-center text-xl font-extrabold">
                {patient?.firstName?.[0]}{patient?.lastName?.[0]}
              </div>
            )}
            <div>
              {loading ? <Skeleton width={200} height={24} /> : (
                <>
                  <h1 className="text-xl font-extrabold text-gray-900">{patient?.firstName} {patient?.lastName}</h1>
                  <p className="text-sm text-gray-400">{records.length} medical record{records.length !== 1 ? "s" : ""}</p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select className="input-modern text-sm w-44" value={filterType} onChange={(e) => { setFilterType(e.target.value); setSelectedDate(null); setSearchDiagnosis(""); }}>
              <option value="date">Filter by Date</option>
              <option value="diagnosis">Filter by Diagnosis</option>
            </select>

            {filterType === "date" ? (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="Select Date" value={selectedDate} onChange={setSelectedDate} slotProps={{ textField: { size: "small" } }} />
              </LocalizationProvider>
            ) : (
              <select className="input-modern text-sm w-44" value={searchDiagnosis} onChange={(e) => setSearchDiagnosis(e.target.value)}>
                <option value="">Select Diagnosis</option>
                {diagnosisOptions.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            )}

            <button onClick={() => setShowAdd(true)} className="btn-modern-primary flex items-center gap-2 text-sm">
              <FaPlus className="text-xs" /> Add Record
            </button>
          </div>
        </div>

        {/* Records */}
        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} height={80} className="rounded-2xl" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="card-modern text-center py-16">
            <FaStethoscope className="text-5xl text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No records found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((record) => (
              <div key={record.id} className="card-modern p-0 overflow-hidden">
                <div
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left cursor-pointer"
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
                    <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(record.id); }}
                      className="p-2 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition-colors">
                      <FaTrash className="text-xs" />
                    </button>
                    {expanded === record.id ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                  </div>
                </div>

                {expanded === record.id && (
                  <div className="border-t border-gray-100 p-5 grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fade-in">
                    {[
                      { icon: FaSyringe, label: "Treatment", value: record.treatment, color: "text-green-600", bg: "bg-green-50" },
                      { icon: FaPills, label: "Medication", value: record.medication || "N/A", color: "text-blue-600", bg: "bg-blue-50" },
                      { icon: FaUserMd, label: "Visit Type", value: record.visitType, color: "text-violet-600", bg: "bg-violet-50" },
                      { icon: FaTint, label: "Blood Pressure", value: record.bloodPressure || "N/A", color: "text-red-500", bg: "bg-red-50" },
                      { icon: FaHeartbeat, label: "Heart Rate", value: record.heartRate ? `${record.heartRate} bpm` : "N/A", color: "text-red-500", bg: "bg-red-50" },
                      { icon: FaTemperatureHigh, label: "Temperature", value: record.temperature ? `${record.temperature}°C` : "N/A", color: "text-orange-500", bg: "bg-orange-50" },
                      { icon: FaWeight, label: "Weight", value: record.weight ? `${record.weight} kg` : "N/A", color: "text-teal-600", bg: "bg-teal-50" },
                    ].map(({ icon: Icon, label, value, color, bg }) => (
                      <div key={label} className={`${bg} rounded-xl p-3 flex items-center gap-3`}>
                        <Icon className={`${color} text-lg`} />
                        <div>
                          <p className="text-xs text-gray-400">{label}</p>
                          <p className="text-sm font-semibold text-gray-700">{value}</p>
                        </div>
                      </div>
                    ))}
                    {record.notes && (
                      <div className="col-span-2 sm:col-span-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <p className="text-xs font-semibold text-amber-600 mb-1">Notes</p>
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

      {/* Add Record Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Add Medical Record</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6">
              <AddMedicalRecord
                patientId={patientId}
                onClose={() => setShowAdd(false)}
                onRecordAdded={() => { fetchRecords(); setShowAdd(false); }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-in">
            <h3 className="font-bold text-gray-800 mb-2">Delete Record</h3>
            <p className="text-gray-500 text-sm mb-5">Are you sure you want to delete this medical record?</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="btn-modern-primary flex-1 py-2.5 bg-red-600 hover:bg-red-700">Delete</button>
              <button onClick={() => setConfirmDelete(null)} className="btn-modern-outline flex-1 py-2.5">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-center" theme="colored" autoClose={3000} hideProgressBar />
    </div>
  );
}
