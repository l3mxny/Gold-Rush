import React from 'react';

function getGoldPileImage(percentage) {
  // percentage = how much of budget REMAINING
  if (percentage >= 50) return '/assets/gold-pile.png';      // little to none spent
  if (percentage >= 25) return '/assets/gold-pile-half.png';  // around halfway to 75% spent
  return '/assets/gold-pile-zero.png';                        // majority spent
}

function getGlowClass(percentage) {
  if (percentage >= 50) return 'gold-pile-glow';      // full glow
  if (percentage >= 25) return 'gold-pile-glow half'; // softer glow
  return 'gold-pile-glow zero';                       // minimal/no glow
}

export default function GoldPile({ goldAmount, monthlyBudget, percentage, onConnectBank }) {
  const hasBudget = monthlyBudget != null && monthlyBudget > 0;
  const displayPercent = hasBudget ? percentage : 100;
  const pileSrc = getGoldPileImage(displayPercent);
  const glowClass = getGlowClass(displayPercent);

  return (
    <div className="gold-section">
      <h2>Your Gold Vein</h2>
      <div className="gold-pile-container">
        <div className={glowClass}>
          <div className="gold-pile-pulse">
            <img
              id="goldPile"
              src={pileSrc}
              alt="Gold pile"
              className="gold-pile-img"
            />
          </div>
        </div>
        <div className="percentage-label">{hasBudget ? `${percentage}%` : '—'}</div>
      </div>
      <h3 style={{ color: '#d4af37', marginBottom: '20px' }}>
        Monthly Budget: {hasBudget ? `$${monthlyBudget}` : 'N/A'}
      </h3>
      <p style={{ marginBottom: '20px' }}>
        {hasBudget ? `$${goldAmount} Remaining` : 'Set your budget in 🗺️ Set Budget to get started'}
      </p>
      <button onClick={onConnectBank} className="primary-btn">
        🏦 Connect Your Bank via Plaid
      </button>
    </div>
  );
}
