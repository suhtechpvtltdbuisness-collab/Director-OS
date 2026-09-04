import React from "react";
import { useData } from "../../context/DataContext";
import { LEAD_SOURCES } from "../../constants/labels";
import Modal from "../common/Modal";
import Field from "../common/Field";
import Input from "../common/Input";
import Select from "../common/Select";
import PrimaryBtn from "../common/PrimaryBtn";
import GhostBtn from "../common/GhostBtn";

export default function LeadFormModal({ open, form, setForm, onClose, onSubmit }) {
  const { products, devs } = useData();
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add New Lead"
      footer={
        <>
          <GhostBtn onClick={onClose}>Cancel</GhostBtn>
          <PrimaryBtn onClick={onSubmit}>Add Lead</PrimaryBtn>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <Field label="Lead / company name">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Orion Retail Pvt Ltd" />
        </Field>
        <Field label="Interested product">
          <Select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}>
            {products.map((p) => <option key={p.id}>{p.name}</option>)}
          </Select>
        </Field>
        <Field label="Estimated value (₹)">
          <Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="250000" />
        </Field>
        <Field label="Source">
          <Select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
            {LEAD_SOURCES.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="Owner">
          <Select value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })}>
            {devs.map((d) => <option key={d.id}>{d.name}</option>)}
          </Select>
        </Field>
      </div>
    </Modal>
  );
}
