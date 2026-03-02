"use client";

// SCAFFOLD: This is your CRUD resource page template.
// 1. Rename this directory from RESOURCE_SLUG to your resource (e.g. "clients", "orders")
// 2. Replace RESOURCE_NAME_PLURAL / RESOURCE_NAME_SINGULAR with your entity name
// 3. Replace TRow interface with your actual data shape
// 4. Connect fetch/create/update/delete to your actual API routes or Supabase client
// 5. Update COLUMNS and FIELDS arrays with real fields

import { useState, useEffect, useCallback } from "react";
import { DataTable, Column } from "@/components/data/DataTable";
import { CrudModal, FieldDef } from "@/components/forms/CrudModal";
import { exportCsv } from "@/lib/export-csv";

// SCAFFOLD: Replace with your actual data shape
interface TRow {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
}

// SCAFFOLD: Define your columns
const COLUMNS: Column<TRow>[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  {
    key: "status",
    label: "Status",
    render: (val) => (
      <span style={{
        fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "9999px",
        background: val === "active" ? "rgba(34,197,94,0.1)" : "rgba(113,113,122,0.15)",
        color: val === "active" ? "#4ADE80" : "#71717A",
      }}>
        {String(val).toUpperCase()}
      </span>
    ),
  },
  { key: "created_at", label: "Created", sortable: true, render: (val) => new Date(String(val)).toLocaleDateString() },
];

// SCAFFOLD: Define your form fields (for create / edit modal)
const FIELDS: FieldDef[] = [
  { key: "name", label: "Name", type: "text", placeholder: "Full name", required: true },
  { key: "email", label: "Email", type: "email", placeholder: "email@example.com", required: true },
  {
    key: "status", label: "Status", type: "select", required: true,
    options: [{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }],
  },
];

export default function ResourcePage() {
  const [rows, setRows] = useState<TRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<TRow | null>(null);

  // SCAFFOLD: Replace with real fetch from your API route or Supabase
  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/RESOURCE_SLUG");
      const data = await res.json();
      setRows(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  // SCAFFOLD: Replace with real create/update API calls
  async function handleSubmit(values: Record<string, string>) {
    const method = editRow ? "PATCH" : "POST";
    const url = editRow ? `/api/RESOURCE_SLUG/${editRow.id}` : "/api/RESOURCE_SLUG";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error(await res.text());
    await fetchRows();
  }

  // SCAFFOLD: Replace with real delete API call
  async function handleDelete(row: TRow) {
    if (!confirm(`Delete "${row.name}"?`)) return;
    await fetch(`/api/RESOURCE_SLUG/${row.id}`, { method: "DELETE" });
    await fetchRows();
  }

  function handleEdit(row: TRow) {
    setEditRow(row);
    setModalOpen(true);
  }

  function handleNew() {
    setEditRow(null);
    setModalOpen(true);
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "28px", fontWeight: 600, color: "#FAFAFA", marginBottom: "4px" }}>
            {/* SCAFFOLD: Replace with resource name */}
            RESOURCE_NAME_PLURAL
          </h1>
          <p style={{ fontSize: "14px", color: "#71717A" }}>
            Manage your RESOURCE_NAME_PLURAL.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => exportCsv(rows, COLUMNS.map(c => ({ key: c.key, label: c.label })), "RESOURCE_SLUG")}
            style={{
              padding: "10px 16px", borderRadius: "9999px", fontSize: "13px", fontWeight: 500,
              background: "none", border: "1px solid rgba(255,255,255,0.10)", color: "#A8A8A8", cursor: "pointer",
            }}
          >
            Export CSV
          </button>
          <button
            onClick={handleNew}
            data-testid="new-resource-button"
            style={{
              padding: "10px 20px", borderRadius: "9999px", fontSize: "13px", fontWeight: 600,
              background: "#FFFFFF", color: "#09090B", border: "none", cursor: "pointer",
            }}
          >
            + New RESOURCE_NAME_SINGULAR
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#52525B", fontSize: "14px" }}>Loading...</div>
      ) : (
        <DataTable
          columns={COLUMNS}
          data={rows}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No RESOURCE_NAME_PLURAL yet. Create your first one."
        />
      )}

      {/* Create / Edit modal */}
      {modalOpen && (
        <CrudModal
          title={editRow ? "Edit RESOURCE_NAME_SINGULAR" : "New RESOURCE_NAME_SINGULAR"}
          fields={FIELDS}
          initialValues={editRow ? (editRow as unknown as Record<string, string>) : undefined}
          onSubmit={handleSubmit}
          onClose={() => { setModalOpen(false); setEditRow(null); }}
          submitLabel={editRow ? "Save changes" : "Create"}
        />
      )}
    </div>
  );
}
