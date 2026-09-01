import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  LayoutDashboard, Package, Megaphone, Users, KanbanSquare, FolderKanban,
  Building2, LifeBuoy, Wallet, CheckSquare, AlertTriangle, History, FileText,
  Bot, Search, Bell, ChevronDown, Plus, X, Menu, LogOut, Filter, TrendingUp,
  TrendingDown, Clock, Shield, CircleCheck, CircleX, CircleAlert, Code2,
  Sparkles, Send, Lock, CalendarClock, MapPin, Coffee, Pause, CircleDot,
  Trash2, Pencil, ChevronRight, DollarSign, Target, Activity, FileBadge2,
  Folder, Download, Eye, UserCheck, Rocket, PercentCircle, BadgeCheck,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, Legend, AreaChart, Area,
} from "recharts";

/* ============================== THEME ============================== */
const C = {
  bg: "#0D1117",
  panel: "#141B29",
  panel2: "#1A2333",
  border: "#26314A",
  borderSoft: "#1D2638",
  text: "#E7ECF6",
  muted: "#8B96AD",
  faint: "#5C6784",
  gold: "#D6A24E",
  goldSoft: "#3A2F1C",
  blue: "#4C8BF5",
  blueSoft: "#152744",
  green: "#3FB68B",
  greenSoft: "#123024",
  amber: "#E0A93D",
  amberSoft: "#332510",
  red: "#E5586B",
  redSoft: "#331A20",
  purple: "#9A7FE0",
};
const FONT_DISPLAY = "'Space Grotesk', 'Inter', sans-serif";
const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Courier New', monospace";

const inr = (n) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
};
const inrFull = (n) => `₹${n.toLocaleString("en-IN")}`;

/* ============================== SEED DATA ============================== */
const PRODUCTS = [
  { id: "p1", name: "ORGA HRMS", type: "SaaS Product", tagline: "End-to-end HR & payroll platform", status: "Live", health: "Good", mrr: 420000, clients: 18, stage: "Scaling", marketingStage: "Active ABM", owner: "Rahul Verma", launched: "2024-02-10" },
  { id: "p2", name: "BotBridge", type: "SaaS Product", tagline: "AI chatbot integration & orchestration layer", status: "Live (Beta)", health: "Watch", mrr: 185000, clients: 9, stage: "Growth", marketingStage: "Launch Push", owner: "Ananya Singh", launched: "2025-01-18" },
  { id: "p3", name: "SUH OptiCore", type: "SaaS Product", tagline: "Workflow automation & optimization engine", status: "Live", health: "Good", mrr: 240000, clients: 6, stage: "Early Growth", marketingStage: "Case Studies", owner: "Karthik Iyer", launched: "2025-03-02" },
  { id: "p4", name: "Skill Guru", type: "SaaS Product", tagline: "Skills assessment & micro-learning platform", status: "Beta", health: "At Risk", mrr: 45000, clients: 3, stage: "Beta", marketingStage: "Waitlist", owner: "Divya Menon", launched: "2025-07-01" },
  { id: "p5", name: "Web Development", type: "Service Line", tagline: "Custom business & e-commerce websites", status: "Active", health: "Good", mrr: 1260000, clients: 11, stage: "Steady", marketingStage: "Referral + SEO", owner: "Priya Nair", launched: "2021-06-01" },
  { id: "p6", name: "Digital Marketing", type: "Service Line", tagline: "Performance marketing & brand growth retainers", status: "Active", health: "Good", mrr: 680000, clients: 8, stage: "Steady", marketingStage: "Referral Program", owner: "Ananya Singh", launched: "2021-09-01" },
  { id: "p7", name: "SaaS Development", type: "Service Line", tagline: "Custom SaaS builds for external clients", status: "Active", health: "Good", mrr: 1840000, clients: 5, stage: "Scaling", marketingStage: "Case Study Series", owner: "Rahul Verma", launched: "2022-01-15" },
  { id: "p8", name: "AI Automation Services", type: "Service Line", tagline: "Workflow & agentic automation for enterprises", status: "Active", health: "Good", mrr: 920000, clients: 7, stage: "Growth", marketingStage: "Webinar Series", owner: "Farhan Shaikh", launched: "2024-11-01" },
];

const DEVS = [
  { id: "d1", name: "Rahul Verma", role: "Lead Full-Stack Engineer", avatarColor: C.blue, workload: 92, status: "Busy", attendance: "Present", location: "Bengaluru", task: "ORGA HRMS v3 — payroll export module", blockers: 0 },
  { id: "d2", name: "Ananya Singh", role: "Backend / AI Engineer", avatarColor: C.purple, workload: 78, status: "Busy", attendance: "Present", location: "Remote — Pune", task: "BotBridge — NLP intent upgrade", blockers: 1 },
  { id: "d3", name: "Karthik Iyer", role: "Frontend Engineer", avatarColor: C.green, workload: 60, status: "Available", attendance: "Present", location: "Bengaluru", task: "SUH OptiCore — dashboard revamp", blockers: 0 },
  { id: "d4", name: "Divya Menon", role: "Full-Stack Engineer", avatarColor: C.amber, workload: 45, status: "Blocked", attendance: "Present", location: "Remote — Kochi", task: "Skill Guru — MVP quiz engine", blockers: 2 },
  { id: "d5", name: "Farhan Shaikh", role: "DevOps / QA Lead", avatarColor: C.red, workload: 85, status: "Busy", attendance: "Present", location: "Bengaluru", task: "Release pipeline — staging → prod gate", blockers: 0 },
  { id: "d6", name: "Priya Nair", role: "Junior Developer", avatarColor: C.gold, workload: 55, status: "On Leave", attendance: "Leave", location: "Remote — Mangalore", task: "Meridian Retail — storefront build", blockers: 0 },
];

const PROJECTS = [
  { id: "pr1", name: "ORGA HRMS v3 Release", product: "ORGA HRMS", owner: "Rahul Verma", health: "Green", progress: 78, deadline: "2026-09-13", deployStatus: "Staging", codeStatus: "3 PRs open", risk: "Low" },
  { id: "pr2", name: "BotBridge NLP Upgrade", product: "BotBridge", owner: "Ananya Singh", health: "Amber", progress: 55, deadline: "2026-09-21", deployStatus: "Dev", codeStatus: "Blocked on client data", risk: "Medium" },
  { id: "pr3", name: "SUH OptiCore Dashboard Revamp", product: "SUH OptiCore", owner: "Karthik Iyer", health: "Green", progress: 90, deadline: "2026-09-06", deployStatus: "Staging", codeStatus: "QA in progress", risk: "Low" },
  { id: "pr4", name: "Skill Guru MVP Launch", product: "Skill Guru", owner: "Divya Menon", health: "Red", progress: 30, deadline: "2026-09-09", deployStatus: "Dev", codeStatus: "API keys pending (client)", risk: "High" },
  { id: "pr5", name: "Meridian Retail — E-commerce Site", product: "Web Development", owner: "Priya Nair", health: "Green", progress: 65, deadline: "2026-09-18", deployStatus: "Dev", codeStatus: "On track", risk: "Low" },
  { id: "pr6", name: "Nimbus Logistics — Custom Portal", product: "SaaS Development", owner: "Rahul Verma", health: "Amber", progress: 40, deadline: "2026-09-28", deployStatus: "Dev", codeStatus: "Scope change pending sign-off", risk: "Medium" },
];

const CLIENTS = [
  { id: "c1", name: "Meridian Retail", product: "Web Development", value: 600000, status: "Active", since: "2026-06-01", contact: "Ritu Malhotra" },
  { id: "c2", name: "Nimbus Logistics", product: "SaaS Development", value: 1450000, status: "Active", since: "2026-04-12", contact: "Sameer Kulkarni" },
  { id: "c3", name: "Zenith Financial Services", product: "ORGA HRMS", value: 360000, status: "Active", since: "2025-11-20", contact: "Anil Kapoor" },
  { id: "c4", name: "Coastal Foods Pvt Ltd", product: "Digital Marketing", value: 120000, status: "Active", since: "2025-08-15", contact: "Meena Pillai" },
  { id: "c5", name: "Vertex Manufacturing", product: "BotBridge", value: 240000, status: "Active", since: "2025-12-01", contact: "Deepak Rao" },
  { id: "c6", name: "Quantum Retail Group", product: "AI Automation Services", value: 800000, status: "Active", since: "2026-02-10", contact: "Nisha Bhatt" },
  { id: "c7", name: "Skyline Realty", product: "Web Development", value: 200000, status: "Completed", since: "2025-05-01", contact: "Vikram Sethi" },
  { id: "c8", name: "Aurora EdTech", product: "Skill Guru", value: 0, status: "Trial", since: "2026-08-01", contact: "Shalini Rao" },
];

const LEAD_STAGES = ["New", "Contacted", "Demo", "Proposal", "Negotiation", "Won", "Lost"];
const INIT_LEADS = [
  { id: "l1", name: "Ashoka Textiles", product: "ORGA HRMS", value: 300000, source: "LinkedIn", stage: "Negotiation", owner: "Rahul Verma", updated: "2026-08-29" },
  { id: "l2", name: "Bright Path School", product: "Skill Guru", value: 90000, source: "Website", stage: "Demo", owner: "Divya Menon", updated: "2026-08-27" },
  { id: "l3", name: "Coral Bay Hospitality", product: "Web Development", value: 220000, source: "Referral", stage: "Proposal", owner: "Priya Nair", updated: "2026-08-30" },
  { id: "l4", name: "Delta Freight Co.", product: "SaaS Development", value: 1600000, source: "Cold Outreach", stage: "Contacted", owner: "Rahul Verma", updated: "2026-08-25" },
  { id: "l5", name: "Everline Pharma", product: "AI Automation Services", value: 950000, source: "Webinar", stage: "Proposal", owner: "Farhan Shaikh", updated: "2026-08-28" },
  { id: "l6", name: "Falcon Sports Retail", product: "BotBridge", value: 260000, source: "Google Ads", stage: "New", owner: "Ananya Singh", updated: "2026-08-31" },
  { id: "l7", name: "Greenfield Realty", product: "Digital Marketing", value: 150000, source: "Referral", stage: "Won", owner: "Ananya Singh", updated: "2026-08-20" },
  { id: "l8", name: "Harbor View Hotels", product: "ORGA HRMS", value: 280000, source: "Event", stage: "Lost", owner: "Rahul Verma", updated: "2026-08-15" },
  { id: "l9", name: "Indigo Retail Labs", product: "SUH OptiCore", value: 410000, source: "LinkedIn", stage: "New", owner: "Karthik Iyer", updated: "2026-08-31" },
  { id: "l10", name: "Jupiter Foods", product: "Digital Marketing", value: 110000, source: "Referral", stage: "Contacted", owner: "Ananya Singh", updated: "2026-08-29" },
  { id: "l11", name: "Kestrel Logistics", product: "SaaS Development", value: 1900000, source: "Cold Outreach", stage: "Demo", owner: "Rahul Verma", updated: "2026-08-26" },
  { id: "l12", name: "Lumen Analytics", product: "AI Automation Services", value: 700000, source: "Website", stage: "Negotiation", owner: "Farhan Shaikh", updated: "2026-08-30" },
];

