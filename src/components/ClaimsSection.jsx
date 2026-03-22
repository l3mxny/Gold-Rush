import React from 'react';

const CATEGORY_EMOJI = {
  Homestead:      '🏠',
  Provisions:     '🍽️',
  'Saloon & Fun': '🎪',
  Transport:      '🚗',
  Other:          '💼',
};

const emoji = (cat) => CATEGORY_EMOJI[cat] || '📌';

const Claim = ({ cat, current, max }) => {
  const pct = max > 0 ? Math.min(Math.round((current / max) * 100), 100) : 0;
  const isWarning = current > max && max > 0;
  return (
    <div className="claim">
      <div className="claim-name">{emoji(cat)} {cat}</div>
      <div className="claim-bar-wrapper">
        <div
          className="claim-bar"
          style={{
            width: `${pct}%`,
            background: isWarning
              ? 'linear-gradient(90deg, #ff6b6b, #ff8787)'
              : 'linear-gradient(90deg, #d4af37, #ffd700)',
          }}
        >
          {pct > 10 ? `${pct}%` : ''}
        </div>
      </div>
      <div className="claim-amount">${current.toFixed(2)} / ${max.toFixed(2)}</div>
      {isWarning && (
        <div className="warning">⚠️ Overmined! ${(current - max).toFixed(2)} over budget.</div>
      )}
    </div>
  );
};

export default function ClaimsSection({ budgetLimits, spentByCategory }) {
  const categories = Object.keys(budgetLimits);

  if (categories.length === 0) {
    return (
      <div className="claims-section">
        <h2>Your Claims</h2>
        <p style={{ color: '#d4af37', marginTop: '20px' }}>
          No budget set yet. Visit <strong>🗺️ Set Budget</strong> to stake your claims!
        </p>
      </div>
    );
  }

  return (
    <div className="claims-section">
      <h2>Your Claims</h2>
      {categories.map(cat => (
        <Claim
          key={cat}
          cat={cat}
          current={spentByCategory[cat] || 0}
          max={budgetLimits[cat] || 0}
        />
      ))}
    </div>
  );
}
