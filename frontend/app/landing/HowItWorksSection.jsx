"use client";

import { useEffect, useRef } from "react";
import { FaUserPlus, FaSearch, FaCalendarCheck, FaNotesMedical } from "react-icons/fa";

const steps = [
  {
    step: "01",
    icon: FaUserPlus,
    title: "Create Your Account",
    desc: "Sign up as a patient or doctor in under 2 minutes. Verify your details and set up your profile.",
    color: "from-blue-500 to-blue-700",
    light: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    step: "02",
    icon: FaSearch,
    title: "Find the Right Doctor",
    desc: "Browse verified specialists by specialty, availability, and ratings. Filter to find your perfect match.",
    color: "from-violet-500 to-violet-700",
    light: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    step: "03",
    icon: FaCalendarCheck,
    title: "Book an Appointment",
    desc: "Select your preferred date and time slot. Get instant confirmation and reminders via notifications.",
    color: "from-teal-500 to-teal-700",
    light: "bg-teal-50",
    border: "border-teal-100",
  },
  {
    step: "04",
    icon: FaNotesMedical,
    title: "Manage Your Health",
    desc: "Access your medical records, track vitals, download reports, and stay on top of your health journey.",
    color: "from-orange-500 to-orange-600",
    light: "bg-orange-50",
    border: "border-orange-100",
  },
];

export default function HowItWorksSection() {
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
    <section id="how-it-works" ref={sectionRef} className="py-28 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-block bg-violet-50 text-violet-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Simple process
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Get started in
            <span className="gradient-text"> 4 easy steps</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Meditrack is designed to be simple and intuitive. From signup to your first appointment in minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-violet-200 to-orange-200 z-0" />

          {steps.map(({ step, icon: Icon, title, desc, color, light, border }, i) => (
            <div key={step} className={`reveal relative z-10`} style={{ transitionDelay: `${i * 100}ms` }}>
              <div className={`${light} ${border} border rounded-3xl p-6 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                {/* Step number + icon */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center shadow-sm`}>
                    <Icon className="text-white text-2xl" />
                  </div>
                  <span className="text-4xl font-extrabold text-gray-100">{step}</span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
