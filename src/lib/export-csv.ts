/**
 * SCAFFOLD: Generic CSV export utility.
 * Usage: exportCsv(data, columns, "my-export")
 */

export interface CsvColumn<TRow> {
  key: keyof TRow & string;
  label: string;
  format?: (value: TRow[keyof TRow]) => string;
}

export function exportCsv<TRow>(
  data: TRow[],
  columns: CsvColumn<TRow>[],
  filename: string
): void {
  const header = columns.map(c => `"${c.label}"`).join(",");
  const rows = data.map(row =>
    columns.map(c => {
      const val = c.format ? c.format(row[c.key]) : String(row[c.key] ?? "");
      // Escape quotes, wrap in quotes
      return `"${val.replace(/"/g, '""')}"`;
    }).join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
