"use client";

import { useEffect, useState } from "react";
import { getPatientAppointments, bookAppointment, cancelAppointment, rateDoctor } from "../../utils/patientApi";
import { getAllDoctors } from "../../utils/doctorApi";
import axios from "axios";
import dayjs from "dayjs";
import {
  FaCalendarAlt, FaClock, FaTrash, FaPlus, FaTimes,
  FaStar, FaUserMd, FaStethoscope, FaEdit, FaCheck,
  FaMapMarkerAlt, FaInfoCircle,
} from "react-icons/fa";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";

const BASE_URL = "http://localhost:3000";
const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

const statusConfig = {
  PENDING:   { label: "Pending",   cls: "bg-amber-100 text-amber-700", dot: "bg-amber-400" },
  CONFIRMED: { label: "Confirmed", cls: "bg-blue-100 text-blue-700",   dot: "bg-blue-500" },
  COMPLETED: { label: "Completed", cls: "bg-green-100 text-green-700", dot: "bg-green-500" },
  CANCELLED: { label: "Cancelled", cls: "bg-red-100 text-red-600",     dot: "bg-red-400" },
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

  // Detail modal state
  const [detailAppt, setDetailAppt] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editReason, setEditReason] = useState("");
  const [saving, setSaving] = useState(false);

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

  const openDetail = (appt) => {
    setDetailAppt(appt);
    setEditReason(appt.reason || "");
    setEditing(false);
  };

  const handleSaveReason = async () => {
    setSaving(true);
    try {
      await axios.put(`${BASE_URL}/appointments/${detailAppt.id}`, { reason: editReason }, authHeaders());
      toast.success("Appointment updated");
      setEditing(false);
      // Update local state
      setDetailAppt({ ...detailAppt, reason: editReason });
      setAppointments((prev) => prev.map((a) => a.id === detailAppt.id ? { ...a, reason: editReason } : a));
    } catch { toast.error("Failed to update"); }
    finally { setSaving(false); }
  };

  const handleBook = async () => {
    if (!form.doctorId) return toast.error("Please select a doctor");
    try {
      await bookAppointment({ doctorId: Number(form.doctorId), date: form.dateTime.toISOString(), startTime: form.dateTime.toISOString(), reason: form.reason });
      toast.success("Appointment booked successfully"); setShowBook(false); fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || "Failed to book appointment"); }
  };

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id);
      toast.success("Appointment cancelled");
      setDetailAppt(null);
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || "Failed to cancel"); }
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
              <div key={appt.id}
                onClick={() => openDetail(appt)}
                className="card-modern flex items-center justify-between p-5 cursor-pointer hover:shadow-md hover:border-teal-100 border border-transparent transition-all">
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
                    {appt.reason && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{appt.reason}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 ${sc.cls}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {sc.label}
                  </span>
                  {canRate && (
                    <button onClick={(e) => { e.stopPropagation(); setRatingModal(appt); }}
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
                    <button onClick={(e) => { e.stopPropagation(); handleCancel(appt.id); }}
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

      {/* ── Appointment Detail Modal ── */}
      {detailAppt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in overflow-hidden">
            {/* Header */}
            <div className={`p-5 flex items-center justify-between ${
              detailAppt.status === "CONFIRMED" ? "bg-blue-600" :
              detailAppt.status === "COMPLETED" ? "bg-green-600" :
              detailAppt.status === "CANCELLED" ? "bg-red-500" : "bg-amber-500"
            }`}>
              <div>
                <p className="text-white font-bold text-lg">Appointment Details</p>
                <p className="text-white/80 text-sm">{statusConfig[detailAppt.status]?.label}</p>
              </div>
              <button onClick={() => setDetailAppt(null)} className="text-white/80 hover:text-white transition-colors">
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Doctor info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-800 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                  {detailAppt.doctor?.firstName?.[0]}{detailAppt.doctor?.lastName?.[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-900">Dr. {detailAppt.doctor?.firstName} {detailAppt.doctor?.lastName}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <FaStethoscope className="text-blue-400 text-xs" /> {detailAppt.doctor?.specialty}
                  </p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-teal-50 rounded-xl">
                  <p className="text-xs text-teal-600 font-semibold mb-1">Date</p>
                  <p className="font-bold text-gray-800">{dayjs(detailAppt.date).format("MMMM D, YYYY")}</p>
                  <p className="text-xs text-gray-400">{dayjs(detailAppt.date).format("dddd")}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-xs text-blue-600 font-semibold mb-1">Time</p>
                  <p className="font-bold text-gray-800">{dayjs(detailAppt.startTime).format("HH:mm")}</p>
                  <p className="text-xs text-gray-400">Duration: ~30 min</p>
                </div>
              </div>

              {/* Reason — editable for pending */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                    <FaInfoCircle className="text-gray-400" /> Reason for Visit
                  </p>
                  {detailAppt.status === "PENDING" && !editing && (
                    <button onClick={() => setEditing(true)}
                      className="text-xs text-teal-600 font-semibold flex items-center gap-1 hover:underline">
                      <FaEdit className="text-xs" /> Edit
                    </button>
                  )}
                </div>
                {editing ? (
                  <div className="space-y-2">
                    <textarea
                      className="input-modern resize-none text-sm"
                      rows={3}
                      value={editReason}
                      onChange={(e) => setEditReason(e.target.value)}
                      placeholder="Describe your reason for visit..."
                    />
                    <div className="flex gap-2">
                      <button onClick={handleSaveReason} disabled={saving}
                        className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl hover:bg-teal-700 transition-colors">
                        <FaCheck className="text-xs" /> {saving ? "Saving..." : "Save"}
                      </button>
                      <button onClick={() => { setEditing(false); setEditReason(detailAppt.reason || ""); }}
                        className="px-4 py-2 border border-gray-200 text-gray-500 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700">{detailAppt.reason || <span className="text-gray-400 italic">No reason specified</span>}</p>
                )}
              </div>

              {/* Rating if completed */}
              {detailAppt.status === "COMPLETED" && detailAppt.rating && (
                <div className="p-4 bg-amber-50 rounded-xl">
                  <p className="text-xs font-semibold text-amber-600 mb-2">Your Rating</p>
                  <div className="flex items-center gap-2">
                    {[1,2,3,4,5].map((s) => (
                      <FaStar key={s} className={s <= detailAppt.rating.rating ? "text-amber-400" : "text-gray-200"} />
                    ))}
                    <span className="text-sm font-semibold text-gray-700 ml-1">{detailAppt.rating.rating}/5</span>
                  </div>
                  {detailAppt.rating.comment && <p className="text-xs text-gray-500 mt-1">{detailAppt.rating.comment}</p>}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                {detailAppt.status === "COMPLETED" && !detailAppt.rating && (
                  <button onClick={() => { setDetailAppt(null); setRatingModal(detailAppt); }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors text-sm">
                    <FaStar className="text-xs" /> Rate This Appointment
                  </button>
                )}
                {(detailAppt.status === "PENDING" || detailAppt.status === "CONFIRMED") && (
                  <button onClick={() => handleCancel(detailAppt.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-red-200 text-red-500 font-semibold rounded-xl hover:bg-red-50 transition-colors text-sm">
                    <FaTrash className="text-xs" /> Cancel Appointment
                  </button>
                )}
                <button onClick={() => setDetailAppt(null)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
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
