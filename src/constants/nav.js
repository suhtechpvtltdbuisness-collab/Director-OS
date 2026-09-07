import {
  LayoutDashboard, Package, Megaphone, Users, KanbanSquare, FolderKanban,
  Building2, LifeBuoy, Wallet, CheckSquare, AlertTriangle, History,
  FileText, Bot, Code2,
} from "lucide-react";

/**
 * Sidebar navigation, grouped by business function rather than listed flat.
 * `directorOnly` areas render a no-permission state for other roles.
 */
export const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
      { to: "/assistant", label: "AI Assistant", icon: Bot },
    ],
  },
  {
    label: "Revenue",
    items: [
      { to: "/leads", label: "CRM & Leads", icon: Users },
      { to: "/campaigns", label: "Marketing", icon: Megaphone },
      { to: "/clients", label: "Clients", icon: Building2 },
    ],
  },
  {
    label: "Delivery",
    items: [
      { to: "/projects", label: "Projects", icon: FolderKanban },
      { to: "/sprints", label: "Sprint Board", icon: KanbanSquare },
      { to: "/products", label: "Products", icon: Package },
      { to: "/team", label: "Dev Team", icon: Code2 },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/support", label: "Support", icon: LifeBuoy },
      { to: "/finance", label: "Finance", icon: Wallet, directorOnly: true },
      { to: "/approvals", label: "Approvals", icon: CheckSquare, badge: "approvals" },
    ],
  },
  {
    label: "Governance",
    items: [
      { to: "/alerts", label: "Alerts & Risks", icon: AlertTriangle },
      { to: "/activity", label: "Activity Log", icon: History },
      { to: "/documents", label: "Documents", icon: FileText },
    ],
  },
];

export const NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

export const MOBILE_NAV = [
  { to: "/", label: "Home", icon: LayoutDashboard, end: true },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/approvals", label: "Approvals", icon: CheckSquare, badge: "approvals" },
  { to: "/assistant", label: "Assistant", icon: Bot },
];
