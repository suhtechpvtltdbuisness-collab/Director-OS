import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Pencil, Trash2 } from "lucide-react";
import { C } from "../../constants/theme";
import { useRecord, useStore } from "../../data/DataStore";
import { useSession } from "../../context/SessionContext";
import { formatDate } from "../../utils";
import { PageHeader, Card, InfoGrid, ConfirmDialog, NotFoundView, ErrorView, Skeleton } from "../../components/ui";
import Badge from "../../components/common/Badge";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import GhostBtn from "../../components/common/GhostBtn";

export default function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useSession();
  const { data, remove } = useStore();
  const { record: doc, status, error, notFound, reload } = useRecord("documents", id);
  const [confirming, setConfirming] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  if (status === "loading") {
    return <div className="flex flex-col gap-4"><Skeleton h={72} /><Skeleton h={220} radius={10} /></div>;
  }
  if (status === "error") return <ErrorView error={error} onRetry={reload} />;
  if (notFound) {
    return <NotFoundView what="document" action={<PrimaryBtn onClick={() => navigate("/documents")}>Back to documents</PrimaryBtn>} />;
  }

  const siblings = data.documents.filter((d) => d.folder === doc.folder && d.id !== doc.id);

  async function confirmDelete() {
    setBusy(true);
    try {
      await remove("documents", doc.id);
      toast("Document removed");
      navigate("/documents");
    } catch (err) {
      toast(err.message || "Could not remove document", "red");
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Documents", to: "/documents" }, { label: doc.name }]}
        title={doc.name}
        description={`Filed under ${doc.folder}`}
        meta={
          <>
            <Badge text={doc.type} tone="gray" />
            <Badge text={doc.version} tone="blue" />
            <span className="text-xs" style={{ color: C.faint }}>Updated {formatDate(doc.updated)}</span>
          </>
        }
        actions={
          <>
            <GhostBtn icon={Pencil} onClick={() => navigate(`/documents/${doc.id}/edit`)}>Edit</GhostBtn>
            <GhostBtn icon={Trash2} tone="red" onClick={() => setConfirming(true)}>Delete</GhostBtn>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Preview" className="lg:col-span-2">
          <div
            className="flex flex-col items-center justify-center gap-3 py-14 rounded-md"
            style={{ background: C.bg, border: `1px dashed ${C.border}` }}
          >
            <FileText size={30} style={{ color: C.faint }} />
            <p className="text-sm" style={{ color: C.muted }}>{doc.name}</p>
            <p className="text-xs max-w-xs text-center" style={{ color: C.faint }}>
              File contents are stored outside Director OS. This record tracks ownership, version and where the document lives.
            </p>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card title="Details">
            <InfoGrid
              columns={2}
              items={[
                { label: "Folder", value: doc.folder },
                { label: "Type", value: doc.type },
                { label: "Version", value: doc.version },
                { label: "Size", value: doc.size },
                { label: "Owner", value: doc.owner },
                { label: "Updated", value: formatDate(doc.updated) },
              ]}
            />
          </Card>

          <Card title={`Also in ${doc.folder}`}>
            {siblings.length ? (
              <ul className="flex flex-col">
                {siblings.map((d, i) => (
                  <li key={d.id} className="py-2" style={{ borderBottom: i < siblings.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                    <button onClick={() => navigate(`/documents/${d.id}`)} className="w-full text-left text-sm truncate hover:underline" style={{ color: C.muted }}>
                      {d.name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm" style={{ color: C.faint }}>This is the only document in the folder.</p>
            )}
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Delete document"
        body={`This will permanently remove "${doc.name}".`}
        confirmLabel="Delete document"
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setConfirming(false)}
      />
    </>
  );
}
