import { useMemo, useState } from "react";

/**
 * Search, filter, sort and paginate a list of records.
 *
 * `searchKeys` are matched case-insensitively. `filters` maps a field name to the
 * currently selected value, where "All" means no constraint.
 */
export default function useTableState(rows, { searchKeys = [], initialSort = null, pageSize = 10 } = {}) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (q && !searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(q))) return false;
      return Object.entries(filters).every(([k, v]) => !v || v === "All" || String(r[k]) === v);
    });
  }, [rows, query, filters, searchKeys]);

  const sorted = useMemo(() => {
    if (!sort?.key) return filtered;
    const dir = sort.dir === "desc" ? -1 : 1;
    return [...filtered].sort((a, b) => {
      const x = a[sort.key], y = b[sort.key];
      if (typeof x === "number" && typeof y === "number") return (x - y) * dir;
      return String(x ?? "").localeCompare(String(y ?? "")) * dir;
    });
  }, [filtered, sort]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pageCount);
  const paged = sorted.slice((current - 1) * pageSize, current * pageSize);

  const setFilter = (key, value) => { setFilters((f) => ({ ...f, [key]: value })); setPage(1); };

  return {
    query,
    setQuery: (v) => { setQuery(v); setPage(1); },
    filters,
    setFilter,
    sort,
    toggleSort: (key) =>
      setSort((s) => (s?.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" })),
    clear: () => { setQuery(""); setFilters({}); setPage(1); },
    rows: paged,
    total: sorted.length,
    isFiltered: Boolean(query) || Object.values(filters).some((v) => v && v !== "All"),
    pagination: { page: current, pageCount, total: sorted.length, pageSize, onPage: setPage },
  };
}
