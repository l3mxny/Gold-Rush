import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import NumericInput from './NumericInput';
import 'react-datepicker/dist/react-datepicker.css';

const today = () => new Date().toISOString().split('T')[0];

const CalendarInput = ({ calendarOpen, onIconClick, ...props }) => (
  <div className="date-picker-input-wrapper">
    <input {...props} className="date-picker-input" />
    <button
      type="button"
      className="date-picker-icon-btn"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onIconClick();
      }}
      tabIndex={-1}
      aria-label="Toggle calendar"
    >
      📅
    </button>
  </div>
);

export default function AddTransaction({ categories, onAddTransaction }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0] || '');
  const [date, setDate] = useState(today());
  const [isSplurge, setIsSplurge] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

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
    <div className={`add-transaction-section${calendarOpen ? ' calendar-open' : ''}`}>
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
            <NumericInput
              value={amount}
              onChange={setAmount}
              placeholder="0.00"
              allowDecimal={true}
            />
          </div>

          <div className="form-group date-picker-group">
            <label>Date</label>
            <DatePicker
              selected={date ? new Date(date) : null}
              onChange={(d) => setDate(d ? d.toISOString().split('T')[0] : '')}
              onCalendarOpen={() => setCalendarOpen(true)}
              onCalendarClose={() => setCalendarOpen(false)}
              open={calendarOpen}
              onClick={() => setCalendarOpen(true)}
              maxDate={new Date()}
              dateFormat="MM/dd/yyyy"
              calendarClassName="gold-rush-calendar"
              showPopperArrow={false}
              popperPlacement="right-start"
              customInput={
                <CalendarInput
                  calendarOpen={calendarOpen}
                  onIconClick={() => setCalendarOpen((prev) => !prev)}
                />
              }
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
            <div className="splurge-row">
              <label htmlFor="splurge-check" className="splurge-label">
                🏴‍☠️ Mark as Splurge (triggers the bandits!)
              </label>
              <span className="checkbox-wrap">
                <input
                  type="checkbox"
                  id="splurge-check"
                  checked={isSplurge}
                  onChange={(e) => setIsSplurge(e.target.checked)}
                  className="splurge-checkbox"
                />
                <span className="checkbox-box" aria-hidden="true" />
              </span>
            </div>
          </div>

          <button type="submit" className={isSplurge ? 'splurge-btn' : 'primary-btn'}>
            {isSplurge ? '🤠 Spend & Summon Bandits' : '✅ Log Transaction'}
          </button>
        </form>
      )}
    </div>
  );
}
