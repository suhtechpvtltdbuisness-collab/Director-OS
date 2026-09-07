import React from "react";
import Modal from "../common/Modal";
import PrimaryBtn from "../common/PrimaryBtn";
import GhostBtn from "../common/GhostBtn";
import { C } from "../../constants/theme";

export default function ConfirmDialog({ open, title, body, confirmLabel = "Confirm", tone = "red", busy, onConfirm, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <GhostBtn onClick={onClose}>Cancel</GhostBtn>
          <PrimaryBtn tone={tone} onClick={onConfirm} disabled={busy}>
            {busy ? "Working…" : confirmLabel}
          </PrimaryBtn>
        </>
      }
    >
      <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{body}</p>
    </Modal>
  );
}
