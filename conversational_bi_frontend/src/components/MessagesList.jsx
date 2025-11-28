import React from 'react';
import ResultTable from './ResultTable';

/**
 * PUBLIC_INTERFACE
 * getMessageKey
 * Generates a stable React key for a message item.
 *
 * Priority:
 * 1) m.id (if provided by the backend)
 * 2) ISO string of m.timestamp (if present)
 * 3) A stable hash of role + content + timestamp
 *
 * @param {Object} m - The message object
 * @returns {string} - Stable key for React lists
 */
export function getMessageKey(m) {
  if (m && m.id != null) return String(m.id);
  if (m && m.timestamp) {
    try {
      const iso = (m.timestamp instanceof Date ? m.timestamp : new Date(m.timestamp)).toISOString();
      if (iso) return iso;
    } catch (e) {
      // fall through to hash fallback
    }
  }
  const role = m?.role ?? 'assistant';
  const content = String(m?.content ?? '');
  const ts = m?.timestamp ? String(m.timestamp) : '';
  return `msg_${stableHash(`${role}:${content}:${ts}`)}`;
}

/**
 * PUBLIC_INTERFACE
 * formatTime
 * Formats a timestamp to 24h time HH:MM using en-US locale.
 *
 * @param {string|number|Date} ts - Timestamp input
 * @returns {string} - Formatted time (e.g., 14:07)
 */
export function formatTime(ts) {
  const d = ts instanceof Date ? ts : new Date(ts);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

/**
 * Computes a stable hash for a string (djb2).
 * @param {string} str
 * @returns {string}
 */
function stableHash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i += 1) {
    // hash * 33 + charCode
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash &= hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Timestamp meta element to render time consistently.
 * @param {{ ts: string|number|Date }} props
 * @returns {JSX.Element|null}
 */
function Timestamp({ ts }) {
  if (!ts) return null;
  return (
    <div className="message-timestamp" aria-label="message timestamp">
      {formatTime(ts)}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * MessagesList
 * Renders a conversation as a semantic list with a single wrapper per message.
 *
 * Rendering rules:
 * - For role === 'result': render <ResultTable .../> followed by a single timestamp.
 * - For other roles: render a single .message div followed by a single timestamp.
 * - No nested redundant wrappers. No extra empty containers when items are removed.
 *
 * Accessibility:
 * - Uses a <section aria-label="Conversation"> container with a div[role="list"]
 *   and each message-block as role="listitem".
 *
 * @param {{
 *  messages: Array<{
 *    id?: string|number,
 *    role?: 'user'|'assistant'|'system'|'error'|'result',
 *    content?: string,
 *    timestamp?: string|number|Date,
 *    // 'result' message specific
 *    sql?: string,
 *    rows?: Array<object>,
 *    isLoading?: boolean
 *  }>
 * }} props
 * @returns {JSX.Element|null}
 */
export default function MessagesList({ messages = [] }) {
  const items = Array.isArray(messages) ? messages.filter(Boolean) : [];

  if (items.length === 0) {
    // Render the semantic container but no list items to avoid layout jumps.
    return (
      <section aria-label="Conversation" className="messages-container">
        <div role="list" className="messages-list" aria-label="Messages" />
      </section>
    );
  }

  return (
    <section aria-label="Conversation" className="messages-container">
      <div role="list" className="messages-list" aria-label="Messages">
        {items.map((m) => (
          <div key={getMessageKey(m)} className="message-block" role="listitem">
            {m?.role === 'result' ? (
              <ResultTable sql={m?.sql} rows={m?.rows} isLoading={m?.isLoading} />
            ) : (
              <div className={`message ${m?.role ?? 'assistant'}`}>
                {String(m?.content ?? '')}
              </div>
            )}
            {m?.timestamp ? <Timestamp ts={m.timestamp} /> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
