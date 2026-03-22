import React from 'react';
import { useLeaderboard } from '../context/LeaderboardContext';

const DispatchItem = ({ description, category, amount, isSplurge }) => (
  <div className="dispatch-item">
    <div className="dispatch-description">
      <div style={{ fontWeight: 'bold' }}>{description}</div>
      <div className={`dispatch-category ${isSplurge ? 'splurge' : ''}`}>
        {category}
      </div>
    </div>
    <div className="dispatch-amount">${Math.abs(amount)}</div>
  </div>
);

export default function DispatchesFeed({ dispatches, onSplurge }) {
  return (
    <div className="dispatches-container">
      <h2>📨 Dispatches (Recent Transactions)</h2>
      {dispatches.map(dispatch => (
        <DispatchItem key={dispatch.id} {...dispatch} />
      ))}

      <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '5px' }}>
        <h3 style={{ marginBottom: '15px' }}>💰 Test Splurge Transactions</h3>
        <div className="button-group">
          <button 
            className="splurge-btn" 
            onClick={() => onSplurge('Shopping Spree', 150)}
          >
            🛍️ Luxury Shopping ($150)
          </button>
          <button 
            className="splurge-btn" 
            onClick={() => onSplurge('Designer Clothes', 200)}
          >
            👗 Designer Clothes ($200)
          </button>
          <button 
            className="splurge-btn" 
            onClick={() => onSplurge('Fancy Dining', 120)}
          >
            🍾 Fancy Dinner ($120)
          </button>
        </div>
      </div>
    </div>
  );
}
