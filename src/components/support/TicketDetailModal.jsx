import React from "react";
import { C, FONT_MONO } from "../../constants/theme";
import { riskTone } from "../../utils/tones";
import Modal from "../common/Modal";
import Badge from "../common/Badge";
import Field from "../common/Field";
import Select from "../common/Select";
import GhostBtn from "../common/GhostBtn";
import PrimaryBtn from "../common/PrimaryBtn";
import { TICKET_STATUSES } from "../../constants/labels";

export default function TicketDetailModal({ ticket: t, onClose, onUpdateStatus }) {
  if (!t) return null;
  return (
    <Modal open={!!t} onClose={onClose} title={`Ticket ${t.id}`} wide>
      <div className="flex flex-col gap-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">{t.subject}</div>
            <div className="text-xs mt-0.5" style={{ color: C.muted }}>
              Client: <b style={{ color: C.text }}>{t.client}</b> · Product: {t.product}
            </div>
          </div>
          <Badge text={t.priority} tone={riskTone(t.priority)} />
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-md p-3" style={{ background: C.panel2, border: `1px solid ${C.borderSoft}` }}>
            <div style={{ color: C.faint }}>Ticket ID</div>
            <div className="font-semibold mt-1" style={{ fontFamily: FONT_MONO, color: C.gold }}>{t.id}</div>
          </div>
          <div className="rounded-md p-3" style={{ background: C.panel2, border: `1px solid ${C.borderSoft}` }}>
            <div style={{ color: C.faint }}>Last Updated</div>
            <div className="font-semibold mt-1">{t.updated}</div>
          </div>
          <div className="rounded-md p-3" style={{ background: C.panel2, border: `1px solid ${C.borderSoft}` }}>
            <div style={{ color: C.faint }}>Product</div>
            <div className="font-semibold mt-1">{t.product}</div>
          </div>
          <div className="rounded-md p-3" style={{ background: C.panel2, border: `1px solid ${C.borderSoft}` }}>
            <div style={{ color: C.faint }}>Current Status</div>
            <div className="mt-1"><Badge text={t.status} tone={t.status === "Resolved" ? "green" : t.status === "In Progress" ? "amber" : "red"} /></div>
          </div>
        </div>

        {/* Update status */}
        <Field label="Update status">
          <Select
            defaultValue={t.status}
            onChange={(e) => onUpdateStatus(t.id, e.target.value)}
          >
            {TICKET_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </Field>

        <div className="flex justify-end gap-2">
          <GhostBtn onClick={onClose}>Close</GhostBtn>
          <PrimaryBtn onClick={onClose}>Save & Close</PrimaryBtn>
        </div>
      </div>
    </Modal>
  );
}
