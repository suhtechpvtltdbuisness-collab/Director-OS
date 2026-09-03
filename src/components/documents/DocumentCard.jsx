import React from "react";
import { FileText, Download } from "lucide-react";
import { C } from "../../constants/theme";
import Panel from "../common/Panel";

export default function DocumentCard({ doc: d }) {
  return (
    <Panel className="p-3 flex items-center gap-3">
      <div className="rounded-md p-2" style={{ background: `${C.blue}22` }}>
        <FileText size={16} style={{ color: C.blue }} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium truncate">{d.name}</div>
        <div className="text-xs" style={{ color: C.faint }}>{d.folder} · {d.owner} · {d.updated}</div>
      </div>
      <Download size={14} style={{ color: C.faint }} />
    </Panel>
  );
}
