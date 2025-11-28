import React, { useMemo, useState } from "react";
import "./oceanTable.css";

/**
 * PUBLIC_INTERFACE
 * OceanTable
 * A reusable, accessible data table that follows the Ocean Professional theme.
 * Includes zebra rows, hover states, subtle borders, status chips, and optional sorting UI affordances.
 *
 * Props:
 * - columns: Array<{ key: string, header: string, align?: 'left'|'center'|'right', width?: string }>
 * - data: Array<Record<string, any>>
 * - caption?: string
 * - ariaLabel?: string
 * - stickyHeader?: boolean
 * - enableSortIcons?: boolean (visual only; sort handler optional)
 * - onSort?: (key: string, direction: 'asc'|'desc') => void
 */
export default function OceanTable({
  columns = [],
  data = [],
  caption,
  ariaLabel = "Data table",
  stickyHeader = true,
  enableSortIcons = true,
  onSort,
}) {
  const [sortState, setSortState] = useState({ key: null, dir: "asc" });
  const [announce, setAnnounce] = useState("");

  const sortedData = useMemo(() => {
    if (!sortState.key) return data;
    const arr = [...data];
    arr.sort((a, b) => {
      const av = a?.[sortState.key];
      const bv = b?.[sortState.key];
      if (av == null && bv == null) return 0;
      if (av == null) return sortState.dir === "asc" ? -1 : 1;
      if (bv == null) return sortState.dir === "asc" ? 1 : -1;
      if (typeof av === "number" && typeof bv === "number") {
        return sortState.dir === "asc" ? av - bv : bv - av;
      }
      const aStr = String(av).toLowerCase();
      const bStr = String(bv).toLowerCase();
      if (aStr < bStr) return sortState.dir === "asc" ? -1 : 1;
      if (aStr > bStr) return sortState.dir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [data, sortState]);

  const handleSort = (key) => {
    if (!enableSortIcons && !onSort) return;
    setSortState((prev) => {
      const nextDir = prev.key === key && prev.dir === "asc" ? "desc" : "asc";
      if (typeof onSort === "function") {
        onSort(key, nextDir);
      }
      setAnnounce(`Sorted by ${key} ${nextDir}`);
      return { key, dir: nextDir };
    });
  };

  return (
    <div className="ocean-card" data-surface="card">
      {/* live region for sort announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">{announce}</div>

      {caption ? (
        <div
          className="ocean-card__band band--sticky"
          role="heading"
          aria-level={2}
          data-surface="band"
        >
          <div className="band-title">{caption}</div>
          <div className="band-actions" aria-label="Actions">
            <button className="btn btn-primary" type="button">Run</button>
            <button className="btn btn-outline-light" type="button">Save</button>
            <button className="btn btn-outline-light" type="button">Add Filter</button>
          </div>
        </div>
      ) : null}

      <div className="ocean-table__scroller" role="region" aria-label={ariaLabel}>
        <table className="ocean-table">
          <thead className={stickyHeader ? "is-sticky" : ""}>
            <tr>
              {columns.map((col) => {
                const active = sortState.key === col.key;
                const dir = active ? sortState.dir : null;
                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={`th-${col.align || "left"}`}
                    scope="col"
                  >
                    <button
                      type="button"
                      className={`th-btn ${enableSortIcons ? "with-sort" : ""}`}
                      onClick={() => handleSort(col.key)}
                      aria-label={`Sort by ${col.header}${dir ? `, ${dir}` : ""}`}
                      aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
                    >
                      <span className="th-label">{col.header.toUpperCase()}</span>
                      {enableSortIcons ? (
                        <span className={`sort-icon ${active ? dir : ""}`} aria-hidden="true">
                          <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                            <path d="M6 12l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      ) : null}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td className="td-empty" colSpan={columns.length}>
                  No data available.
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => (
                <tr
                  key={row.id ?? `r_${idx}`}
                  className="ocean-row"
                  tabIndex={0}
                  aria-selected="false"
                  data-row
                >
                  {columns.map((col) => {
                    const value = row[col.key];
                    if (col.key.toLowerCase().includes("status")) {
                      return (
                        <td key={col.key} className={`td-${col.align || "left"}`}>
                          <StatusChip value={String(value)} />
                        </td>
                      );
                    }
                    return (
                      <td key={col.key} className={`td-${col.align || "left"}`}>
                        {formatCell(value)}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="ocean-table__footer" role="navigation" aria-label="Pagination">
        <div className="footer-spacer" />
        <div className="pagination">
          <button className="btn btn-ghost" type="button" aria-label="Previous page">‹</button>
          <span className="page-index" aria-live="polite">1 / 5</span>
          <button className="btn btn-ghost" type="button" aria-label="Next page">›</button>
        </div>
      </div>
    </div>
  );
}

function formatCell(val) {
  if (val == null) return "";
  if (typeof val === "number") return Intl.NumberFormat("en-US").format(val);
  return String(val);
}

/**
 * PUBLIC_INTERFACE
 * StatusChip
 * Simple pill chip with Ocean Professional colors mapped by status value.
 * Ensures accessible contrast and consistent sizing.
 */
function StatusChip({ value }) {
  const v = String(value).toLowerCase();
  let tone = "neutral";
  if (["complete", "success", "paid"].includes(v)) tone = "success";
  else if (["pending", "hold", "processing"].includes(v)) tone = "info";
  else if (["failed", "error", "canceled"].includes(v)) tone = "danger";
  return <span className={`chip chip-${tone}`} role="status" aria-label={`status: ${value}`}>{value}</span>;
}
