"use client";

import { useState, useMemo } from "react";

// SCAFFOLD: Replace TRow with your actual row type
export interface Column<TRow> {
  key: keyof TRow & string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: TRow[keyof TRow], row: TRow) => React.ReactNode;
}

interface DataTableProps<TRow extends { id: string | number }> {
  columns: Column<TRow>[];
  data: TRow[];
  pageSize?: number;
  onEdit?: (row: TRow) => void;
  onDelete?: (row: TRow) => void;
  emptyMessage?: string;
}

export function DataTable<TRow extends { id: string | number }>({
  columns,
  data,
  pageSize = 25,
  onEdit,
  onDelete,
  emptyMessage = "No records found.",
}: DataTableProps<TRow>) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<keyof TRow | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter(row =>
      columns.some(col => String(row[col.key] ?? "").toLowerCase().includes(q))
    );
  }, [data, query, columns]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      const cmp = String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData = sorted.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(key: keyof TRow) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  const thStyle: React.CSSProperties = {
    padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600,
    color: "#71717A", textTransform: "uppercase", letterSpacing: "0.06em",
    borderBottom: "1px solid rgba(255,255,255,0.06)", whiteSpace: "nowrap",
  };
  const tdStyle: React.CSSProperties = {
    padding: "12px 16px", fontSize: "13px", color: "#A1A1AA",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Search */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={e => { setQuery(e.target.value); setPage(1); }}
          style={{
            padding: "8px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)", fontSize: "13px", color: "#FAFAFA",
            outline: "none", width: "280px",
          }}
        />
        <span style={{ fontSize: "12px", color: "#71717A" }}>
          {filtered.length} record{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#111113" }}>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  style={{ ...thStyle, cursor: col.sortable ? "pointer" : "default", width: col.width }}
                  onClick={() => col.sortable && toggleSort(col.key)}
                >
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    <span style={{ marginLeft: "4px" }}>{sortDir === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
              ))}
              {(onEdit || onDelete) && <th style={thStyle}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  style={{ ...tdStyle, textAlign: "center", padding: "40px", color: "#52525B" }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : pageData.map(row => (
              <tr key={row.id}>
                {columns.map(col => (
                  <td key={col.key} style={tdStyle}>
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "—")}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          style={{
                            fontSize: "12px", padding: "4px 10px", borderRadius: "6px",
                            background: "none", border: "1px solid rgba(255,255,255,0.12)",
                            color: "#A8A8A8", cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          style={{
                            fontSize: "12px", padding: "4px 10px", borderRadius: "6px",
                            background: "none", border: "1px solid rgba(239,68,68,0.25)",
                            color: "#EF4444", cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", alignItems: "center" }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: "6px 12px", borderRadius: "6px", fontSize: "12px",
              background: "none", border: "1px solid rgba(255,255,255,0.10)",
              color: page === 1 ? "#52525B" : "#A8A8A8",
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
          >
            Prev
          </button>
          <span style={{ fontSize: "12px", color: "#71717A" }}>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: "6px 12px", borderRadius: "6px", fontSize: "12px",
              background: "none", border: "1px solid rgba(255,255,255,0.10)",
              color: page === totalPages ? "#52525B" : "#A8A8A8",
              cursor: page === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
