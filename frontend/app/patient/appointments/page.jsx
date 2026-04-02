"use client";

import { useEffect, useState } from "react";
import { getPatientAppointments, bookAppointment, cancelAppointment } from "../../utils/patientApi";
import { getAllDoctors } from "../../utils/doctorApi";
import dayjs from "dayjs";
import { FaCalendarAlt, FaUserMd, FaClock, FaTrash, FaPlus } from "react-icons/fa";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBook, setShowBook] = useState(false);
  const [filter, setFilter] = useState("upcoming");
  const [form, setForm] = useState({ doctorId: "", reason: "", dateTime: dayjs() });

  const fetchAll = async () => {
    try {
      const [appts, docs] = await Promise.all([getPatientAppointments(), getAllDoctors()]);
      setAppointments(appts);
      setDoctors(docs);
    } catch { toast.error("Failed to load data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const now = new Date();
  const filtered = appointments.filter((a) =>
    filter === "upcoming" ? new Date(a.date) >= now : new Date(a.date) < now
  );

  const handleBook = async () => {
    if (!form.doctorId) return toast.error("Please select a doctor");
    try {
      await bookAppointment({
        doctorId: Number(form.doctorId),
        date: form.dateTime.toISOString(),
        startTime: form.dateTime.toISOString(),
        reason: form.reason,
      });
      toast.success("Appointment booked");
      setShowBook(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book appointment");
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id);
      toast.success("Appointment cancelled");
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800">My Appointments</h2>
        <button onClick={() => setShowBook(true)} className="btn btn-primary flex items-center gap-2">
          <FaPlus /> Book Appointment
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {["upcoming", "past"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              filter === f ? "bg-teal-600 text-white" : "bg-white text-gray-500 border hover:bg-gray-50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <Skeleton count={4} height={70} className="mb-3 rounded-xl" /> :
        filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FaCalendarAlt className="text-5xl mx-auto mb-3 opacity-30" />
            <p>No {filter} appointments.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((appt) => (
              <div key={appt.id} className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${filter === "upcoming" ? "bg-teal-100 text-teal-600" : "bg-gray-100 text-gray-400"}`}>
                    <FaUserMd />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      Dr. {appt.doctor?.firstName} {appt.doctor?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{appt.doctor?.specialty}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <FaClock className="inline" />
                      {dayjs(appt.date).format("MMM D, YYYY")} at {dayjs(appt.startTime).format("HH:mm")}
                    </p>
                    {appt.reason && <p className="text-xs text-gray-400">{appt.reason}</p>}
                  </div>
                </div>
                {filter === "upcoming" && (
                  <button onClick={() => handleCancel(appt.id)} className="btn btn-sm btn-outline btn-error">
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>
        )
      }

      {/* Book modal */}
      {showBook && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4">Book an Appointment</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Select Doctor</label>
                <select className="select select-bordered w-full"
                  value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}>
                  <option value="">-- Choose a doctor --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      Dr. {d.firstName} {d.lastName} — {d.specialty}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Date & Time</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    value={form.dateTime}
                    onChange={(v) => setForm({ ...form, dateTime: v })}
                    ampm={false}
                    shouldDisableDate={(d) => d.day() === 0}
                    shouldDisableTime={(t) => t.hour() < 8 || t.hour() >= 18}
                    className="w-full"
                  />
                </LocalizationProvider>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Reason (optional)</label>
                <input className="input input-bordered w-full" placeholder="Reason for visit"
                  value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleBook} className="btn btn-primary flex-1">Confirm</button>
              <button onClick={() => setShowBook(false)} className="btn btn-ghost flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-center" theme="colored" autoClose={3000} hideProgressBar />
    </div>
  );
}
