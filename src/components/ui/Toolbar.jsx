import React from "react";
import { Search, X } from "lucide-react";
import { C } from "../../constants/theme";

/**
 * List-page control strip: a search box, any number of filter selects and an
 * optional right-hand slot.
 */
export default function Toolbar({ query, onQuery, placeholder = "Search…", filters = [], right, onClear }) {
  const dirty = query || filters.some((f) => f.value && f.value !== "All");

  return (
    <div className="flex flex-wrap items-center gap-2 p-3" style={{ borderBottom: `1px solid ${C.border}` }}>
      <div className="relative flex-1 min-w-[180px]">
        <Search size={14} style={{ position: "absolute", left: 10, top: 9, color: C.faint }} />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md pl-8 pr-3 py-1.5 text-sm outline-none focus:ring-1"
          style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text }}
        />
      </div>

      {filters.map((f) => (
        <select
          key={f.key}
          value={f.value}
          onChange={(e) => f.onChange(e.target.value)}
          className="rounded-md px-2.5 py-1.5 text-sm outline-none"
          style={{
            background: C.bg,
            border: `1px solid ${f.value && f.value !== "All" ? C.goldBorder : C.border}`,
            color: f.value && f.value !== "All" ? C.gold : C.muted,
          }}
        >
          {f.options.map((o) => (
            <option key={o} value={o} style={{ color: C.text, background: C.panel }}>
              {o === "All" ? f.label : o}
            </option>
          ))}
        </select>
      ))}

      {dirty && onClear && (
        <button
          onClick={onClear}
          className="inline-flex items-center gap-1 text-xs rounded-md px-2 py-1.5"
          style={{ color: C.muted, border: `1px solid ${C.border}` }}
        >
          <X size={12} /> Clear
        </button>
      )}

      {right && <div className="ml-auto flex items-center gap-2">{right}</div>}
    </div>
  );
}
