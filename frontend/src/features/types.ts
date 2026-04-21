export type Role = "user" | "contractor" | "admin";

export type NavItem = {
  key:
    | "dashboard"
    | "budget"
    | "analytics"
    | "contracts"
    | "notifications"
    | "account";
  label: string;
  to: string;
  allowedRoles: Role[];
};

