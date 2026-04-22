import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import client1 from "@/assets/client1.png"; // replace with your actual images
import client2 from "@/assets/client2.png";
import client3 from "@/assets/client3.png";
import client4 from "@/assets/client4.png";

const testimonials = [
  {
    id: "01",
    name: "Albert Flores",
    role: "Founder",
    image: client1,
    paragraphs: [
      "This Villa is My Dream and the Dreams Come True. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
    ],
  },
  {
    id: "02",
    name: "Savannah Nguyen",
    role: "Interior Designer",
    image: client2,
    paragraphs: [
      "Working with this team was an absolute pleasure from start to finish. They understood exactly what we were looking for and delivered beyond our expectations in every possible way.",
      "The property exceeded every benchmark we set. I would wholeheartedly recommend their services to anyone searching for their perfect home or investment property.",
    ],
  },
  {
    id: "03",
    name: "Robert Fox",
    role: "Property Investor",
    image: client3,
    paragraphs: [
      "I have invested in properties across multiple continents, and this has been by far the smoothest and most professional experience I have ever encountered in real estate.",
      "The attention to detail, the quality of construction, and the prime location make this an investment I am proud to have in my portfolio. Truly world-class.",
    ],
  },
  {
    id: "04",
    name: "Eleanor Pena",
    role: "Architect",
    image: client4,
    paragraphs: [
      "As an architect I notice things that most buyers overlook — the proportions, the material quality, the way light moves through a space. This property passed every single test.",
      "Rarely do I encounter residential projects that balance aesthetics with functionality this well. The design sensibility here is refined and deeply considered.",
    ],
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const goTo = useCallback(
    (index: number, dir: "left" | "right") => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 300);
    },
    [animating],
  );

  const prev = () =>
    goTo((current - 1 + testimonials.length) % testimonials.length, "left");
  const next = () => goTo((current + 1) % testimonials.length, "right");

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % testimonials.length, "right");
    }, 6000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  const t = testimonials[current];

  return (
    <section className="bg-background py-12 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* ── Header block ── */}
        <div className="mb-8 md:mb-10">
          <h2 className="font-sans font-semibold text-[36px] leading-[129%] tracking-[-0.02em] text-foreground mb-4 md:text-display-lg">
            What's Our Client's Says
          </h2>
          <p className="font-sans font-normal text-[16px] leading-[150%] tracking-[0em] text-foreground/50 max-w-lg md:text-text-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit lorem
            sagittis, proin ut lectus sed ut. Enim egestas enim id duis.
          </p>
        </div>

        {/* ── Testimonial card ── */}
        <div className="border border-foreground/10 rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:gap-16">
            {/* Left — avatar + name */}
            <div className="flex-shrink-0 flex flex-row md:flex-col items-center md:items-start gap-3 mb-8 md:mb-0 md:w-44">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-foreground/10">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              </div>
              <div>
                <p className="text-text-lg leading-[155%] tracking-[-0.02em] font-semibold text-foreground align-middle">
                  {t.name}
                </p>
                <p className="text-foreground/50 text-sm">{t.role}</p>
              </div>
            </div>

            {/* Right — testimonial text */}
            <div className="flex-1 min-h-[220px]">
              <div
                key={current}
                style={{
                  opacity: animating ? 0 : 1,
                  transform: animating
                    ? `translateX(${direction === "right" ? "24px" : "-24px"})`
                    : "translateX(0)",
                  transition: "opacity 300ms ease, transform 300ms ease",
                }}
              >
                {t.paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className="font-sans font-normal text-[24px] leading-[132%] tracking-[-0.02em] text-foreground mb-6 last:mb-0 md:text-display-sm md:leading-[150%] md:tracking-[0.01em]"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* ── Nav buttons + dot indicators ── */}
          <div className="flex items-center gap-3 mt-10">
            {/* Prev */}
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Next */}
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRight size={16} />
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-1.5 ml-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > current ? "right" : "left")}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-5 h-1.5 bg-foreground"
                      : "w-1.5 h-1.5 bg-foreground/20 hover:bg-foreground/40"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
