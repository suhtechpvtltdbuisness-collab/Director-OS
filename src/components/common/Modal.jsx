import React from "react";
import { X } from "lucide-react";
import { C, FONT_DISPLAY } from "../../constants/theme";

export default function Modal({ open, onClose, title, children, footer, wide }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "#00000088" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${wide ? "sm:max-w-2xl" : "sm:max-w-md"} rounded-t-xl sm:rounded-xl max-h-[90vh] overflow-y-auto`}
        style={{ background: C.panel2, border: `1px solid ${C.border}` }}
      >
        <div
          className="flex items-center justify-between px-4 py-3 sticky top-0"
          style={{ background: C.panel2, borderBottom: `1px solid ${C.border}` }}
        >
          <h3 className="text-sm font-semibold" style={{ color: C.text, fontFamily: FONT_DISPLAY }}>{title}</h3>
          <button onClick={onClose} style={{ color: C.muted }}><X size={18} /></button>
        </div>
        <div className="p-4">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 px-4 py-3" style={{ borderTop: `1px solid ${C.border}` }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
