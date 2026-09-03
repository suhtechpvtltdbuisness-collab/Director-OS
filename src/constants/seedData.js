import { C } from "./theme";

export const PRODUCTS = [
  { id: "p1", name: "ORGA HRMS", type: "SaaS Product", tagline: "End-to-end HR & payroll platform", status: "Live", health: "Good", mrr: 420000, clients: 18, stage: "Scaling", marketingStage: "Active ABM", owner: "Rahul Verma", launched: "2024-02-10" },
  { id: "p2", name: "BotBridge", type: "SaaS Product", tagline: "AI chatbot integration & orchestration layer", status: "Live (Beta)", health: "Watch", mrr: 185000, clients: 9, stage: "Growth", marketingStage: "Launch Push", owner: "Ananya Singh", launched: "2025-01-18" },
  { id: "p3", name: "SUH OptiCore", type: "SaaS Product", tagline: "Workflow automation & optimization engine", status: "Live", health: "Good", mrr: 240000, clients: 6, stage: "Early Growth", marketingStage: "Case Studies", owner: "Karthik Iyer", launched: "2025-03-02" },
  { id: "p4", name: "Skill Guru", type: "SaaS Product", tagline: "Skills assessment & micro-learning platform", status: "Beta", health: "At Risk", mrr: 45000, clients: 3, stage: "Beta", marketingStage: "Waitlist", owner: "Divya Menon", launched: "2025-07-01" },
  { id: "p5", name: "Web Development", type: "Service Line", tagline: "Custom business & e-commerce websites", status: "Active", health: "Good", mrr: 1260000, clients: 11, stage: "Steady", marketingStage: "Referral + SEO", owner: "Priya Nair", launched: "2021-06-01" },
  { id: "p6", name: "Digital Marketing", type: "Service Line", tagline: "Performance marketing & brand growth retainers", status: "Active", health: "Good", mrr: 680000, clients: 8, stage: "Steady", marketingStage: "Referral Program", owner: "Ananya Singh", launched: "2021-09-01" },
  { id: "p7", name: "SaaS Development", type: "Service Line", tagline: "Custom SaaS builds for external clients", status: "Active", health: "Good", mrr: 1840000, clients: 5, stage: "Scaling", marketingStage: "Case Study Series", owner: "Rahul Verma", launched: "2022-01-15" },
  { id: "p8", name: "AI Automation Services", type: "Service Line", tagline: "Workflow & agentic automation for enterprises", status: "Active", health: "Good", mrr: 920000, clients: 7, stage: "Growth", marketingStage: "Webinar Series", owner: "Farhan Shaikh", launched: "2024-11-01" },
];

export const DEVS = [
  { id: "d1", name: "Rahul Verma", role: "Lead Full-Stack Engineer", avatarColor: C.blue, workload: 92, status: "Busy", attendance: "Present", location: "Bengaluru", task: "ORGA HRMS v3 — payroll export module", blockers: 0 },
  { id: "d2", name: "Ananya Singh", role: "Backend / AI Engineer", avatarColor: C.purple, workload: 78, status: "Busy", attendance: "Present", location: "Remote — Pune", task: "BotBridge — NLP intent upgrade", blockers: 1 },
  { id: "d3", name: "Karthik Iyer", role: "Frontend Engineer", avatarColor: C.green, workload: 60, status: "Available", attendance: "Present", location: "Bengaluru", task: "SUH OptiCore — dashboard revamp", blockers: 0 },
  { id: "d4", name: "Divya Menon", role: "Full-Stack Engineer", avatarColor: C.amber, workload: 45, status: "Blocked", attendance: "Present", location: "Remote — Kochi", task: "Skill Guru — MVP quiz engine", blockers: 2 },
  { id: "d5", name: "Farhan Shaikh", role: "DevOps / QA Lead", avatarColor: C.red, workload: 85, status: "Busy", attendance: "Present", location: "Bengaluru", task: "Release pipeline — staging → prod gate", blockers: 0 },
  { id: "d6", name: "Priya Nair", role: "Junior Developer", avatarColor: C.gold, workload: 55, status: "On Leave", attendance: "Leave", location: "Remote — Mangalore", task: "Meridian Retail — storefront build", blockers: 0 },
];

