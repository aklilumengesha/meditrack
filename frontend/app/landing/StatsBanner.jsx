"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { end: 10000, suffix: "+", label: "Patients Served", prefix: "" },
  { end: 500, suffix: "+", label: "Verified Doctors", prefix: "" },
  { end: 50000, suffix: "+", label: "Appointments Booked", prefix: "" },
  { end: 99.9, suffix: "%", label: "Platform Uptime", prefix: "" },
];

function useCountUp(end, duration = 2000, started) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * end).toFixed(end % 1 !== 0 ? 1 : 0)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);
  return count;
}

function StatItem({ end, suffix, label, started }) {
  const count = useCountUp(end, 2000, started);
  return (
    <div className="text-center">
      <p className="text-5xl font-extrabold gradient-text-white mb-2">
        {end >= 1000 ? (count >= 1000 ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K` : count) : count}{suffix}
      </p>
      <p className="text-blue-200 font-medium text-sm">{label}</p>
    </div>
  );
}

export default function StatsBanner() {
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-3">Trusted worldwide</p>
          <h2 className="text-3xl font-extrabold text-white">Numbers that speak for themselves</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((s) => (
            <StatItem key={s.label} {...s} started={started} />
          ))}
        </div>
      </div>
    </section>
  );
}
