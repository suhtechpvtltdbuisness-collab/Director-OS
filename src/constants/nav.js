import {
  LayoutDashboard,
  Package,
  Megaphone,
  Users,
  KanbanSquare,
  FolderKanban,
  Building2,
  LifeBuoy,
  Wallet,
  CheckSquare,
  AlertTriangle,
  History,
  FileText,
  Bot,
  Code2,
} from "lucide-react";

export const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "crm", label: "CRM & Leads", icon: Users },
  { id: "team", label: "Dev Team", icon: Code2 },
  { id: "sprints", label: "Sprint Board", icon: KanbanSquare },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "clients", label: "Clients", icon: Building2 },
  { id: "support", label: "Support", icon: LifeBuoy },
  { id: "finance", label: "Finance", icon: Wallet },
  { id: "approvals", label: "Approvals", icon: CheckSquare },
  { id: "alerts", label: "Alerts & Risks", icon: AlertTriangle },
  { id: "activity", label: "Activity Log", icon: History },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "assistant", label: "AI Assistant", icon: Bot },
];

export const MOBILE_NAV = [NAV[0], NAV[3], NAV[5], NAV[10], NAV[14]];
