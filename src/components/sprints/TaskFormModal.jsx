import React from "react";
import { useData } from "../../context/DataContext";
import { TASK_PRIORITIES } from "../../constants/labels";
import Modal from "../common/Modal";
import Field from "../common/Field";
import Input from "../common/Input";
import Select from "../common/Select";
import PrimaryBtn from "../common/PrimaryBtn";
import GhostBtn from "../common/GhostBtn";

export default function TaskFormModal({ open, form, setForm, onClose, onSubmit }) {
  const { products, devs } = useData();
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Assign New Task"
      footer={
        <>
          <GhostBtn onClick={onClose}>Cancel</GhostBtn>
          <PrimaryBtn onClick={onSubmit}>Assign</PrimaryBtn>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <Field label="Task title">
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Fix invoice PDF export bug" />
        </Field>
        <Field label="Product / project">
          <Select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}>
            {products.map((p) => <option key={p.id}>{p.name}</option>)}
          </Select>
        </Field>
        <Field label="Assign to">
          <Select value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })}>
            {devs.map((d) => <option key={d.id}>{d.name}</option>)}
          </Select>
        </Field>
        <Field label="Priority">
          <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            {TASK_PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </Select>
        </Field>
        <Field label="Due date">
          <Input type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
        </Field>
      </div>
    </Modal>
  );
}
