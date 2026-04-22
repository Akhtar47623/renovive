import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useState } from "react";

export function FeatureLayout() {
  const [openMobile, setOpenMobile] = useState(false);

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar openMobile={openMobile} setOpenMobile={setOpenMobile} />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

