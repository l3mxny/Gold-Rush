import React from 'react';
import { useLeaderboard } from '../context/LeaderboardContext';

const TYCOON_TAGLINES = [
  'Mastered thrift on a long trail',
  'Mastered the ledger over the lure',
  'Kept their gold close and bandits far',
  'Rode into sunset with pockets full',
];

const OUTLAW_TAGLINES = [
  'Blew it all at the saloon',
  'Spent faster than a tumbleweed rolls',
  'Last seen fleeing from the budget',
  'Wanted for crimes against savings',
];

const SHOW_N = 2;

const Avatar = ({ displayName, photoURL, size = 72, border = '3px solid #c8a000' }) => (
  <div style={{
    width: size, height: size,
    background: 'linear-gradient(135deg, #c8a000, #7a5e00)',
    borderRadius: '50%', margin: '8px auto 14px',
    fontSize: '2.2em', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    color: '#1a1000', fontWeight: 'bold',
    boxShadow: '0 0 12px rgba(200,160,0,0.3)',
    overflow: 'hidden', border,
  }}>
    {photoURL
      ? <img src={photoURL} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      : displayName.charAt(0).toUpperCase()
    }
  </div>
);

function TycoonCard({ rank, displayName, saved, photoURL }) {
  return (
    <div style={{
      background: 'rgba(26, 18, 4, 0.98)',
      border: '2px solid #c8a000',
      borderRadius: 10,
      padding: '22px 18px 20px',
      textAlign: 'center',
      position: 'relative',
      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4)',
    }}>
      {/* Rank badge */}
      <div style={{
        position: 'absolute', top: 10, right: 10,
        background: 'linear-gradient(135deg, #c8a000, #ffd700)',
        color: '#1a1000', width: 30, height: 30, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold', fontSize: '0.85em',
      }}>
        #{rank}
      </div>

      {/* Avatar */}
      <Avatar displayName={displayName} photoURL={photoURL} />

      {/* Name */}
      <div style={{ fontWeight: 'bold', fontSize: '1.15em', color: '#f5deb3', marginBottom: 14 }}>
        {displayName}
      </div>

      {/* Saved bar */}
      <div style={{
        background: 'linear-gradient(90deg, #b89000, #ffd700, #b89000)',
        color: '#1a1000', padding: '10px 16px', borderRadius: 6,
        fontWeight: 'bold', fontSize: '1em', marginBottom: 12, letterSpacing: 1,
      }}>
        SAVED: ${saved}
      </div>

      {/* Tagline */}
      <div style={{ color: '#7a6a40', fontSize: '0.85em', fontStyle: 'italic' }}>
        💰 {TYCOON_TAGLINES[(rank - 1) % TYCOON_TAGLINES.length]}
      </div>
    </div>
  );
}

function OutlawCard({ rank, displayName, saved, spent, budget, photoURL }) {
  const spentPct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  return (
    <div style={{
      background: 'rgba(18, 10, 10, 0.98)',
      border: '1px solid #3a0f0f',
      borderRadius: 10,
      padding: '22px 18px 20px',
      textAlign: 'center',
      position: 'relative',
      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
    }}>
      {/* Rank badge */}
      <div style={{
        position: 'absolute', top: 10, right: 10,
        background: '#8b1515', color: '#f5deb3',
        width: 30, height: 30, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold', fontSize: '0.85em',
      }}>
        #{rank}
      </div>

      {/* WANTED label */}
      <div style={{
        color: '#d4af37', fontWeight: 'bold',
        letterSpacing: 4, marginBottom: 14, fontSize: '1em',
      }}>
        WANTED
      </div>

      {/* Avatar */}
      <Avatar displayName={displayName} photoURL={photoURL} border="3px solid #8b1515" />

      {/* Name */}
      <div style={{ fontWeight: 'bold', fontSize: '1.15em', color: '#f5deb3', marginBottom: 14 }}>
        {displayName}
      </div>

      {/* Reward bar */}
      <div style={{
        background: 'linear-gradient(90deg, #7a1515, #b02020, #7a1515)',
        color: '#f5deb3', padding: '10px 16px', borderRadius: 6,
        fontWeight: 'bold', fontSize: '1em', marginBottom: 12, letterSpacing: 1,
      }}>
        REWARD: ${saved}
      </div>

      {/* Crime text */}
      <div style={{ color: '#7a6a5a', fontSize: '0.85em', fontStyle: 'italic' }}>
        💸 {OUTLAW_TAGLINES[(rank - 1) % OUTLAW_TAGLINES.length]}
      </div>
      <div style={{ color: '#7a6a5a', fontSize: '0.85em', marginTop: 4 }}>
        Within budget ({spentPct}% spent)
      </div>
    </div>
  );
}

export default function WantedPosters() {
  const { friendsLeaderboard, loading } = useLeaderboard();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', color: '#ffd700', padding: 40 }}>
        Loading...
      </div>
    );
  }

  if (friendsLeaderboard.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#ffd700', padding: 40 }}>
        No friends yet! Add friends to see the leaderboard 👇
      </div>
    );
  }

  // Already sorted by saved desc — top savers first
  const topSavers = friendsLeaderboard.slice(0, SHOW_N);
  // Worst savers — sort ascending by saved
  const worstSavers = [...friendsLeaderboard]
    .sort((a, b) => a.saved - b.saved)
    .slice(0, SHOW_N);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Most Wanted for SAVING ── */}
      <div style={{
        background: 'rgba(20, 15, 5, 0.97)',
        border: '2px solid #c8a000',
        borderRadius: 12,
        padding: '28px 28px 32px',
        boxShadow: '0 0 24px rgba(200,160,0,0.15)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <h2 style={{
            color: '#ffd700', fontSize: '1.75em', fontWeight: 'bold',
            margin: '0 0 4px', letterSpacing: 1,
            textShadow: '0 0 12px rgba(255,215,0,0.4)',
          }}>
            🏆 Most Wanted for SAVING
          </h2>
          <p style={{
            color: '#c8a000', fontSize: '0.78em',
            letterSpacing: 4, margin: 0, fontWeight: 'bold',
          }}>
            TOP TYCOONS
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(topSavers.length, 2)}, 1fr)`,
          gap: 20,
        }}>
          {topSavers.map((user, idx) => (
            <TycoonCard
              key={user.id}
              rank={idx + 1}
              displayName={user.displayName}
              saved={user.saved}
              photoURL={user.photoURL}
            />
          ))}
        </div>
      </div>

      {/* ── WANTED — Biggest Spenders ── */}
      <div style={{
        background: 'rgba(18, 10, 10, 0.97)',
        border: '2px solid #3a0f0f',
        borderRadius: 12,
        padding: '28px 28px 32px',
        boxShadow: '0 0 24px rgba(139,0,0,0.1)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 10, marginBottom: 6,
        }}>
          <span style={{ color: '#cc2222', fontSize: '1.1em' }}>●</span>
          <h2 style={{
            color: '#cc2222', fontSize: '1.75em',
            fontWeight: 'bold', margin: 0, letterSpacing: 3,
          }}>
            WANTED
          </h2>
        </div>
        <hr style={{ border: 'none', borderTop: '2px solid #7a1515', margin: '10px 0 22px' }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(worstSavers.length, 2)}, 1fr)`,
          gap: 20,
        }}>
          {worstSavers.map((user, idx) => (
            <OutlawCard
              key={user.id}
              rank={idx + 1}
              displayName={user.displayName}
              saved={user.saved}
              spent={user.spent}
              budget={user.budget}
              photoURL={user.photoURL}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
