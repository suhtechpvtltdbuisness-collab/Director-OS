import React from "react";
import { C } from "../../constants/theme";
import Modal from "../common/Modal";
import ApprovalGate from "../common/ApprovalGate";
import Panel from "../common/Panel";
import GhostBtn from "../common/GhostBtn";
import PrimaryBtn from "../common/PrimaryBtn";

export default function ApprovalConfirmModal({ approval, decision, onClose, onConfirm }) {
  return (
    <Modal
      open={!!approval}
      onClose={onClose}
      title={`Confirm ${decision}`}
      footer={
        <>
          <GhostBtn onClick={onClose}>Cancel</GhostBtn>
          <PrimaryBtn tone={decision === "Rejected" ? "red" : "gold"} onClick={onConfirm}>
            Confirm {decision}
          </PrimaryBtn>
        </>
      }
    >
      {approval && (
        <div className="flex flex-col gap-3 text-sm">
          <ApprovalGate>
            This action requires explicit director confirmation and will be recorded in the audit log
          </ApprovalGate>
          <Panel className="p-3">
            <div className="font-medium">{approval.title}</div>
            <div className="text-xs mt-1" style={{ color: C.muted }}>{approval.detail}</div>
          </Panel>
          <p style={{ color: C.muted }}>
            You are about to <b style={{ color: C.text }}>{decision?.toLowerCase()}</b> this{" "}
            {approval.type.toLowerCase()} request from {approval.requestedBy}.
          </p>
        </div>
      )}
    </Modal>
  );
}
