import { useMemo } from "react";
import heroImage from "@/assets/hero-home.png";
import { ArrowUpRight, DollarSign, Home, MapPin, Search } from "lucide-react";

const HeroSection = () => {
  const inputs = useMemo(
    () => [
      { icon: MapPin, placeholder: "Location" },
      { icon: Home, placeholder: "Property Type" },
      { icon: DollarSign, placeholder: "Budget" },
    ],
    []
  );

  return (
    <section className="relative min-h-screen flex items-center">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Modern renovated home"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <div className="relative container mx-auto px-4 pt-40 flex flex-col items-center text-center">
        <div className=" animate-fade-in">
          <h1 className="text-display-xl leading-[120%] tracking-[-0.02em] font-semibold text-white text-center mb-3">
            Select Best Residence
            <br />
            That Aligns With Your Lifestyle
          </h1>
          <p className="text-white/70 text-text-xl leading-[150%] tracking-[-0.02em] font-normal text-center max-w-2xl mx-auto">
            Embarking on the journey to find a new home is exciting. Selecting the right residence is crucial for
            a harmonious match with your unique lifestyle.
          </p>
        </div>

        {/* Search bar */}
        <div className="w-full max-w-4xl mt-[400px]">
          <div className="bg-white rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-black/10 px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0">
            {inputs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.placeholder}
                  className="flex items-center gap-2 md:flex-1 min-w-0"
                >
                  <span className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black/60 shrink-0">
                    <Icon size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder={item.placeholder}
                    className="w-full bg-transparent outline-none text-[13px] text-gray-700 placeholder:text-gray-400"
                  />
                  {idx !== inputs.length - 1 ? (
                    <span className="hidden md:block mx-4 h-8 w-px bg-gray-200" />
                  ) : null}
                </div>
              );
            })}

            <div className="flex items-center gap-3 md:pl-4">
              <button
                type="button"
                className="h-11 md:h-12 px-5 md:px-6 rounded-full bg-black text-white text-[13px] font-medium flex items-center gap-2 justify-center"
              >
                <Search size={16} />
                Search
              </button>
              <button
                type="button"
                aria-label="Search"
                className="h-11 md:h-12 w-11 md:w-12 rounded-full bg-black text-white flex items-center justify-center"
              >
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
