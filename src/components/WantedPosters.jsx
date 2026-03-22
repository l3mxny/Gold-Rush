import React from 'react';
import { useLeaderboard } from '../context/LeaderboardContext';

const WantedPoster = ({ rank, email, displayName, budget, saved, savingsPercentage }) => {
  return (
    <div className="wanted-poster">
      <div className="wanted-rank">#{rank}</div>
      <div className="wanted-title">WANTED</div>
      <div className="wanted-avatar">{displayName.charAt(0)}</div>
      <div className="wanted-name">{displayName}</div>
      <div className="wanted-bounty">REWARD: ${saved}</div>
      <div className="wanted-crime">Saved: {savingsPercentage}% of budget</div>
      <div className="wanted-crime">{email}</div>
    </div>
  );
};

export default function WantedPosters() {
  const { friendsLeaderboard, loading } = useLeaderboard();

  if (loading) {
    return <div className="leaderboard-section"><h2>🔴 WANTED POSTERS 🔴</h2><p>Loading...</p></div>;
  }

  return (
    <div className="leaderboard-section">
      <h2>🔴 WANTED POSTERS - Friends Challenge 🔴</h2>
      <div className="leaderboard-grid">
        {friendsLeaderboard.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#ffd700' }}>
            No friends yet! Add friends to see the leaderboard 👇
          </p>
        ) : (
          friendsLeaderboard.map((user, idx) => (
            <WantedPoster 
              key={user.id}
              rank={idx + 1}
              email={user.email}
              displayName={user.displayName}
              budget={user.budget}
              saved={user.saved}
              savingsPercentage={user.savingsPercentage}
            />
          ))
        )}
      </div>
    </div>
  );
}
