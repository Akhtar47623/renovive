import prop1 from "@/assets/prop1.png"; // replace with your actual images
import prop2 from "@/assets/prop2.png";
import prop3 from "@/assets/prop3.png";
import prop4 from "@/assets/prop4.png";
import { MapPin, BedDouble, Bath, Maximize2, ArrowUpRight } from "lucide-react";

const properties = [
  {
    id: "01",
    title: "Cascading Waters Villa of Serenity",
    address: "3891 Ranchview Dr, Richardson, California",
    bedrooms: 5,
    baths: 6,
    sqft: 5320,
    image: prop1,
  },
  {
    id: "02",
    title: "Starlit Cove Private Villa Retreat",
    address: "3891 Ranchview Dr, Richardson, California",
    bedrooms: 6,
    baths: 8,
    sqft: 6740,
    image: prop2,
  },
  {
    id: "03",
    title: "Golden Sands Haven by the Bay",
    address: "3891 Ranchview Dr, Richardson, California",
    bedrooms: 4,
    baths: 3,
    sqft: 4800,
    image: prop3,
  },
  {
    id: "04",
    title: "Enchanted Garden View Villa Retreat",
    address: "3891 Ranchview Dr, Richardson, California",
    bedrooms: 5,
    baths: 6,
    sqft: 5500,
    image: prop4,
  },
];

const PropertiesSection = () => {
  return (
    <section className="bg-background py-12 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* ── Header block — mirrors ServicesSection header style ── */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8 md:mb-10 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-sans font-semibold text-[36px] leading-[129%] tracking-[-0.02em] text-foreground mb-4 md:text-display-lg">
              Explore Our Latest Properties
            </h2>
            <p className="font-sans font-normal text-[16px] leading-[150%] tracking-[0em] text-foreground/50 max-w-lg md:text-text-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit lorem
              sagittis, proin ut lectus sed ut. Enim egestas enim id duis.
            </p>
          </div>

          {/* View All pill button — top-right as in screenshot */}
          <div className="flex-shrink-0 md:pt-2">
            <button className="flex items-center gap-2 border border-foreground/20 rounded-full px-5 py-2.5 text-sm font-medium text-foreground hover:bg-foreground hover:text-background transition-colors duration-200 group">
              View All
              <span className="w-6 h-6 rounded-full border border-foreground/30 flex items-center justify-center group-hover:border-background/30 transition-colors">
                <ArrowUpRight size={13} />
              </span>
            </button>
          </div>
        </div>

        {/* ── 2×2 property grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
          {properties.map((property) => (
            <div key={property.id} className="group cursor-pointer">
              {/* Property image */}
              <div className="relative rounded-xl overflow-hidden mb-4 aspect-[4/3]">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
                {/* Fallback gradient when image is missing */}
                <div className="absolute inset-0 bg-gradient-to-br from-stone-700 via-stone-600 to-stone-900 -z-10" />
              </div>

              {/* Title row — name left, View + icon right */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-sans font-semibold text-[24px] leading-[132%] tracking-[-0.02em] text-foreground pr-4 md:text-display-xs">
                  {property.title}
                </h3>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-sm text-foreground/60 font-medium border border-foreground/25 rounded-full p-2">
                    View
                  </span>
                  <span className="w-7 h-7 rounded-full border border-foreground/25 flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-colors duration-200">
                    <ArrowUpRight size={13} />
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center gap-1.5 mb-2.5">
                <MapPin
                  size={13}
                  className="text-foreground/40 flex-shrink-0"
                />
                <p className="font-sans font-normal text-[16px] leading-[150%] tracking-[0em] text-foreground/50 truncate align-middle md:text-text-md">
                  {property.address}
                </p>
              </div>

              {/* Specs row — bedrooms / baths / sqft */}
              <div className="flex items-center gap-5 text-text-md leading-[150%] tracking-[0em] font-normal text-foreground/50">
                <span className="flex items-center gap-1.5 align-middle">
                  <BedDouble size={14} className="text-foreground/35" />
                  {property.bedrooms} bedrooms
                </span>
                <span className="flex items-center gap-1.5 align-middle">
                  <Bath size={14} className="text-foreground/35" />
                  {property.baths} baths
                </span>
                <span className="flex items-center gap-1.5 align-middle">
                  <Maximize2 size={13} className="text-foreground/35" />
                  {property.sqft.toLocaleString()} Sqft
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertiesSection;
