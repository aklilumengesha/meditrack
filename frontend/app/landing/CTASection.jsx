"use client";

import Link from "next/link";
import { FaArrowRight, FaHeartbeat } from "react-icons/fa";

export default function CTASection() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 rounded-3xl p-12 lg:p-16 text-center overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "25px 25px" }} />
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <FaHeartbeat className="text-blue-300 text-2xl" />
              <span className="text-blue-200 font-semibold text-sm uppercase tracking-widest">Start today</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
              Ready to transform
              <br />
              <span className="gradient-text-white">your healthcare experience?</span>
            </h2>

            <p className="text-blue-200 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of patients and doctors already using Meditrack. Sign up free and experience the future of healthcare management.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/register"
                className="flex items-center gap-2.5 bg-white text-blue-700 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl text-base">
                Create Free Account <FaArrowRight className="text-sm" />
              </Link>
              <Link href="/login"
                className="flex items-center gap-2.5 bg-white/10 backdrop-blur text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all border border-white/20 text-base">
                Sign In
              </Link>
            </div>

            <p className="text-blue-300 text-sm mt-6">No credit card required · Free to get started</p>
          </div>
        </div>
      </div>
    </section>
  );
}
