"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDoctorById, getDoctorRatings } from "../../../utils/doctorApi";
import { FaUserMd, FaStethoscope, FaPhone, FaEnvelope, FaStar, FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import dayjs from "dayjs";

export default function DoctorProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [ratingsData, setRatingsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDoctorById(id), getDoctorRatings(id)])
      .then(([d, r]) => { setDoctor(d); setRatingsData(r); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <FaStar key={s} className={s <= Math.round(rating) ? "text-amber-400" : "text-gray-200"} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <FaArrowLeft className="text-xs" /> Back
      </button>

      {loading ? <Skeleton count={8} height={48} className="mb-3" /> : (
        <>
          {/* Doctor card */}
          <div className="card-modern">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-800 text-white rounded-2xl flex items-center justify-center text-3xl font-extrabold shadow-sm flex-shrink-0">
                {doctor?.firstName?.[0]}{doctor?.lastName?.[0]}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-extrabold text-gray-900">Dr. {doctor?.firstName} {doctor?.lastName}</h1>
                <p className="text-gray-500 flex items-center gap-1.5 mt-1">
                  <FaStethoscope className="text-blue-400" /> {doctor?.specialty}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {renderStars(doctor?.averageRating || 0)}
                  <span className="text-sm font-semibold text-gray-700">{doctor?.averageRating || 0}</span>
                  <span className="text-sm text-gray-400">({doctor?.totalRatings || 0} reviews)</span>
                </div>
              </div>
              <button
                onClick={() => router.push("/patient/appointments")}
                className="btn-modern-primary flex items-center gap-2 text-sm">
                <FaCalendarAlt className="text-xs" /> Book Appointment
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              {[
                { icon: FaEnvelope, label: "Email", value: doctor?.user?.email, color: "text-violet-500" },
                { icon: FaPhone, label: "Phone", value: doctor?.phone || "Not provided", color: "text-green-500" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Icon className={`${color} text-lg`} />
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-semibold text-gray-700">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ratings */}
          <div className="card-modern">
            <h2 className="section-title">Patient Reviews</h2>
            {!ratingsData?.ratings?.length ? (
              <div className="text-center py-8 text-gray-400">
                <FaStar className="text-4xl mx-auto mb-2 opacity-20" />
                <p className="text-sm">No reviews yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ratingsData.ratings.map((r) => (
                  <div key={r.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs font-bold">
                          {r.patient?.firstName?.[0]}{r.patient?.lastName?.[0]}
                        </div>
                        <p className="text-sm font-semibold text-gray-800">{r.patient?.firstName} {r.patient?.lastName}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(r.rating)}
                        <span className="text-xs text-gray-400 ml-1">{dayjs(r.createdAt).format("MMM D, YYYY")}</span>
                      </div>
                    </div>
                    {r.comment && <p className="text-sm text-gray-600 mt-1">{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
