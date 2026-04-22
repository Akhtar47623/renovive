import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import heroBg from "@/assets/contact.png";
import { Link } from "react-router-dom";
const ContactPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! We'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Hero Section — full-bleed photo with overlay title */}
      <section className="relative h-[42vh] min-h-[950px] overflow-hidden">
        {/* Replace src with your actual hero image */}
        <img
          src={heroBg}
          alt="Modern architectural home surrounded by lush greenery"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark gradient overlay — heavier at bottom where text sits */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />

        {/* Title + breadcrumb pinned to bottom-left */}
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-8 pt-16">
          <h1 className="font-sans font-semibold text-[48px] leading-[126%] tracking-[-0.02em] text-white mb-3 text-center md:text-left md:text-display-lg">
            Contact Us
          </h1>
          <nav className="flex items-center gap-1.5 text-white/60 text-text-md leading-[150%] tracking-[0em] font-normal">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
            <span className="text-white/40">›</span>
            <span className="text-white/80">Contact Us</span>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 md:px-16 grid md:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* Left — Headline + Info */}
          <div>
            <h2 className="text-display-md font-semibold tracking-[-0.02em] text-gray-900 mb-3">
              Let's Start A Conversation.
            </h2>
            <p className="text-gray-500 text-text-md leading-[150%] tracking-[0em] font-normal mb-10 max-w-sm">
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout.
            </p>

            {/* Contact info cards */}
            <div className="space-y-5">
              {[
                {
                  icon: MapPin,
                  label: "Location",
                  value: "2118 Thornridge Cir. Syracuse, Connecticut 35624",
                },
                {
                  icon: Phone,
                  label: "Phone Number",
                  value: "(671) 555-0110",
                },
                {
                  icon: Mail,
                  label: "Email Address",
                  value: "ventr@demo.com",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  {/* Dark circular icon badge */}
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="text-white" size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-gray-800 text-text-md leading-[150%] tracking-[0em] font-normal">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Horizontal rule below info */}
            <div className="mt-8 border-t border-gray-100" />
          </div>

          {/* Right — Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Name
                </label>
                <Input
                  placeholder="Perry Wilson"
                  required
                  className="bg-white border-gray-200 rounded-md h-11 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="perry.wilson@example.com"
                  required
                  className="bg-white border-gray-200 rounded-md h-11 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Mobile Number
                </label>
                <Input
                  type="tel"
                  placeholder="(219) 555-0114"
                  className="bg-white border-gray-200 rounded-md h-11 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Message
                </label>
                <Textarea
                  placeholder=""
                  rows={5}
                  required
                  className="bg-white border-gray-200 rounded-md text-sm text-gray-900 resize-none focus-visible:ring-gray-300"
                />
              </div>

              {/* Submit button — pill with arrow icon, matches screenshot */}
              <div className="flex items-center gap-3 pt-1">
                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-full px-6 h-11 bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 text-sm font-medium shadow-sm"
                >
                  {loading ? "Sending..." : "Send Your Message"}
                </Button>
                <button
                  type="submit"
                  disabled={loading}
                  aria-label="Send"
                  className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <ArrowUpRight size={16} className="text-white" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;