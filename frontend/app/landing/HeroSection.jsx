"use client";

import Link from "next/link";
import { FaUserMd, FaUserInjured, FaArrowRight, FaHeartbeat, FaShieldAlt, FaClock } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const floatingBadges = [
  { icon: FaHeartbeat, label: "Real-time Monitoring", color: "bg-red-50 text-red-600 border-red-100", delay: "0s" },
  { icon: MdVerified, label: "Verified Doctors", color: "bg-blue-50 text-blue-600 border-blue-100", delay: "1.5s" },
  { icon: FaShieldAlt, label: "Secure & Private", color: "bg-green-50 text-green-600 border-green-100", delay: "3s" },
  { icon: FaClock, label: "24/7 Access", color: "bg-violet-50 text-violet-600 border-violet-100", delay: "2s" },
];

const stats = [
  { value: "10K+", label: "Patients Served" },
  { value: "500+", label: "Verified Doctors" },
  { value: "50K+", label: "Appointments" },
  { value: "99.9%", label: "Uptime" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 pt-16">
      {/* Background blobs */}
      <div className="hero-blob w-96 h-96 bg-blue-500 top-10 -left-20" />
      <div className="hero-blob w-80 h-80 bg-cyan-400 bottom-20 right-10" style={{ animationDelay: "3s" }} />
      <div className="hero-blob w-64 h-64 bg-violet-400 top-1/2 left-1/2" style={{ animationDelay: "1.5s" }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle, #1d4ed8 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full">
              <span className="pulse-dot w-2 h-2 bg-blue-500 rounded-full inline-block" />
              Trusted by 10,000+ patients worldwide
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Your Health,
                <br />
                <span className="gradient-text">Managed Smarter</span>
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
                Book appointments with verified doctors and manage your health records securely in one place.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/register?role=PATIENT"
                className="flex items-center gap-2.5 shimmer-btn text-white font-semibold px-7 py-4 rounded-2xl shadow-lg hover:shadow-blue-300 transition-all text-base">
                <FaUserInjured className="text-lg" />
                I&apos;m a Patient
                <FaArrowRight className="text-sm" />
              </Link>
              <Link href="/register?role=DOCTOR"
                className="flex items-center gap-2.5 bg-white text-gray-800 font-semibold px-7 py-4 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all text-base">
                <FaUserMd className="text-blue-600 text-lg" />
                I&apos;m a Doctor
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-4 pt-4">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-extrabold gradient-text">{value}</p>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — doctor image seamlessly integrated */}
          <div className="relative hidden lg:flex items-center justify-center h-[560px]">
            {/* Doctor image — no container, blends into hero bg */}
            <div className="relative z-10 w-[420px] h-[520px]">
              <img
                src="https://www.pngall.com/wp-content/uploads/2016/04/Doctor-PNG-Image.png"
                alt="Doctor"
                className="w-full h-full object-contain drop-shadow-2xl"
                style={{ filter: "drop-shadow(0 20px 40px rgba(59,130,246,0.25))" }}
              />
            </div>

            {/* Floating badges — z-30 to stay above image */}
            {floatingBadges.map(({ icon: Icon, label, color, delay }) => (
              <div key={label} className={`absolute z-30 float-badge flex items-center gap-2 ${color} border text-xs font-semibold px-3 py-2 rounded-full shadow-md`}
                style={{
                  animationDelay: delay,
                  top: label === "Real-time Monitoring" ? "6%" : label === "Verified Doctors" ? "72%" : label === "Secure & Private" ? "42%" : "18%",
                  right: label === "Real-time Monitoring" ? "-2%" : label === "Verified Doctors" ? "-2%" : undefined,
                  left: label === "Secure & Private" ? "-4%" : label === "24/7 Access" ? "-4%" : undefined,
                }}>
                <Icon className="text-sm" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L60 69.3C120 58.7 240 37.3 360 32C480 26.7 600 37.3 720 42.7C840 48 960 48 1080 42.7C1200 37.3 1320 26.7 1380 21.3L1440 16V80H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
