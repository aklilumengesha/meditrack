"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { FaUserMd, FaUserInjured, FaCheck, FaArrowRight } from "react-icons/fa";

const doctorFeatures = [
  "Personalized doctor dashboard",
  "View and manage all patient appointments",
  "Access complete patient medical histories",
  "Add and update medical records with vitals",
  "Generate and download PDF reports",
  "Real-time notifications for new bookings",
  "Analytics on diagnoses and visit types",
  "Reschedule or cancel appointments easily",
];

const patientFeatures = [
  "Book appointments with verified specialists",
  "Filter doctors by specialty",
  "View upcoming and past appointments",
  "Access your full medical history",
  "Track vitals: BP, heart rate, temperature",
  "Download medical records as PDF",
  "Receive instant booking confirmations",
  "Manage your personal health profile",
];

export default function RolesSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll(".reveal")?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <span className="inline-block bg-teal-50 text-teal-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Built for everyone
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            One platform,
            <span className="gradient-text"> two experiences</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Whether you&apos;re a doctor managing your practice or a patient taking control of your health — Meditrack has you covered.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Doctor card */}
          <div id="for-doctors" className="reveal" style={{ transitionDelay: "0ms" }}>
            <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-3xl p-8 h-full overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center">
                    <FaUserMd className="text-white text-2xl" />
                  </div>
                  <div>
                    <p className="text-white font-extrabold text-xl">For Doctors</p>
                    <p className="text-blue-200 text-sm">Manage your practice smarter</p>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {doctorFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-blue-100 text-sm">
                      <div className="w-5 h-5 bg-blue-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaCheck className="text-blue-300 text-xs" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href="/register?role=DOCTOR"
                  className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-6 py-3.5 rounded-2xl hover:bg-blue-50 transition-colors text-sm">
                  Join as a Doctor <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </div>
          </div>

          {/* Patient card */}
          <div id="for-patients" className="reveal" style={{ transitionDelay: "100ms" }}>
            <div className="relative bg-gradient-to-br from-teal-800 via-teal-700 to-cyan-700 rounded-3xl p-8 h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center">
                    <FaUserInjured className="text-white text-2xl" />
                  </div>
                  <div>
                    <p className="text-white font-extrabold text-xl">For Patients</p>
                    <p className="text-teal-200 text-sm">Take control of your health</p>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {patientFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-teal-100 text-sm">
                      <div className="w-5 h-5 bg-teal-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaCheck className="text-teal-300 text-xs" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href="/register?role=PATIENT"
                  className="inline-flex items-center gap-2 bg-white text-teal-700 font-bold px-6 py-3.5 rounded-2xl hover:bg-teal-50 transition-colors text-sm">
                  Join as a Patient <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
