import React from "react";
import { C, FONT_DISPLAY } from "../../constants/theme";

/** Label/value pairs for entity metadata. */
export function InfoGrid({ items, columns = 2 }) {
  return (
    <dl className={`grid gap-4 grid-cols-1 ${columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
      {items.filter(Boolean).map((it) => (
        <div key={it.label} className="min-w-0">
          <dt className="text-[11px] uppercase tracking-wide mb-1" style={{ color: C.faint }}>{it.label}</dt>
          <dd className="text-sm break-words" style={{ color: C.text }}>{it.value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Generic titled card used across detail pages. */
export function Card({ title, action, children, className = "", padded = true }) {
  return (
    <section className={`rounded-lg min-w-0 ${className}`} style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      {title && (
        <header className="flex items-center justify-between gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
          <h3 className="text-sm font-semibold" style={{ color: C.text, fontFamily: FONT_DISPLAY }}>{title}</h3>
          {action}
        </header>
      )}
      <div className={padded ? "p-4" : ""}>{children}</div>
    </section>
  );
}

/** Vertical activity timeline. Items: { title, meta, tone }. */
export function Timeline({ items }) {
  if (!items.length) {
    return <p className="text-sm" style={{ color: C.faint }}>No activity recorded yet.</p>;
  }
  return (
    <ol className="flex flex-col">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: it.tone || C.gold }} />
            {i < items.length - 1 && <span className="w-px flex-1" style={{ background: C.border }} />}
          </div>
          <div className={`min-w-0 ${i < items.length - 1 ? "pb-4" : ""}`}>
            <p className="text-sm" style={{ color: C.text }}>{it.title}</p>
            {it.meta && <p className="text-xs mt-0.5" style={{ color: C.faint }}>{it.meta}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