const INIT_CAMPAIGNS = [
  { id: "cm1", name: "ORGA HRMS — Q3 LinkedIn ABM", product: "ORGA HRMS", channel: "LinkedIn", budget: 80000, spend: 62000, leads: 34, conversions: 5, status: "Active", start: "2026-07-01", end: "2026-09-30" },
  { id: "cm2", name: "BotBridge Launch Push", product: "BotBridge", channel: "Google Ads + Content", budget: 120000, spend: 105000, leads: 58, conversions: 7, status: "Active", start: "2026-06-15", end: "2026-09-15" },
  { id: "cm3", name: "Skill Guru Beta Waitlist", product: "Skill Guru", channel: "Instagram / Meta", budget: 30000, spend: 28500, leads: 210, conversions: 12, status: "Active", start: "2026-07-10", end: "2026-09-10" },
  { id: "cm4", name: "SaaS Dev — Case Study Series", product: "SaaS Development", channel: "Content / SEO", budget: 40000, spend: 22000, leads: 15, conversions: 3, status: "Active", start: "2026-08-01", end: "2026-10-01" },
  { id: "cm5", name: "Digital Marketing — Referral Program", product: "Digital Marketing", channel: "Referral", budget: 15000, spend: 9000, leads: 11, conversions: 4, status: "Active", start: "2026-08-01", end: "2026-12-31" },
  { id: "cm6", name: "AI Automation — Webinar Series", product: "AI Automation Services", channel: "Webinar / Email", budget: 50000, spend: 50000, leads: 40, conversions: 6, status: "Completed", start: "2026-05-01", end: "2026-07-31" },
];

const INIT_TICKETS = [
  { id: "t1024", client: "Zenith Financial Services", subject: "Payroll export failing for August cycle", product: "ORGA HRMS", priority: "High", status: "Open", updated: "2026-09-01" },
  { id: "t1023", client: "Vertex Manufacturing", subject: "Bot not responding after business hours", product: "BotBridge", priority: "Urgent", status: "In Progress", updated: "2026-09-01" },
  { id: "t1021", client: "Coastal Foods Pvt Ltd", subject: "Campaign dashboard access request", product: "Digital Marketing", priority: "Low", status: "Resolved", updated: "2026-08-29" },
  { id: "t1019", client: "Nimbus Logistics", subject: "Portal login SSO failing intermittently", product: "SaaS Development", priority: "High", status: "Open", updated: "2026-08-31" },
  { id: "t1015", client: "Aurora EdTech", subject: "Quiz scoring bug on final module", product: "Skill Guru", priority: "Medium", status: "In Progress", updated: "2026-08-30" },
];

const INVOICES = [
  { id: "INV-2201", client: "Nimbus Logistics", amount: 450000, status: "Overdue", dueDate: "2026-08-13", daysOverdue: 19 },
  { id: "INV-2205", client: "Zenith Financial Services", amount: 90000, status: "Pending", dueDate: "2026-09-05", daysOverdue: 0 },
  { id: "INV-2198", client: "Meridian Retail", amount: 300000, status: "Paid", dueDate: "2026-08-10", daysOverdue: 0 },
  { id: "INV-2207", client: "Quantum Retail Group", amount: 400000, status: "Pending", dueDate: "2026-09-10", daysOverdue: 0 },
  { id: "INV-2190", client: "Vertex Manufacturing", amount: 120000, status: "Paid", dueDate: "2026-08-01", daysOverdue: 0 },
  { id: "INV-2210", client: "Coastal Foods Pvt Ltd", amount: 60000, status: "Overdue", dueDate: "2026-08-20", daysOverdue: 12 },
];

const REVENUE_TREND = [
  { month: "Apr", revenue: 3120000, target: 3000000 },
  { month: "May", revenue: 3340000, target: 3200000 },
  { month: "Jun", revenue: 3580000, target: 3400000 },
  { month: "Jul", revenue: 3910000, target: 3600000 },
  { month: "Aug", revenue: 4260000, target: 3900000 },
  { month: "Sep (MTD)", revenue: 690000, target: 4100000 },
];

const INIT_APPROVALS = [
  { id: "ap1", type: "Production Deployment", title: "Deploy ORGA HRMS v3 to production", requestedBy: "Rahul Verma", risk: "Medium", detail: "Payroll export module, tested in staging, 3 PRs merged.", status: "Pending" },
  { id: "ap2", type: "Discount", title: "15% renewal discount — Quantum Retail Group", requestedBy: "Karthik Iyer", risk: "Medium", detail: "12-month AI Automation renewal, client requested match of competitor quote.", status: "Pending" },
  { id: "ap3", type: "Payment Release", title: "Vendor payment — Cloud hosting, ₹45,000", requestedBy: "Farhan Shaikh", risk: "Low", detail: "Monthly AWS + backup infra invoice, within budget.", status: "Pending" },
  { id: "ap4", type: "Production Deployment", title: "Hotfix — BotBridge NLP intent parser", requestedBy: "Ananya Singh", risk: "High", detail: "Touches 9 live client bots. Rollback plan attached.", status: "Pending" },
  { id: "ap5", type: "Discount", title: "25% annual discount — Aurora EdTech (Skill Guru)", requestedBy: "Divya Menon", risk: "Medium", detail: "Convert free trial to paid annual at discounted early-adopter rate.", status: "Pending" },
];

const ALERTS = [
  { id: "a1", severity: "High", title: "Skill Guru MVP is behind schedule", detail: "30% complete with 8 days to deadline — currently trending Red.", area: "Projects" },
  { id: "a2", severity: "High", title: "BotBridge NLP upgrade blocked 5+ days", detail: "Waiting on client data access from Vertex Manufacturing.", area: "Projects" },
  { id: "a3", severity: "High", title: "Nimbus Logistics invoice overdue 19 days", detail: "₹4,50,000 outstanding — largest receivable at risk.", area: "Finance" },
  { id: "a4", severity: "Medium", title: "Skill Guru campaign ROI declining", detail: "₹28,500 spent for 12 paid conversions from 210 signups — low paid conversion rate.", area: "Marketing" },
  { id: "a5", severity: "Medium", title: "Divya Menon blocked 2+ days", detail: "Waiting on client-provided API keys for Skill Guru quiz engine.", area: "Team" },
  { id: "a6", severity: "Low", title: "SSL certificate renewal due in 6 days", detail: "Client portal (Nimbus Logistics) — schedule renewal to avoid downtime.", area: "Ops" },
];

const INIT_ACTIVITY = [
  { id: "ac1", time: "09:14", actor: "Rahul Verma", action: "moved 'Payroll export module' to Review", area: "Sprint Board" },
  { id: "ac2", time: "09:40", actor: "Director", action: "approved payment release — Cloud hosting ₹45,000", area: "Approvals" },
  { id: "ac3", time: "10:02", actor: "Ananya Singh", action: "flagged BotBridge NLP upgrade as blocked", area: "Projects" },
  { id: "ac4", time: "10:35", actor: "System", action: "new lead captured — Falcon Sports Retail (BotBridge)", area: "CRM" },
  { id: "ac5", time: "11:12", actor: "Karthik Iyer", action: "requested discount approval — Quantum Retail Group", area: "Approvals" },
  { id: "ac6", time: "11:50", actor: "Farhan Shaikh", action: "pushed SUH OptiCore build to staging", area: "Deployments" },
  { id: "ac7", time: "13:20", actor: "Divya Menon", action: "logged blocker — awaiting client API keys", area: "Sprint Board" },
  { id: "ac8", time: "14:05", actor: "System", action: "invoice INV-2210 marked overdue — Coastal Foods", area: "Finance" },
];

const DOCUMENTS = [
  { id: "doc1", folder: "Product Specs", name: "ORGA HRMS v3 — Functional Spec.pdf", owner: "Rahul Verma", updated: "2026-08-28" },
  { id: "doc2", folder: "Product Specs", name: "BotBridge — NLP Architecture.docx", owner: "Ananya Singh", updated: "2026-08-25" },
  { id: "doc3", folder: "Client Contracts", name: "Nimbus Logistics — MSA.pdf", owner: "Director", updated: "2026-04-12" },
  { id: "doc4", folder: "Client Contracts", name: "Quantum Retail Group — SOW.pdf", owner: "Director", updated: "2026-02-10" },
  { id: "doc5", folder: "SOPs", name: "Production Deployment Checklist.pdf", owner: "Farhan Shaikh", updated: "2026-07-15" },
  { id: "doc6", folder: "SOPs", name: "Client Onboarding Playbook.docx", owner: "Priya Nair", updated: "2026-06-01" },
  { id: "doc7", folder: "Marketing Assets", name: "Skill Guru — Waitlist Landing Copy.docx", owner: "Ananya Singh", updated: "2026-07-20" },
  { id: "doc8", folder: "Marketing Assets", name: "Brand Guidelines — SUH TECH.pdf", owner: "Director", updated: "2025-12-01" },
];

const SPRINT_COLUMNS = ["Backlog", "In Progress", "Review", "Blocked", "Done"];
const INIT_TASKS = [
  { id: "tk1", title: "Payroll export module — CSV + Tally sync", product: "ORGA HRMS", assignee: "Rahul Verma", priority: "High", status: "Review", due: "2026-09-04" },
  { id: "tk2", title: "NLP intent parser — multilingual support", product: "BotBridge", assignee: "Ananya Singh", priority: "High", status: "In Progress", due: "2026-09-10" },
  { id: "tk3", title: "OptiCore dashboard — dark mode + charts", product: "SUH OptiCore", assignee: "Karthik Iyer", priority: "Medium", status: "In Progress", due: "2026-09-05" },
  { id: "tk4", title: "Quiz engine — scoring logic rebuild", product: "Skill Guru", assignee: "Divya Menon", priority: "Urgent", status: "Blocked", due: "2026-09-03" },
  { id: "tk5", title: "Release pipeline — prod deploy gate for v3", product: "ORGA HRMS", assignee: "Farhan Shaikh", priority: "High", status: "In Progress", due: "2026-09-06" },
  { id: "tk6", title: "Meridian Retail — checkout flow", product: "Web Development", assignee: "Priya Nair", priority: "Medium", status: "In Progress", due: "2026-09-09" },
  { id: "tk7", title: "Nimbus portal — SSO bug investigation", product: "SaaS Development", assignee: "Rahul Verma", priority: "Urgent", status: "Backlog", due: "2026-09-02" },
  { id: "tk8", title: "BotBridge — fallback response tuning", product: "BotBridge", assignee: "Ananya Singh", priority: "Medium", status: "Backlog", due: "2026-09-12" },
  { id: "tk9", title: "OptiCore — QA regression pass", product: "SUH OptiCore", assignee: "Farhan Shaikh", priority: "Medium", status: "Review", due: "2026-09-04" },
  { id: "tk10", title: "HRMS v3 — leave management edge cases", product: "ORGA HRMS", assignee: "Rahul Verma", priority: "Low", status: "Done", due: "2026-08-30" },
  { id: "tk11", title: "Skill Guru — waitlist → paid conversion flow", product: "Skill Guru", assignee: "Divya Menon", priority: "High", status: "Blocked", due: "2026-09-05" },
  { id: "tk12", title: "OptiCore — client onboarding wizard", product: "SUH OptiCore", assignee: "Karthik Iyer", priority: "Low", status: "Done", due: "2026-08-28" },
];

