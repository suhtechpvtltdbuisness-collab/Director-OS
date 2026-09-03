import React, { useState } from "react";
import { C, FONT_MONO } from "../../constants/theme";
import { inrFull } from "../../utils/formatCurrency";
import Modal from "../common/Modal";
import Badge from "../common/Badge";
import Field from "../common/Field";
import Select from "../common/Select";
import GhostBtn from "../common/GhostBtn";
import PrimaryBtn from "../common/PrimaryBtn";
import { LEAD_STAGES } from "../../constants/labels";

const stageTone = {
  New: "gray", Contacted: "blue", Demo: "purple", Proposal: "blue",
  Negotiation: "amber", Won: "green", Lost: "red",
};

export default function LeadDetailModal({ lead, onClose, onMoveStage, onRemove }) {
  const [stage, setStage] = useState(lead?.stage || "New");
  const [notes, setNotes] = useState(lead?.notes || "");

  if (!lead) return null;

  function save() {
    onMoveStage(lead.id, stage);
    onClose();
  }

  return (
    <Modal open={!!lead} onClose={onClose} title={`Lead: ${lead.name}`} wide>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">{lead.name}</div>
            <div className="text-xs mt-0.5" style={{ color: C.muted }}>
              Product: {lead.product} · Source: {lead.source} · Owner: {lead.owner}
            </div>
          </div>
          <Badge text={lead.stage} tone={stageTone[lead.stage] || "gray"} />
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-md p-3" style={{ background: C.panel2, border: `1px solid ${C.borderSoft}` }}>
            <div style={{ color: C.faint }}>Deal Value</div>
            <div className="font-semibold mt-1 text-sm" style={{ color: C.gold }}>{inrFull(lead.value)}</div>
          </div>
          <div className="rounded-md p-3" style={{ background: C.panel2, border: `1px solid ${C.borderSoft}` }}>
            <div style={{ color: C.faint }}>Last Updated</div>
            <div className="font-semibold mt-1">{lead.updated}</div>
          </div>
        </div>

        <Field label="Move to stage">
          <Select value={stage} onChange={(e) => setStage(e.target.value)}>
            {LEAD_STAGES.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </Field>

        <Field label="Notes">
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add context, follow-up notes…"
            className="w-full rounded-md px-3 py-2 text-sm resize-none"
            style={{ background: C.panel2, border: `1px solid ${C.border}`, color: C.text }}
          />
        </Field>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => { onRemove(lead.id, lead.name); onClose(); }}
            className="text-xs"
            style={{ color: C.red }}
          >
            Remove lead
          </button>
          <div className="flex gap-2">
            <GhostBtn onClick={onClose}>Cancel</GhostBtn>
            <PrimaryBtn onClick={save}>Save</PrimaryBtn>
          </div>
        </div>
      </div>
    </Modal>
  );
}
