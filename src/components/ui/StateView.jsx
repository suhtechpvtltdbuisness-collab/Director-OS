import React from "react";
import { AlertTriangle, Inbox, Lock, RotateCw, SearchX } from "lucide-react";
import { C, FONT_DISPLAY } from "../../constants/theme";
import PrimaryBtn from "../common/PrimaryBtn";
import GhostBtn from "../common/GhostBtn";

function Shell({ icon: Icon, tone, title, body, actions }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-14 gap-3">
      <div className="rounded-xl p-3" style={{ background: `${tone}1A`, border: `1px solid ${tone}33` }}>
        <Icon size={22} style={{ color: tone }} />
      </div>
      <h3 className="text-base font-semibold" style={{ color: C.text, fontFamily: FONT_DISPLAY }}>{title}</h3>
      {body && <p className="text-sm max-w-sm leading-relaxed" style={{ color: C.muted }}>{body}</p>}
      {actions && <div className="flex items-center gap-2 mt-1">{actions}</div>}
    </div>
  );
}

export function EmptyView({ title = "Nothing here yet", body, action, icon = Inbox }) {
  return <Shell icon={icon} tone={C.faint} title={title} body={body} actions={action} />;
}

export function NoResultsView({ onClear }) {
  return (
    <Shell
      icon={SearchX}
      tone={C.faint}
      title="No matching records"
      body="No records match your current search and filters. Try widening them."
      actions={onClear && <GhostBtn onClick={onClear}>Clear filters</GhostBtn>}
    />
  );
}

export function ErrorView({ error, onRetry }) {
  return (
    <Shell
      icon={AlertTriangle}
      tone={C.red}
      title="Something went wrong"
      body={error || "We couldn't load this data."}
      actions={onRetry && <PrimaryBtn icon={RotateCw} onClick={onRetry}>Try again</PrimaryBtn>}
    />
  );
}

export function ForbiddenView({ body = "Your role doesn't have access to this area. Contact a director if you need it." }) {
  return <Shell icon={Lock} tone={C.gold} title="You don't have access" body={body} />;
}

export function NotFoundView({ what = "record", action }) {
  return (
    <Shell
      icon={SearchX}
      tone={C.amber}
      title={`This ${what} doesn't exist`}
      body={`The ${what} you're looking for may have been deleted, or the link is wrong.`}
      actions={action}
    />
  );
}

/** Shimmering placeholder block. */
export function Skeleton({ h = 14, w = "100%", className = "", radius = 6 }) {
  return (
    <div
      className={`animate-pulse ${className}`}
      style={{ height: h, width: w, borderRadius: radius, background: C.track }}
    />
  );
}

export function TableSkeleton({ rows = 6, cols = 5 }) {
  return (
    <div className="p-4 flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} w={c === 0 ? "26%" : `${Math.round(60 / (cols - 1))}%`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardsSkeleton({ count = 6, height = 120 }) {
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} h={height} radius={10} />
      ))}
    </div>
  );
}
