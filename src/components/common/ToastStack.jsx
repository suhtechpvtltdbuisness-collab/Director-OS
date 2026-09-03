import React from "react";
import { C } from "../../constants/theme";
import { toneMap } from "../../utils/tones";

export default function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-16 md:bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="px-3 py-2 rounded-md text-sm shadow-lg"
          style={{
            background: C.panel2,
            border: `1px solid ${toneMap[t.tone]?.fg || C.border}`,
            color: C.text,
          }}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}
