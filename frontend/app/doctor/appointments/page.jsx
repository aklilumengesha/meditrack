"use client";

import { useEffect, useState } from "react";
import { getMyAppointments } from "../../utils/doctorApi";
import { deleteAppointment, rescheduleAppointment } from "../../utils/api";
import dayjs from "dayjs";
import { FaCalendarAlt, FaClock, FaUserAlt, FaTrash, FaEdit } from "react-icons/fa";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [newDateTime, setNewDateTime] = useState(dayjs());
  const [filter, setFilter] = useState("upcoming");

  const fetchAppointments = async () => {
    try {
      const data = await getMyAppointments();
      setAppointments(data);
    } catch (err) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const now = new Date();
  const filtered = appointments.filter((a) =>
    filter === "upcoming" ? new Date(a.date) >= now : new Date(a.date) < now
  );

  const handleDelete = async (id) => {
    try {
      await deleteAppointment(id);
      toast.success("Appointment deleted");
      fetchAppointments();
      setSelected(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleReschedule = async () => {
    try {
      await rescheduleAppointment(selected.id, newDateTime.toISOString(), newDateTime.toISOString());
      toast.success("Appointment rescheduled");
      fetchAppointments();
      setSelected(null);
    } catch {
      toast.error("Failed to reschedule");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Appointments</h2>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {["upcoming", "past"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              filter === f ? "bg-blue-600 text-white" : "bg-white text-gray-500 border hover:bg-gray-50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <Skeleton count={5} height={70} className="mb-3 rounded-xl" />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FaCalendarAlt className="text-5xl mx-auto mb-3 opacity-30" />
          <p>No {filter} appointments.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((appt) => (
            <div key={appt.id} className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${filter === "upcoming" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
                  <FaCalendarAlt />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {appt.patient?.firstName} {appt.patient?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                    <FaClock className="inline" /> {dayjs(appt.date).format("MMM D, YYYY")} at {dayjs(appt.startTime).format("HH:mm")}
                  </p>
                  {appt.reason && <p className="text-xs text-gray-400 mt-0.5">{appt.reason}</p>}
                </div>
              </div>
              {filter === "upcoming" && (
                <div className="flex gap-2">
                  <button onClick={() => setSelected(appt)} className="btn btn-sm btn-outline btn-info">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(appt.id)} className="btn btn-sm btn-outline btn-error">
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reschedule modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4">Reschedule Appointment</h3>
            <p className="text-sm text-gray-500 mb-4">
              Patient: <strong>{selected.patient?.firstName} {selected.patient?.lastName}</strong>
            </p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="New date and time"
                value={newDateTime}
                onChange={setNewDateTime}
                ampm={false}
                shouldDisableDate={(d) => d.day() === 0}
                shouldDisableTime={(t) => t.hour() < 8 || t.hour() >= 18}
                className="w-full"
              />
            </LocalizationProvider>
            <div className="flex gap-3 mt-5">
              <button onClick={handleReschedule} className="btn btn-primary flex-1">Confirm</button>
              <button onClick={() => setSelected(null)} className="btn btn-ghost flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-center" theme="colored" autoClose={3000} hideProgressBar />
    </div>
  );
}
