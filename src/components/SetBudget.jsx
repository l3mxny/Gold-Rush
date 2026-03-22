import React, { useState, useEffect } from 'react';
import NumericInput from './NumericInput';

const CATEGORY_EMOJI = {
  Homestead:      '🏠',
  Provisions:     '🍽️',
  'Saloon & Fun': '🎪',
  Transport:      '🚗',
  Other:          '💼',
};

const emoji = (cat) => CATEGORY_EMOJI[cat] || '📌';

export default function SetBudget({ budgetLimits, onSaveBudget }) {
  const [form, setForm] = useState({ ...budgetLimits });
  const [newCatName, setNewCatName] = useState('');
  const [newCatAmount, setNewCatAmount] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({ ...budgetLimits });
  }, [budgetLimits]);

  const categories = Object.keys(form);
  const total = categories.reduce((sum, cat) => sum + (parseFloat(form[cat]) || 0), 0);

  const handleChange = (cat, value) => {
    const parsed = parseFloat(value);
    setForm(prev => ({ ...prev, [cat]: isNaN(parsed) ? '' : parsed }));
    setSaved(false);
  };

  const handleAddCategory = () => {
    const name = newCatName.trim();
    if (!name) { alert('⚠️ Please enter a category name.'); return; }
    if (form[name] !== undefined) { alert(`⚠️ "${name}" already exists.`); return; }
    const amount = parseFloat(newCatAmount);
    if (isNaN(amount) || amount < 0) { alert('⚠️ Please enter a valid budget amount.'); return; }
    setForm(prev => ({ ...prev, [name]: amount }));
    setNewCatName('');
    setNewCatAmount('');
    setSaved(false);
  };

  const handleRemoveCategory = (cat) => {
    setForm(prev => {
      const next = { ...prev };
      delete next[cat];
      return next;
    });
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categories.length === 0) {
      alert('⚠️ Add at least one category before saving.');
      return;
    }
    for (const cat of categories) {
      if (form[cat] === '' || form[cat] < 0) {
        alert(`⚠️ Please enter a valid amount for "${cat}".`);
        return;
      }
    }
    onSaveBudget({ ...form });
    setSaved(true);
  };

  return (
    <div className="set-budget-section">
      <h2>🗺️ Stake Your Claims</h2>
      <p className="budget-subtitle">Set how much gold you're willing to spend each month per category.</p>

      <form onSubmit={handleSubmit} className="budget-form">
        <div className="budget-total-display">
          Total Budget: <strong>{categories.length === 0 ? '—' : `$${total.toFixed(2)}`}</strong>
        </div>

        <div className="budget-categories">
          <h3>Your Claims</h3>
          {categories.length === 0 && (
            <p style={{ color: '#d4af37', fontSize: '0.9em' }}>No categories yet. Add one below.</p>
          )}
          {categories.map(cat => (
            <div key={cat} className="form-group budget-category-row">
              <label>{emoji(cat)} {cat}</label>
              <div className="budget-input-with-btn">
                <NumericInput
                  value={form[cat]}
                  onChange={(raw) => handleChange(cat, raw)}
                  placeholder="0"
                  allowDecimal={true}
                />
                <button
                  type="button"
                  className="remove-cat-btn"
                  onClick={() => handleRemoveCategory(cat)}
                  title={`Remove ${cat}`}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="add-category-section">
          <h3>Add a Category</h3>
          <div className="add-category-row">
            <input
              type="text"
              placeholder="e.g. Medicine, Pet Care..."
              value={newCatName}
              onChange={(e) => { setNewCatName(e.target.value); setSaved(false); }}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
            />
            <NumericInput
              placeholder="$0"
              value={newCatAmount}
              onChange={setNewCatAmount}
              allowDecimal={true}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
            />
            <button type="button" className="primary-btn" onClick={handleAddCategory}>
              + Add
            </button>
          </div>
        </div>

        <button type="submit" className="primary-btn budget-save-btn">
          💾 Save Budget
        </button>

        {saved && (
          <p className="budget-saved-msg">✅ Budget saved! Head to Home to see it reflected.</p>
        )}
      </form>
    </div>
  );
}
