"use client";

import { useState, useEffect, useRef } from "react";

// SCAFFOLD: Replace FieldDef with your actual form fields
export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "email" | "number" | "textarea" | "select";
  placeholder?: string;
  options?: { label: string; value: string }[]; // for select
  required?: boolean;
}

interface CrudModalProps {
  title: string;
  fields: FieldDef[];
  initialValues?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => Promise<void>;
  onClose: () => void;
  submitLabel?: string;
}

export function CrudModal({
  title,
  fields,
  initialValues = {},
  onSubmit,
  onClose,
  submitLabel = "Save",
}: CrudModalProps) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map(f => [f.key, initialValues[f.key] ?? ""]))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)",
    fontSize: "14px", color: "#FAFAFA", outline: "none", boxSizing: "border-box",
    fontFamily: "inherit",
  };

  return (
    <div
      ref={overlayRef}
      onClick={e => e.target === overlayRef.current && onClose()}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 50, padding: "16px",
      }}
    >
      <div style={{
        background: "#18181B", borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "32px", width: "100%", maxWidth: "480px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#FAFAFA", margin: 0 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#71717A", cursor: "pointer", fontSize: "20px", lineHeight: 1, padding: "4px" }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {fields.map(field => (
            <div key={field.key}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#71717A", marginBottom: "6px" }}>
                {field.label}{field.required && <span style={{ color: "#EF4444", marginLeft: "2px" }}>*</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  value={values[field.key] ?? ""}
                  onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              ) : field.type === "select" ? (
                <select
                  value={values[field.key] ?? ""}
                  onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                  required={field.required}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="">Select...</option>
                  {field.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={values[field.key] ?? ""}
                  onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  required={field.required}
                  style={inputStyle}
                />
              )}
            </div>
          ))}

          {error && (
            <p style={{ fontSize: "13px", color: "#EF4444", margin: 0 }}>{error}</p>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 20px", borderRadius: "9999px", fontSize: "13px", fontWeight: 500,
                background: "none", border: "1px solid rgba(255,255,255,0.10)", color: "#71717A", cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "10px 24px", borderRadius: "9999px", fontSize: "13px", fontWeight: 600,
                background: saving ? "rgba(255,255,255,0.1)" : "#FFFFFF",
                color: saving ? "#71717A" : "#09090B",
                border: "none", cursor: saving ? "not-allowed" : "pointer",
                transition: "background 150ms",
              }}
            >
              {saving ? "Saving..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
