"use client";

import { useEffect, useState } from "react";
import { getMyAppointments, updateAppointmentStatus } from "../../utils/doctorApi";
import { deleteAppointment, rescheduleAppointment } from "../../utils/api";
import dayjs from "dayjs";
import { FaCalendarAlt, FaClock, FaTrash, FaEdit, FaTimes, FaCheck } from "react-icons/fa";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";

const statusConfig = {
  PENDING:   { label: "Pending",   cls: "bg-amber-100 text-amber-700" },
  CONFIRMED: { label: "Confirmed", cls: "bg-blue-100 text-blue-700" },
  COMPLETED: { label: "Completed", cls: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelled", cls: "bg-red-100 text-red-600" },
};

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [newDateTime, setNewDateTime] = useState(dayjs());
  const [filter, setFilter] = useState("upcoming");

  const fetchAppointments = async () => {
    try { setAppointments(await getMyAppointments()); }
    catch { toast.error("Failed to load appointments"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const now = new Date();
  const filtered = appointments.filter((a) =>
    filter === "upcoming" ? new Date(a.date) >= now : new Date(a.date) < now
  );

  const handleDelete = async (id) => {
    try { await deleteAppointment(id); toast.success("Appointment deleted"); fetchAppointments(); setSelected(null); }
    catch { toast.error("Failed to delete"); }
  };

  const handleReschedule = async () => {
    try {
      await rescheduleAppointment(selected.id, newDateTime.toISOString(), newDateTime.toISOString());
      toast.success("Appointment rescheduled"); fetchAppointments(); setSelected(null);
    } catch { toast.error("Failed to reschedule"); }
  };

  const handleStatus = async (id, status) => {
    try { await updateAppointmentStatus(id, status); toast.success(`Marked as ${status.toLowerCase()}`); fetchAppointments(); }
    catch { toast.error("Failed to update status"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="text-gray-500 mt-1">{appointments.length} total appointment{appointments.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {["upcoming", "past"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              filter === f ? "bg-blue-600 text-white shadow-sm" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
            }`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} height={72} className="rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card-modern text-center py-16">
          <FaCalendarAlt className="text-5xl text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No {filter} appointments</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((appt) => {
            const sc = statusConfig[appt.status] || statusConfig.PENDING;
            return (
              <div key={appt.id} className="card-modern flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${filter === "upcoming" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                    {appt.patient?.firstName?.[0]}{appt.patient?.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{appt.patient?.firstName} {appt.patient?.lastName}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <FaClock className="inline" /> {dayjs(appt.date).format("MMM D, YYYY")} at {dayjs(appt.startTime).format("HH:mm")}
                    </p>
                    {appt.reason && <p className="text-xs text-gray-300 mt-0.5">{appt.reason}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${sc.cls}`}>{sc.label}</span>
                  {filter === "upcoming" && appt.status === "PENDING" && (
                    <button onClick={() => handleStatus(appt.id, "CONFIRMED")}
                      className="p-2 rounded-xl border border-blue-100 text-blue-500 hover:bg-blue-50 transition-colors" title="Confirm">
                      <FaCheck className="text-sm" />
                    </button>
                  )}
                  {filter === "upcoming" && appt.status === "CONFIRMED" && (
                    <button onClick={() => handleStatus(appt.id, "COMPLETED")}
                      className="p-2 rounded-xl border border-green-100 text-green-500 hover:bg-green-50 transition-colors" title="Mark Complete">
                      <FaCheck className="text-sm" />
                    </button>
                  )}
                  {filter === "upcoming" && appt.status !== "CANCELLED" && appt.status !== "COMPLETED" && (
                    <>
                      <button onClick={() => setSelected(appt)}
                        className="p-2 rounded-xl border border-blue-100 text-blue-400 hover:bg-blue-50 transition-colors">
                        <FaEdit className="text-sm" />
                      </button>
                      <button onClick={() => handleStatus(appt.id, "CANCELLED")}
                        className="p-2 rounded-xl border border-red-100 text-red-400 hover:bg-red-50 transition-colors">
                        <FaTimes className="text-sm" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">Reschedule Appointment</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl mb-5">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {selected.patient?.firstName?.[0]}{selected.patient?.lastName?.[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{selected.patient?.firstName} {selected.patient?.lastName}</p>
                <p className="text-xs text-gray-500">{selected.reason || "No reason specified"}</p>
              </div>
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker label="New date and time" value={newDateTime} onChange={setNewDateTime}
                ampm={false} shouldDisableDate={(d) => d.day() === 0}
                shouldDisableTime={(t) => t.hour() < 8 || t.hour() >= 18} className="w-full" />
            </LocalizationProvider>
            <div className="flex gap-3 mt-5">
              <button onClick={handleReschedule} className="btn-modern-primary flex-1 py-3 flex items-center justify-center gap-2">
                <FaCheck className="text-xs" /> Confirm
              </button>
              <button onClick={() => setSelected(null)} className="btn-modern-outline flex-1 py-3">Cancel</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-center" theme="colored" autoClose={3000} hideProgressBar />
    </div>
  );
}
