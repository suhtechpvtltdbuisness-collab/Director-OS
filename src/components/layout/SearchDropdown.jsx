import React from "react";
import { C } from "../../constants/theme";
import Badge from "../common/Badge";

export default function SearchDropdown({ results, onSelect }) {
  if (!results.length) {
    return <div className="px-3 py-3 text-sm" style={{ color: C.faint }}>No matches found</div>;
  }
  return (
    <div className="max-h-80 overflow-y-auto">
      {results.map((r, i) => (
        <button
          key={`${r.to}-${i}`}
          onClick={() => onSelect(r.to)}
          className="w-full text-left px-3 py-2 text-sm flex items-center justify-between gap-3 hover:opacity-80"
          style={{ borderBottom: i < results.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}
        >
          <span className="truncate" style={{ color: C.text }}>{r.label}</span>
          <Badge text={r.kind} tone="gray" />
        </button>
      ))}
    </div>
  );
}
