import React, { useState } from 'react';
import { useLeaderboard } from '../context/LeaderboardContext';

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
    <div className="add-friend-section" style={{
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '10px',
      padding: '20px',
      marginTop: '20px',
      border: '2px solid #ffd700',
      maxWidth: '500px'
    }}>
      <h3 style={{ color: '#ffd700', marginBottom: '15px' }}>🤠 Add a Friend</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#ffd700' }}>
          Friend's Email Address:
        </label>
        <input 
          type="email"
          placeholder="friend@example.com"
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddFriend()}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ffd700',
            background: 'rgba(255, 215, 0, 0.1)',
            color: '#ffd700',
            boxSizing: 'border-box',
            fontSize: '14px'
          }}
        />
      </div>

      <button
        onClick={handleAddFriend}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          background: '#ffd700',
          color: '#000',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.5 : 1
        }}
      >
        {loading ? '⏳ Adding...' : '✅ Add Friend'}
      </button>

      {friends.length > 0 && (
        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #ffd700' }}>
          <h4 style={{ color: '#ffd700', marginBottom: '10px' }}>👫 Your Friends ({friends.length})</h4>
          <div style={{ color: '#ccc', fontSize: '14px' }}>
            {friends.map((email, idx) => (
              <div key={idx} style={{ marginBottom: '8px', paddingLeft: '10px' }}>
                📧 {email}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
