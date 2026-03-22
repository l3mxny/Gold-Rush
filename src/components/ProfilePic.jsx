import React, { useState, useEffect } from 'react';
import { storage, db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export default function ProfilePic() {
  const { currentUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [hovered, setHovered] = useState(false);

  // Load saved photo from Firestore on login
  useEffect(() => {
    if (!currentUser) return;
    db.collection('leaderboard').doc(currentUser.uid).get().then((doc) => {
      if (doc.exists && doc.data().photoURL) {
        setPreview(doc.data().photoURL);
      }
    });
  }, [currentUser]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const ref = storage.ref(`profilePics/${currentUser.uid}`);
      await ref.put(file);
      const url = await ref.getDownloadURL();
      await db.collection('leaderboard').doc(currentUser.uid).set(
        { photoURL: url },
        { merge: true }
      );
    } catch (err) {
      console.error('Upload failed:', err);
      alert('⚠️ Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <label
      title="Change profile photo"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer', display: 'inline-block', position: 'relative', flexShrink: 0 }}
    >
      {/* Avatar circle */}
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: 'linear-gradient(135deg, #c8a000, #7a5e00)',
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.2em', color: '#1a1000', fontWeight: 'bold',
        border: '2px solid #c8a000',
        boxShadow: '0 0 8px rgba(200,160,0,0.4)',
        transition: 'opacity 0.2s',
        opacity: uploading ? 0.6 : 1,
      }}>
        {preview
          ? <img src={preview} alt="pfp" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : currentUser?.email?.charAt(0).toUpperCase()
        }
      </div>

      {/* Camera overlay on hover */}
      {hovered && !uploading && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1em',
        }}>
          📷
        </div>
      )}

      {/* Uploading spinner text */}
      {uploading && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.55em', color: '#ffd700', fontWeight: 'bold',
        }}>
          ...
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={uploading}
      />
    </label>
  );
}
