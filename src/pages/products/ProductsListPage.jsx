import React from "react";
import { useNavigate } from "react-router-dom";
import { Package, Plus, IndianRupee, Building2, HeartPulse } from "lucide-react";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { useCollection } from "../../data/DataStore";
import useTableState from "../../hooks/useTableState";
import { inr, formatDate, healthTone, statusTone } from "../../utils";
import { PageHeader, Toolbar, EmptyView, NoResultsView, ErrorView, CardsSkeleton, Pagination } from "../../components/ui";
import Badge from "../../components/common/Badge";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import KpiCard from "../../components/common/KpiCard";

export const PRODUCT_TYPES = ["SaaS Product", "Service Line"];
export const PRODUCT_STATUSES = ["Live", "Live (Beta)", "Beta", "Active", "Sunset"];

function ProductCard({ product, onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="text-left rounded-lg p-4 flex flex-col gap-3 transition-colors h-full"
      style={{ background: C.panel, border: `1px solid ${C.border}` }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.goldBorder)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold truncate" style={{ color: C.text, fontFamily: FONT_DISPLAY }}>{product.name}</h3>
          <p className="text-xs mt-0.5 line-clamp-2" style={{ color: C.muted }}>{product.tagline}</p>
        </div>
        <Badge text={product.health} tone={healthTone(product.health)} />
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1">
        <div>
          <div className="text-[10px] uppercase tracking-wide" style={{ color: C.faint }}>MRR</div>
          <div className="text-sm font-semibold" style={{ color: C.gold }}>{inr(product.mrr)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide" style={{ color: C.faint }}>Clients</div>
          <div className="text-sm font-semibold">{product.clientCount}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide" style={{ color: C.faint }}>Churn</div>
          <div className="text-sm font-semibold" style={{ color: product.churn > 5 ? C.red : C.text }}>{product.churn}%</div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mt-auto pt-2" style={{ borderTop: `1px solid ${C.borderSoft}` }}>
        <span className="text-xs truncate" style={{ color: C.faint }}>{product.owner}</span>
        <Badge text={product.status} tone={statusTone(product.status)} />
      </div>
    </button>
  );
}

export default function ProductsListPage() {
  const navigate = useNavigate();
  const { rows, status, error, reload } = useCollection("products");

  const t = useTableState(rows, { searchKeys: ["name", "tagline", "owner", "stage"], pageSize: 9 });

  const mrr = rows.reduce((s, r) => s + r.mrr, 0);
  const clients = rows.reduce((s, r) => s + r.clientCount, 0);
  const atRisk = rows.filter((r) => r.health === "At Risk");

  return (
    <>
      <PageHeader
        title="Products & Services"
        description="The full portfolio of SaaS products and service lines, with recurring revenue and health."
        actions={<PrimaryBtn icon={Plus} onClick={() => navigate("/products/new")}>Add product</PrimaryBtn>}
      />

      <div className={`grid gap-3 grid-cols-2 xl:grid-cols-4 mb-4 ${status === "error" ? "hidden" : ""}`}>
        <KpiCard label="Portfolio lines" value={rows.length} icon={Package} />
        <KpiCard label="Total MRR" value={inr(mrr)} icon={IndianRupee} accent={C.gold} />
        <KpiCard label="Client accounts" value={clients} icon={Building2} accent={C.blue} />
        <KpiCard label="At risk" value={atRisk.length} icon={HeartPulse} accent={C.red} />
      </div>

      <div className="rounded-lg overflow-hidden mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <Toolbar
          query={t.query}
          onQuery={t.setQuery}
          placeholder="Search by product, owner or stage…"
          onClear={t.clear}
          filters={[
            { key: "type", label: "All types", value: t.filters.type || "All", options: ["All", ...PRODUCT_TYPES], onChange: (v) => t.setFilter("type", v) },
            { key: "health", label: "All health", value: t.filters.health || "All", options: ["All", "Good", "Watch", "At Risk"], onChange: (v) => t.setFilter("health", v) },
          ]}
        />
      </div>

      {status === "loading" ? (
        <CardsSkeleton count={6} height={150} />
      ) : status === "error" ? (
        <ErrorView error={error} onRetry={reload} />
      ) : t.rows.length === 0 ? (
        <div className="rounded-lg" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          {t.isFiltered ? <NoResultsView onClear={t.clear} /> : (
            <EmptyView
              icon={Package}
              title="No products yet"
              body="Add a SaaS product or service line to start tracking revenue and delivery."
              action={<PrimaryBtn icon={Plus} onClick={() => navigate("/products/new")}>Add product</PrimaryBtn>}
            />
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {t.rows.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={() => navigate(`/products/${p.id}`)} />
            ))}
          </div>
          {t.pagination.pageCount > 1 && (
            <div className="rounded-lg mt-3" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <Pagination {...t.pagination} />
            </div>
          )}
        </>
      )}
    </>
  );
}
