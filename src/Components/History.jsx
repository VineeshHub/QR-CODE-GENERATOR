import React, { useState } from 'react';

export default function History({ history, clearHistory }) {
  const [copied, setCopied] = useState(null);

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  if (history.length === 0) {
    return (
      <div className="panel">
        <h2 className="panel-title">History</h2>
        <div className="empty-state">
          <div className="empty-icon">🕒</div>
          <p>No history yet.<br />Generate or scan a QR code to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">History</h2>
        <button className="btn btn-danger btn-sm" onClick={clearHistory}>Clear All</button>
      </div>

      <div className="history-list">
        {history.map(item => (
          <div key={item.id} className={`history-item ${item.type === 'Scanned' ? 'scanned' : 'generated'}`}>
            <div className="history-meta">
              <span className={`badge ${item.type === 'Scanned' ? 'badge-scan' : 'badge-gen'}`}>
                {item.type === 'Scanned' ? '📷 Scanned' : '⚡ Generated'}
              </span>
              <span className="history-time">{item.time}</span>
            </div>
            <p className="history-value">{item.value}</p>
            <button className="btn-copy" onClick={() => copy(item.value, item.id)}>
              {copied === item.id ? '✅ Copied' : '📋 Copy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}