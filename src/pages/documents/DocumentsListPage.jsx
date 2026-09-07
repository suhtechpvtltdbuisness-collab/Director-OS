import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, Trash2, Eye, Pencil, FolderOpen, HardDrive } from "lucide-react";
import { C } from "../../constants/theme";
import { useCollection, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import useTableState from "../../hooks/useTableState";
import { formatDate } from "../../utils";
import { PageHeader, Toolbar, DataTable, EmptyView, NoResultsView, ConfirmDialog } from "../../components/ui";
import Badge from "../../components/common/Badge";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import KpiCard from "../../components/common/KpiCard";

export const FOLDERS = ["Product Specs", "Client Contracts", "SOPs", "Marketing Assets", "Finance"];
export const FILE_TYPES = ["PDF", "DOCX", "XLSX", "PPTX", "PNG"];

const TYPE_TONE = { PDF: "red", DOCX: "blue", XLSX: "green", PPTX: "amber", PNG: "gray" };

export default function DocumentsListPage() {
  const navigate = useNavigate();
  const { rows, status, error, reload } = useCollection("documents");
  const { remove } = useStore();
  const { toast } = useSession();
  const [pendingDelete, setPendingDelete] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  const owners = React.useMemo(() => ["All", ...Array.from(new Set(rows.map((r) => r.owner))).sort()], [rows]);

  const t = useTableState(rows, {
    searchKeys: ["name", "folder", "owner"],
    initialSort: { key: "updated", dir: "desc" },
  });

  async function confirmDelete() {
    setBusy(true);
    try {
      await remove("documents", pendingDelete.id);
      toast("Document removed");
      setPendingDelete(null);
    } catch (err) {
      toast(err.message || "Could not remove document", "red");
    } finally {
      setBusy(false);
    }
  }

  const columns = [
    {
      key: "name", label: "Document", sortable: true, primary: true,
      render: (r) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <FileText size={15} style={{ color: C.faint }} className="shrink-0" />
          <div className="min-w-0">
            <div className="font-medium truncate" style={{ color: C.text }}>{r.name}</div>
            <div className="text-xs truncate" style={{ color: C.faint }}>{r.folder}</div>
          </div>
        </div>
      ),
    },
    { key: "type", label: "Type", sortable: true, render: (r) => <Badge text={r.type} tone={TYPE_TONE[r.type] || "gray"} /> },
    { key: "size", label: "Size", sortable: true, align: "right", secondary: true },
    { key: "version", label: "Version", sortable: true, secondary: true },
    { key: "owner", label: "Owner", sortable: true },
    { key: "updated", label: "Last updated", sortable: true, render: (r) => formatDate(r.updated) },
  ];

  return (
    <>
      <PageHeader
        title="Documents"
        description="Contracts, specifications and internal playbooks, organised by folder."
        actions={<PrimaryBtn icon={Plus} onClick={() => navigate("/documents/new")}>Add document</PrimaryBtn>}
      />

      <div className={`grid gap-3 grid-cols-2 xl:grid-cols-3 mb-4 ${status === "error" ? "hidden" : ""}`}>
        <KpiCard label="Documents" value={rows.length} icon={FileText} />
        <KpiCard label="Folders" value={new Set(rows.map((r) => r.folder)).size} icon={FolderOpen} accent={C.blue} />
        <KpiCard label="Contributors" value={new Set(rows.map((r) => r.owner)).size} icon={HardDrive} accent={C.green} />
      </div>

      <div className="rounded-lg overflow-hidden" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <Toolbar
          query={t.query}
          onQuery={t.setQuery}
          placeholder="Search documents by name, folder or owner…"
          onClear={t.clear}
          filters={[
            { key: "folder", label: "All folders", value: t.filters.folder || "All", options: ["All", ...FOLDERS], onChange: (v) => t.setFilter("folder", v) },
            { key: "type", label: "All types", value: t.filters.type || "All", options: ["All", ...FILE_TYPES], onChange: (v) => t.setFilter("type", v) },
            { key: "owner", label: "All owners", value: t.filters.owner || "All", options: owners, onChange: (v) => t.setFilter("owner", v) },
          ]}
        />
        <DataTable
          columns={columns}
          rows={t.rows}
          loading={status === "loading"}
          error={status === "error" ? error : null}
          onRetry={reload}
          sort={t.sort}
          onSort={t.toggleSort}
          onRowClick={(r) => navigate(`/documents/${r.id}`)}
          pagination={t.pagination}
          rowActions={(r) => [
            { label: "View document", icon: Eye, onClick: () => navigate(`/documents/${r.id}`) },
            { label: "Edit details", icon: Pencil, onClick: () => navigate(`/documents/${r.id}/edit`) },
            { label: "Delete", icon: Trash2, tone: "red", onClick: () => setPendingDelete(r) },
          ]}
          empty={t.isFiltered ? <NoResultsView onClear={t.clear} /> : (
            <EmptyView
              icon={FileText}
              title="No documents"
              body="Add contracts, specifications and playbooks so the team can find them in one place."
              action={<PrimaryBtn icon={Plus} onClick={() => navigate("/documents/new")}>Add document</PrimaryBtn>}
            />
          )}
        />
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete document"
        body={`This will permanently remove "${pendingDelete?.name}".`}
        confirmLabel="Delete document"
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </>
  );
}
