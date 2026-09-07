import React from "react";
import { AlertCircle } from "lucide-react";
import { C, FONT_DISPLAY } from "../../constants/theme";

/** A titled card grouping related inputs. */
export function FormSection({ title, description, children, columns = 2 }) {
  return (
    <section className="rounded-lg" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <header className="px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
        <h3 className="text-sm font-semibold" style={{ color: C.text, fontFamily: FONT_DISPLAY }}>{title}</h3>
        {description && <p className="text-xs mt-0.5" style={{ color: C.faint }}>{description}</p>}
      </header>
      <div className={`p-4 grid gap-4 grid-cols-1 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
        {children}
      </div>
    </section>
  );
}

/** Label + control + validation message. Pass `full` to span both columns. */
export function FormField({ label, required, error, hint, children, full }) {
  return (
    <div className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <label className="text-xs font-medium" style={{ color: C.muted }}>
        {label}
        {required && <span style={{ color: C.red }}> *</span>}
      </label>
      {children}
      {error ? (
        <span className="inline-flex items-center gap-1 text-xs" style={{ color: C.red }}>
          <AlertCircle size={11} /> {error}
        </span>
      ) : hint ? (
        <span className="text-xs" style={{ color: C.faint }}>{hint}</span>
      ) : null}
    </div>
  );
}

const controlStyle = (error) => ({
  background: C.bg,
  border: `1px solid ${error ? C.red : C.border}`,
  color: C.text,
});

export function TextInput({ error, ...props }) {
  return (
    <input
      {...props}
      className="w-full rounded-md px-3 py-2 text-sm outline-none"
      style={controlStyle(error)}
    />
  );
}

export function TextArea({ error, rows = 4, ...props }) {
  return (
    <textarea
      {...props}
      rows={rows}
      className="w-full rounded-md px-3 py-2 text-sm outline-none resize-y"
      style={controlStyle(error)}
    />
  );
}

export function SelectInput({ error, options = [], placeholder, ...props }) {
  return (
    <select {...props} className="w-full rounded-md px-3 py-2 text-sm outline-none" style={controlStyle(error)}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => {
        const value = typeof o === "string" ? o : o.value;
        const label = typeof o === "string" ? o : o.label;
        return <option key={value} value={value} style={{ background: C.panel }}>{label}</option>;
      })}
    </select>
  );
}

/** Sticky footer holding the primary and secondary form actions. */
export function FormActions({ children }) {
  return (
    <div
      className="sticky bottom-0 flex items-center justify-end gap-2 px-4 py-3 rounded-lg z-10"
      style={{ background: C.panel, border: `1px solid ${C.border}` }}
    >
      {children}
    </div>
  );
}
