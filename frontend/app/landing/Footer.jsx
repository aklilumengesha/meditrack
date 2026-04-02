import Link from "next/link";
import { FaHeartbeat, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <FaHeartbeat className="text-white text-lg" />
              </div>
              <span className="text-xl font-extrabold text-white">Meditrack</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Modern healthcare management for patients and doctors. Secure, fast, and built for the future of medicine.
            </p>
            <div className="flex gap-3 mt-5">
              {[FaTwitter, FaLinkedin, FaGithub].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <Icon className="text-slate-400 text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Product</p>
            <ul className="space-y-2.5">
              {[
                { label: "Features", href: "#features" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "For Doctors", href: "#for-doctors" },
                { label: "For Patients", href: "#for-patients" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-sm hover:text-white transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Account</p>
            <ul className="space-y-2.5">
              {[
                { label: "Sign In", href: "/login" },
                { label: "Create Account", href: "/register" },
                { label: "Doctor Portal", href: "/doctor/dashboard" },
                { label: "Patient Portal", href: "/patient/dashboard" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">© {new Date().getFullYear()} Meditrack. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