/* ============================== SMALL UI PRIMITIVES ============================== */
const toneMap = {
  green: { bg: C.greenSoft, fg: C.green },
  amber: { bg: C.amberSoft, fg: C.amber },
  red: { bg: C.redSoft, fg: C.red },
  blue: { bg: C.blueSoft, fg: C.blue },
  gold: { bg: C.goldSoft, fg: C.gold },
  gray: { bg: "#232C40", fg: C.muted },
};
function Badge({ text, tone = "gray", icon: Icon }) {
  const t = toneMap[tone] || toneMap.gray;
  return (
    <span
      className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap"
      style={{ background: t.bg, color: t.fg, fontFamily: FONT_BODY }}
    >
      {Icon && <Icon size={12} />}
      {text}
    </span>
  );
}

function healthTone(h) {
  if (h === "Good" || h === "Green") return "green";
  if (h === "Watch" || h === "Amber") return "amber";
  if (h === "At Risk" || h === "Red") return "red";
  return "gray";
}
function riskTone(r) {
  if (r === "Low") return "green";
  if (r === "Medium") return "amber";
  if (r === "High" || r === "Urgent") return "red";
  return "gray";
}

function ProgressBar({ value, tone = "blue", height = 6 }) {
  const t = toneMap[tone] || toneMap.blue;
  return (
    <div style={{ background: "#232C40", height, borderRadius: 99, width: "100%", overflow: "hidden" }}>
      <div style={{ width: `${value}%`, height: "100%", background: t.fg, borderRadius: 99, transition: "width .4s ease" }} />
    </div>
  );
}

function KpiCard({ label, value, delta, deltaGood = true, icon: Icon, sub, accent = C.gold }) {
  return (
    <div
      className="rounded-lg p-4 flex flex-col gap-2 min-w-0"
      style={{ background: C.panel, border: `1px solid ${C.border}` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: C.muted, fontFamily: FONT_BODY }}>{label}</span>
        {Icon && (
          <div className="rounded-md p-1.5" style={{ background: `${accent}22` }}>
            <Icon size={14} style={{ color: accent }} />
          </div>
        )}
      </div>
      <div className="text-2xl font-semibold" style={{ color: C.text, fontFamily: FONT_DISPLAY }}>{value}</div>
      <div className="flex items-center gap-2">
        {delta && (
          <span className="inline-flex items-center gap-0.5 text-xs font-medium" style={{ color: deltaGood ? C.green : C.red }}>
            {deltaGood ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {delta}
          </span>
        )}
        {sub && <span className="text-xs" style={{ color: C.faint }}>{sub}</span>}
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, right }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
      <div>
        <h2 className="text-lg font-semibold" style={{ color: C.text, fontFamily: FONT_DISPLAY }}>{title}</h2>
        {subtitle && <p className="text-sm mt-0.5" style={{ color: C.muted }}>{subtitle}</p>}
      </div>
      {right && <div className="flex items-center gap-2 flex-wrap">{right}</div>}
    </div>
  );
}

function Panel({ children, className = "", style = {} }) {
  return (
    <div className={`rounded-lg ${className}`} style={{ background: C.panel, border: `1px solid ${C.border}`, ...style }}>
      {children}
    </div>
  );
}

function IconBtn({ icon: Icon, onClick, label, active }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors"
      style={{
        background: active ? `${C.gold}1F` : "transparent",
        color: active ? C.gold : C.muted,
        border: `1px solid ${active ? C.gold + "55" : C.border}`,
      }}
    >
      {Icon && <Icon size={13} />}
      {label}
    </button>
  );
}

function PrimaryBtn({ children, onClick, icon: Icon, disabled, tone = "gold" }) {
  const bg = tone === "gold" ? C.gold : tone === "red" ? C.red : C.blue;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition-opacity"
      style={{ background: disabled ? "#3A3F4B" : bg, color: disabled ? C.faint : "#0D1117", opacity: disabled ? 0.6 : 1, cursor: disabled ? "not-allowed" : "pointer", fontFamily: FONT_BODY }}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick, icon: Icon, tone }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium"
      style={{ background: "transparent", color: tone === "red" ? C.red : C.muted, border: `1px solid ${tone === "red" ? C.red + "55" : C.border}` }}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}

function Input({ ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-md px-3 py-2 text-sm outline-none ${props.className || ""}`}
      style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontFamily: FONT_BODY, ...props.style }}
    />
  );
}
function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full rounded-md px-3 py-2 text-sm outline-none"
      style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontFamily: FONT_BODY }}
    >
      {children}
    </select>
  );
}
function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1 text-xs" style={{ color: C.muted }}>
      {label}
      {children}
    </label>
  );
}

function Modal({ open, onClose, title, children, footer, wide }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "#00000088" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${wide ? "sm:max-w-2xl" : "sm:max-w-md"} rounded-t-xl sm:rounded-xl max-h-[90vh] overflow-y-auto`}
        style={{ background: C.panel2, border: `1px solid ${C.border}` }}
      >
        <div className="flex items-center justify-between px-4 py-3 sticky top-0" style={{ background: C.panel2, borderBottom: `1px solid ${C.border}` }}>
          <h3 className="text-sm font-semibold" style={{ color: C.text, fontFamily: FONT_DISPLAY }}>{title}</h3>
          <button onClick={onClose} style={{ color: C.muted }}><X size={18} /></button>
        </div>
        <div className="p-4">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 px-4 py-3" style={{ borderTop: `1px solid ${C.border}` }}>{footer}</div>}
      </div>
    </div>
  );
}

function EmptyState({ text, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10" style={{ color: C.faint }}>
      {Icon && <Icon size={22} />}
      <span className="text-sm">{text}</span>
    </div>
  );
}

function ApprovalGate({ children }) {
  return (
    <div className="flex items-center gap-1.5 text-xs" style={{ color: C.gold }}>
      <Lock size={11} /> {children}
    </div>
  );
}

/* ============================== NAV ============================== */
const NAV = [
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

/* ============================== LOGIN ============================== */
function Login({ onLogin }) {
  const [email, setEmail] = useState("director@suhtech.top");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("director");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4" style={{ background: C.bg, fontFamily: FONT_BODY }}>
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="rounded-lg p-2" style={{ background: `${C.gold}22` }}>
            <Shield size={20} style={{ color: C.gold }} />
          </div>
          <div className="text-center">
            <div className="text-base font-semibold tracking-tight" style={{ color: C.text, fontFamily: FONT_DISPLAY }}>SUH Director OS</div>
            <div className="text-xs" style={{ color: C.muted }}>SUH TECH PRIVATE LIMITED</div>
          </div>
        </div>
        <Panel className="p-5">
          {step === 1 ? (
            <div className="flex flex-col gap-3">
              <Field label="Work email">
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@suhtech.top" />
              </Field>
              <Field label="Password">
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </Field>
              <Field label="Sign in as">
                <Select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="director">Director — full access</option>
                  <option value="manager">Manager — view only</option>
                </Select>
              </Field>
              <PrimaryBtn onClick={() => setStep(2)}>Continue</PrimaryBtn>
              <p className="text-xs text-center" style={{ color: C.faint }}>Demo build — any credentials proceed to OTP step.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs mb-1" style={{ color: C.muted }}>
                <BadgeCheck size={14} style={{ color: C.green }} /> Two-factor verification sent to {email}
              </div>
              <Field label="Enter 6-digit code">
                <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" maxLength={6} />
              </Field>
              <PrimaryBtn onClick={() => onLogin({ email, role })}>Verify & Sign in</PrimaryBtn>
              <button onClick={() => setStep(1)} className="text-xs" style={{ color: C.muted }}>Back</button>
            </div>
          )}
        </Panel>
        <p className="text-xs text-center mt-4" style={{ color: C.faint }}>Role-based access · Session encrypted · Audit logged</p>
      </div>
    </div>
  );
}

