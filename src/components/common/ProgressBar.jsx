import React from "react";
import { toneMap } from "../../utils/tones";

export default function ProgressBar({ value, tone = "blue", height = 6 }) {
  const t = toneMap[tone] || toneMap.blue;
  return (
    <div style={{ background: "#232C40", height, borderRadius: 99, width: "100%", overflow: "hidden" }}>
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          background: t.fg,
          borderRadius: 99,
          transition: "width .4s ease",
        }}
      />
    </div>
  );
}
