import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import RolesSection from "./RolesSection";
import StatsBanner from "./StatsBanner";
import TestimonialsSection from "./TestimonialsSection";
import CTASection from "./CTASection";
import Footer from "./Footer";

export const metadata = {
  title: "Meditrack — Modern Healthcare Management",
  description: "Connect with verified doctors, manage appointments, and access your medical records — all in one secure platform.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <RolesSection />
      <StatsBanner />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