export const PROJECTS = [
  { id: "pr1", name: "ORGA HRMS v3 Release", product: "ORGA HRMS", owner: "Rahul Verma", health: "Green", progress: 78, deadline: "2026-09-13", deployStatus: "Staging", codeStatus: "3 PRs open", risk: "Low" },
  { id: "pr2", name: "BotBridge NLP Upgrade", product: "BotBridge", owner: "Ananya Singh", health: "Amber", progress: 55, deadline: "2026-09-21", deployStatus: "Dev", codeStatus: "Blocked on client data", risk: "Medium" },
  { id: "pr3", name: "SUH OptiCore Dashboard Revamp", product: "SUH OptiCore", owner: "Karthik Iyer", health: "Green", progress: 90, deadline: "2026-09-06", deployStatus: "Staging", codeStatus: "QA in progress", risk: "Low" },
  { id: "pr4", name: "Skill Guru MVP Launch", product: "Skill Guru", owner: "Divya Menon", health: "Red", progress: 30, deadline: "2026-09-09", deployStatus: "Dev", codeStatus: "API keys pending (client)", risk: "High" },
  { id: "pr5", name: "Meridian Retail — E-commerce Site", product: "Web Development", owner: "Priya Nair", health: "Green", progress: 65, deadline: "2026-09-18", deployStatus: "Dev", codeStatus: "On track", risk: "Low" },
  { id: "pr6", name: "Nimbus Logistics — Custom Portal", product: "SaaS Development", owner: "Rahul Verma", health: "Amber", progress: 40, deadline: "2026-09-28", deployStatus: "Dev", codeStatus: "Scope change pending sign-off", risk: "Medium" },
];

export const CLIENTS = [
  { id: "c1", name: "Meridian Retail", product: "Web Development", value: 600000, status: "Active", since: "2026-06-01", contact: "Ritu Malhotra" },
  { id: "c2", name: "Nimbus Logistics", product: "SaaS Development", value: 1450000, status: "Active", since: "2026-04-12", contact: "Sameer Kulkarni" },
  { id: "c3", name: "Zenith Financial Services", product: "ORGA HRMS", value: 360000, status: "Active", since: "2025-11-20", contact: "Anil Kapoor" },
  { id: "c4", name: "Coastal Foods Pvt Ltd", product: "Digital Marketing", value: 120000, status: "Active", since: "2025-08-15", contact: "Meena Pillai" },
  { id: "c5", name: "Vertex Manufacturing", product: "BotBridge", value: 240000, status: "Active", since: "2025-12-01", contact: "Deepak Rao" },
  { id: "c6", name: "Quantum Retail Group", product: "AI Automation Services", value: 800000, status: "Active", since: "2026-02-10", contact: "Nisha Bhatt" },
  { id: "c7", name: "Skyline Realty", product: "Web Development", value: 200000, status: "Completed", since: "2025-05-01", contact: "Vikram Sethi" },
  { id: "c8", name: "Aurora EdTech", product: "Skill Guru", value: 0, status: "Trial", since: "2026-08-01", contact: "Shalini Rao" },
];

