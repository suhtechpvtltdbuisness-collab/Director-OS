import React from "react";
import { PRODUCTS, DEVS } from "../../constants/seedData";
import Modal from "../common/Modal";
import Field from "../common/Field";
import Input from "../common/Input";
import Select from "../common/Select";
import PrimaryBtn from "../common/PrimaryBtn";
import GhostBtn from "../common/GhostBtn";

export default function ProjectFormModal({ open, form, setForm, onClose, onSubmit }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Project"
      footer={
        <>
          <GhostBtn onClick={onClose}>Cancel</GhostBtn>
          <PrimaryBtn onClick={onSubmit}>Create</PrimaryBtn>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <Field label="Project name">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. ORGA HRMS — Mobile App v1" />
        </Field>
        <Field label="Product">
          <Select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}>
            {PRODUCTS.map((p) => <option key={p.id}>{p.name}</option>)}
          </Select>
        </Field>
        <Field label="Owner">
          <Select value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })}>
            {DEVS.map((d) => <option key={d.id}>{d.name}</option>)}
          </Select>
        </Field>
        <Field label="Deadline">
          <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
        </Field>
      </div>
    </Modal>
  );
}
