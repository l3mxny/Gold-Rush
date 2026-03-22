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

const RANK_TITLES = { 1: 'Town Owner', 2: 'Head Sheriff', 3: 'Cowgirl' };
const OUTLAW_REWARDS = { 1: '10,000', 2: '5,000', 3: '1,000' };

function TycoonCard({ rank, displayName, saved }) {
  return (
    <div style={{
      background: 'linear-gradient(160deg, #f5f0e8 0%, #e8e0cc 100%)',
      border: '1px solid #bbb',
      borderTop: '4px solid #1a1a1a',
      borderRadius: 2,
      padding: '16px 18px 18px',
      fontFamily: 'Georgia, serif',
      position: 'relative',
      boxShadow: '2px 2px 8px rgba(0,0,0,0.25)',
      maxWidth: 260,
      margin: '0 auto',
    }}>
      {/* Gazette nameplate */}
      <div style={{
        borderBottom: '2px solid #1a1a1a',
        borderTop: '2px solid #1a1a1a',
        textAlign: 'center',
        padding: '2px 0',
        marginBottom: 10,
        fontSize: '0.6em',
        letterSpacing: 4,
        color: '#1a1a1a',
        fontWeight: 'bold',
        textTransform: 'uppercase',
      }}>
        The Gold Rush Gazette
      </div>

      {/* Rank badge — top-right corner with border */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        background: '#1a1a1a', color: '#f5f0e8',
        width: 32, height: 32,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold', fontSize: '0.8em',
        border: '2px solid #555',
        borderTop: 'none', borderRight: 'none',
      }}>
        #{rank}
      </div>

      {/* Headline */}
      <div style={{
        marginBottom: 8,
        borderBottom: '1px solid #aaa',
        paddingBottom: 8,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '1.25em',
          fontWeight: 'bold',
          color: '#1a1a1a',
          lineHeight: 1.2,
          wordBreak: 'break-word',
        }}>
          {displayName}
        </div>
        <div style={{
          fontSize: '0.95em',
          fontWeight: 'bold',
          color: '#1a1a1a',
          lineHeight: 1.4,
          whiteSpace: 'nowrap',
        }}>
          Strikes Gold Again
        </div>
      </div>

      {/* Avatar */}
      <div style={{
        width: 80, height: 80,
        background: 'linear-gradient(135deg, #888, #444)',
        border: '2px solid #1a1a1a',
        borderRadius: 2,
        margin: '10px auto 6px',
        fontSize: '2.6em', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: '#f5f0e8', fontWeight: 'bold',
      }}>
        {displayName.charAt(0).toUpperCase()}
      </div>

      {/* Title */}
      {RANK_TITLES[rank] && (
        <div style={{
          fontSize: '0.72em', color: '#444',
          letterSpacing: 2, textAlign: 'center',
          fontStyle: 'italic', marginBottom: 10,
        }}>
          — {RANK_TITLES[rank]} —
        </div>
      )}

      {/* Savings amount — highlighted */}
      <div style={{
        background: '#1a1a1a',
        color: '#f5f0e8',
        textAlign: 'center',
        padding: '10px 12px',
        marginBottom: 10,
        fontSize: '1.5em',
        fontWeight: 'bold',
        letterSpacing: 1,
      }}>
        ${typeof saved === 'number' ? saved.toFixed(2) : saved}
        <div style={{ fontSize: '0.45em', letterSpacing: 3, marginTop: 2, fontWeight: 'normal' }}>
          SAVED THIS MONTH
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        borderTop: '1px solid #aaa',
        paddingTop: 6,
        fontSize: '0.72em',
        color: '#555',
        fontStyle: 'italic',
        textAlign: 'center',
      }}>
        {TYCOON_TAGLINES[(rank - 1) % TYCOON_TAGLINES.length]}
      </div>
    </div>
  );
}

function OutlawCard({ rank, displayName, saved, spent, budget }) {
  const overBy = Math.max(0, spent - budget);
  return (
    <div style={{
      background: 'linear-gradient(160deg, #e8dcc4 0%, #d4c49a 100%)',
      border: '6px solid #6b4c1e',
      borderRadius: 4,
      padding: '18px 20px 22px',
      textAlign: 'center',
      position: 'relative',
      boxShadow: '4px 4px 16px rgba(0,0,0,0.6), inset 0 0 30px rgba(100,70,20,0.15)',
      fontFamily: 'Georgia, serif',
      maxWidth: 260,
      margin: '0 auto',
    }}>
      {/* Rank badge — top-right corner with border */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        background: '#8b0000', color: '#e8dcc4',
        width: 32, height: 32,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold', fontSize: '0.8em',
        border: '2px solid #6b4c1e',
        borderTop: 'none', borderRight: 'none',
      }}>
        #{rank}
      </div>

      {/* WANTED */}
      <div style={{
        color: '#8b0000',
        fontWeight: 'bold',
        fontSize: '2.4em',
        letterSpacing: 6,
        lineHeight: 1,
        marginBottom: 2,
        textShadow: '1px 1px 0 rgba(0,0,0,0.2)',
        borderBottom: '2px solid #8b0000',
        paddingBottom: 8,
      }}>
        WANTED
      </div>

      {/* DEAD OR ALIVE */}
      <div style={{
        color: '#8b0000', fontSize: '0.7em',
        letterSpacing: 3, fontWeight: 'bold', marginBottom: 14,
      }}>
        DEAD OR ALIVE
      </div>

      {/* Avatar */}
      <div style={{
        width: 90, height: 90,
        background: 'linear-gradient(135deg, #b8956a, #7a5e3a)',
        border: '3px solid #6b4c1e',
        borderRadius: 4,
        margin: '0 auto 14px',
        fontSize: '3em', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: '#e8dcc4', fontWeight: 'bold',
        boxShadow: '2px 2px 6px rgba(0,0,0,0.4)',
      }}>
        {displayName.charAt(0).toUpperCase()}
      </div>

      {/* Name */}
      <div style={{ fontWeight: 'bold', fontSize: '1.3em', color: '#1a0f00', marginBottom: 4 }}>
        {displayName}
      </div>

      {/* Crime caption */}
      <div style={{ color: '#5a3a10', fontSize: '0.85em', fontStyle: 'italic', marginBottom: 16 }}>
        for going ${overBy.toFixed(2)} over budget
      </div>

      {/* Reward */}
      <div style={{
        background: '#8b0000',
        color: '#e8dcc4',
        padding: '8px 12px',
        borderRadius: 3,
        fontWeight: 'bold',
        fontSize: '0.95em',
        letterSpacing: 1,
      }}>
        REWARD: ${OUTLAW_REWARDS[rank] || Math.abs(saved).toFixed(2)}
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
            margin: 0, letterSpacing: 1,
            textShadow: '0 0 12px rgba(255,215,0,0.4)',
          }}>
            💰 Top Tycoons
          </h2>
        </div>
        <hr style={{ border: 'none', borderTop: '2px solid #c8a000', margin: '10px 0 22px' }} />

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
          <h2 style={{
            color: '#cc2222', fontSize: '1.75em',
            fontWeight: 'bold', margin: 0, letterSpacing: 3,
          }}>
            🕵️ Most Wanted
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
            />
          ))}
        </div>
      </div>

    </div>
  );
}
