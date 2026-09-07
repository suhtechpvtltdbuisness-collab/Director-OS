import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { C, FONT_DISPLAY } from "../../constants/theme";

/**
 * Standard page masthead: optional breadcrumb, title, one-line description and
 * a right-aligned action cluster.
 */
export default function PageHeader({ title, description, breadcrumbs = [], actions, meta }) {
  return (
    <div className="mb-5">
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 mb-2 text-xs flex-wrap" style={{ color: C.faint }}>
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={i}>
              {b.to ? (
                <Link to={b.to} className="hover:underline" style={{ color: C.muted }}>{b.label}</Link>
              ) : (
                <span>{b.label}</span>
              )}
              {i < breadcrumbs.length - 1 && <ChevronRight size={12} />}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight truncate" style={{ color: C.text, fontFamily: FONT_DISPLAY }}>
            {title}
          </h1>
          {description && <p className="text-sm mt-1" style={{ color: C.muted }}>{description}</p>}
          {meta && <div className="flex items-center gap-2 mt-2 flex-wrap">{meta}</div>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
