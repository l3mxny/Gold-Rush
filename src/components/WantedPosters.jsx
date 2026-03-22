import React, { useState, useMemo } from 'react';

const REWARD_SPENDING_MULTIPLIER = 0.1;

/** One emoji for all Top Tycoon habit lines (saving / building stash). */
const TYCOON_LINE_EMOJI = '💰';
/** One emoji for all Wanted blow lines (reckless spending). */
const WANTED_LINE_EMOJI = '💸';

const WANTED_SPENDING_TYPES = [
  'Dining Out',
  'Homestead',
  'Saloon & Fun',
  'Provisions',
  'SPLURGE',
  'Other',
];

function savingsPct(saved, budget) {
  const b = Number(budget) || 1;
  const s = Number(saved);
  return s / b;
}

function totalSpent(saved, budget) {
  return Math.max(0, Number(budget) - Number(saved));
}

function formatReward(amount) {
  const n = Math.round(amount * 100) / 100;
  return n % 1 === 0 ? String(n) : n.toFixed(2);
}

function formatMoney(amount) {
  const n = Math.round(Number(amount) * 100) / 100;
  return n % 1 === 0 ? String(n) : n.toFixed(2);
}

function computeOverbudgetPercent(spent, budget) {
  const b = Number(budget) || 1;
  const s = Number(spent);
  if (s <= b) return 0;
  return Math.round(((s - b) / b) * 100);
}

/**
 * Aggregate transactions by category; returns the category with highest total spend.
 */
function getTopSpendingCategory(transactions, budget) {
  if (!transactions?.length) return null;
  const totals = {};
  for (const t of transactions) {
    const cat = t.category || 'Other';
    const amt = Math.max(0, Number(t.amount) || 0);
    totals[cat] = (totals[cat] || 0) + amt;
  }
  const sorted = Object.entries(totals).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
  );
  if (!sorted.length) return null;
  const [category, amount] = sorted[0];
  const b = Number(budget) || 1;
  const pct = Math.round((amount / b) * 100);
  return { category, amount, pct };
}

function getTycoonSavingsHabit(savedPct, name) {
  const tiers = [
    { min: 55, habit: 'a powder-keg-proof stash' },
    { min: 50, habit: 'staking the claim before the saloon' },
    { min: 45, habit: 'the ledger over the lure' },
    { min: 40, habit: 'slow pannin when others rush' },
    { min: 0, habit: 'keeping dust on the table' },
  ];
  const tier = tiers.find((t) => savedPct >= t.min) || tiers[tiers.length - 1];
  const alt = (name.charCodeAt(0) + savedPct) % 3;
  const alts = [
    { habit: 'paying the homestead first' },
    { habit: 'banking nuggets before they melt' },
    { habit: 'thrift on a long trail' },
  ];
  return alt === 0 ? tier.habit : alts[alt % alts.length].habit;
}

const TycoonCard = ({ rank, name, budget, saved, savingsHabit }) => {
  const savingsPercentage = Math.round(savingsPct(saved, budget) * 100);
  const derivedHabit = getTycoonSavingsHabit(savingsPercentage, name);
  const habitPhrase = savingsHabit || derivedHabit;

  return (
    <div className="tycoon-card">
      <div className="tycoon-rank">#{rank}</div>
      <div className="tycoon-avatar">{name.charAt(0)}</div>
      <div className="tycoon-name">{name}</div>
      <div className="tycoon-saved-badge">SAVED: ${formatMoney(saved)}</div>
      <p className="tycoon-habit-line">
        <span className="leaderboard-line-emoji" aria-hidden>
          {TYCOON_LINE_EMOJI}
        </span>{' '}
        Mastered {habitPhrase}
      </p>
    </div>
  );
};

const WantedPoster = ({ rank, name, budget, saved, transactions, overbudgetPercent: obStored }) => {
  const spent = totalSpent(saved, budget);
  const spentPct = Math.round((spent / (Number(budget) || 1)) * 100);
  const reward = spent * REWARD_SPENDING_MULTIPLIER;
  const top = getTopSpendingCategory(transactions, budget);
  const overPct =
    obStored != null ? obStored : computeOverbudgetPercent(spent, budget);

  const blowText = top
    ? `Blew ${top.pct}% on ${top.category} — $${formatMoney(top.amount)}`
    : `Blew ${spentPct}% of the budget — $${formatMoney(spent)}`;

  return (
    <div className="wanted-poster">
      <div className="wanted-rank">#{rank}</div>
      <div className="wanted-title">WANTED</div>
      <div className="wanted-avatar">{name.charAt(0)}</div>
      <div className="wanted-name">{name}</div>
      <div className="wanted-reward-badge">REWARD: ${formatReward(reward)}</div>
      <p className="wanted-blow-line">
        <span className="leaderboard-line-emoji" aria-hidden>
          {WANTED_LINE_EMOJI}
        </span>{' '}
        {blowText}
      </p>
      <p
        className={`wanted-overbudget-line${overPct > 0 ? ' wanted-overbudget-line--over' : ''}`}
      >
        {overPct > 0 ? (
          <>Over budget by {overPct}%</>
        ) : (
          <>Within budget ({spentPct}% spent)</>
        )}
      </p>
    </div>
  );
};

