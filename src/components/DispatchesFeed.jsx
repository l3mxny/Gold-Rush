import React from 'react';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const DispatchItem = ({ description, category, amount, isSplurge, date }) => (
  <div className="dispatch-item">
    <div className="dispatch-description">
      <div style={{ fontWeight: 'bold' }}>{description}</div>
      <div className={`dispatch-category ${isSplurge ? 'splurge' : ''}`}>
        {category}
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
      <div className="dispatch-amount">${Math.abs(amount).toFixed(2)}</div>
      {date && <div className="dispatch-date">{formatDate(date)}</div>}
    </div>
  </div>
);

export default function DispatchesFeed({ dispatches }) {
  const sorted = [...dispatches].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  });

  return (
    <div className="dispatches-container">
      <h2>📨 Dispatches (Recent Transactions)</h2>
      {sorted.length === 0 ? (
        <p style={{ color: '#d4af37', textAlign: 'center', padding: '20px' }}>
          No transactions yet. Head to <strong>💰 Add Transaction</strong> to log your first haul.
        </p>
      ) : (
        sorted.map(dispatch => (
          <DispatchItem key={dispatch.id} {...dispatch} />
        ))
      )}
    </div>
  );
}
