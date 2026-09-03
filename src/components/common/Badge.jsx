import React from "react";
import { toneMap } from "../../utils/tones";
import { FONT_BODY } from "../../constants/theme";

export default function Badge({ text, tone = "gray", icon: Icon }) {
  const t = toneMap[tone] || toneMap.gray;
  return (
    <span
      className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap"
      style={{ background: t.bg, color: t.fg, fontFamily: FONT_BODY }}
    >
      {Icon && <Icon size={12} />}
      {text}
    </span>
  );
}
