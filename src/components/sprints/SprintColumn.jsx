import React from "react";
import { C } from "../../constants/theme";
import TaskCard from "./TaskCard";

export default function SprintColumn({ col, onRemove, onMove }) {
  return (
    <div className="flex-1 min-w-[210px]">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-semibold" style={{ color: col.status === "Blocked" ? C.red : C.muted }}>
          {col.status}
        </span>
        <span className="text-xs" style={{ color: C.faint }}>{col.items.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {col.items.map((t) => (
          <TaskCard key={t.id} task={t} onRemove={onRemove} onMove={onMove} />
        ))}
        {col.items.length === 0 && (
          <div className="text-xs text-center py-4" style={{ color: C.faint }}>Empty</div>
        )}
      </div>
    </div>
  );
}
