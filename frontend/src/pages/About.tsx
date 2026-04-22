import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/contact.png";
import { Link } from "react-router-dom";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServiceSection";
import AgentsSection from "@/components/AgentsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import MissionSection from "@/components/MissionSection";
import aboutMissionImage from "@/assets/mission-1.png";

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[42vh] min-h-[950px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="About Renovive"
            className="w-full h-full object-fill"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-8 pt-16">
          <h1 className="font-sans font-semibold text-[48px] leading-[126%] tracking-[-0.02em] text-white mb-3 text-center md:text-left md:text-display-lg">
            About Us
          </h1>
          <nav className="flex items-center gap-1.5 text-white/60 text-text-md leading-[150%] tracking-[0em] font-normal">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-white/40">›</span>
            <span className="text-white/80">About Us</span>
          </nav>
        </div>
      </section>

      {/* Sections (re-using Home page blocks) */}
      <MissionSection />
      <AboutSection imageSrc={aboutMissionImage} showImage={false} />
      <ServicesSection />
      <AgentsSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />

      <Footer />
    </div>
  );
};

export default AboutPage;
