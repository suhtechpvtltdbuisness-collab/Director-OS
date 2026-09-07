import { useMemo } from "react";
import { useStore } from "../data/DataStore";

/** Collections the topbar search spans, with how to label and link each hit. */
const TARGETS = [
  { key: "clients", kind: "Client", field: "name", to: (r) => `/clients/${r.id}` },
  { key: "projects", kind: "Project", field: "name", to: (r) => `/projects/${r.id}` },
  { key: "leads", kind: "Lead", field: "name", to: (r) => `/leads/${r.id}` },
  { key: "products", kind: "Product", field: "name", to: (r) => `/products/${r.id}` },
  { key: "devs", kind: "Team", field: "name", to: (r) => `/team/${r.id}` },
  { key: "tickets", kind: "Ticket", field: "subject", to: (r) => `/support/${r.id}` },
  { key: "campaigns", kind: "Campaign", field: "name", to: (r) => `/campaigns/${r.id}` },
  { key: "tasks", kind: "Task", field: "title", to: (r) => `/sprints/${r.id}` },
  { key: "invoices", kind: "Invoice", field: "id", to: (r) => `/finance/invoices/${r.id}` },
  { key: "documents", kind: "Document", field: "name", to: (r) => `/documents/${r.id}` },
];

export default function useGlobalSearch(query) {
  const { data } = useStore();

  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const hits = [];
    for (const t of TARGETS) {
      for (const row of data[t.key] || []) {
        const label = String(row[t.field] ?? "");
        if (label.toLowerCase().includes(q)) {
          hits.push({ kind: t.kind, label, to: t.to(row) });
          if (hits.length >= 40) break;
        }
      }
    }
    return hits.slice(0, 10);
  }, [query, data]);
}
