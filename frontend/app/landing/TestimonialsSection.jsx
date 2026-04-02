"use client";

import { useEffect, useRef } from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Patient",
    initials: "SM",
    color: "from-teal-500 to-teal-700",
    badge: "bg-teal-50 text-teal-700",
    stars: 5,
    quote: "Meditrack completely changed how I manage my health. Booking appointments used to take days — now it takes seconds. My doctor can see my full history instantly and I always know what's happening with my health.",
  },
  {
    name: "Dr. James Okonkwo",
    role: "Cardiologist",
    initials: "JO",
    color: "from-blue-500 to-blue-700",
    badge: "bg-blue-50 text-blue-700",
    stars: 5,
    quote: "As a cardiologist, having instant access to patient vitals, medical history, and appointment schedules in one dashboard is invaluable. The PDF export feature alone saves me hours every week.",
  },
  {
    name: "Emily Chen",
    role: "Patient",
    initials: "EC",
    color: "from-violet-500 to-violet-700",
    badge: "bg-violet-50 text-violet-700",
    stars: 5,
    quote: "I love how I can filter doctors by specialty and see their availability in real time. The notification system keeps me updated on every appointment change. It feels like having a personal health assistant.",
  },
  {
    name: "Dr. Amara Diallo",
    role: "General Practitioner",
    initials: "AD",
    color: "from-orange-500 to-orange-600",
    badge: "bg-orange-50 text-orange-700",
    stars: 5,
    quote: "The analytics dashboard gives me insights I never had before. I can see patterns in diagnoses, track visit types, and export reports for my clinic. Meditrack is the future of practice management.",
  },
  {
    name: "Marcus Thompson",
    role: "Patient",
    initials: "MT",
    color: "from-rose-500 to-rose-700",
    badge: "bg-rose-50 text-rose-700",
    stars: 5,
    quote: "Managing my chronic condition used to be stressful. Now I have all my records, medications, and appointments in one place. My doctor and I are always on the same page. Truly life-changing.",
  },
  {
    name: "Dr. Priya Sharma",
    role: "Pediatrician",
    initials: "PS",
    color: "from-cyan-500 to-cyan-700",
    badge: "bg-cyan-50 text-cyan-700",
    stars: 5,
    quote: "The role-based system is brilliant. My patients see exactly what they need, and I see exactly what I need. The security and privacy features give both me and my patients complete peace of mind.",
  },
];

export default function TestimonialsSection() {
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
    <section ref={sectionRef} className="py-28 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <span className="inline-block bg-orange-50 text-orange-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Real stories
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Loved by patients
            <span className="gradient-text"> and doctors</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our community has to say about Meditrack.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, initials, color, badge, stars, quote }, i) => (
            <div
              key={name}
              className="testimonial-card bg-white rounded-3xl p-6 shadow-sm border border-gray-100 reveal"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Quote icon */}
              <FaQuoteLeft className="text-gray-100 text-4xl mb-4" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(stars)].map((_, j) => (
                  <FaStar key={j} className="text-amber-400 text-sm" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">&ldquo;{quote}&rdquo;</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <div className={`w-11 h-11 bg-gradient-to-br ${color} text-white rounded-full flex items-center justify-center font-bold text-sm`}>
                  {initials}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{name}</p>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${badge}`}>{role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
