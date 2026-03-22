import React, { useState } from 'react';
import { useLeaderboard } from '../context/LeaderboardContext';
import './AddFriend.css';

export default function AddFriend() {
  const { addFriend, friends } = useLeaderboard();
  const [friendEmail, setFriendEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddFriend = async () => {
    if (!friendEmail.trim()) {
      alert('⚠️ Please enter an email address');
      return;
    }

    setLoading(true);
    const success = await addFriend(friendEmail);
    setLoading(false);

    if (success) {
      setFriendEmail('');
    }
  };

  return (
    <div className="add-friend-section">
      <h3>🤠 Add a Friend</h3>

      <div style={{ marginBottom: '18px' }}>
        <label htmlFor="friend-email" className="add-friend-label">
          Friend's Email Address:
        </label>
        <input
          id="friend-email"
          type="email"
          placeholder="friend@example.com"
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddFriend()}
          className="add-friend-input"
        />
      </div>

      <button
        onClick={handleAddFriend}
        disabled={loading}
        className="add-friend-btn"
      >
        {loading ? '⏳ Adding...' : '✅ Add Friend'}
      </button>

      {friends.length > 0 && (
        <div className="add-friend-divider">
          <h4 className="add-friend-list-header">👫 Your Friends ({friends.length})</h4>
          <div className="add-friend-list">
            {friends.map((email, idx) => (
              <div key={idx} className="add-friend-list-item">
                📧 {email}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
