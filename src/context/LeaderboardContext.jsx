import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  doc, 
  setDoc, 
  onSnapshot,
  query,
  collection,
  orderBy,
  where,
  arrayUnion,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const LeaderboardContext = createContext();

export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error('useLeaderboard must be used within LeaderboardProvider');
  }
  return context;
};

export const LeaderboardProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [friendsLeaderboard, setFriendsLeaderboard] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auto-save user's stats to Firestore
  const saveUserStats = async (stats) => {
    if (!currentUser) return;

    try {
      await setDoc(doc(db, 'leaderboard', currentUser.uid), {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: stats.displayName || currentUser.email.split('@')[0],
        budget: stats.budget,
        spent: stats.spent,
        saved: stats.saved,
        savingsPercentage: stats.savingsPercentage,
        lastUpdated: new Date(),
      }, { merge: true });
    } catch (error) {
      console.error('Error saving user stats:', error);
    }
  };

  // Add a friend by email
  const addFriend = async (friendEmail) => {
    if (!currentUser) return;
    
    try {
      // Find friend by email
      const friendQuery = query(
        collection(db, 'leaderboard'),
        where('email', '==', friendEmail)
      );
      
      // Since Firestore doesn't allow where queries easily, we'll fetch all and filter
      const allUsersDoc = await getDoc(doc(db, 'leaderboard', 'users'));
      
      // Better approach: just add to friends array with email
      // The friend system works by storing emails of friends
      const userDocRef = doc(db, 'leaderboard', currentUser.uid);
      await setDoc(userDocRef, {
        friends: arrayUnion(friendEmail)
      }, { merge: true });
      
      // Also add current user to friend's friends list (mutual)
      const friendDocRef = doc(db, 'leaderboard', friendEmail); // Using email as backup
      // We'll need to search by email - for now just store the relationship one way
      
      alert(`✅ Added ${friendEmail} as a friend!`);
      return true;
    } catch (error) {
      console.error('Error adding friend:', error);
      alert('⚠️ Could not add friend. Make sure the email is correct.');
      return false;
    }
  };

  // Listen to current user's data and friends
  useEffect(() => {
    if (!currentUser) {
      setFriendsLeaderboard([]);
      setFriends([]);
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, 'leaderboard', currentUser.uid);
    
    const unsubscribeUser = onSnapshot(userDocRef, async (userSnap) => {
      if (!userSnap.exists()) {
        setFriends([]);
        setFriendsLeaderboard([]);
        setLoading(false);
        return;
      }

      const userData = userSnap.data();
      const friendEmails = userData.friends || [];
      setFriends(friendEmails);

      // Now fetch leaderboard data for all friends
      const leaderboardQuery = query(
        collection(db, 'leaderboard'),
        orderBy('saved', 'desc')
      );

      const unsubscribeLeaderboard = onSnapshot(leaderboardQuery, (snapshot) => {
        const allUsers = [];
        snapshot.forEach((doc) => {
          allUsers.push({
            id: doc.id,
            ...doc.data()
          });
        });

        // Filter to show friends + current user
        const filteredLeaderboard = allUsers.filter(user =>
          friendEmails.includes(user.email) || user.uid === currentUser.uid
        );

        setFriendsLeaderboard(filteredLeaderboard);
        setLoading(false);
      }, (error) => {
        console.error('Error listening to leaderboard:', error);
        setLoading(false);
      });

      return () => unsubscribeLeaderboard();
    }, (error) => {
      console.error('Error listening to user:', error);
      setLoading(false);
    });

    return () => unsubscribeUser();
  }, [currentUser]);

  const value = {
    friendsLeaderboard,
    friends,
    loading,
    saveUserStats,
    addFriend,
  };

  return (
    <LeaderboardContext.Provider value={value}>
      {children}
    </LeaderboardContext.Provider>
  );
};
