import React from 'react';

export default function GoldPile({ goldAmount, monthlyBudget, percentage, onConnectBank }) {
  return (
    <div className="gold-section">
      <h2>Your Gold Vein</h2>
      <div className="gold-pile-container">
        <div className="gold-pile-glow">
          <div className="gold-pile-pulse">
            <img
              id="goldPile"
              src="/assets/gold-pile.png"
              alt="Gold pile"
              className="gold-pile-img"
              style={{
                opacity: (percentage / 100) * 0.8 + 0.2,
                transform: `scaleY(${percentage / 100})`,
                transformOrigin: 'center bottom',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
        </div>
        <div className="percentage-label">{percentage}%</div>
      </div>
      <h3 style={{ color: '#d4af37', marginBottom: '20px' }}>
        Monthly Budget: ${monthlyBudget}
      </h3>
      <p style={{ marginBottom: '20px' }}>${goldAmount} Remaining</p>
      <button onClick={onConnectBank} className="primary-btn">
        🏦 Connect Your Bank via Plaid
      </button>
    </div>
  );
}