/* ============================== APP ============================== */
export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [leads, setLeads] = useState(INIT_LEADS);
  const [campaigns, setCampaigns] = useState(INIT_CAMPAIGNS);
  const [tickets, setTickets] = useState(INIT_TICKETS);
  const [tasks, setTasks] = useState(INIT_TASKS);
  const [approvals, setApprovals] = useState(INIT_APPROVALS);
  const [activity, setActivity] = useState(INIT_ACTIVITY);
  const [projects, setProjects] = useState(PROJECTS);

  const isDirector = user?.role === "director";

  function pushActivity(actor, action, area) {
    setActivity((a) => [{ id: "ac" + Date.now(), time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), actor, action, area }, ...a]);
  }
  function toast(msg, tone = "green") {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { setSearchOpen(false); setNotifOpen(false); setProfileOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQ.trim()) return [];
    const q = searchQ.toLowerCase();
    const res = [];
    PRODUCTS.filter((p) => p.name.toLowerCase().includes(q)).forEach((p) => res.push({ kind: "Product", label: p.name, tab: "products" }));
    CLIENTS.filter((c) => c.name.toLowerCase().includes(q)).forEach((c) => res.push({ kind: "Client", label: c.name, tab: "clients" }));
    leads.filter((l) => l.name.toLowerCase().includes(q)).forEach((l) => res.push({ kind: "Lead", label: l.name, tab: "crm" }));
    tickets.filter((t) => t.subject.toLowerCase().includes(q) || t.client.toLowerCase().includes(q)).forEach((t) => res.push({ kind: "Ticket", label: `${t.id} — ${t.subject}`, tab: "support" }));
    DEVS.filter((d) => d.name.toLowerCase().includes(q)).forEach((d) => res.push({ kind: "Developer", label: d.name, tab: "team" }));
    return res.slice(0, 8);
  }, [searchQ, leads, tickets]);

  const pendingApprovalsCount = approvals.filter((a) => a.status === "Pending").length;
  const notifItems = [
    ...ALERTS.map((a) => ({ title: a.title, tone: riskTone(a.severity), time: "Today" })),
    ...approvals.filter((a) => a.status === "Pending").map((a) => ({ title: `Approval needed: ${a.title}`, tone: "gold", time: "Pending" })),
  ].slice(0, 8);

  const pageTitle = NAV.find((n) => n.id === tab)?.label || "Dashboard";

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="min-h-screen w-full flex" style={{ background: C.bg, fontFamily: FONT_BODY, color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      {/* ============ DESKTOP SIDEBAR ============ */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0" style={{ borderRight: `1px solid ${C.border}`, background: C.panel }}>
        <div className="flex items-center gap-2 px-4 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div className="rounded-md p-1.5" style={{ background: `${C.gold}22` }}>
            <Shield size={16} style={{ color: C.gold }} />
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight" style={{ fontFamily: FONT_DISPLAY }}>Director OS</div>
            <div className="text-[10px]" style={{ color: C.faint }}>SUH TECH PVT LTD</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-2 px-2 flex flex-col gap-0.5">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = tab === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-left relative"
                style={{ background: active ? `${C.gold}1A` : "transparent", color: active ? C.gold : C.muted, fontWeight: active ? 600 : 500 }}
              >
                <Icon size={15} />
                {n.label}
                {n.id === "approvals" && pendingApprovalsCount > 0 && (
                  <span className="ml-auto text-[10px] rounded-full px-1.5 py-0.5" style={{ background: C.red, color: "#fff" }}>{pendingApprovalsCount}</span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="px-3 py-3" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: C.gold, color: "#0D1117" }}>
              {isDirector ? "DR" : "MG"}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium truncate">{isDirector ? "Director" : "Manager"}</div>
              <div className="text-[10px] truncate" style={{ color: C.faint }}>{user.email}</div>
            </div>
            <button onClick={() => setUser(null)} title="Sign out" style={{ color: C.faint }}><LogOut size={14} /></button>
          </div>
        </div>
      </aside>

      {/* ============ MOBILE DRAWER ============ */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ background: "#00000088" }} onClick={() => setMobileNavOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-64 h-full flex flex-col" style={{ background: C.panel, borderRight: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-2">
                <Shield size={16} style={{ color: C.gold }} />
                <span className="text-sm font-semibold" style={{ fontFamily: FONT_DISPLAY }}>Director OS</span>
              </div>
              <button onClick={() => setMobileNavOpen(false)}><X size={18} style={{ color: C.muted }} /></button>
            </div>
            <nav className="flex-1 overflow-y-auto py-2 px-2 flex flex-col gap-0.5">
              {NAV.map((n) => {
                const Icon = n.icon;
                const active = tab === n.id;
                return (
                  <button key={n.id} onClick={() => { setTab(n.id); setMobileNavOpen(false); }}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm text-left"
                    style={{ background: active ? `${C.gold}1A` : "transparent", color: active ? C.gold : C.muted, fontWeight: active ? 600 : 500 }}>
                    <Icon size={15} />{n.label}
                    {n.id === "approvals" && pendingApprovalsCount > 0 && (
                      <span className="ml-auto text-[10px] rounded-full px-1.5 py-0.5" style={{ background: C.red, color: "#fff" }}>{pendingApprovalsCount}</span>
                    )}
                  </button>
                );
              })}
            </nav>
            <button onClick={() => setUser(null)} className="flex items-center gap-2 px-4 py-3 text-sm" style={{ borderTop: `1px solid ${C.border}`, color: C.muted }}>
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      )}

      {/* ============ MAIN ============ */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 px-3 sm:px-5 py-3" style={{ background: `${C.bg}F2`, backdropFilter: "blur(6px)", borderBottom: `1px solid ${C.border}` }}>
          <button className="md:hidden" onClick={() => setMobileNavOpen(true)}><Menu size={20} style={{ color: C.text }} /></button>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold" style={{ fontFamily: FONT_DISPLAY }}>{pageTitle}</div>
          </div>
          <div className="flex-1 relative max-w-md ml-0 sm:ml-4">
            <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: C.faint }} />
            <input
              value={searchQ}
              onChange={(e) => { setSearchQ(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search products, clients, leads, tickets, team…"
              className="w-full rounded-md pl-8 pr-3 py-2 text-sm outline-none"
              style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.text }}
            />
            {searchOpen && searchQ.trim() && (
              <div className="absolute top-full mt-1 left-0 right-0 rounded-md overflow-hidden z-40" style={{ background: C.panel2, border: `1px solid ${C.border}` }}>
                {searchResults.length ? searchResults.map((r, i) => (
                  <button key={i} onClick={() => { setTab(r.tab); setSearchOpen(false); setSearchQ(""); }}
                    className="w-full text-left px-3 py-2 text-sm flex items-center justify-between" style={{ borderBottom: i < searchResults.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                    <span>{r.label}</span>
                    <Badge text={r.kind} tone="gray" />
                  </button>
                )) : <div className="px-3 py-3 text-sm" style={{ color: C.faint }}>No matches</div>}
              </div>
            )}
          </div>
          <div className="relative">
            <button onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false); }} className="relative p-2 rounded-md" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <Bell size={16} style={{ color: C.text }} />
              {notifItems.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center" style={{ background: C.red, color: "#fff" }}>{notifItems.length}</span>}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-1 w-80 max-w-[85vw] rounded-md overflow-hidden z-40" style={{ background: C.panel2, border: `1px solid ${C.border}` }}>
                <div className="px-3 py-2 text-xs font-semibold" style={{ borderBottom: `1px solid ${C.border}`, color: C.muted }}>Notifications</div>
                <div className="max-h-80 overflow-y-auto">
                  {notifItems.map((n, i) => (
                    <div key={i} className="px-3 py-2.5 flex items-start gap-2 text-sm" style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: toneMap[n.tone]?.fg || C.muted }} />
                      <div className="min-w-0">
                        <div className="truncate">{n.title}</div>
                        <div className="text-[10px]" style={{ color: C.faint }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="relative hidden sm:block">
            <button onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }} className="flex items-center gap-2 px-2 py-1.5 rounded-md" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold" style={{ background: C.gold, color: "#0D1117" }}>{isDirector ? "DR" : "MG"}</div>
              <ChevronDown size={13} style={{ color: C.muted }} />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 rounded-md overflow-hidden z-40" style={{ background: C.panel2, border: `1px solid ${C.border}` }}>
                <div className="px-3 py-2.5 text-sm" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <div className="font-medium">{isDirector ? "Director" : "Manager"}</div>
                  <div className="text-xs" style={{ color: C.faint }}>{user.email}</div>
                </div>
                <button onClick={() => setUser(null)} className="w-full text-left px-3 py-2.5 text-sm flex items-center gap-2" style={{ color: C.red }}>
                  <LogOut size={13} /> Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-5 pb-20 md:pb-5">
          {tab === "dashboard" && <Dashboard projects={projects} leads={leads} campaigns={campaigns} tickets={tickets} approvals={approvals} setTab={setTab} />}
          {tab === "products" && <ProductsView />}
          {tab === "marketing" && <MarketingView campaigns={campaigns} setCampaigns={setCampaigns} leads={leads} isDirector={isDirector} pushActivity={pushActivity} toast={toast} />}
          {tab === "crm" && <CrmView leads={leads} setLeads={setLeads} pushActivity={pushActivity} toast={toast} />}
          {tab === "team" && <TeamView tasks={tasks} />}
          {tab === "sprints" && <SprintsView tasks={tasks} setTasks={setTasks} pushActivity={pushActivity} toast={toast} />}
          {tab === "projects" && <ProjectsView projects={projects} setProjects={setProjects} pushActivity={pushActivity} toast={toast} />}
          {tab === "clients" && <ClientsView />}
          {tab === "support" && <SupportView tickets={tickets} setTickets={setTickets} pushActivity={pushActivity} toast={toast} />}
          {tab === "finance" && <FinanceView isDirector={isDirector} pushActivity={pushActivity} toast={toast} />}
          {tab === "approvals" && <ApprovalsView approvals={approvals} setApprovals={setApprovals} isDirector={isDirector} pushActivity={pushActivity} toast={toast} />}
          {tab === "alerts" && <AlertsView setTab={setTab} />}
          {tab === "activity" && <ActivityView activity={activity} />}
          {tab === "documents" && <DocumentsView />}
          {tab === "assistant" && <AssistantView leads={leads} campaigns={campaigns} projects={projects} approvals={approvals} tickets={tickets} setTab={setTab} />}
        </main>
      </div>

      {/* ============ MOBILE BOTTOM NAV ============ */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden flex items-stretch z-30" style={{ background: C.panel, borderTop: `1px solid ${C.border}` }}>
        {[NAV[0], NAV[3], NAV[5], NAV[10], NAV[14]].map((n) => {
          const Icon = n.icon;
          const active = tab === n.id;
          return (
            <button key={n.id} onClick={() => setTab(n.id)} className="flex-1 flex flex-col items-center gap-0.5 py-2 relative">
              <Icon size={18} style={{ color: active ? C.gold : C.faint }} />
              <span className="text-[9px]" style={{ color: active ? C.gold : C.faint }}>{n.label.split(" ")[0]}</span>
              {n.id === "approvals" && pendingApprovalsCount > 0 && <span className="absolute top-1 right-6 w-1.5 h-1.5 rounded-full" style={{ background: C.red }} />}
            </button>
          );
        })}
      </nav>

      {/* Toasts */}
      <div className="fixed bottom-16 md:bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="px-3 py-2 rounded-md text-sm shadow-lg" style={{ background: C.panel2, border: `1px solid ${toneMap[t.tone]?.fg || C.border}`, color: C.text }}>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================== DASHBOARD ============================== */
function Dashboard({ projects, leads, campaigns, tickets, approvals, setTab }) {
  const totalMRR = PRODUCTS.reduce((s, p) => s + p.mrr, 0);
  const totalPipeline = leads.filter((l) => !["Won", "Lost"].includes(l.stage)).reduce((s, l) => s + l.value, 0);
  const wonThisPeriod = leads.filter((l) => l.stage === "Won").reduce((s, l) => s + l.value, 0);
  const atRiskProjects = projects.filter((p) => p.health === "Red" || p.health === "Amber").length;
  const totalLeadsGen = campaigns.reduce((s, c) => s + c.leads, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
  const openTickets = tickets.filter((t) => t.status !== "Resolved").length;
  const pendingApprovals = approvals.filter((a) => a.status === "Pending").length;
  const avgWorkload = Math.round(DEVS.reduce((s, d) => s + d.workload, 0) / DEVS.length);

  const productSplit = PRODUCTS.map((p) => ({ name: p.name, value: p.mrr }));
  const pieColors = [C.gold, C.blue, C.green, C.amber, C.purple, C.red, "#5CC8D7", "#B4C46A"];

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader title="Executive Overview" subtitle="SUH TECH PRIVATE LIMITED — live company snapshot" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Monthly Recurring + Service Revenue" value={inr(totalMRR)} delta="+8.4% MoM" icon={DollarSign} accent={C.gold} />
        <KpiCard label="Active Pipeline Value" value={inr(totalPipeline)} delta={`${leads.filter((l) => !["Won", "Lost"].includes(l.stage)).length} open leads`} deltaGood icon={Target} accent={C.blue} sub="" />
        <KpiCard label="Projects At Risk" value={atRiskProjects} delta={atRiskProjects > 1 ? "Needs attention" : "Stable"} deltaGood={atRiskProjects <= 1} icon={AlertTriangle} accent={C.red} />
        <KpiCard label="Pending Director Approvals" value={pendingApprovals} icon={CheckSquare} accent={C.amber} sub="awaiting sign-off" />
        <KpiCard label="Marketing Leads Generated" value={totalLeadsGen} delta={`${totalConversions} conversions`} deltaGood icon={Megaphone} accent={C.purple} />
        <KpiCard label="Open Support Tickets" value={openTickets} icon={LifeBuoy} accent={C.blue} sub={`${tickets.filter((t) => t.priority === "Urgent").length} urgent`} />
        <KpiCard label="Avg. Developer Workload" value={`${avgWorkload}%`} icon={Code2} accent={C.green} sub={`${DEVS.filter((d) => d.status === "Blocked").length} blocked`} />
        <KpiCard label="Won Deals (Period)" value={inr(wonThisPeriod)} icon={TrendingUp} accent={C.green} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel className="p-4 lg:col-span-2">
          <div className="text-sm font-semibold mb-3" style={{ fontFamily: FONT_DISPLAY }}>Revenue vs Target</div>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <AreaChart data={REVENUE_TREND}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.gold} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={C.borderSoft} vertical={false} />
                <XAxis dataKey="month" stroke={C.faint} fontSize={11} />
                <YAxis stroke={C.faint} fontSize={11} tickFormatter={(v) => inr(v)} width={55} />
                <RTooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} formatter={(v) => inrFull(v)} />
                <Area type="monotone" dataKey="revenue" stroke={C.gold} fill="url(#rev)" strokeWidth={2} />
                <Line type="monotone" dataKey="target" stroke={C.muted} strokeDasharray="4 4" dot={false} strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel className="p-4">
          <div className="text-sm font-semibold mb-3" style={{ fontFamily: FONT_DISPLAY }}>Revenue Mix by Product</div>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={productSplit} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                  {productSplit.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                </Pie>
                <RTooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} formatter={(v) => inrFull(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold" style={{ fontFamily: FONT_DISPLAY }}>Project Health</div>
            <button onClick={() => setTab("projects")} className="text-xs flex items-center gap-1" style={{ color: C.gold }}>View all <ChevronRight size={12} /></button>
          </div>
          <div className="flex flex-col gap-3">
            {projects.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-40 shrink-0 text-sm truncate">{p.name}</div>
                <div className="flex-1"><ProgressBar value={p.progress} tone={healthTone(p.health)} /></div>
                <div className="w-10 text-xs text-right shrink-0" style={{ color: C.muted }}>{p.progress}%</div>
                <Badge text={p.health} tone={healthTone(p.health)} />
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold" style={{ fontFamily: FONT_DISPLAY }}>Team Workload</div>
            <button onClick={() => setTab("team")} className="text-xs flex items-center gap-1" style={{ color: C.gold }}>View all <ChevronRight size={12} /></button>
          </div>
          <div className="flex flex-col gap-3">
            {DEVS.map((d) => (
              <div key={d.id} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0" style={{ background: d.avatarColor + "33", color: d.avatarColor }}>
                  {d.name.split(" ").map((x) => x[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs truncate">{d.name}</div>
                  <ProgressBar value={d.workload} tone={d.workload > 85 ? "red" : d.workload > 65 ? "amber" : "green"} height={4} />
                </div>
                <span className="text-xs w-8 text-right" style={{ color: C.muted }}>{d.workload}%</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel className="p-4">
          <div className="text-sm font-semibold mb-3" style={{ fontFamily: FONT_DISPLAY }}>Campaign Performance</div>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={campaigns} margin={{ left: -20 }}>
                <CartesianGrid stroke={C.borderSoft} vertical={false} />
                <XAxis dataKey="name" stroke={C.faint} fontSize={9} tickFormatter={(v) => v.split(" ")[0]} />
                <YAxis stroke={C.faint} fontSize={11} />
                <RTooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
                <Bar dataKey="leads" fill={C.blue} radius={[3, 3, 0, 0]} name="Leads" />
                <Bar dataKey="conversions" fill={C.green} radius={[3, 3, 0, 0]} name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold" style={{ fontFamily: FONT_DISPLAY }}>Pending Approvals</div>
            <button onClick={() => setTab("approvals")} className="text-xs flex items-center gap-1" style={{ color: C.gold }}>Review <ChevronRight size={12} /></button>
          </div>
          <div className="flex flex-col gap-2">
            {approvals.filter((a) => a.status === "Pending").slice(0, 4).map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-2 text-sm py-1.5" style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
                <div className="min-w-0">
                  <div className="truncate">{a.title}</div>
                  <div className="text-[10px]" style={{ color: C.faint }}>{a.type} · requested by {a.requestedBy}</div>
                </div>
                <Badge text={a.risk} tone={riskTone(a.risk)} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ============================== PRODUCTS ============================== */
function ProductsView() {
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const types = ["All", "SaaS Product", "Service Line"];
  const filtered = PRODUCTS.filter((p) => (filter === "All" || p.type === filter) && p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Product Portfolio"
        subtitle="SaaS products and service lines under SUH TECH"
        right={
          <>
            <Input placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 200 }} />
            {types.map((t) => <IconBtn key={t} label={t} active={filter === t} onClick={() => setFilter(t)} />)}
          </>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <Panel key={p.id} className="p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold" style={{ fontFamily: FONT_DISPLAY }}>{p.name}</div>
                <div className="text-xs" style={{ color: C.muted }}>{p.type}</div>
              </div>
              <Badge text={p.health} tone={healthTone(p.health)} />
            </div>
            <p className="text-xs" style={{ color: C.muted }}>{p.tagline}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div style={{ color: C.faint }}>Revenue / mo</div>
                <div className="font-semibold" style={{ color: C.gold }}>{inr(p.mrr)}</div>
              </div>
              <div>
                <div style={{ color: C.faint }}>Clients</div>
                <div className="font-semibold">{p.clients}</div>
              </div>
              <div>
                <div style={{ color: C.faint }}>Stage</div>
                <div>{p.stage}</div>
              </div>
              <div>
                <div style={{ color: C.faint }}>Status</div>
                <div>{p.status}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs pt-2" style={{ borderTop: `1px solid ${C.borderSoft}` }}>
              <span style={{ color: C.faint }}>Marketing: {p.marketingStage}</span>
              <span style={{ color: C.faint }}>Owner: {p.owner.split(" ")[0]}</span>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

/* ============================== MARKETING ============================== */
function MarketingView({ campaigns, setCampaigns, leads, isDirector, pushActivity, toast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", product: PRODUCTS[0].name, channel: "", budget: "", status: "Active" });

  function addCampaign() {
    if (!form.name.trim()) return;
    const c = { id: "cm" + Date.now(), name: form.name, product: form.product, channel: form.channel || "Multi-channel", budget: Number(form.budget) || 0, spend: 0, leads: 0, conversions: 0, status: form.status, start: new Date().toISOString().slice(0, 10), end: "" };
    setCampaigns((cs) => [c, ...cs]);
    pushActivity("Director", `created campaign '${c.name}'`, "Marketing");
    toast("Campaign created");
    setShowAdd(false);
    setForm({ name: "", product: PRODUCTS[0].name, channel: "", budget: "", status: "Active" });
  }
  function removeCampaign(id, name) {
    setCampaigns((cs) => cs.filter((c) => c.id !== id));
    pushActivity("Director", `archived campaign '${name}'`, "Marketing");
    toast("Campaign archived", "amber");
  }

  const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalLeads = campaigns.reduce((s, c) => s + c.leads, 0);
  const totalConv = campaigns.reduce((s, c) => s + c.conversions, 0);

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Marketing Campaigns"
        subtitle="Plan, track, and measure campaigns across every product"
        right={<PrimaryBtn icon={Plus} onClick={() => setShowAdd(true)}>New Campaign</PrimaryBtn>}
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Total Budget" value={inr(totalBudget)} icon={Wallet} accent={C.gold} />
        <KpiCard label="Total Spend" value={inr(totalSpend)} icon={Activity} accent={C.blue} sub={`${Math.round((totalSpend / totalBudget) * 100)}% utilized`} />
        <KpiCard label="Leads Generated" value={totalLeads} icon={Users} accent={C.purple} />
        <KpiCard label="Conversions" value={totalConv} icon={Target} accent={C.green} sub={`${((totalConv / totalLeads) * 100).toFixed(1)}% rate`} />
      </div>

      <Panel className="p-0 overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}`, color: C.faint }}>
              {["Campaign", "Product", "Channel", "Budget / Spend", "Leads", "Conv.", "ROI", "Status", ""].map((h) => (
                <th key={h} className="text-left font-medium px-3 py-2.5 text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => {
              const roi = c.spend > 0 ? (((c.conversions * (leads.find((l) => l.product === c.product)?.value || 200000)) - c.spend) / c.spend) : 0;
              const utilization = Math.min(100, Math.round((c.spend / c.budget) * 100));
              return (
                <tr key={c.id} style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
                  <td className="px-3 py-2.5 font-medium">{c.name}</td>
                  <td className="px-3 py-2.5" style={{ color: C.muted }}>{c.product}</td>
                  <td className="px-3 py-2.5" style={{ color: C.muted }}>{c.channel}</td>
                  <td className="px-3 py-2.5 w-32">
                    <div className="text-xs mb-1">{inr(c.spend)} / {inr(c.budget)}</div>
                    <ProgressBar value={utilization} tone={utilization > 90 ? "red" : "blue"} height={4} />
                  </td>
                  <td className="px-3 py-2.5">{c.leads}</td>
                  <td className="px-3 py-2.5">{c.conversions}</td>
                  <td className="px-3 py-2.5">
                    <Badge text={roi > 2 ? "Strong" : roi > 0 ? "Positive" : "Low"} tone={roi > 2 ? "green" : roi > 0 ? "amber" : "red"} />
                  </td>
                  <td className="px-3 py-2.5"><Badge text={c.status} tone={c.status === "Active" ? "blue" : "gray"} /></td>
                  <td className="px-3 py-2.5">
                    {isDirector ? (
                      <button onClick={() => removeCampaign(c.id, c.name)} style={{ color: C.faint }}><Trash2 size={14} /></button>
                    ) : <Lock size={13} style={{ color: C.faint }} />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New Marketing Campaign"
        footer={<><GhostBtn onClick={() => setShowAdd(false)}>Cancel</GhostBtn><PrimaryBtn onClick={addCampaign}>Create Campaign</PrimaryBtn></>}>
        <div className="flex flex-col gap-3">
          <Field label="Campaign name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. ORGA HRMS — Diwali Offer Push" /></Field>
          <Field label="Product"><Select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}>{PRODUCTS.map((p) => <option key={p.id}>{p.name}</option>)}</Select></Field>
          <Field label="Channel"><Input value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })} placeholder="e.g. LinkedIn, Google Ads, Referral" /></Field>
          <Field label="Budget (₹)"><Input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="50000" /></Field>
        </div>
      </Modal>
    </div>
  );
}

/* ============================== CRM ============================== */
function CrmView({ leads, setLeads, pushActivity, toast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ name: "", product: PRODUCTS[0].name, value: "", source: "Website", owner: DEVS[0].name });

  function addLead() {
    if (!form.name.trim()) return;
    const l = { id: "l" + Date.now(), name: form.name, product: form.product, value: Number(form.value) || 0, source: form.source, stage: "New", owner: form.owner, updated: new Date().toISOString().slice(0, 10) };
    setLeads((ls) => [l, ...ls]);
    pushActivity("Director", `added new lead '${l.name}'`, "CRM");
    toast("Lead added");
    setShowAdd(false);
    setForm({ name: "", product: PRODUCTS[0].name, value: "", source: "Website", owner: DEVS[0].name });
  }
  function moveStage(id, stage) {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, stage, updated: new Date().toISOString().slice(0, 10) } : l)));
    toast(`Lead moved to ${stage}`, "blue");
  }
  function removeLead(id, name) {
    setLeads((ls) => ls.filter((l) => l.id !== id));
    pushActivity("Director", `removed lead '${name}'`, "CRM");
    toast("Lead removed", "amber");
  }

  const filtered = leads.filter((l) => l.name.toLowerCase().includes(q.toLowerCase()));
  const byStage = LEAD_STAGES.map((s) => ({ stage: s, items: filtered.filter((l) => l.stage === s) }));
  const pipelineValue = leads.filter((l) => !["Won", "Lost"].includes(l.stage)).reduce((s, l) => s + l.value, 0);
  const wonValue = leads.filter((l) => l.stage === "Won").reduce((s, l) => s + l.value, 0);
  const funnelData = LEAD_STAGES.map((s) => ({ stage: s, count: leads.filter((l) => l.stage === s).length }));

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="CRM & Lead Pipeline"
        subtitle="Every lead across every product, one funnel"
        right={<><Input placeholder="Search leads…" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 180 }} /><PrimaryBtn icon={Plus} onClick={() => setShowAdd(true)}>Add Lead</PrimaryBtn></>}
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Open Pipeline Value" value={inr(pipelineValue)} icon={Target} accent={C.blue} />
        <KpiCard label="Won This Period" value={inr(wonValue)} icon={TrendingUp} accent={C.green} />
        <KpiCard label="Total Leads" value={leads.length} icon={Users} accent={C.purple} />
        <KpiCard label="Win Rate" value={`${Math.round((leads.filter((l) => l.stage === "Won").length / leads.filter((l) => ["Won", "Lost"].includes(l.stage)).length) * 100) || 0}%`} icon={PercentCircle} accent={C.gold} />
      </div>

      <Panel className="p-4">
        <div className="text-sm font-semibold mb-3" style={{ fontFamily: FONT_DISPLAY }}>Pipeline Funnel</div>
        <div style={{ width: "100%", height: 200 }}>
          <ResponsiveContainer>
            <BarChart data={funnelData} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid stroke={C.borderSoft} horizontal={false} />
              <XAxis type="number" stroke={C.faint} fontSize={11} />
              <YAxis type="category" dataKey="stage" stroke={C.faint} fontSize={11} width={80} />
              <RTooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <Bar dataKey="count" fill={C.gold} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="overflow-x-auto -mx-1 px-1">
        <div className="flex gap-3 min-w-[900px] lg:min-w-0">
          {byStage.map((col) => (
            <div key={col.stage} className="flex-1 min-w-[220px]">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-semibold" style={{ color: C.muted }}>{col.stage}</span>
                <span className="text-xs" style={{ color: C.faint }}>{col.items.length}</span>
              </div>
              <div className="flex flex-col gap-2">
                {col.items.map((l) => (
                  <Panel key={l.id} className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-medium truncate">{l.name}</div>
                      <button onClick={() => removeLead(l.id, l.name)} style={{ color: C.faint }}><X size={12} /></button>
                    </div>
                    <div className="text-xs mt-1" style={{ color: C.muted }}>{l.product}</div>
                    <div className="text-xs font-semibold mt-1" style={{ color: C.gold }}>{inr(l.value)}</div>
                    <div className="flex items-center justify-between mt-2">
                      <Badge text={l.source} tone="gray" />
                      <span className="text-[10px]" style={{ color: C.faint }}>{l.owner.split(" ")[0]}</span>
                    </div>
                    <select value={l.stage} onChange={(e) => moveStage(l.id, e.target.value)} className="w-full mt-2 rounded px-2 py-1 text-xs" style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text }}>
                      {LEAD_STAGES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </Panel>
                ))}
                {col.items.length === 0 && <div className="text-xs text-center py-4" style={{ color: C.faint }}>No leads</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Lead"
        footer={<><GhostBtn onClick={() => setShowAdd(false)}>Cancel</GhostBtn><PrimaryBtn onClick={addLead}>Add Lead</PrimaryBtn></>}>
        <div className="flex flex-col gap-3">
          <Field label="Lead / company name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Orion Retail Pvt Ltd" /></Field>
          <Field label="Interested product"><Select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}>{PRODUCTS.map((p) => <option key={p.id}>{p.name}</option>)}</Select></Field>
          <Field label="Estimated value (₹)"><Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="250000" /></Field>
          <Field label="Source">
            <Select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
              {["Website", "LinkedIn", "Referral", "Cold Outreach", "Event", "Google Ads", "Webinar"].map((s) => <option key={s}>{s}</option>)}
            </Select>
          </Field>
          <Field label="Owner"><Select value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })}>{DEVS.map((d) => <option key={d.id}>{d.name}</option>)}</Select></Field>
        </div>
      </Modal>
    </div>
  );
}

/* ============================== TEAM ============================== */
function TeamView({ tasks }) {
  const statusTone = { Available: "green", Busy: "amber", Blocked: "red", "On Leave": "gray" };
  const statusIcon = { Available: CircleCheck, Busy: CircleDot, Blocked: CircleAlert, "On Leave": Coffee };

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Developer Team" subtitle="Who's working on what, right now" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Team Size" value={DEVS.length} icon={Users} accent={C.blue} />
        <KpiCard label="Available" value={DEVS.filter((d) => d.status === "Available").length} icon={CircleCheck} accent={C.green} />
        <KpiCard label="Blocked" value={DEVS.filter((d) => d.status === "Blocked").length} icon={CircleAlert} accent={C.red} />
        <KpiCard label="On Leave Today" value={DEVS.filter((d) => d.status === "On Leave").length} icon={Coffee} accent={C.amber} />
      </div>

      <Panel className="p-4">
        <div className="text-sm font-semibold mb-3" style={{ fontFamily: FONT_DISPLAY }}>Workload Distribution</div>
        <div style={{ width: "100%", height: 200 }}>
          <ResponsiveContainer>
            <BarChart data={DEVS} margin={{ left: -20 }}>
              <CartesianGrid stroke={C.borderSoft} vertical={false} />
              <XAxis dataKey="name" stroke={C.faint} fontSize={9} tickFormatter={(v) => v.split(" ")[0]} />
              <YAxis stroke={C.faint} fontSize={11} unit="%" />
              <RTooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <Bar dataKey="workload" radius={[4, 4, 0, 0]}>
                {DEVS.map((d, i) => <Cell key={i} fill={d.workload > 85 ? C.red : d.workload > 65 ? C.amber : C.green} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {DEVS.map((d) => {
          const Icon = statusIcon[d.status];
          const devTasks = tasks.filter((t) => t.assignee === d.name);
          return (
            <Panel key={d.id} className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0" style={{ background: d.avatarColor + "33", color: d.avatarColor }}>
                  {d.name.split(" ").map((x) => x[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold truncate">{d.name}</div>
                  <div className="text-xs truncate" style={{ color: C.muted }}>{d.role}</div>
                </div>
                <Badge text={d.status} tone={statusTone[d.status]} icon={Icon} />
              </div>
              <div className="text-xs flex items-center gap-1.5" style={{ color: C.muted }}><MapPin size={11} />{d.location}</div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span style={{ color: C.faint }}>Workload</span><span>{d.workload}%</span>
                </div>
                <ProgressBar value={d.workload} tone={d.workload > 85 ? "red" : d.workload > 65 ? "amber" : "green"} />
              </div>
              <div className="rounded-md p-2 text-xs" style={{ background: C.panel2, border: `1px solid ${C.borderSoft}` }}>
                <div style={{ color: C.faint }}>Current focus</div>
                <div className="mt-0.5">{d.task}</div>
              </div>
              {d.blockers > 0 && (
                <div className="flex items-center gap-1.5 text-xs" style={{ color: C.red }}>
                  <AlertTriangle size={12} /> {d.blockers} active blocker{d.blockers > 1 ? "s" : ""}
                </div>
              )}
              <div className="flex items-center justify-between text-xs pt-2" style={{ borderTop: `1px solid ${C.borderSoft}` }}>
                <span style={{ color: C.faint }}>{devTasks.length} tasks assigned</span>
                <span style={{ color: C.faint }}>Attendance: {d.attendance}</span>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

/* ============================== SPRINT BOARD ============================== */
function SprintsView({ tasks, setTasks, pushActivity, toast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filterDev, setFilterDev] = useState("All");
  const [form, setForm] = useState({ title: "", product: PRODUCTS[0].name, assignee: DEVS[0].name, priority: "Medium", due: "" });

  function addTask() {
    if (!form.title.trim()) return;
    const t = { id: "tk" + Date.now(), title: form.title, product: form.product, assignee: form.assignee, priority: form.priority, status: "Backlog", due: form.due || "2026-09-15" };
    setTasks((ts) => [t, ...ts]);
    pushActivity("Director", `assigned task '${t.title}' to ${t.assignee}`, "Sprint Board");
    toast("Task assigned");
    setShowAdd(false);
    setForm({ title: "", product: PRODUCTS[0].name, assignee: DEVS[0].name, priority: "Medium", due: "" });
  }
  function moveTask(id, status) {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, status } : t)));
  }
  function removeTask(id) {
    setTasks((ts) => ts.filter((t) => t.id !== id));
    toast("Task removed", "amber");
  }

  const filtered = filterDev === "All" ? tasks : tasks.filter((t) => t.assignee === filterDev);
  const cols = SPRINT_COLUMNS.map((s) => ({ status: s, items: filtered.filter((t) => t.status === s) }));

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Sprint Board"
        subtitle="Assign tasks, track progress and blockers across every developer"
        right={
          <>
            <Select value={filterDev} onChange={(e) => setFilterDev(e.target.value)} style={{ width: 170 }}>
              <option value="All">All developers</option>
              {DEVS.map((d) => <option key={d.id}>{d.name}</option>)}
            </Select>
            <PrimaryBtn icon={Plus} onClick={() => setShowAdd(true)}>Assign Task</PrimaryBtn>
          </>
        }
      />
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="flex gap-3 min-w-[1100px] lg:min-w-0">
          {cols.map((col) => (
            <div key={col.status} className="flex-1 min-w-[210px]">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-semibold" style={{ color: col.status === "Blocked" ? C.red : C.muted }}>{col.status}</span>
                <span className="text-xs" style={{ color: C.faint }}>{col.items.length}</span>
              </div>
              <div className="flex flex-col gap-2">
                {col.items.map((t) => (
                  <Panel key={t.id} className="p-3" style={{ borderLeft: `3px solid ${toneMap[riskTone(t.priority)].fg}` }}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-medium leading-snug">{t.title}</div>
                      <button onClick={() => removeTask(t.id)} style={{ color: C.faint }}><X size={12} /></button>
                    </div>
                    <div className="text-xs mt-1" style={{ color: C.muted }}>{t.product}</div>
                    <div className="flex items-center justify-between mt-2">
                      <Badge text={t.priority} tone={riskTone(t.priority)} />
                      <span className="text-[10px] flex items-center gap-1" style={{ color: C.faint }}><CalendarClock size={11} />{t.due?.slice(5)}</span>
                    </div>
                    <div className="text-[10px] mt-1.5" style={{ color: C.faint }}>{t.assignee}</div>
                    <select value={t.status} onChange={(e) => moveTask(t.id, e.target.value)} className="w-full mt-2 rounded px-2 py-1 text-xs" style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text }}>
                      {SPRINT_COLUMNS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </Panel>
                ))}
                {col.items.length === 0 && <div className="text-xs text-center py-4" style={{ color: C.faint }}>Empty</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Assign New Task"
        footer={<><GhostBtn onClick={() => setShowAdd(false)}>Cancel</GhostBtn><PrimaryBtn onClick={addTask}>Assign</PrimaryBtn></>}>
        <div className="flex flex-col gap-3">
          <Field label="Task title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Fix invoice PDF export bug" /></Field>
          <Field label="Product / project"><Select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}>{PRODUCTS.map((p) => <option key={p.id}>{p.name}</option>)}</Select></Field>
          <Field label="Assign to"><Select value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })}>{DEVS.map((d) => <option key={d.id}>{d.name}</option>)}</Select></Field>
          <Field label="Priority"><Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>{["Low", "Medium", "High", "Urgent"].map((p) => <option key={p}>{p}</option>)}</Select></Field>
          <Field label="Due date"><Input type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  );
}

/* ============================== PROJECTS ============================== */
function ProjectsView({ projects, setProjects, pushActivity, toast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", product: PRODUCTS[0].name, owner: DEVS[0].name, deadline: "" });

  function addProject() {
    if (!form.name.trim()) return;
    const p = { id: "pr" + Date.now(), name: form.name, product: form.product, owner: form.owner, health: "Green", progress: 0, deadline: form.deadline || "2026-10-01", deployStatus: "Dev", codeStatus: "Not started", risk: "Low" };
    setProjects((ps) => [p, ...ps]);
    pushActivity("Director", `created project '${p.name}'`, "Projects");
    toast("Project created");
    setShowAdd(false);
    setForm({ name: "", product: PRODUCTS[0].name, owner: DEVS[0].name, deadline: "" });
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Project Management" subtitle="Health, progress, deployment and code status for every active project"
        right={<PrimaryBtn icon={Plus} onClick={() => setShowAdd(true)}>New Project</PrimaryBtn>} />
      <div className="grid grid-cols-1 gap-3">
        {projects.map((p) => (
          <Panel key={p.id} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <div className="text-sm font-semibold" style={{ fontFamily: FONT_DISPLAY }}>{p.name}</div>
                <div className="text-xs" style={{ color: C.muted }}>{p.product} · Owner: {p.owner}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge text={`Risk: ${p.risk}`} tone={riskTone(p.risk)} />
                <Badge text={p.health} tone={healthTone(p.health)} />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
              <div>
                <div style={{ color: C.faint }}>Progress</div>
                <div className="mt-1"><ProgressBar value={p.progress} tone={healthTone(p.health)} /></div>
                <div className="mt-1">{p.progress}%</div>
              </div>
              <div><div style={{ color: C.faint }}>Deadline</div><div className="mt-1 flex items-center gap-1"><CalendarClock size={12} />{p.deadline}</div></div>
              <div><div style={{ color: C.faint }}>Deploy Status</div><div className="mt-1">{p.deployStatus}</div></div>
              <div><div style={{ color: C.faint }}>Code Status</div><div className="mt-1">{p.codeStatus}</div></div>
            </div>
          </Panel>
        ))}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New Project"
        footer={<><GhostBtn onClick={() => setShowAdd(false)}>Cancel</GhostBtn><PrimaryBtn onClick={addProject}>Create</PrimaryBtn></>}>
        <div className="flex flex-col gap-3">
          <Field label="Project name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. ORGA HRMS — Mobile App v1" /></Field>
          <Field label="Product"><Select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}>{PRODUCTS.map((p) => <option key={p.id}>{p.name}</option>)}</Select></Field>
          <Field label="Owner"><Select value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })}>{DEVS.map((d) => <option key={d.id}>{d.name}</option>)}</Select></Field>
          <Field label="Deadline"><Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  );
}

/* ============================== CLIENTS ============================== */
function ClientsView() {
  const [q, setQ] = useState("");
  const filtered = CLIENTS.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  const statusTone = { Active: "green", Completed: "blue", Trial: "amber" };
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Client Management" subtitle="Every client relationship in one place"
        right={<Input placeholder="Search clients…" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 200 }} />} />
      <Panel className="p-0 overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead><tr style={{ borderBottom: `1px solid ${C.border}`, color: C.faint }}>
            {["Client", "Product", "Contract Value", "Status", "Contact", "Since"].map((h) => <th key={h} className="text-left font-medium px-3 py-2.5 text-xs">{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
                <td className="px-3 py-2.5 font-medium">{c.name}</td>
                <td className="px-3 py-2.5" style={{ color: C.muted }}>{c.product}</td>
                <td className="px-3 py-2.5">{c.value > 0 ? inrFull(c.value) : "—"}</td>
                <td className="px-3 py-2.5"><Badge text={c.status} tone={statusTone[c.status]} /></td>
                <td className="px-3 py-2.5" style={{ color: C.muted }}>{c.contact}</td>
                <td className="px-3 py-2.5" style={{ color: C.faint }}>{c.since}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

/* ============================== SUPPORT ============================== */
function SupportView({ tickets, setTickets, pushActivity, toast }) {
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Open", "In Progress", "Resolved"];
  function updateStatus(id, status) {
    setTickets((ts) => ts.map((t) => (t.id === id ? { ...t, status, updated: new Date().toISOString().slice(0, 10) } : t)));
    pushActivity("Director", `updated ticket ${id} to ${status}`, "Support");
    toast("Ticket updated");
  }
  const filtered = filter === "All" ? tickets : tickets.filter((t) => t.status === filter);
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Support & Tickets" subtitle="Client-reported issues across all products"
        right={statuses.map((s) => <IconBtn key={s} label={s} active={filter === s} onClick={() => setFilter(s)} />)} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Open" value={tickets.filter((t) => t.status === "Open").length} icon={CircleAlert} accent={C.red} />
        <KpiCard label="In Progress" value={tickets.filter((t) => t.status === "In Progress").length} icon={CircleDot} accent={C.amber} />
        <KpiCard label="Resolved" value={tickets.filter((t) => t.status === "Resolved").length} icon={CircleCheck} accent={C.green} />
        <KpiCard label="Urgent" value={tickets.filter((t) => t.priority === "Urgent").length} icon={AlertTriangle} accent={C.red} />
      </div>
      <Panel className="p-0 overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead><tr style={{ borderBottom: `1px solid ${C.border}`, color: C.faint }}>
            {["ID", "Client", "Subject", "Product", "Priority", "Status", "Updated"].map((h) => <th key={h} className="text-left font-medium px-3 py-2.5 text-xs">{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
                <td className="px-3 py-2.5" style={{ fontFamily: FONT_MONO, color: C.faint }}>{t.id}</td>
                <td className="px-3 py-2.5 font-medium">{t.client}</td>
                <td className="px-3 py-2.5" style={{ color: C.muted }}>{t.subject}</td>
                <td className="px-3 py-2.5" style={{ color: C.muted }}>{t.product}</td>
                <td className="px-3 py-2.5"><Badge text={t.priority} tone={riskTone(t.priority)} /></td>
                <td className="px-3 py-2.5">
                  <select value={t.status} onChange={(e) => updateStatus(t.id, e.target.value)} className="rounded px-2 py-1 text-xs" style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text }}>
                    {["Open", "In Progress", "Resolved"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2.5" style={{ color: C.faint }}>{t.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

/* ============================== FINANCE ============================== */
function FinanceView({ isDirector, pushActivity, toast }) {
  const [gate, setGate] = useState(null);
  const totalOutstanding = INVOICES.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);
  const overdue = INVOICES.filter((i) => i.status === "Overdue");
  const paid = INVOICES.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const statusTone = { Paid: "green", Pending: "blue", Overdue: "red" };

  function releasePayment(inv) {
    pushActivity("Director", `approved payment reminder escalation for ${inv.id}`, "Finance");
    toast(`Approval recorded for ${inv.id}`, "green");
    setGate(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Finance & Receivables" subtitle="Revenue, invoices and outstanding payments" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Total Outstanding" value={inr(totalOutstanding)} icon={Wallet} accent={C.amber} />
        <KpiCard label="Overdue Receivables" value={inr(overdue.reduce((s, i) => s + i.amount, 0))} icon={AlertTriangle} accent={C.red} sub={`${overdue.length} invoices`} />
        <KpiCard label="Collected (period)" value={inr(paid)} icon={CircleCheck} accent={C.green} />
        <KpiCard label="Avg. Days to Pay" value="14 days" icon={Clock} accent={C.blue} />
      </div>
      <Panel className="p-4">
        <div className="text-sm font-semibold mb-3" style={{ fontFamily: FONT_DISPLAY }}>Revenue Trend</div>
        <div style={{ width: "100%", height: 200 }}>
          <ResponsiveContainer>
            <LineChart data={REVENUE_TREND}>
              <CartesianGrid stroke={C.borderSoft} vertical={false} />
              <XAxis dataKey="month" stroke={C.faint} fontSize={11} />
              <YAxis stroke={C.faint} fontSize={11} tickFormatter={(v) => inr(v)} width={55} />
              <RTooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} formatter={(v) => inrFull(v)} />
              <Line type="monotone" dataKey="revenue" stroke={C.gold} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <Panel className="p-0 overflow-x-auto">
        <table className="w-full text-sm min-w-[680px]">
          <thead><tr style={{ borderBottom: `1px solid ${C.border}`, color: C.faint }}>
            {["Invoice", "Client", "Amount", "Due Date", "Status", ""].map((h) => <th key={h} className="text-left font-medium px-3 py-2.5 text-xs">{h}</th>)}
          </tr></thead>
          <tbody>
            {INVOICES.map((i) => (
              <tr key={i.id} style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
                <td className="px-3 py-2.5" style={{ fontFamily: FONT_MONO, color: C.faint }}>{i.id}</td>
                <td className="px-3 py-2.5 font-medium">{i.client}</td>
                <td className="px-3 py-2.5">{inrFull(i.amount)}</td>
                <td className="px-3 py-2.5" style={{ color: C.muted }}>{i.dueDate}{i.daysOverdue > 0 && <span style={{ color: C.red }}> ({i.daysOverdue}d overdue)</span>}</td>
                <td className="px-3 py-2.5"><Badge text={i.status} tone={statusTone[i.status]} /></td>
                <td className="px-3 py-2.5">
                  {i.status === "Overdue" && (
                    isDirector ? <button onClick={() => setGate(i)} className="text-xs" style={{ color: C.gold }}>Escalate</button> : <Lock size={13} style={{ color: C.faint }} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Modal open={!!gate} onClose={() => setGate(null)} title="Approve Escalation"
        footer={<><GhostBtn onClick={() => setGate(null)}>Cancel</GhostBtn><PrimaryBtn onClick={() => releasePayment(gate)}>Approve Escalation</PrimaryBtn></>}>
        {gate && (
          <div className="flex flex-col gap-3 text-sm">
            <ApprovalGate>High-risk financial action — director approval required</ApprovalGate>
            <p style={{ color: C.muted }}>Escalate <b style={{ color: C.text }}>{gate.id}</b> for <b style={{ color: C.text }}>{gate.client}</b> — {inrFull(gate.amount)}, {gate.daysOverdue} days overdue — to formal collections notice.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ============================== APPROVALS ============================== */
function ApprovalsView({ approvals, setApprovals, isDirector, pushActivity, toast }) {
  const [active, setActive] = useState(null);
  const [decision, setDecision] = useState(null);
  const typeIcon = { "Production Deployment": Rocket, Discount: PercentCircle, "Payment Release": DollarSign };

  function decide(id, status) {
    setApprovals((as) => as.map((a) => (a.id === id ? { ...a, status } : a)));
    const a = approvals.find((x) => x.id === id);
    pushActivity("Director", `${status.toLowerCase()} — ${a.title}`, "Approvals");
    toast(`${status}: ${a.title}`, status === "Approved" ? "green" : "red");
    setActive(null);
    setDecision(null);
  }

  const pending = approvals.filter((a) => a.status === "Pending");
  const resolved = approvals.filter((a) => a.status !== "Pending");

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Approval Inbox" subtitle="High-risk actions wait here — nothing executes without director sign-off" />
      <div className="grid grid-cols-3 gap-3">
        <KpiCard label="Pending" value={pending.length} icon={Clock} accent={C.amber} />
        <KpiCard label="High Risk" value={approvals.filter((a) => a.risk === "High" && a.status === "Pending").length} icon={AlertTriangle} accent={C.red} />
        <KpiCard label="Decided" value={resolved.length} icon={CheckSquare} accent={C.green} />
      </div>

      <div className="flex flex-col gap-3">
        {pending.map((a) => {
          const Icon = typeIcon[a.type] || Shield;
          return (
            <Panel key={a.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="flex items-start gap-3 min-w-0">
                <div className="rounded-md p-2 shrink-0" style={{ background: `${toneMap[riskTone(a.risk)].fg}22` }}>
                  <Icon size={16} style={{ color: toneMap[riskTone(a.risk)].fg }} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium">{a.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: C.muted }}>{a.detail}</div>
                  <div className="text-xs mt-1" style={{ color: C.faint }}>{a.type} · Requested by {a.requestedBy}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge text={`Risk: ${a.risk}`} tone={riskTone(a.risk)} />
                {isDirector ? (
                  <>
                    <GhostBtn tone="red" icon={CircleX} onClick={() => { setActive(a); setDecision("Rejected"); }}>Reject</GhostBtn>
                    <PrimaryBtn icon={CircleCheck} onClick={() => { setActive(a); setDecision("Approved"); }}>Approve</PrimaryBtn>
                  </>
                ) : <ApprovalGate>Director access required</ApprovalGate>}
              </div>
            </Panel>
          );
        })}
        {pending.length === 0 && <EmptyState text="No pending approvals" icon={CheckSquare} />}
      </div>

      {resolved.length > 0 && (
        <>
          <div className="text-xs font-semibold mt-2" style={{ color: C.faint }}>Recently decided</div>
          <div className="flex flex-col gap-2">
            {resolved.map((a) => (
              <div key={a.id} className="flex items-center justify-between text-sm px-3 py-2 rounded-md" style={{ background: C.panel, border: `1px solid ${C.borderSoft}` }}>
                <span style={{ color: C.muted }}>{a.title}</span>
                <Badge text={a.status} tone={a.status === "Approved" ? "green" : "red"} />
              </div>
            ))}
          </div>
        </>
      )}

      <Modal open={!!active} onClose={() => setActive(null)} title={`Confirm ${decision}`}
        footer={<><GhostBtn onClick={() => setActive(null)}>Cancel</GhostBtn><PrimaryBtn tone={decision === "Rejected" ? "red" : "gold"} onClick={() => decide(active.id, decision)}>Confirm {decision}</PrimaryBtn></>}>
        {active && (
          <div className="flex flex-col gap-3 text-sm">
            <ApprovalGate>This action requires explicit director confirmation and will be recorded in the audit log</ApprovalGate>
            <div className="rounded-md p-3" style={{ background: C.panel, border: `1px solid ${C.borderSoft}` }}>
              <div className="font-medium">{active.title}</div>
              <div className="text-xs mt-1" style={{ color: C.muted }}>{active.detail}</div>
            </div>
            <p style={{ color: C.muted }}>You are about to <b style={{ color: C.text }}>{decision?.toLowerCase()}</b> this {active.type.toLowerCase()} request from {active.requestedBy}.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ============================== ALERTS ============================== */
function AlertsView({ setTab }) {
  const sevTone = { High: "red", Medium: "amber", Low: "blue" };
  const areaTab = { Projects: "projects", Finance: "finance", Marketing: "marketing", Team: "team", Ops: "documents" };
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Alerts & Risks" subtitle="Everything that needs director attention, ranked by severity" />
      <div className="flex flex-col gap-3">
        {ALERTS.sort((a, b) => (a.severity === "High" ? -1 : 1)).map((a) => (
          <Panel key={a.id} className="p-4 flex items-start justify-between gap-3" style={{ borderLeft: `3px solid ${toneMap[sevTone[a.severity]].fg}` }}>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Badge text={a.severity} tone={sevTone[a.severity]} />
                <span className="text-xs" style={{ color: C.faint }}>{a.area}</span>
              </div>
              <div className="text-sm font-medium mt-1.5">{a.title}</div>
              <div className="text-xs mt-0.5" style={{ color: C.muted }}>{a.detail}</div>
            </div>
            <button onClick={() => setTab(areaTab[a.area] || "dashboard")} className="text-xs flex items-center gap-1 shrink-0" style={{ color: C.gold }}>
              Review <ChevronRight size={12} />
            </button>
          </Panel>
        ))}
      </div>
    </div>
  );
}

/* ============================== ACTIVITY LOG ============================== */
function ActivityView({ activity }) {
  const [area, setArea] = useState("All");
  const areas = ["All", ...Array.from(new Set(activity.map((a) => a.area)))];
  const filtered = area === "All" ? activity : activity.filter((a) => a.area === area);
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Activity & Audit Log" subtitle="A full trail of what happened, who did it, and when"
        right={areas.map((a) => <IconBtn key={a} label={a} active={area === a} onClick={() => setArea(a)} />)} />
      <Panel className="p-0">
        {filtered.map((a, i) => (
          <div key={a.id} className="flex items-start gap-3 px-4 py-3" style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
            <span className="text-xs shrink-0 w-12" style={{ color: C.faint, fontFamily: FONT_MONO }}>{a.time}</span>
            <div className="text-sm">
              <b>{a.actor}</b> <span style={{ color: C.muted }}>{a.action}</span>
            </div>
            <Badge text={a.area} tone="gray" />
          </div>
        ))}
        {filtered.length === 0 && <EmptyState text="No activity in this area yet" icon={History} />}
      </Panel>
    </div>
  );
}

/* ============================== DOCUMENTS ============================== */
function DocumentsView() {
  const [folder, setFolder] = useState("All");
  const folders = ["All", ...Array.from(new Set(DOCUMENTS.map((d) => d.folder)))];
  const filtered = folder === "All" ? DOCUMENTS : DOCUMENTS.filter((d) => d.folder === folder);
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Documents & Knowledge Base" subtitle="Specs, contracts, SOPs and marketing assets"
        right={folders.map((f) => <IconBtn key={f} label={f} icon={Folder} active={folder === f} onClick={() => setFolder(f)} />)} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((d) => (
          <Panel key={d.id} className="p-3 flex items-center gap-3">
            <div className="rounded-md p-2" style={{ background: `${C.blue}22` }}><FileText size={16} style={{ color: C.blue }} /></div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{d.name}</div>
              <div className="text-xs" style={{ color: C.faint }}>{d.folder} · {d.owner} · {d.updated}</div>
            </div>
            <Download size={14} style={{ color: C.faint }} />
          </Panel>
        ))}
      </div>
    </div>
  );
}

/* ============================== AI ASSISTANT ============================== */
function AssistantView({ leads, campaigns, projects, approvals, tickets, setTab }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "I'm your executive assistant. I read live data across products, marketing, dev team, finance and approvals. Ask me about company status, or use a quick prompt below." },
  ]);
  const [input, setInput] = useState("");

  function summarize(query) {
    const q = query.toLowerCase();
    const pendingApprovals = approvals.filter((a) => a.status === "Pending");
    const atRisk = projects.filter((p) => p.health === "Red" || p.health === "Amber");
    const overdueInvoices = INVOICES.filter((i) => i.status === "Overdue");
    const bestCampaign = [...campaigns].sort((a, b) => b.conversions / b.leads - a.conversions / a.leads)[0];
    const worstCampaign = [...campaigns].sort((a, b) => a.conversions / a.leads - b.conversions / b.leads)[0];
    const blockedDevs = DEVS.filter((d) => d.status === "Blocked");
    const openPipeline = leads.filter((l) => !["Won", "Lost"].includes(l.stage)).reduce((s, l) => s + l.value, 0);

    if (q.includes("approv")) {
      return pendingApprovals.length
        ? `You have ${pendingApprovals.length} pending approvals: ${pendingApprovals.map((a) => `"${a.title}" (${a.risk} risk)`).join("; ")}. Recommended: clear the "Low" risk ones first, review "${pendingApprovals.find((a) => a.risk === "High")?.title || "the high-risk item"}" carefully before deciding.`
        : "No pending approvals right now — the queue is clear.";
    }
    if (q.includes("risk") || q.includes("project")) {
      return atRisk.length
        ? `${atRisk.length} project(s) need attention: ${atRisk.map((p) => `${p.name} (${p.health}, ${p.progress}% done, due ${p.deadline})`).join("; ")}. Suggested action: reassign support to "${atRisk[0].name}" or renegotiate its deadline.`
        : "All projects are currently on track.";
    }
    if (q.includes("market") || q.includes("campaign")) {
      return `Best performing campaign by conversion rate: "${bestCampaign.name}" (${bestCampaign.conversions}/${bestCampaign.leads} leads). Weakest: "${worstCampaign.name}" — consider reallocating budget away from it. Total leads generated across all campaigns: ${campaigns.reduce((s, c) => s + c.leads, 0)}.`;
    }
    if (q.includes("team") || q.includes("develop") || q.includes("block")) {
      return blockedDevs.length
        ? `${blockedDevs.length} developer(s) are blocked: ${blockedDevs.map((d) => `${d.name} — ${d.task}`).join("; ")}. Recommended action: resolve the external dependency (client data / API keys) or temporarily reassign them to unblocked work.`
        : "No developers are currently blocked.";
    }
    if (q.includes("finance") || q.includes("invoice") || q.includes("revenue")) {
      return `Outstanding receivables: ${inr(overdueInvoices.reduce((s, i) => s + i.amount, 0))} overdue across ${overdueInvoices.length} invoice(s), largest being ${overdueInvoices[0]?.id} from ${overdueInvoices[0]?.client}. Open sales pipeline stands at ${inr(openPipeline)}.`;
    }
    return `Today's snapshot: ${pendingApprovals.length} approvals waiting on you, ${atRisk.length} project(s) at risk, ${blockedDevs.length} developer(s) blocked, and ${overdueInvoices.length} invoice(s) overdue. Try asking about "approvals", "projects", "marketing" or "team" for detail.`;
  }

  function send(q) {
    const text = q ?? input;
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }, { role: "assistant", text: summarize(text) }]);
    setInput("");
  }

  const quick = [
    { label: "Today's company summary", tab: null },
    { label: "What needs my approval?", tab: "approvals" },
    { label: "Which projects are at risk?", tab: "projects" },
    { label: "Marketing performance this month", tab: "marketing" },
    { label: "Who on the dev team is blocked?", tab: "team" },
    { label: "Overdue invoices", tab: "finance" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="AI Executive Assistant" subtitle="Rule-based summarizer over live company data — not an autonomous agent" />
      <Panel className="p-3">
        <div className="flex items-start gap-2 text-xs" style={{ color: C.muted }}>
          <Sparkles size={13} style={{ color: C.gold, marginTop: 1 }} />
          This assistant reads current dashboard data to answer questions and suggest next actions. It never executes payments, deployments, or discounts on its own — those always go through the Approval Inbox.
        </div>
      </Panel>
      <div className="flex flex-wrap gap-2">
        {quick.map((q, i) => (
          <button key={i} onClick={() => send(q.label)} className="text-xs px-3 py-1.5 rounded-full" style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.muted }}>
            {q.label}
          </button>
        ))}
      </div>
      <Panel className="p-4 flex flex-col gap-3 min-h-[320px]">
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[420px]">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[85%] rounded-lg px-3 py-2 text-sm" style={{ background: m.role === "user" ? C.gold : C.panel2, color: m.role === "user" ? "#0D1117" : C.text, border: m.role === "user" ? "none" : `1px solid ${C.border}` }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-2" style={{ borderTop: `1px solid ${C.borderSoft}` }}>
          <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask about revenue, risk, team, marketing…" />
          <PrimaryBtn icon={Send} onClick={() => send()}>Send</PrimaryBtn>
        </div>
      </Panel>
    </div>
  );
}
