import React from "react";
import { C } from "../../constants/theme";
import Badge from "../common/Badge";

export default function SearchDropdown({ results, onSelect }) {
  if (!results.length) {
    return (
      <div className="px-3 py-3 text-sm" style={{ color: C.faint }}>No matches</div>
    );
  }
  return (
    <>
      {results.map((r, i) => (
        <button
          key={i}
          onClick={() => onSelect(r.tab)}
          className="w-full text-left px-3 py-2 text-sm flex items-center justify-between"
          style={{ borderBottom: i < results.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}
        >
          <span>{r.label}</span>
          <Badge text={r.kind} tone="gray" />
        </button>
      ))}
    </>
  );
}
