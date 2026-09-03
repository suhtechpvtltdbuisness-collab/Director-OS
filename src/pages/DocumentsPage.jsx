import React, { useState } from "react";
import { Folder, FileText, Upload } from "lucide-react";
import { C } from "../constants/theme";
import { DOCUMENTS } from "../constants/seedData";
import SectionHeader from "../components/common/SectionHeader";
import KpiCard from "../components/common/KpiCard";
import IconBtn from "../components/common/IconBtn";
import Input from "../components/common/Input";
import PrimaryBtn from "../components/common/PrimaryBtn";
import DocumentCard from "../components/documents/DocumentCard";

export default function DocumentsPage() {
  const [folder, setFolder] = useState("All");
  const [q, setQ] = useState("");

  const folders = ["All", ...Array.from(new Set(DOCUMENTS.map((d) => d.folder)))];
  const filtered = DOCUMENTS
    .filter((d) => folder === "All" || d.folder === folder)
    .filter((d) => !q || d.name.toLowerCase().includes(q.toLowerCase()));

  const folderCounts = folders.slice(1).map((f) => ({
    name: f,
    count: DOCUMENTS.filter((d) => d.folder === f).length,
  }));

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader
        title="Documents & Knowledge Base"
        subtitle="Specs, contracts, SOPs and marketing assets"
        right={
          <>
            <Input placeholder="Search documents…" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 200 }} />
            <PrimaryBtn icon={Upload}>Upload</PrimaryBtn>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Total Documents" value={DOCUMENTS.length} icon={FileText} accent={C.blue} />
        {folderCounts.slice(0, 3).map((f) => (
          <KpiCard key={f.name} label={f.name} value={f.count} icon={Folder} accent={C.purple} sub="files" />
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {folders.map((f) => (
          <IconBtn key={f} label={f} icon={Folder} active={folder === f} onClick={() => setFolder(f)} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((d) => <DocumentCard key={d.id} doc={d} />)}
      </div>
    </div>
  );
}
