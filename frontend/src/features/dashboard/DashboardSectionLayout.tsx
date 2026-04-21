import { NavLink, Outlet } from "react-router-dom";

export function DashboardSectionLayout() {
  return (
    <div className="mx-auto px-4 ">
      {/* <div className="flex items-center justify-between mb-6 "> */}
        {/* <h1 className="font-serif text-2xl font-bold text-foreground">Dashboard</h1> */}
      {/* </div> */}

      <Outlet />
    </div>
  );
}

