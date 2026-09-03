import React from "react";
import { C } from "../../constants/theme";
import { inrFull } from "../../utils/formatCurrency";
import Modal from "../common/Modal";
import ApprovalGate from "../common/ApprovalGate";
import GhostBtn from "../common/GhostBtn";
import PrimaryBtn from "../common/PrimaryBtn";

export default function EscalateModal({ invoice, onClose, onApprove }) {
  return (
    <Modal
      open={!!invoice}
      onClose={onClose}
      title="Approve Escalation"
      footer={
        <>
          <GhostBtn onClick={onClose}>Cancel</GhostBtn>
          <PrimaryBtn onClick={onApprove}>Approve Escalation</PrimaryBtn>
        </>
      }
    >
      {invoice && (
        <div className="flex flex-col gap-3 text-sm">
          <ApprovalGate>High-risk financial action — director approval required</ApprovalGate>
          <p style={{ color: C.muted }}>
            Escalate <b style={{ color: C.text }}>{invoice.id}</b> for{" "}
            <b style={{ color: C.text }}>{invoice.client}</b> — {inrFull(invoice.amount)},{" "}
            {invoice.daysOverdue} days overdue — to formal collections notice.
          </p>
        </div>
      )}
    </Modal>
  );
}
