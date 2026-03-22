import React, { useState } from 'react';

const today = () => new Date().toISOString().split('T')[0];

export default function AddTransaction({ categories, onAddTransaction }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0] || '');
  const [date, setDate] = useState(today());
  const [isSplurge, setIsSplurge] = useState(false);

  // Keep selected category valid if categories list changes
  const effectiveCategory = categories.includes(category) ? category : (categories[0] || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categories.length === 0) {
      alert('⚠️ Please create at least one budget category first.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (!description.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('⚠️ Please fill in a description and a valid amount.');
      return;
    }
    if (!date) {
      alert('⚠️ Please select a date.');
      return;
    }
    onAddTransaction({ description, amount: parsedAmount, category: effectiveCategory, date, isSplurge });
    setDescription('');
    setAmount('');
    setDate(today());
    setIsSplurge(false);
  };

  return (
    <div className="add-transaction-section">
      <h2>💰 Log a Haul</h2>

      {categories.length === 0 ? (
        <p style={{ color: '#d4af37', marginTop: '10px' }}>
          No categories yet. Visit <strong>🗺️ Set Budget</strong> to create some first.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="add-transaction-form">
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              placeholder="e.g. Whole Foods, Rent, Saloon tabs..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Amount ($)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              max={today()}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={effectiveCategory}
              onChange={(e) => setCategory(e.target.value)}
              className="category-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group splurge-toggle">
            <label className="splurge-label">
              <input
                type="checkbox"
                checked={isSplurge}
                onChange={(e) => setIsSplurge(e.target.checked)}
                className="splurge-checkbox"
              />
              <span>🏴‍☠️ Mark as Splurge (triggers the bandits!)</span>
            </label>
          </div>

          <button type="submit" className={isSplurge ? 'splurge-btn' : 'primary-btn'}>
            {isSplurge ? '🤠 Spend & Summon Bandits' : '✅ Log Transaction'}
          </button>
        </form>
      )}
    </div>
  );
}
