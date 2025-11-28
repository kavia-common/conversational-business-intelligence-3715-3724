import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ResultTable
 * Renders a simple data table for 'result' messages. Designed to sit inside a single
 * message wrapper without adding extra structural wrappers.
 *
 * @param {{
 *  sql?: string,
 *  rows?: Array<Record<string, any>>,
 *  isLoading?: boolean
 * }} props
 * @returns {JSX.Element}
 */
export default function ResultTable({ sql, rows = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="result-table">
        <div className="result-table__meta">Running query…</div>
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="result-table">
        {sql ? <div className="result-table__meta">SQL: {sql}</div> : null}
        <div className="result-table__empty">No rows.</div>
      </div>
    );
  }

  const headerKeys = Object.keys(rows[0] ?? {});

  return (
    <div className="result-table" aria-label="result table">
      {sql ? <div className="result-table__meta">SQL: {sql}</div> : null}
      <div className="result-table__scroller">
        <table>
          <thead>
            <tr>
              {headerKeys.map((k) => (
                <th key={k}>{k}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={`r_${idx}`}>
                {headerKeys.map((k) => (
                  <td key={k}>{String(r?.[k] ?? '')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
