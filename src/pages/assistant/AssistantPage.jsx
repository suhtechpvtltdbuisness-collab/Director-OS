import React from "react";
import { Link } from "react-router-dom";
import { Bot, Send, User } from "lucide-react";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { ASSISTANT_INTRO, QUICK_PROMPTS } from "../../constants/assistant";
import { useStore } from "../../data/DataStore";
import { SOURCE } from "../../data/source";
import { assistantApi } from "../../api";
import { inr, dueLabel, daysUntil } from "../../utils";
import { PageHeader, Card, ErrorView, Skeleton } from "../../components/ui";
import PrimaryBtn from "../../components/common/PrimaryBtn";

/**
 * Answers are derived from the data already loaded in the store, so the
 * assistant never claims something the rest of the app cannot show.
 */
function answer(question, data) {
  const q = question.toLowerCase();
  const { projects, leads, invoices, approvals, alerts, devs, tickets, products, campaigns } = data;

  const match = (...words) => words.some((w) => q.includes(w));

  if (match("approval", "approve", "sign-off", "sign off")) {
    const pending = approvals.filter((a) => a.status === "Pending");
    if (!pending.length) return { text: "Nothing is waiting on your approval right now." };
    return {
      text: `${pending.length} request${pending.length === 1 ? "" : "s"} need your decision, worth ${inr(pending.reduce((s, a) => s + (a.amount || 0), 0))} in total.`,
      items: pending.map((a) => ({ label: a.title, meta: `${a.type} · ${a.risk} risk · ${a.requestedBy}`, to: `/approvals/${a.id}` })),
    };
  }

  if (match("risk", "at risk", "behind", "slipping")) {
    const risky = projects.filter((p) => p.health === "Red" || p.risk === "High");
    if (!risky.length) return { text: "No projects are currently flagged red or high risk." };
    return {
      text: `${risky.length} project${risky.length === 1 ? " is" : "s are"} at risk.`,
      items: risky.map((p) => ({ label: p.name, meta: `${p.progress}% complete · ${dueLabel(p.deadline)} · ${p.client}`, to: `/projects/${p.id}` })),
    };
  }

  if (match("overdue", "unpaid", "receivable", "invoice")) {
    const late = invoices.filter((i) => i.status === "Overdue");
    if (!late.length) return { text: "No invoices are overdue. Receivables are current." };
    return {
      text: `${late.length} invoice${late.length === 1 ? " is" : "s are"} overdue, totalling ${inr(late.reduce((s, i) => s + i.amount, 0))}.`,
      items: late.map((i) => ({ label: `${i.id} — ${i.client}`, meta: `${inr(i.amount)} · ${i.daysOverdue} days overdue`, to: `/finance/invoices/${i.id}` })),
    };
  }

  if (match("blocked", "blocker", "stuck")) {
    const stuck = devs.filter((d) => d.blockers > 0 || d.status === "Blocked");
    if (!stuck.length) return { text: "Nobody on the dev team is reporting a blocker." };
    return {
      text: `${stuck.length} engineer${stuck.length === 1 ? " is" : "s are"} blocked.`,
      items: stuck.map((d) => ({ label: d.name, meta: `${d.blockers} blocker${d.blockers === 1 ? "" : "s"} · ${d.task}`, to: `/team/${d.id}` })),
    };
  }

  if (match("marketing", "campaign", "spend", "ads")) {
    const active = campaigns.filter((c) => c.status === "Active");
    const spend = active.reduce((s, c) => s + c.spend, 0);
    const conversions = active.reduce((s, c) => s + c.conversions, 0);
    return {
      text: `${active.length} active campaign${active.length === 1 ? "" : "s"} have spent ${inr(spend)} for ${conversions} conversions${conversions ? ` (${inr(Math.round(spend / conversions))} each)` : ""}.`,
      items: active.map((c) => ({ label: c.name, meta: `${c.channel} · ${c.leads} leads · ${c.conversions} converted`, to: `/campaigns/${c.id}` })),
    };
  }

  if (match("pipeline", "lead", "sales", "deal")) {
    const open = leads.filter((l) => !["Won", "Lost"].includes(l.stage));
    return {
      text: `${open.length} open opportunities worth ${inr(open.reduce((s, l) => s + l.value, 0))}.`,
      items: [...open].sort((a, b) => b.value - a.value).slice(0, 5)
        .map((l) => ({ label: l.name, meta: `${inr(l.value)} · ${l.stage} · ${l.owner}`, to: `/leads/${l.id}` })),
    };
  }

  if (match("ticket", "support", "bug", "incident")) {
    const open = tickets.filter((t) => t.status === "Open" || t.status === "In Progress");
    return {
      text: `${open.length} support ticket${open.length === 1 ? " is" : "s are"} open, ${open.filter((t) => t.priority === "Urgent").length} of them urgent.`,
      items: open.slice(0, 5).map((t) => ({ label: t.subject, meta: `${t.client} · ${t.priority} · ${t.assignee}`, to: `/support/${t.id}` })),
    };
  }

  if (match("alert", "warning", "attention")) {
    const active = alerts.filter((a) => !a.dismissed);
    if (!active.length) return { text: "There are no active alerts." };
    return {
      text: `${active.length} active alert${active.length === 1 ? "" : "s"}, ${active.filter((a) => a.severity === "High").length} at high severity.`,
      items: active.map((a) => ({ label: a.title, meta: `${a.area} · ${a.severity}`, to: "/alerts" })),
    };
  }

  // Default: an overall company summary.
  const pending = approvals.filter((a) => a.status === "Pending");
  const risky = projects.filter((p) => p.health === "Red" || p.risk === "High");
  const late = invoices.filter((i) => i.status === "Overdue");
  const mrr = products.reduce((s, p) => s + p.mrr, 0);
  const soon = projects.filter((p) => { const d = daysUntil(p.deadline); return d !== null && d >= 0 && d <= 7; });

  return {
    text: `Recurring revenue is ${inr(mrr)} across ${products.length} lines. ${projects.length} projects are running, ${risky.length} at risk, and ${soon.length} due within a week. ${pending.length} approvals await you and ${late.length} invoices are overdue.`,
    items: [
      pending.length && { label: `${pending.length} approvals pending`, meta: "Needs a director decision", to: "/approvals" },
      risky.length && { label: `${risky.length} projects at risk`, meta: "Red health or high risk", to: "/projects" },
      late.length && { label: `${late.length} overdue invoices`, meta: inr(late.reduce((s, i) => s + i.amount, 0)), to: "/finance/invoices" },
    ].filter(Boolean),
  };
}

