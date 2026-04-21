import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  LineChart,
  FileText,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SIDEBAR_ITEMS } from "./navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useEffect, useMemo, useState } from "react";

const iconByKey = {
  dashboard: LayoutDashboard,
  budget: Wallet,
  analytics: LineChart,
  contracts: FileText,
  notifications: Bell,
  account: Settings,
} as const;

export function Sidebar({
  openMobile,
  setOpenMobile,
}: {
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
}) {
  const { role, user, signOut } = useAuth();
  const { pathname } = useLocation();
  const isMobile = useIsMobile();

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("renovive:sidebarCollapsed") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("renovive:sidebarCollapsed", collapsed ? "1" : "0");
    } catch {
      // ignore
    }
  }, [collapsed]);

  const mainItems = SIDEBAR_ITEMS.filter(
    (i) =>
      ["dashboard", "budget", "analytics", "contracts"].includes(i.key) &&
      (!!role && i.allowedRoles.includes(role))
  );

  const bottomItems = SIDEBAR_ITEMS.filter(
    (i) =>
      ["notifications", "account"].includes(i.key) &&
      (!!role && i.allowedRoles.includes(role))
  );

  const notificationItem = bottomItems.find((i) => i.key === "notifications");
  const accountItem = bottomItems.find((i) => i.key === "account");

  const aside = (
    <aside
      className={[
        "shrink-0 flex flex-col bg-[#F5F5F6] h-screen overflow-y-auto border-r border-gray-200/70 transition-[width] duration-200",
        collapsed ? "w-[76px]" : "w-[288px]",
      ].join(" ")}
    >
      {/* Logo */}
      <div className={["h-16 flex items-center", collapsed ? "px-3 justify-center" : "px-5 justify-between"].join(" ")}>
        <span
          className={[
            "font-bold text-xl tracking-tight text-gray-900 whitespace-nowrap transition-all",
            collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100",
          ].join(" ")}
        >
          Re<span className="text-gray-900">No</span>
          <span className="font-black">VIVE</span>
        </span>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className={[
            "w-9 h-9 rounded-full border border-gray-200 bg-white/70 hover:bg-white flex items-center justify-center text-gray-800",
            collapsed ? "mx-auto" : "",
          ].join(" ")}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Main nav */}
      <nav className={["py-3 flex flex-col gap-0.5", collapsed ? "px-2" : "px-3"].join(" ")}>
        {mainItems.map((item) => {
          const Icon = iconByKey[item.key as keyof typeof iconByKey];
          const isDashboard = item.key === "dashboard";

          return (
            <NavLink
              key={item.key}
              to={item.to}
              // Use a custom rule for Dashboard:
              // - active on /dashboard and /dashboard/projects/*
              // - not active on other sections (budget/analytics/contracts/etc)
              end={!isDashboard}
              className={({ isActive }) =>
                `flex items-center ${collapsed ? "justify-center" : "gap-3"} rounded-full ${collapsed ? "px-0" : "px-3"} py-2.5 text-sm font-medium transition-colors ${
                  (isDashboard
                    ? pathname === "/dashboard" || pathname.startsWith("/dashboard/projects")
                    : isActive)
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-200/60 hover:text-gray-800"
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  {Icon && (
                    <Icon
                      size={16}
                      className={
                        isDashboard
                          ? pathname === "/dashboard" || pathname.startsWith("/dashboard/projects")
                            ? "text-white"
                            : "text-gray-400"
                          : isActive
                            ? "text-white"
                            : "text-gray-400"
                      }
                    />
                  )}
                  <span className={collapsed ? "hidden" : ""}>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom section */}
      <div className={["pb-3 flex flex-col gap-0.5 border-t border-[#E5E7EB] pt-3", collapsed ? "px-2" : "px-3"].join(" ")}>
        {/* Notifications */}
        {notificationItem && (
          <NavLink
            to={notificationItem.to}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? "justify-center" : "gap-3"} rounded-xl ${collapsed ? "px-0" : "px-3"} py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-200/60 hover:text-gray-800"
              }`
            }
            title={collapsed ? notificationItem.label : undefined}
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Bell
                    size={16}
                    className={isActive ? "text-white" : "text-gray-400"}
                  />
                  {/* Badge */}
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    2
                  </span>
                </div>
                <span className={collapsed ? "hidden" : ""}>{notificationItem.label}</span>
              </>
            )}
          </NavLink>
        )}

        {/* Account */}
        {accountItem && (
          <NavLink
            to={accountItem.to}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? "justify-center" : "gap-3"} rounded-xl ${collapsed ? "px-0" : "px-3"} py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-200/60 hover:text-gray-800"
              }`
            }
            title={collapsed ? accountItem.label : undefined}
          >
            {({ isActive }) => (
              <>
                <Settings
                  size={16}
                  className={isActive ? "text-white" : "text-gray-400"}
                />
                <span className={collapsed ? "hidden" : ""}>{accountItem.label}</span>
              </>
            )}
          </NavLink>
        )}

        {/* Logout */}
        <button
          type="button"
          onClick={() => void signOut()}
          className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} rounded-xl ${collapsed ? "px-0" : "px-3"} py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-200/60 hover:text-gray-800 transition-colors`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={16} className="text-gray-400" />
          <span className={collapsed ? "hidden" : ""}>Logout</span>
        </button>

        {/* User profile */}
        <div className={`mt-2 flex items-center ${collapsed ? "justify-center" : "gap-3"} rounded-xl ${collapsed ? "px-0" : "px-3"} py-2`}>
          <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.fullName
              ? user.fullName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "MS"}
          </div>
          <div className={collapsed ? "hidden" : "min-w-0"}>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.fullName ?? "Michael Smith"}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.email ?? "michaelsmith12@gmail.com"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="p-0 w-[288px]">
          {aside}
        </SheetContent>
      </Sheet>
    );
  }

  return <div className="hidden md:block">{aside}</div>;
}