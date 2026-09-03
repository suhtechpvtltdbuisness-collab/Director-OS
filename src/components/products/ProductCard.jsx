import React from "react";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { inr } from "../../utils/formatCurrency";
import { healthTone } from "../../utils/tones";
import Panel from "../common/Panel";
import Badge from "../common/Badge";

export default function ProductCard({ product: p }) {
  return (
    <Panel className="p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold" style={{ fontFamily: FONT_DISPLAY }}>{p.name}</div>
          <div className="text-xs" style={{ color: C.muted }}>{p.type}</div>
        </div>
        <Badge text={p.health} tone={healthTone(p.health)} />
      </div>
      <p className="text-xs" style={{ color: C.muted }}>{p.tagline}</p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <div style={{ color: C.faint }}>Revenue / mo</div>
          <div className="font-semibold" style={{ color: C.gold }}>{inr(p.mrr)}</div>
        </div>
        <div>
          <div style={{ color: C.faint }}>Clients</div>
          <div className="font-semibold">{p.clients}</div>
        </div>
        <div>
          <div style={{ color: C.faint }}>Stage</div>
          <div>{p.stage}</div>
        </div>
        <div>
          <div style={{ color: C.faint }}>Status</div>
          <div>{p.status}</div>
        </div>
      </div>
      <div
        className="flex items-center justify-between text-xs pt-2"
        style={{ borderTop: `1px solid ${C.borderSoft}` }}
      >
        <span style={{ color: C.faint }}>Marketing: {p.marketingStage}</span>
        <span style={{ color: C.faint }}>Owner: {p.owner.split(" ")[0]}</span>
      </div>
    </Panel>
  );
}
