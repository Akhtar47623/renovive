import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ShieldCheck, Users, Wrench } from "lucide-react";

// Replace with your actual before/after images
import defaultAboutImage from "@/assets/about.png";

type AboutSectionProps = {
  imageSrc?: string;
  showImage?: boolean;
};

const AboutSection = ({ imageSrc, showImage = true }: AboutSectionProps) => {
  const imgRef = useRef<HTMLDivElement>(null);
  const [imgOk, setImgOk] = useState(true);
  const aboutImage = imageSrc ?? defaultAboutImage;

  return (
    <section className="bg-background py-12 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* ── Top row: label + text (mirrors your screenshot layout) ── */}
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 md:gap-16 mb-10 md:mb-12">
          <div>
            <span className="inline-block whitespace-nowrap text-display-lg tracking-[-0.02em] font-semibold text-foreground rounded-sm py-1">
              About Us
            </span>
          </div>

          <div className="space-y-5">
            <p className="text-foreground/90 text-display-sm leading-[150%] tracking-[0.01em] font-normal">
            Our company specialise in transacting all type of properties in united state and making sure our clients enjoy a smooth and straightforward process that is tailored to their needs. We worked hard to ensure that our clients
            </p>
            <p className="text-foreground/55 text-display-sm leading-[150%] tracking-[0.01em] font-normal">could trust the service we offer by hiring the best people for the job and you can too. We are committed to providing a unique and unforgettable property experience with our expert team, extensive network and personalized service.
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

        {showImage ? (
          <div
            ref={imgRef}
            className="relative rounded-xl overflow-hidden mb-10 md:mb-12 h-[420px] md:h-[520px]"
          >
            {/* Fallback background shown when image fails */}
            <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900" />

            {imgOk ? (
              <img
                src={aboutImage}
                alt="Renovation project showcase"
                className="relative z-10 w-full h-full object-cover"
                loading="lazy"
                onError={() => setImgOk(false)}
              />
            ) : null}

            {/* Floating info card — bottom right, same style as your screenshot */}
            <div className="absolute z-20 bottom-6 right-6 bg-background rounded-xl p-4 shadow-xl max-w-[260px] w-full">
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
        ) : null}
      </div>
    </section>
  );
};

export default AboutSection;
