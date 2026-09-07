import { C } from "../constants/theme";

export const toneMap = {
  green: { bg: C.greenSoft, fg: C.green },
  amber: { bg: C.amberSoft, fg: C.amber },
  red: { bg: C.redSoft, fg: C.red },
  blue: { bg: C.blueSoft, fg: C.blue },
  gold: { bg: C.goldSoft, fg: C.gold },
  gray: { bg: C.track, fg: C.muted },
};

export function healthTone(h) {
  if (h === "Good" || h === "Green") return "green";
  if (h === "Watch" || h === "Amber") return "amber";
  if (h === "At Risk" || h === "Red") return "red";
  return "gray";
}

export function riskTone(r) {
  if (r === "Low") return "green";
  if (r === "Medium") return "amber";
  if (r === "High" || r === "Urgent") return "red";
  return "gray";
}

/** Work item priority. */
export function priorityTone(p) {
  return { Urgent: "red", High: "amber", Medium: "blue", Low: "gray" }[p] || "gray";
}

/** Sprint task and milestone status. */
export function taskTone(s) {
  return { Done: "green", Review: "blue", "In Progress": "gold", Blocked: "red", Backlog: "gray", Pending: "gray" }[s] || "gray";
}

/** Sales pipeline stage. */
export function stageTone(s) {
  return { Won: "green", Negotiation: "gold", Proposal: "blue", Demo: "blue", Contacted: "gray", New: "gray", Lost: "red" }[s] || "gray";
}

/** Client, campaign, ticket, invoice and approval lifecycle status. */
export function statusTone(s) {
  return {
    Active: "green", Live: "green", Paid: "green", Resolved: "green", Approved: "green", Completed: "green",
    Pending: "amber", "In Progress": "gold", "Live (Beta)": "amber", Beta: "amber", Trial: "blue", Paused: "amber",
    Overdue: "red", Open: "red", Rejected: "red", Churned: "red", Blocked: "red",
    Draft: "gray", Closed: "gray",
  }[s] || "gray";
}
