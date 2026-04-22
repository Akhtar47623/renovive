import { useState } from "react";
import { ArrowUpRight, Star } from "lucide-react";

const ContactSection = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    console.log(form);
  };

  return (
    <section className="bg-background pt-12 md:pt-16 pb-4 overflow-hidden">
      {/* ── Full-width dark rounded card with side margins only ── */}
      <div className="bg-foreground rounded-3xl  px-10 md:px-20 py-14 md:py-20 flex flex-col md:flex-row items-center gap-12 md:gap-0">
        {/* ── Left — heading + description + social proof ── */}
        <div className="flex-1 flex flex-col justify-between min-h-[380px] md:pr-20">
          <div>
            <h2 className="text-display-lg font-semibold tracking-[-0.02em] text-background mb-6 max-w-3xl">
              Still Not Sure Where to Start? Contact Us and Fill Out the Form
            </h2>
            <p className="text-text-md leading-[150%] tracking-[0em] font-normal text-background/50 max-w-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-2 mt-12 md:mt-auto">
            <Star size={15} className="fill-yellow-400 text-yellow-400" />
            <span className="text-background text-sm font-semibold">4.8</span>
            <span className="text-background/50 text-sm">(12K Reviews)</span>
          </div>
        </div>

        {/* ── Right — white form card ── */}
        <div className="w-full md:w-[620px] lg:w-[680px] bg-background rounded-2xl p-8 lg:p-10 flex flex-col gap-4 flex-shrink-0">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-foreground/50 font-medium">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Perry Wilson"
              className="w-full border border-foreground/15 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/30 transition"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-foreground/50 font-medium">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="perry.wilson@example.com"
              className="w-full border border-foreground/15 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/30 transition"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-foreground/50 font-medium">
              Mobile Number
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="(219) 555-0114"
              className="w-full border border-foreground/15 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/30 transition"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Message"
              rows={4}
              className="w-full border border-foreground/15 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/30 transition resize-none"
            />
          </div>

          {/* Send button */}
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 border border-foreground/20 rounded-full px-6 py-2.5 text-sm font-medium text-foreground hover:bg-foreground hover:text-background transition-colors duration-200"
            >
              Send
            </button>
            <span className="w-9 h-9 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors duration-200 cursor-pointer">
              <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
