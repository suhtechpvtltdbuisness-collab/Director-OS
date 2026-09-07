import React, { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { C } from "../../constants/theme";

/** Overflow menu for a table row. `actions` is [{ label, icon, onClick, tone }]. */
export default function RowActions({ actions = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  if (!actions.length) return null;

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="p-1.5 rounded-md"
        style={{ color: C.muted, background: open ? C.track : "transparent" }}
        aria-label="Row actions"
      >
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-44 rounded-md overflow-hidden z-30 shadow-xl"
          style={{ background: C.panel2, border: `1px solid ${C.border}` }}
        >
          {actions.map((a) => (
            <button
              key={a.label}
              onClick={(e) => { e.stopPropagation(); setOpen(false); a.onClick(); }}
              className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:opacity-80"
              style={{ color: a.tone === "red" ? C.red : C.text }}
            >
              {a.icon && <a.icon size={13} />} {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
