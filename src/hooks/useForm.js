import { useState } from "react";

/**
 * Minimal form state with submit-time validation.
 *
 * `validate` receives the current values and returns an object of
 * `{ field: "message" }` for whatever is invalid.
 */
export default function useForm(initial, validate = () => ({})) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((err) => (err[key] ? { ...err, [key]: undefined } : err));
  };

  async function submit(onValid) {
    const found = validate(values);
    setErrors(found);
    if (Object.values(found).some(Boolean)) return false;
    setSaving(true);
    try {
      await onValid(values);
      return true;
    } finally {
      setSaving(false);
    }
  }

  return { values, setValues, errors, setErrors, saving, set, submit };
}

export const required = (v) => (String(v ?? "").trim() ? undefined : "This field is required");
export const positive = (v) => (Number(v) > 0 ? undefined : "Enter an amount greater than zero");
export const email = (v) => (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(v ?? "")) ? undefined : "Enter a valid email address");
