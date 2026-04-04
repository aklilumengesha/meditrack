"use client";

import { useEffect, useState } from "react";
import { getMyAppointments, updateAppointmentStatus } from "../../utils/doctorApi";
import { deleteAppointment, rescheduleAppointment } from "../../utils/api";
import dayjs from "dayjs";
import {
  FaCalendarAlt, FaClock, FaTrash, FaEdit, FaTimes,
  FaCheck, FaUserAlt, FaBell,
} from "react-icons/fa";
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
  const [filter, setFilter] = useState("pending");

  const fetchAppointments = async () => {
    try { setAppointments(await getMyAppointments()); }
    catch { toast.error("Failed to load appointments"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const now = new Date();

  const pendingAppts = appointments.filter((a) => a.status === "PENDING" && new Date(a.date) >= now);
  const upcomingAppts = appointments.filter((a) => a.status === "CONFIRMED" && new Date(a.date) >= now);
  const pastAppts = appointments.filter((a) => new Date(a.date) < now || a.status === "COMPLETED" || a.status === "CANCELLED");

  const tabs = [
    { key: "pending", label: "Pending Requests", count: pendingAppts.length, color: "bg-amber-600" },
    { key: "upcoming", label: "Confirmed", count: upcomingAppts.length, color: "bg-blue-600" },
    { key: "past", label: "Past / Done", count: pastAppts.length, color: "bg-gray-500" },
  ];

  const filtered = filter === "pending" ? pendingAppts : filter === "upcoming" ? upcomingAppts : pastAppts;

  const handleStatus = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      const labels = { CONFIRMED: "accepted", COMPLETED: "completed", CANCELLED: "cancelled" };
      toast.success(`Appointment ${labels[status] || "updated"}`);
      fetchAppointments();
    } catch { toast.error("Failed to update status"); }
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="text-gray-500 mt-1">{appointments.length} total · {pendingAppts.length} pending</p>
        </div>
        {pendingAppts.length > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold px-4 py-2 rounded-xl">
            <FaBell className="text-amber-500" />
            {pendingAppts.length} new request{pendingAppts.length !== 1 ? "s" : ""} waiting
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(({ key, label, count, color }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              filter === key ? `${color} text-white shadow-sm` : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
            }`}>
            {label}
            {count > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${filter === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} height={80} className="rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card-modern text-center py-16">
          <FaCalendarAlt className="text-5xl text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No {filter} appointments</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((appt) => {
            const sc = statusConfig[appt.status] || statusConfig.PENDING;
            const isPending = appt.status === "PENDING";
            const isConfirmed = appt.status === "CONFIRMED";

            return (
              <div key={appt.id} className={`card-modern p-5 ${isPending ? "border-l-4 border-amber-400" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${
                      isPending ? "bg-amber-100 text-amber-700" : isConfirmed ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {appt.patient?.firstName?.[0]}{appt.patient?.lastName?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{appt.patient?.firstName} {appt.patient?.lastName}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <FaClock className="inline" /> {dayjs(appt.date).format("MMM D, YYYY")} at {dayjs(appt.startTime).format("HH:mm")}
                      </p>
                      {appt.reason && <p className="text-xs text-gray-400 mt-0.5">{appt.reason}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${sc.cls}`}>{sc.label}</span>

                    {/* PENDING — show Accept + Decline */}
                    {isPending && (
                      <>
                        <button onClick={() => handleStatus(appt.id, "CONFIRMED")}
                          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors">
                          <FaCheck className="text-xs" /> Accept
                        </button>
                        <button onClick={() => handleStatus(appt.id, "CANCELLED")}
                          className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-500 text-xs font-bold rounded-xl hover:bg-red-50 transition-colors">
                          <FaTimes className="text-xs" /> Decline
                        </button>
                      </>
                    )}

                    {/* CONFIRMED — show Complete + Reschedule */}
                    {isConfirmed && (
                      <>
                        <button onClick={() => handleStatus(appt.id, "COMPLETED")}
                          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors">
                          <FaCheck className="text-xs" /> Complete
                        </button>
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
              </div>
            );
          })}
        </div>
      )}

      {/* Reschedule modal */}
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
