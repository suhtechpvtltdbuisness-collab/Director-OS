import React from "react";
import { History } from "lucide-react";
import { C } from "../../constants/theme";
import { useCollection } from "../../data/DataStore";
import useTableState from "../../hooks/useTableState";
import { formatDate } from "../../utils";
import { PageHeader, Toolbar, Card, EmptyView, NoResultsView, ErrorView, Skeleton, Pagination } from "../../components/ui";
import Avatar from "../../components/common/Avatar";
import Badge from "../../components/common/Badge";

const AREA_COLOR = {
  "Sprint Board": C.blue, Approvals: C.gold, Projects: C.green, CRM: C.purple,
  Deployments: C.pieTeal, Finance: C.amber, Marketing: C.pieLime, Support: C.red, Documents: C.muted,
};

export default function ActivityPage() {
  const { rows, status, error, reload } = useCollection("activity");

  const areas = React.useMemo(() => ["All", ...Array.from(new Set(rows.map((r) => r.area))).sort()], [rows]);
  const actors = React.useMemo(() => ["All", ...Array.from(new Set(rows.map((r) => r.actor))).sort()], [rows]);

  const t = useTableState(rows, { searchKeys: ["actor", "action", "area"], pageSize: 15 });

  /** Group the current page of entries by calendar day. */
  const grouped = React.useMemo(() => {
    const map = new Map();
    for (const row of t.rows) {
      if (!map.has(row.date)) map.set(row.date, []);
      map.get(row.date).push(row);
    }
    return [...map.entries()];
  }, [t.rows]);

  return (
    <>
      <PageHeader
        title="Activity Log"
        description="A chronological audit trail of every action taken across Director OS."
      />

      <div className="rounded-lg overflow-hidden mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <Toolbar
          query={t.query}
          onQuery={t.setQuery}
          placeholder="Search the audit trail…"
          onClear={t.clear}
          filters={[
            { key: "area", label: "All areas", value: t.filters.area || "All", options: areas, onChange: (v) => t.setFilter("area", v) },
            { key: "actor", label: "All people", value: t.filters.actor || "All", options: actors, onChange: (v) => t.setFilter("actor", v) },
          ]}
        />
      </div>

      {status === "loading" ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} h={56} radius={10} />)}
        </div>
      ) : status === "error" ? (
        <ErrorView error={error} onRetry={reload} />
      ) : t.rows.length === 0 ? (
        <Card>
          {t.isFiltered ? <NoResultsView onClear={t.clear} /> : (
            <EmptyView icon={History} title="No activity yet" body="Actions taken across the system will be recorded here." />
          )}
        </Card>
      ) : (
        <div className="flex flex-col gap-5">
          {grouped.map(([date, entries]) => (
            <section key={date}>
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: C.faint }}>
                {formatDate(date)}
              </h2>
              <Card padded={false}>
                <ul>
                  {entries.map((a, i) => (
                    <li
                      key={a.id}
                      className="flex items-start gap-3 px-4 py-3"
                      style={{ borderBottom: i < entries.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}
                    >
                      <Avatar name={a.actor} color={AREA_COLOR[a.area] || C.muted} size={8} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm" style={{ color: C.text }}>
                          <span className="font-medium">{a.actor}</span>{" "}
                          <span style={{ color: C.muted }}>{a.action}</span>
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: C.faint }}>{a.time}</p>
                      </div>
                      <Badge text={a.area} tone="gray" />
                    </li>
                  ))}
                </ul>
              </Card>
            </section>
          ))}
          {t.pagination.pageCount > 1 && (
            <Card padded={false}><Pagination {...t.pagination} /></Card>
          )}
        </div>
      )}
    </>
  );
}
