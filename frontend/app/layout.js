import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: { default: "Meditrack", template: "%s | Meditrack" },
  description: "Modern healthcare management platform for patients and doctors. Book appointments, manage medical records, and connect with verified specialists.",
  keywords: ["healthcare", "appointments", "medical records", "doctors", "patients", "health management", "telemedicine"],
  authors: [{ name: "Aklilu Mengesha", url: "https://aklilu-mengesha-portfolio.vercel.app/" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Meditrack",
    description: "Book appointments, manage records, connect with doctors.",
    type: "website",
    locale: "en_US",
    siteName: "Meditrack",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meditrack",
    description: "Modern healthcare management for patients and doctors.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