function Message({ role, content }) {
  const isBot = role === "bot";
  return (
    <div className={`flex gap-3 ${isBot ? "" : "flex-row-reverse"}`}>
      <div
        className="rounded-md p-1.5 h-7 w-7 flex items-center justify-center shrink-0"
        style={{ background: isBot ? C.goldTint : C.track }}
      >
        {isBot ? <Bot size={14} style={{ color: C.gold }} /> : <User size={14} style={{ color: C.muted }} />}
      </div>
      <div className={`min-w-0 max-w-2xl ${isBot ? "" : "text-right"}`}>
        <div
          className="rounded-lg px-3.5 py-2.5 inline-block text-left"
          style={{ background: isBot ? C.panel : C.panel2, border: `1px solid ${C.border}` }}
        >
          <p className="text-sm leading-relaxed" style={{ color: C.text }}>{content.text}</p>
          {content.items?.length > 0 && (
            <ul className="flex flex-col gap-1.5 mt-3 pt-3" style={{ borderTop: `1px solid ${C.borderSoft}` }}>
              {content.items.map((it, i) => (
                <li key={i}>
                  <Link to={it.to} className="flex flex-col hover:underline">
                    <span className="text-sm" style={{ color: C.gold }}>{it.label}</span>
                    <span className="text-xs" style={{ color: C.faint }}>{it.meta}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AssistantPage() {
  const { data, status, error, reload } = useStore();
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [asking, setAsking] = React.useState(false);
  const endRef = React.useRef(null);

  React.useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  if (status === "loading") {
    return <div className="flex flex-col gap-4"><Skeleton h={64} /><Skeleton h={360} radius={10} /></div>;
  }
  if (status === "error") return <ErrorView error={error} onRetry={reload} />;

  async function ask(question) {
    if (!question.trim() || asking) return;
    setMessages((m) => [...m, { role: "user", content: { text: question } }]);
    setInput("");
    setAsking(true);
    try {
      if (SOURCE === "api") {
        const { reply } = await assistantApi.chat(question);
        setMessages((m) => [...m, { role: "bot", content: { text: reply } }]);
      } else {
        setMessages((m) => [...m, { role: "bot", content: answer(question, data) }]);
      }
    } catch (err) {
      setMessages((m) => [...m, { role: "bot", content: { text: err.message || "Could not reach the assistant." } }]);
    } finally {
      setAsking(false);
    }
  }

  return (
    <>
      <PageHeader
        title="AI Assistant"
        description="Ask about anything happening across the business. Answers link straight to the underlying records."
      />

      <Card padded={false} className="flex flex-col" >
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4" style={{ minHeight: 380, maxHeight: "58vh" }}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center gap-3 py-10">
              <div className="rounded-xl p-3" style={{ background: C.goldTint }}>
                <Bot size={22} style={{ color: C.gold }} />
              </div>
              <h3 className="text-base font-semibold" style={{ color: C.text, fontFamily: FONT_DISPLAY }}>How can I help?</h3>
              <p className="text-sm max-w-md" style={{ color: C.muted }}>{ASSISTANT_INTRO}</p>
            </div>
          ) : (
            messages.map((m, i) => <Message key={i} role={m.role} content={m.content} />)
          )}
          <div ref={endRef} />
        </div>

        <div className="p-3 flex flex-wrap gap-2" style={{ borderTop: `1px solid ${C.border}` }}>
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p.label}
              onClick={() => ask(p.label)}
              className="text-xs rounded-md px-2.5 py-1.5"
              style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="p-3 flex items-center gap-2" style={{ borderTop: `1px solid ${C.border}` }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask(input)}
            placeholder="Ask about projects, pipeline, invoices, approvals…"
            className="flex-1 rounded-md px-3 py-2 text-sm outline-none"
            style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text }}
          />
          <PrimaryBtn icon={Send} onClick={() => ask(input)} disabled={!input.trim() || asking}>Ask</PrimaryBtn>
        </div>
      </Card>
    </>
  );
}
