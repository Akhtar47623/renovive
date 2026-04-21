import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function FeatureLayout() {
  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

