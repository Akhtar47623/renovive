import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ShieldCheck, Users, Wrench } from "lucide-react";

// Replace with your actual before/after images
import aboutImage from "@/assets/about.png";

const AboutSection = () => {
  const imgRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-background py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* ── Top row: label + text (mirrors your screenshot layout) ── */}
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-16 mb-20 rounded-sm p-8">
          <div>
            <span className="inline-block font-serif text-2xl font-bold text-foreground rounded-sm px-3 py-1">
              About Us
            </span>
          </div>

          <div className="space-y-5">
            <p className="text-foreground/90 text-base leading-relaxed">
              ReNoVIVE was built to fix what's broken about home renovation. We
              specialise in connecting homeowners with skilled, vetted
              contractors across the country — and giving both sides the
              transparency they deserve.
            </p>
            <p className="text-foreground/55 text-base leading-relaxed">
              We worked hard to ensure that our clients could trust every step
              of the process. By combining AI-powered cost estimation with a
              curated network of professionals, we've made renovation planning
              straightforward, honest, and stress-free. Our platform is built on
              the belief that great work starts with the right match — and the
              right information.
            </p>

            <div className="flex items-center gap-1 pt-2">
              <Link to="/about" className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-foreground/30 text-foreground/80 hover:text-foreground hover:border-foreground"
                >
                  Read More
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-foreground/30 text-foreground/80 hover:text-foreground hover:border-foreground"
                >
                  <ArrowUpRight size={14} />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Hero image with floating property card ── */}
        <div
          ref={imgRef}
          className="relative rounded-xl overflow-hidden mb-20 h-[420px] md:h-[520px]"
        >
          <img
            src={aboutImage}
            alt="Renovation project showcase"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback gradient if image missing
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />

          {/* Fallback background shown when no image */}
          <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 -z-10" />

          {/* Floating info card — bottom right, same style as your screenshot */}
          <div className="absolute bottom-6 right-6 bg-background rounded-xl p-4 shadow-xl max-w-[260px] w-full">
            <p className="font-semibold text-foreground text-sm leading-snug mb-1">
              Modern Kitchen Transformation
            </p>
            <p className="text-foreground/50 text-xs mb-2">
              14 Elmwood Ave, Austin, Texas
            </p>
            <div className="flex items-center gap-3 text-foreground/60 text-xs mb-3">
              <span>🛠 Full remodel</span>
              <span>⏱ 6 weeks</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground text-base">
                Est. $18,400
              </span>
              <div className="flex gap-1">
                <button className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-foreground/60 hover:bg-accent/10 transition-colors text-xs">
                  ‹
                </button>
                <button className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-foreground/60 hover:bg-accent/10 transition-colors text-xs">
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
