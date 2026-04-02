"use client";

import { useEffect, useRef } from "react";
import {
  FaCalendarCheck, FaNotesMedical, FaUserMd, FaChartBar,
  FaFilePdf, FaBell, FaLock, FaMobileAlt, FaSearch,
} from "react-icons/fa";

const features = [
  {
    icon: FaCalendarCheck,
    title: "Smart Appointment Booking",
    desc: "Book appointments with verified doctors in seconds. Choose your preferred time slot, specialty, and get instant confirmation.",
    color: "from-blue-500 to-blue-700",
    bg: "bg-blue-50",
    tag: "Patients & Doctors",
  },
  {
    icon: FaNotesMedical,
    title: "Digital Medical Records",
    desc: "All your health history in one secure place. Access diagnoses, treatments, medications, and vitals anytime, anywhere.",
    color: "from-teal-500 to-teal-700",
    bg: "bg-teal-50",
    tag: "Patients",
  },
  {
    icon: FaUserMd,
    title: "Doctor Dashboard",
    desc: "Doctors get a powerful portal to manage patients, view upcoming appointments, and track medical histories efficiently.",
    color: "from-violet-500 to-violet-700",
    bg: "bg-violet-50",
    tag: "Doctors",
  },
  {
    icon: FaChartBar,
    title: "Health Analytics",
    desc: "Visual charts and statistics on diagnoses, visit types, and health trends — helping doctors make data-driven decisions.",
    color: "from-orange-500 to-orange-600",
    bg: "bg-orange-50",
    tag: "Doctors",
  },
  {
    icon: FaFilePdf,
    title: "PDF Report Export",
    desc: "Generate and download professional medical reports as PDF with a single click. Share with specialists or keep for records.",
    color: "from-rose-500 to-rose-700",
    bg: "bg-rose-50",
    tag: "Patients & Doctors",
  },
  {
    icon: FaBell,
    title: "Real-time Notifications",
    desc: "Instant alerts for appointment bookings, cancellations, and rescheduling — keeping both doctors and patients informed.",
    color: "from-amber-500 to-amber-600",
    bg: "bg-amber-50",
    tag: "Patients & Doctors",
  },
  {
    icon: FaLock,
    title: "Secure & Private",
    desc: "Enterprise-grade security with JWT authentication, role-based access control, and encrypted data storage.",
    color: "from-green-500 to-green-700",
    bg: "bg-green-50",
    tag: "All Users",
  },
  {
    icon: FaSearch,
    title: "Doctor Search by Specialty",
    desc: "Find the right specialist instantly. Filter doctors by specialty — Cardiology, Neurology, Pediatrics, and more.",
    color: "from-cyan-500 to-cyan-700",
    bg: "bg-cyan-50",
    tag: "Patients",
  },
  {
    icon: FaMobileAlt,
    title: "Fully Responsive",
    desc: "Access Meditrack from any device — desktop, tablet, or mobile. A seamless experience wherever you are.",
    color: "from-indigo-500 to-indigo-700",
    bg: "bg-indigo-50",
    tag: "All Users",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    const els = sectionRef.current?.querySelectorAll(".reveal");
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Everything you need
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Powerful features for
            <span className="gradient-text"> modern healthcare</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            From booking to billing, Meditrack covers every aspect of the patient-doctor relationship with intuitive tools.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, color, bg, tag }, i) => (
            <div
              key={title}
              className="feature-card gradient-border p-6 cursor-default reveal"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-4 shadow-sm`}>
                <Icon className="text-white text-xl" />
              </div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-800 text-lg leading-tight">{title}</h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{desc}</p>
              <span className={`inline-block ${bg} text-xs font-semibold px-3 py-1 rounded-full text-gray-600`}>
                {tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
