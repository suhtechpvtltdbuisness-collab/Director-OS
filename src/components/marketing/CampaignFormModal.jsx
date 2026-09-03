import React from "react";
import { PRODUCTS } from "../../constants/seedData";
import Modal from "../common/Modal";
import Field from "../common/Field";
import Input from "../common/Input";
import Select from "../common/Select";
import PrimaryBtn from "../common/PrimaryBtn";
import GhostBtn from "../common/GhostBtn";

export default function CampaignFormModal({ open, form, setForm, onClose, onSubmit }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Marketing Campaign"
      footer={
        <>
          <GhostBtn onClick={onClose}>Cancel</GhostBtn>
          <PrimaryBtn onClick={onSubmit}>Create Campaign</PrimaryBtn>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <Field label="Campaign name">
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. ORGA HRMS — Diwali Offer Push"
          />
        </Field>
        <Field label="Product">
          <Select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}>
            {PRODUCTS.map((p) => <option key={p.id}>{p.name}</option>)}
          </Select>
        </Field>
        <Field label="Channel">
          <Input
            value={form.channel}
            onChange={(e) => setForm({ ...form, channel: e.target.value })}
            placeholder="e.g. LinkedIn, Google Ads, Referral"
          />
        </Field>
        <Field label="Budget (₹)">
          <Input
            type="number"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
            placeholder="50000"
          />
        </Field>
      </div>
    </Modal>
  );
}
