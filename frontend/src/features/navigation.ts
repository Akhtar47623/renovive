import type { NavItem } from "./types";

export const SIDEBAR_ITEMS: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    to: "/dashboard",
    allowedRoles: ["user", "contractor", "admin"],
  },
  {
    key: "budget",
    label: "Budget",
    to: "/dashboard/budget",
    allowedRoles: ["user", "contractor", "admin"],
  },
  {
    key: "analytics",
    label: "Analytics",
    to: "/dashboard/analytics",
    allowedRoles: ["contractor", "admin"],
  },
  {
    key: "contracts",
    label: "Contracts",
    to: "/dashboard/contracts",
    allowedRoles: ["contractor", "admin"],
  },
  {
    key: "notifications",
    label: "Notifications",
    to: "/dashboard/notifications",
    allowedRoles: ["user", "contractor", "admin"],
  },
  {
    key: "account",
    label: "Account",
    to: "/dashboard/account",
    allowedRoles: ["user", "contractor", "admin"],
  },
];

