import React from "react";
import { Shield, Rocket, DollarSign } from "lucide-react";
import { CircleCheck, CircleX, PercentCircle } from "lucide-react";
import { C } from "../../constants/theme";
import { riskTone, toneMap } from "../../utils/tones";
import Panel from "../common/Panel";
import Badge from "../common/Badge";
import PrimaryBtn from "../common/PrimaryBtn";
import GhostBtn from "../common/GhostBtn";
import ApprovalGate from "../common/ApprovalGate";

const typeIcon = { "Production Deployment": Rocket, Discount: PercentCircle, "Payment Release": DollarSign };

export default function ApprovalCard({ approval: a, isDirector, onApprove, onReject }) {
  const Icon = typeIcon[a.type] || Shield;
  return (
    <Panel className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
      <div className="flex items-start gap-3 min-w-0">
        <div className="rounded-md p-2 shrink-0" style={{ background: `${toneMap[riskTone(a.risk)].fg}22` }}>
          <Icon size={16} style={{ color: toneMap[riskTone(a.risk)].fg }} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium">{a.title}</div>
          <div className="text-xs mt-0.5" style={{ color: C.muted }}>{a.detail}</div>
          <div className="text-xs mt-1" style={{ color: C.faint }}>{a.type} · Requested by {a.requestedBy}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge text={`Risk: ${a.risk}`} tone={riskTone(a.risk)} />
        {isDirector ? (
          <>
            <GhostBtn tone="red" icon={CircleX} onClick={() => onReject(a)}>Reject</GhostBtn>
            <PrimaryBtn icon={CircleCheck} onClick={() => onApprove(a)}>Approve</PrimaryBtn>
          </>
        ) : <ApprovalGate>Director access required</ApprovalGate>}
      </div>
    </Panel>
  );
}
