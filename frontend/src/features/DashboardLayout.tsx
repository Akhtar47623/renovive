import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";

export function FeatureLayout() {
  const [openMobile, setOpenMobile] = useState(false);

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <Sidebar openMobile={openMobile} setOpenMobile={setOpenMobile} />
      <main className="flex-1 overflow-y-auto bg-[#ffffff]">
        {/* Mobile topbar */}
        <div className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100 px-4 h-14 flex items-center">
          <button
            type="button"
            onClick={() => setOpenMobile(true)}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-800"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

// Back-compat export: App.tsx imports DashboardLayout
export const DashboardLayout = FeatureLayout;