export default function WantedPosters({ outlaws, onAddOutlaw }) {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('2000');
  const [spent, setSpent] = useState('1500');
  const [spendingType, setSpendingType] = useState(WANTED_SPENDING_TYPES[0]);

  const handleAddOutlaw = () => {
    onAddOutlaw(name, budget, spent, spendingType);
    setName('');
    setBudget('2000');
    setSpent('1500');
    setSpendingType(WANTED_SPENDING_TYPES[0]);
  };

  const { tycoons, wanted } = useMemo(() => {
    const postedWanted = outlaws.filter((o) => o.postedAsWanted);
    const forLeaderboard = outlaws.filter((o) => !o.postedAsWanted);
    const sorted = [...forLeaderboard].sort(
      (a, b) => savingsPct(b.saved, b.budget) - savingsPct(a.saved, a.budget)
    );
    const mid = Math.ceil(sorted.length / 2);
    const tycoons = sorted.slice(0, mid);
    const wantedFromSplit = sorted.slice(mid);
    const wanted = [...wantedFromSplit, ...postedWanted].sort(
      (a, b) => savingsPct(a.saved, a.budget) - savingsPct(b.saved, b.budget)
    );
    return { tycoons, wanted };
  }, [outlaws]);

  return (
    <div className="leaderboard-section">
      {tycoons.length > 0 && (
        <div className="leaderboard-subsection leaderboard-tycoons">
          <div className="leaderboard-tycoons-header">
            <span className="leaderboard-tycoons-trophy" aria-hidden>
              🏆
            </span>
            <h2 className="leaderboard-heading-tycoons">Most Wanted for SAVING</h2>
          </div>
          <p className="leaderboard-tycoons-tagline">Top Tycoons</p>
          <div className="leaderboard-grid leaderboard-grid--tycoons">
            {tycoons.map((outlaw, idx) => (
              <TycoonCard
                key={outlaw.id || `tycoon-${outlaw.name}-${idx}`}
                rank={idx + 1}
                name={outlaw.name}
                budget={outlaw.budget}
                saved={outlaw.saved}
                savingsHabit={outlaw.savingsHabit}
              />
            ))}
          </div>
        </div>
      )}

      {wanted.length > 0 && (
        <div className="leaderboard-subsection leaderboard-wanted">
          <h2 className="leaderboard-heading-wanted">🔴 WANTED</h2>
          <div className="leaderboard-grid leaderboard-grid--wanted">
            {wanted.map((outlaw, idx) => (
              <WantedPoster
                key={outlaw.id || `wanted-${outlaw.name}-${idx}`}
                rank={idx + 1}
                name={outlaw.name}
                budget={outlaw.budget}
                saved={outlaw.saved}
                transactions={outlaw.transactions}
                overbudgetPercent={outlaw.overbudgetPercent}
              />
            ))}
          </div>
        </div>
      )}

      <div className="leaderboard-subsection add-outlaw-section">
        <div className="add-outlaw-form">
          <div className="add-outlaw-form-header">
            <span className="add-outlaw-form-icon" aria-hidden>
              📋
            </span>
            <h3 className="add-outlaw-form-title">Post a Wanted Notice</h3>
          </div>
          <div className="form-row form-row--post-wanted">
          <div className="form-group">
            <label>Outlaw Name</label>
            <input
              type="text"
              placeholder="e.g., Jesse James"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Monthly Budget ($)</label>
            <input
              type="number"
              placeholder="2000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Amount Spent ($)</label>
            <input
              type="number"
              placeholder="1500"
              min="0"
              value={spent}
              onChange={(e) => setSpent(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Top spending type</label>
            <select
              value={spendingType}
              onChange={(e) => setSpendingType(e.target.value)}
            >
              {WANTED_SPENDING_TYPES.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="add-outlaw-post-btn" onClick={handleAddOutlaw}>
            Post
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
