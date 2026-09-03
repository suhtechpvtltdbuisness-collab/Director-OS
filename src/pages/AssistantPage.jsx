import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { C } from "../constants/theme";
import { INVOICES, DEVS } from "../constants/seedData";
import { QUICK_PROMPTS, ASSISTANT_INTRO } from "../constants/assistant";
import { inr } from "../utils/formatCurrency";
import SectionHeader from "../components/common/SectionHeader";
import Panel from "../components/common/Panel";
import ChatMessage from "../components/assistant/ChatMessage";
import QuickPrompts from "../components/assistant/QuickPrompts";
import ChatComposer from "../components/assistant/ChatComposer";

function summarize(query, { leads, campaigns, projects, approvals, tickets }) {
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

export default function AssistantPage({ leads, campaigns, projects, approvals, tickets, setTab }) {
  const [messages, setMessages] = useState([{ role: "assistant", text: ASSISTANT_INTRO }]);
  const [input, setInput] = useState("");

  function send(q) {
    const text = q ?? input;
    if (!text.trim()) return;
    const reply = summarize(text, { leads, campaigns, projects, approvals, tickets });
    setMessages((m) => [...m, { role: "user", text }, { role: "assistant", text: reply }]);
    setInput("");
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="AI Executive Assistant"
        subtitle="Rule-based summarizer over live company data — not an autonomous agent"
      />
      <Panel className="p-3">
        <div className="flex items-start gap-2 text-xs" style={{ color: C.muted }}>
          <Sparkles size={13} style={{ color: C.gold, marginTop: 1 }} />
          This assistant reads current dashboard data to answer questions and suggest next actions. It never executes payments, deployments, or discounts on its own — those always go through the Approval Inbox.
        </div>
      </Panel>
      <QuickPrompts prompts={QUICK_PROMPTS} onSelect={(label) => send(label)} />
      <Panel className="p-4 flex flex-col gap-3 min-h-[320px]">
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[420px]">
          {messages.map((m, i) => <ChatMessage key={i} message={m} />)}
        </div>
        <ChatComposer input={input} setInput={setInput} onSend={() => send()} />
      </Panel>
    </div>
  );
}
