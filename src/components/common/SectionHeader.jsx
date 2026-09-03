import React from "react";
import { C, FONT_DISPLAY } from "../../constants/theme";

export default function SectionHeader({ title, subtitle, right }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
      <div>
        <h2 className="text-lg font-semibold" style={{ color: C.text, fontFamily: FONT_DISPLAY }}>{title}</h2>
        {subtitle && <p className="text-sm mt-0.5" style={{ color: C.muted }}>{subtitle}</p>}
      </div>
      {right && <div className="flex items-center gap-2 flex-wrap">{right}</div>}
    </div>
  );
}
