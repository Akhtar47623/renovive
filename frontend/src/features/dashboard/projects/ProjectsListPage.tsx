import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Plus, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  title: string;
  address: string;
  style: string;
  discount: string;
  marketRange: string;
  aiEstimate: string;
  image: string;
}

// NOTE: Dummy listing (fallback when API isn't available yet)
const DUMMY_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Cascading Waters Villa",
    address: "3891 Ranchview Dr. Richardson, California",
    style: "Modern",
    discount: "-42%",
    marketRange: "$67,000 – 80,000",
    aiEstimate: "$48,000 – 60,000",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  },
  {
    id: "2",
    title: "Sunset Ridge Manor",
    address: "512 Hillcrest Blvd. Austin, Texas",
    style: "Modern",
    discount: "-31%",
    marketRange: "$92,000 – 110,000",
    aiEstimate: "$63,000 – 78,000",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
  },
  {
    id: "3",
    title: "Oakwood Heritage Estate",
    address: "204 Elmwood Ct. Portland, Oregon",
    style: "Modern",
    discount: "-28%",
    marketRange: "$55,000 – 70,000",
    aiEstimate: "$39,000 – 52,000",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
  },
];

type ProjectApiItem = {
  id: string;
  title?: string | null;
  description?: string | null;
  budget?: number | null;
  createdAt?: string;
};

function toCardProject(p: ProjectApiItem): Project {
  const title = (p.title ?? "").trim() ? String(p.title) : "Untitled Property";
  return {
    id: p.id,
    title,
    address: p.description ?? "-",
    style: "Property",
    discount: "",
    marketRange: p.budget != null ? `$${Number(p.budget).toLocaleString()}` : "-",
    aiEstimate: "-",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  };
}

const HeroBanner = () => (
  <div
    className="relative w-full rounded-2xl overflow-hidden mb-8 "
    style={{ height: 300 }}
    
  >
    <img
      src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80"
      alt="hero"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-white text-2xl font-bold leading-tight mb-2">
        Select Best Residence<br />That Aligns With Your Lifestyle
      </h2>
      <p className="text-white/75 text-sm max-w-md">
        Embarking on the journey to find a new home is exciting. Selecting the
        right residence is crucial for a harmonious match with your unique
        lifestyle.
      </p>
    </div>
  </div>
);

const PropertyCard = ({ project }: { project: Project }) => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100/80 shadow-[0_8px_30px_rgba(17,24,39,0.06)] flex flex-col">
    {/* Image */}
    <div className="relative">
      <img
        src={project.image}
        alt={project.title}
        className="w-full object-cover"
        style={{ height: 170 }}
      />
      <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
        {project.style}
      </span>
    </div>

    {/* Content */}
    <div className="p-4 flex flex-col flex-1">
      <h3 className="font-bold text-gray-900 text-[18px] leading-tight mb-1">{project.title}</h3>
      <div className="flex items-center gap-2 text-gray-400 text-[12px] mb-3">
        <span className="w-4 h-4 rounded-full border border-gray-200 flex items-center justify-center">
          <MapPin size={10} />
        </span>
        <span className="truncate">{project.address}</span>
      </div>

      <p className="text-gray-500 text-xs mb-2">Estimated Cost</p>

      {/* Price row */}
      <div className="relative mb-4">
        <div className="flex items-stretch w-full rounded-xl border border-gray-200 overflow-hidden bg-white">
          {/* In Market */}
          <div className="flex-1 min-w-0 py-2.5 pl-12 pr-3 text-center">
            <div className="text-[10px] text-gray-400 font-medium leading-none">
              In Market
            </div>
            <div className="text-[14px] font-semibold text-indigo-700 leading-tight mt-0.5">
              {project.marketRange}
            </div>
          </div>

          {/* Estimated Cost by AI */}
          <div className="shrink-0 rounded-xl bg-purple-600 px-5 py-2.5 text-center w-[40%]">
            <div className="text-[10px] text-purple-200 font-medium leading-none">
              Estimated Cost by AI
            </div>
            <div className="text-[14px] font-semibold text-white leading-tight mt-0.5">
              {project.aiEstimate}
            </div>
          </div>
        </div>

        {/* Discount badge (overlapping) */}
        {project.discount ? (
          <span className="absolute left-[-10px] top-1/2 -translate-y-1/2 bg-red-700 text-white text-[11px] font-bold px-5 py-1 rounded-full shadow-sm">
            {project.discount}
          </span>
        ) : null}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto">
        <button className=" border border-gray-200 rounded-full py-2.5 px-6 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          View
        </button>
        <button className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors">
          <ArrowUpRight size={15} />
        </button>
      </div>
    </div>
  </div>
);

const EmptyState = ({ onNew }: { onNew: () => void }) => {
  return (
    <div className="w-full flex items-center justify-center py-14">
      <div className="text-center max-w-xl">
        <div className="mx-auto mb-6 w-[92px] h-[92px] flex items-center justify-center">
          <svg width="92" height="92" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="46" cy="46" r="40" fill="#EEF2FF" />
            <rect x="26" y="20" width="40" height="52" rx="10" fill="white" stroke="#E6E9F6" />
            <rect x="26" y="20" width="40" height="14" rx="10" fill="#6D6AFE" />
            <rect x="32" y="40" width="22" height="4" rx="2" fill="#C7D2FE" />
            <rect x="32" y="48" width="28" height="4" rx="2" fill="#DBEAFE" />
            <rect x="32" y="56" width="18" height="4" rx="2" fill="#DBEAFE" />
          </svg>
        </div>

        <h3 className="text-[22px] font-medium text-gray-700 leading-tight">
          You don’t have any <span className="font-bold text-gray-900">Active Properties</span> yet.
        </h3>
        <p className="text-[13px] text-gray-400 mt-1.5">
          Click the button below to add your first one.
        </p>

        <div className="mt-5 flex justify-center">
          <Button
            type="button"
            onClick={onNew}
            className="h-11 px-6 rounded-full bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Plus className="mr-2" size={16} />
            New Project
          </Button>
        </div>
      </div>
    </div>
  );
};

const ProjectListPage = () => {
  const [projects] = useState<Project[]>(DUMMY_PROJECTS);
  const navigate = useNavigate();

  return (
    <div className="bg-[#ffffff] p-6">
      <HeroBanner />

      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[28px] font-semibold text-gray-900 tracking-tight">Active Properties</h2>
        <button
          type="button"
          onClick={() => navigate("/dashboard/projects/new")}
          className="flex items-center gap-2 bg-gray-900 text-white text-[13px] font-medium px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
        >
          <Plus size={15} />
          New Project
        </button>
      </div>

      {/* Property grid */}
      {projects.length === 0 ? (
        <EmptyState onNew={() => navigate("/dashboard/projects/new")} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <PropertyCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectListPage;