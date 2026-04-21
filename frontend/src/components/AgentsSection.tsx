import agent1 from "@/assets/agent1.png"; // replace with your actual images
import agent2 from "@/assets/agent2.png";
import agent3 from "@/assets/agent3.png";
import { ArrowUpRight, Phone, Mail } from "lucide-react";

const agents = [
  {
    id: "01",
    name: "Wade Warren",
    role: "Real Estate Agent",
    image: agent1,
  },
  {
    id: "02",
    name: "Jenny Wilson",
    role: "Real Estate Agent",
    image: agent2,
  },
  {
    id: "03",
    name: "Devon Lane",
    role: "Real Estate Agent",
    image: agent3,
  },
];

const AgentsSection = () => {
  return (
    <section className="bg-background py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* ── Header block — mirrors PropertiesSection header style ── */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-display-lg font-semibold tracking-[-0.02em] text-foreground mb-4">
              Our Agents
            </h2>
            <p className="text-text-md leading-[150%] tracking-[0em] font-normal text-foreground/50 max-w-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit lorem
              sagittis, proin ut lectus sed ut.
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

        {/* ── 3-column agent grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10">
          {agents.map((agent) => (
            <div key={agent.id} className="group cursor-pointer">
              {/* Agent portrait */}
              <div className="relative rounded-xl overflow-hidden mb-4 aspect-[3/4]">
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
                {/* Fallback gradient when image is missing */}
                <div className="absolute inset-0 bg-gradient-to-br from-stone-700 via-stone-600 to-stone-900 -z-10" />

                {/* Hover overlay with contact icons */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="w-8 h-8 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors">
                    <Phone size={13} className="text-foreground" />
                  </span>
                  <span className="w-8 h-8 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors">
                    <Mail size={13} className="text-foreground" />
                  </span>
                </div>
              </div>

              {/* Name row — name left, arrow icon right */}
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-display-xs leading-[132%] tracking-[-0.02em] font-semibold text-foreground">
                  {agent.name}
                </h3>
                <span className="w-7 h-7 rounded-full border border-foreground/25 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-200">
                  <ArrowUpRight size={13} />
                </span>
              </div>

              {/* Role */}
              <p className="text-text-md leading-[150%] tracking-[0em] font-normal text-foreground/50">
                {agent.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgentsSection;
