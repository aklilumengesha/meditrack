"use client";

import { useEffect, useState } from "react";
import { getPatientAppointments, bookAppointment, cancelAppointment, rateDoctor } from "../../utils/patientApi";
import { getAllDoctors } from "../../utils/doctorApi";
import dayjs from "dayjs";
import { FaCalendarAlt, FaUserMd, FaClock, FaTrash, FaPlus, FaTimes, FaStar } from "react-icons/fa";
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

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBook, setShowBook] = useState(false);
  const [filter, setFilter] = useState("upcoming");
  const [specialty, setSpecialty] = useState("");
  const [form, setForm] = useState({ doctorId: "", reason: "", dateTime: dayjs() });
  const [ratingModal, setRatingModal] = useState(null);
  const [ratingForm, setRatingForm] = useState({ rating: 5, comment: "" });
  const [hoveredStar, setHoveredStar] = useState(0);

  const fetchAll = async () => {
    try {
      const [appts, docs] = await Promise.all([getPatientAppointments(), getAllDoctors(specialty)]);
      setAppointments(appts); setDoctors(docs);
    } catch { toast.error("Failed to load data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, [specialty]);

  const now = new Date();
  const filtered = appointments.filter((a) =>
    filter === "upcoming" ? new Date(a.date) >= now : new Date(a.date) < now
  );

  const handleBook = async () => {
    if (!form.doctorId) return toast.error("Please select a doctor");
    try {
      await bookAppointment({ doctorId: Number(form.doctorId), date: form.dateTime.toISOString(), startTime: form.dateTime.toISOString(), reason: form.reason });
      toast.success("Appointment booked successfully"); setShowBook(false); fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || "Failed to book appointment"); }
  };

  const handleCancel = async (id) => {
    try { await cancelAppointment(id); toast.success("Appointment cancelled"); fetchAll(); }
    catch (err) { toast.error(err.response?.data?.message || "Failed to cancel"); }
  };

  const handleRate = async () => {
    try {
      await rateDoctor(ratingModal.id, ratingForm.rating, ratingForm.comment);
      toast.success("Thank you for your rating!"); setRatingModal(null); fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || "Failed to submit rating"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">My Appointments</h1>
          <p className="text-gray-500 mt-1">{appointments.length} total appointment{appointments.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowBook(true)} className="btn-modern-primary flex items-center gap-2">
          <FaPlus className="text-xs" /> Book Appointment
        </button>
      </div>

      <div className="flex gap-2">
        {["upcoming", "past"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              filter === f ? "bg-teal-600 text-white shadow-sm" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
            }`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} height={72} className="rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card-modern text-center py-16">
          <FaCalendarAlt className="text-5xl text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No {filter} appointments</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((appt) => {
            const sc = statusConfig[appt.status] || statusConfig.PENDING;
            const canRate = appt.status === "COMPLETED" && !appt.rating;
            return (
              <div key={appt.id} className="card-modern flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${filter === "upcoming" ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-500"}`}>
                    {appt.doctor?.firstName?.[0]}{appt.doctor?.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Dr. {appt.doctor?.firstName} {appt.doctor?.lastName}</p>
                    <p className="text-xs text-gray-400">{appt.doctor?.specialty}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <FaClock className="inline" /> {dayjs(appt.date).format("MMM D, YYYY")} at {dayjs(appt.startTime).format("HH:mm")}
                    </p>
                    {appt.reason && <p className="text-xs text-gray-300 mt-0.5">{appt.reason}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${sc.cls}`}>{sc.label}</span>
                  {canRate && (
                    <button onClick={() => setRatingModal(appt)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-600 text-xs font-semibold rounded-xl hover:bg-amber-100 transition-colors">
                      <FaStar className="text-xs" /> Rate
                    </button>
                  )}
                  {appt.rating && (
                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                      <FaStar /> <span className="text-gray-500">{appt.rating.rating}/5</span>
                    </div>
                  )}
                  {filter === "upcoming" && appt.status !== "CANCELLED" && appt.status !== "COMPLETED" && (
                    <button onClick={() => handleCancel(appt.id)}
                      className="p-2.5 rounded-xl border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                      <FaTrash className="text-sm" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Book modal */}
      {showBook && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">Book an Appointment</h3>
              <button onClick={() => setShowBook(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Filter by Specialty</label>
                <input className="input-modern" placeholder="e.g. Cardiology" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Doctor</label>
                <select className="input-modern" value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}>
                  <option value="">-- Choose a doctor --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      Dr. {d.firstName} {d.lastName} — {d.specialty}{d.averageRating > 0 ? ` ⭐ ${d.averageRating}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date & Time</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker value={form.dateTime} onChange={(v) => setForm({ ...form, dateTime: v })}
                    ampm={false} shouldDisableDate={(d) => d.day() === 0}
                    shouldDisableTime={(t) => t.hour() < 8 || t.hour() >= 18} className="w-full" />
                </LocalizationProvider>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reason (optional)</label>
                <input className="input-modern" placeholder="Reason for visit" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleBook} className="btn-modern-primary flex-1 py-3">Confirm Booking</button>
              <button onClick={() => setShowBook(false)} className="btn-modern-outline flex-1 py-3">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Rating modal */}
      {ratingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">Rate Your Appointment</h3>
              <button onClick={() => setRatingModal(null)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-xl mb-5">
              <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {ratingModal.doctor?.firstName?.[0]}{ratingModal.doctor?.lastName?.[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-800">Dr. {ratingModal.doctor?.firstName} {ratingModal.doctor?.lastName}</p>
                <p className="text-xs text-gray-500">{ratingModal.doctor?.specialty}</p>
              </div>
            </div>
            <div className="text-center mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-3">How was your experience?</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRatingForm({ ...ratingForm, rating: star })}
                    className="text-3xl transition-transform hover:scale-110">
                    <FaStar className={star <= (hoveredStar || ratingForm.rating) ? "text-amber-400" : "text-gray-200"} />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][ratingForm.rating]}
              </p>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Comment (optional)</label>
              <textarea className="input-modern resize-none" rows={3} placeholder="Share your experience..."
                value={ratingForm.comment} onChange={(e) => setRatingForm({ ...ratingForm, comment: e.target.value })} />
            </div>
            <div className="flex gap-3">
              <button onClick={handleRate} className="btn-modern-primary flex-1 py-3">Submit Rating</button>
              <button onClick={() => setRatingModal(null)} className="btn-modern-outline flex-1 py-3">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-center" theme="colored" autoClose={3000} hideProgressBar />
    </div>
  );
}
