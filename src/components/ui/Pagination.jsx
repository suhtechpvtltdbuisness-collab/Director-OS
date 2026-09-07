import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { C } from "../../constants/theme";

export default function Pagination({ page, pageCount, total, pageSize, onPage }) {
  if (total === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const btn = (dir, disabled) => ({
    background: "transparent",
    border: `1px solid ${C.border}`,
    color: disabled ? C.disabled : C.muted,
    cursor: disabled ? "not-allowed" : "pointer",
  });

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
      style={{ borderTop: `1px solid ${C.border}` }}
    >
      <span className="text-xs" style={{ color: C.faint }}>
        Showing <span style={{ color: C.muted }}>{from}–{to}</span> of{" "}
        <span style={{ color: C.muted }}>{total}</span>
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs"
          style={btn("prev", page <= 1)}
        >
          <ChevronLeft size={13} /> Prev
        </button>
        <span className="text-xs px-2" style={{ color: C.muted }}>
          {page} / {pageCount}
        </span>
        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= pageCount}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs"
          style={btn("next", page >= pageCount)}
        >
          Next <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
