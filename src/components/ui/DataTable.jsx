import React from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { C } from "../../constants/theme";
import { ErrorView, TableSkeleton } from "./StateView";
import Pagination from "./Pagination";
import RowActions from "./RowActions";

/**
 * Table for desktop, stacked cards below `md`.
 *
 * Columns: { key, label, render?, sortable?, align?, width?, primary?, secondary? }
 * `primary` names the heading of the mobile card; `secondary` columns are hidden
 * on mobile to keep the card readable.
 */
export default function DataTable({
  columns,
  rows,
  loading,
  error,
  onRetry,
  onRowClick,
  rowActions,
  empty,
  sort,
  onSort,
  pagination,
}) {
  if (loading) return <TableSkeleton cols={Math.min(columns.length, 6)} />;
  if (error) return <ErrorView error={error} onRetry={onRetry} />;
  if (!rows.length) return empty || null;

  const primary = columns.find((c) => c.primary) || columns[0];
  const cardCols = columns.filter((c) => c !== primary && !c.secondary);

  const sortIcon = (key) => {
    if (sort?.key !== key) return <ChevronsUpDown size={12} style={{ color: C.faint }} />;
    return sort.dir === "asc"
      ? <ArrowUp size={12} style={{ color: C.gold }} />
      : <ArrowDown size={12} style={{ color: C.gold }} />;
  };

  return (
    <div>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="text-left font-medium px-4 py-2.5 whitespace-nowrap"
                  style={{ color: C.faint, fontSize: 11, letterSpacing: ".04em", textTransform: "uppercase", width: c.width, textAlign: c.align || "left" }}
                >
                  {c.sortable && onSort ? (
                    <button
                      onClick={() => onSort(c.key)}
                      className="inline-flex items-center gap-1 hover:opacity-80"
                      style={{ color: sort?.key === c.key ? C.gold : C.faint }}
                    >
                      {c.label} {sortIcon(c.key)}
                    </button>
                  ) : c.label}
                </th>
              ))}
              {rowActions && <th style={{ width: 44 }} />}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className="transition-colors"
                style={{
                  borderBottom: `1px solid ${C.borderSoft}`,
                  cursor: onRowClick ? "pointer" : "default",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.panel2)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 align-middle" style={{ color: C.text, textAlign: c.align || "left" }}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
                {rowActions && (
                  <td className="px-2 py-3 text-right">
                    <RowActions actions={rowActions(row)} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-2 p-3">
        {rows.map((row) => (
          <div
            key={row.id}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className="rounded-lg p-3 flex flex-col gap-2"
            style={{ background: C.panel2, border: `1px solid ${C.border}` }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 font-medium" style={{ color: C.text }}>
                {primary.render ? primary.render(row) : row[primary.key]}
              </div>
              {rowActions && <RowActions actions={rowActions(row)} />}
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {cardCols.map((c) => (
                <div key={c.key} className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: C.faint }}>{c.label}</div>
                  <div className="text-sm truncate" style={{ color: C.muted }}>
                    {c.render ? c.render(row) : row[c.key]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {pagination && <Pagination {...pagination} />}
    </div>
  );
}
