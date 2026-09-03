import React from "react";
import { initials } from "../../utils/initials";

export default function Avatar({ name, color, size = 8, textSize = "text-xs" }) {
  const px = size * 4;
  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold shrink-0 ${textSize}`}
      style={{
        width: px,
        height: px,
        background: color + "33",
        color: color,
      }}
    >
      {initials(name)}
    </div>
  );
}
