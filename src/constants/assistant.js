export const ASSISTANT_INTRO =
  "I read across products, pipeline, delivery, support and finance. Ask a question, or start with one of these.";

export const QUICK_PROMPTS = [
  { label: "Company summary", intent: "summary" },
  { label: "What needs my approval?", intent: "approvals", to: "/approvals" },
  { label: "Which projects are at risk?", intent: "risk", to: "/projects" },
  { label: "Marketing performance", intent: "marketing", to: "/campaigns" },
  { label: "Who is blocked?", intent: "blocked", to: "/team" },
  { label: "Overdue invoices", intent: "overdue", to: "/finance/invoices" },
];