export const INIT_LEADS = [
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

export const INIT_CAMPAIGNS = [
  { id: "cm1", name: "ORGA HRMS — Q3 LinkedIn ABM", product: "ORGA HRMS", channel: "LinkedIn", budget: 80000, spend: 62000, leads: 34, conversions: 5, status: "Active", start: "2026-07-01", end: "2026-09-30" },
  { id: "cm2", name: "BotBridge Launch Push", product: "BotBridge", channel: "Google Ads + Content", budget: 120000, spend: 105000, leads: 58, conversions: 7, status: "Active", start: "2026-06-15", end: "2026-09-15" },
  { id: "cm3", name: "Skill Guru Beta Waitlist", product: "Skill Guru", channel: "Instagram / Meta", budget: 30000, spend: 28500, leads: 210, conversions: 12, status: "Active", start: "2026-07-10", end: "2026-09-10" },
  { id: "cm4", name: "SaaS Dev — Case Study Series", product: "SaaS Development", channel: "Content / SEO", budget: 40000, spend: 22000, leads: 15, conversions: 3, status: "Active", start: "2026-08-01", end: "2026-10-01" },
  { id: "cm5", name: "Digital Marketing — Referral Program", product: "Digital Marketing", channel: "Referral", budget: 15000, spend: 9000, leads: 11, conversions: 4, status: "Active", start: "2026-08-01", end: "2026-12-31" },
  { id: "cm6", name: "AI Automation — Webinar Series", product: "AI Automation Services", channel: "Webinar / Email", budget: 50000, spend: 50000, leads: 40, conversions: 6, status: "Completed", start: "2026-05-01", end: "2026-07-31" },
];

export const INIT_TICKETS = [
  { id: "t1024", client: "Zenith Financial Services", subject: "Payroll export failing for August cycle", product: "ORGA HRMS", priority: "High", status: "Open", updated: "2026-09-01" },
  { id: "t1023", client: "Vertex Manufacturing", subject: "Bot not responding after business hours", product: "BotBridge", priority: "Urgent", status: "In Progress", updated: "2026-09-01" },
  { id: "t1021", client: "Coastal Foods Pvt Ltd", subject: "Campaign dashboard access request", product: "Digital Marketing", priority: "Low", status: "Resolved", updated: "2026-08-29" },
  { id: "t1019", client: "Nimbus Logistics", subject: "Portal login SSO failing intermittently", product: "SaaS Development", priority: "High", status: "Open", updated: "2026-08-31" },
  { id: "t1015", client: "Aurora EdTech", subject: "Quiz scoring bug on final module", product: "Skill Guru", priority: "Medium", status: "In Progress", updated: "2026-08-30" },
];

export const INVOICES = [
  { id: "INV-2201", client: "Nimbus Logistics", amount: 450000, status: "Overdue", dueDate: "2026-08-13", daysOverdue: 19 },
  { id: "INV-2205", client: "Zenith Financial Services", amount: 90000, status: "Pending", dueDate: "2026-09-05", daysOverdue: 0 },
  { id: "INV-2198", client: "Meridian Retail", amount: 300000, status: "Paid", dueDate: "2026-08-10", daysOverdue: 0 },
  { id: "INV-2207", client: "Quantum Retail Group", amount: 400000, status: "Pending", dueDate: "2026-09-10", daysOverdue: 0 },
  { id: "INV-2190", client: "Vertex Manufacturing", amount: 120000, status: "Paid", dueDate: "2026-08-01", daysOverdue: 0 },
  { id: "INV-2210", client: "Coastal Foods Pvt Ltd", amount: 60000, status: "Overdue", dueDate: "2026-08-20", daysOverdue: 12 },
];

export const REVENUE_TREND = [
  { month: "Apr", revenue: 3120000, target: 3000000 },
  { month: "May", revenue: 3340000, target: 3200000 },
  { month: "Jun", revenue: 3580000, target: 3400000 },
  { month: "Jul", revenue: 3910000, target: 3600000 },
  { month: "Aug", revenue: 4260000, target: 3900000 },
  { month: "Sep (MTD)", revenue: 690000, target: 4100000 },
];

export const INIT_APPROVALS = [
  { id: "ap1", type: "Production Deployment", title: "Deploy ORGA HRMS v3 to production", requestedBy: "Rahul Verma", risk: "Medium", detail: "Payroll export module, tested in staging, 3 PRs merged.", status: "Pending" },
  { id: "ap2", type: "Discount", title: "15% renewal discount — Quantum Retail Group", requestedBy: "Karthik Iyer", risk: "Medium", detail: "12-month AI Automation renewal, client requested match of competitor quote.", status: "Pending" },
  { id: "ap3", type: "Payment Release", title: "Vendor payment — Cloud hosting, ₹45,000", requestedBy: "Farhan Shaikh", risk: "Low", detail: "Monthly AWS + backup infra invoice, within budget.", status: "Pending" },
  { id: "ap4", type: "Production Deployment", title: "Hotfix — BotBridge NLP intent parser", requestedBy: "Ananya Singh", risk: "High", detail: "Touches 9 live client bots. Rollback plan attached.", status: "Pending" },
  { id: "ap5", type: "Discount", title: "25% annual discount — Aurora EdTech (Skill Guru)", requestedBy: "Divya Menon", risk: "Medium", detail: "Convert free trial to paid annual at discounted early-adopter rate.", status: "Pending" },
];

export const ALERTS = [
  { id: "a1", severity: "High", title: "Skill Guru MVP is behind schedule", detail: "30% complete with 8 days to deadline — currently trending Red.", area: "Projects" },
  { id: "a2", severity: "High", title: "BotBridge NLP upgrade blocked 5+ days", detail: "Waiting on client data access from Vertex Manufacturing.", area: "Projects" },
  { id: "a3", severity: "High", title: "Nimbus Logistics invoice overdue 19 days", detail: "₹4,50,000 outstanding — largest receivable at risk.", area: "Finance" },
  { id: "a4", severity: "Medium", title: "Skill Guru campaign ROI declining", detail: "₹28,500 spent for 12 paid conversions from 210 signups — low paid conversion rate.", area: "Marketing" },
  { id: "a5", severity: "Medium", title: "Divya Menon blocked 2+ days", detail: "Waiting on client-provided API keys for Skill Guru quiz engine.", area: "Team" },
  { id: "a6", severity: "Low", title: "SSL certificate renewal due in 6 days", detail: "Client portal (Nimbus Logistics) — schedule renewal to avoid downtime.", area: "Ops" },
];

export const INIT_ACTIVITY = [
  { id: "ac1", time: "09:14", actor: "Rahul Verma", action: "moved 'Payroll export module' to Review", area: "Sprint Board" },
  { id: "ac2", time: "09:40", actor: "Director", action: "approved payment release — Cloud hosting ₹45,000", area: "Approvals" },
  { id: "ac3", time: "10:02", actor: "Ananya Singh", action: "flagged BotBridge NLP upgrade as blocked", area: "Projects" },
  { id: "ac4", time: "10:35", actor: "System", action: "new lead captured — Falcon Sports Retail (BotBridge)", area: "CRM" },
  { id: "ac5", time: "11:12", actor: "Karthik Iyer", action: "requested discount approval — Quantum Retail Group", area: "Approvals" },
  { id: "ac6", time: "11:50", actor: "Farhan Shaikh", action: "pushed SUH OptiCore build to staging", area: "Deployments" },
  { id: "ac7", time: "13:20", actor: "Divya Menon", action: "logged blocker — awaiting client API keys", area: "Sprint Board" },
  { id: "ac8", time: "14:05", actor: "System", action: "invoice INV-2210 marked overdue — Coastal Foods", area: "Finance" },
];

export const DOCUMENTS = [
  { id: "doc1", folder: "Product Specs", name: "ORGA HRMS v3 — Functional Spec.pdf", owner: "Rahul Verma", updated: "2026-08-28" },
  { id: "doc2", folder: "Product Specs", name: "BotBridge — NLP Architecture.docx", owner: "Ananya Singh", updated: "2026-08-25" },
  { id: "doc3", folder: "Client Contracts", name: "Nimbus Logistics — MSA.pdf", owner: "Director", updated: "2026-04-12" },
  { id: "doc4", folder: "Client Contracts", name: "Quantum Retail Group — SOW.pdf", owner: "Director", updated: "2026-02-10" },
  { id: "doc5", folder: "SOPs", name: "Production Deployment Checklist.pdf", owner: "Farhan Shaikh", updated: "2026-07-15" },
  { id: "doc6", folder: "SOPs", name: "Client Onboarding Playbook.docx", owner: "Priya Nair", updated: "2026-06-01" },
  { id: "doc7", folder: "Marketing Assets", name: "Skill Guru — Waitlist Landing Copy.docx", owner: "Ananya Singh", updated: "2026-07-20" },
  { id: "doc8", folder: "Marketing Assets", name: "Brand Guidelines — SUH TECH.pdf", owner: "Director", updated: "2025-12-01" },
];

export const INIT_TASKS = [
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
