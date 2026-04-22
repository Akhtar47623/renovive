import serviceImage from "@/assets/service.png";

const services = [
  {
    number: "01",
    title: "Best Platform",
    desc: "Upload your renovation project and get an AI-powered cost estimate instantly — no contractor needed upfront. Our platform does the heavy lifting so you can plan with confidence.",
  },
  {
    number: "02",
    title: "Comfort & Space",
    desc: "We match your project to contractors who specialise in exactly what you need — kitchen, bathroom, full remodel — so every job feels tailor-made for your space.",
  },
  {
    number: "03",
    title: "24/7 Support",
    desc: "From your first estimate to your final walkthrough, our support team is always available to help you navigate the process, resolve issues, and keep things on track.",
  },
  {
    number: "04",
    title: "Best Market Price",
    desc: "Our cost estimation engine benchmarks against real market data so you always know if a quote is fair — and you never overpay for renovation work again.",
  },
];

const ServicesSection = () => {
  return (
    <section className="bg-background py-12 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* ── Header block — dashed border matching your Figma ── */}
        <div className="mb-8 md:mb-10 max-w-2xl">
          <h2 className="text-display-lg font-semibold tracking-[-0.02em] text-foreground mb-4">
            Benefits You Get When You Use Our Services
          </h2>
          <p className="text-text-md leading-[150%] tracking-[0em] font-normal text-foreground/50 max-w-lg">
            Lorem ipsum sit amet, consectetur adipiscing elit. Sit lorem
            sagittis, proin ut lectus sed ut. Enim egestas enim id duis.
          </p>
        </div>

        {/* ── 4-column service cards with number accent ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0 mb-10">
          {services.map((s, i) => (
            <div key={s.number} className={`relative py-6 pr-6 }`}>
              {/* Large faded number (positioned behind) */}
              <p className="absolute top-5 text-display-xl leading-[120%] tracking-[-0.02em] font-semibold text-foreground/10 select-none z-0">
                {s.number}
              </p>

              {/* Content (above number) */}
              <div className="relative z-10 pt-10">
                <h3 className="text-display-sm leading-[150%] tracking-[0.01em] font-semibold text-foreground mb-2">
                  {s.title.replace("&amp;", "&")}
                </h3>

                <p className="text-text-md leading-[150%] tracking-[0em] font-normal text-foreground/50">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Full-width hero image with rounded corners ── */}
        <div className="relative rounded-xl overflow-hidden mb-10 md:mb-12 h-[420px] md:h-[520px]">
          <img
            src={serviceImage}
            alt="ReNoVIVE renovation showcase"
            className="w-full h-full object-fill"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          {/* Fallback gradient when image is missing */}
          <div className="absolute inset-0 bg-gradient-to-br from-stone-700 via-stone-600 to-stone-900 -z-10" />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
