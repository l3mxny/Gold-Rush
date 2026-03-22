import React, { useState, useEffect } from 'react';
import './App.css';
import { useAuth } from './context/AuthContext';
import { useLeaderboard } from './context/LeaderboardContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './config/firebase';
import GoldPile from './components/GoldPile';
import ClaimsSection from './components/ClaimsSection';
import DispatchesFeed from './components/DispatchesFeed';
import WantedPosters from './components/WantedPosters';
import AddFriend from './components/AddFriend';
import AddTransaction from './components/AddTransaction';
import SetBudget from './components/SetBudget';
import BanditAnimation from './components/BanditAnimation';
import Login from './components/Login';
import Signup from './components/Signup';
import ProfilePic from './components/ProfilePic';

const DEFAULT_BUDGET = {
  Homestead:      1000,
  Provisions:      500,
  'Saloon & Fun':  200,
  Transport:       150,
  Other:           150,
};

const TODAY = new Date().toISOString().split('T')[0];

const TABS = [
  { id: 'home',         label: 'Home' },
  { id: 'transactions', label: '📨 Recent Transactions' },
  { id: 'add',          label: '💰 Add Transaction' },
  { id: 'budget',       label: '🗺️ Set Budget' },
];

export default function App() {
  const { currentUser, logout } = useAuth();
  const { saveUserStats } = useLeaderboard();

  const [authView, setAuthView] = useState('login');
  const [activeTab, setActiveTab] = useState('home');
  const [budgetLimits, setBudgetLimits] = useState(null);
  const [hasSetBudget, setHasSetBudget] = useState(false);
  const [dispatches, setDispatches] = useState([]);
  const [showBandit, setShowBandit] = useState(false);
  const [banditAmount, setBanditAmount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [isPlaidConnected, setIsPlaidConnected] = useState(false);

  // Check Plaid connection status
  useEffect(() => {
    if (!currentUser) return;
    fetch('/plaid-status')
      .then((res) => res.json())
      .then((data) => setIsPlaidConnected(data.connected))
      .catch(() => {});
  }, [currentUser]);

  // Load user budget from Firestore (preserve existing users, N/A for new)
  useEffect(() => {
    if (!currentUser) return;
    const loadBudget = async () => {
      try {
        const budgetRef = doc(db, 'userBudgets', currentUser.uid);
        const budgetSnap = await getDoc(budgetRef);
        if (budgetSnap.exists() && budgetSnap.data().budgetLimits) {
          setBudgetLimits(budgetSnap.data().budgetLimits);
          setHasSetBudget(true);
        } else {
          const leaderboardRef = doc(db, 'leaderboard', currentUser.uid);
          const leaderboardSnap = await getDoc(leaderboardRef);
          if (leaderboardSnap.exists()) {
            setBudgetLimits(DEFAULT_BUDGET);
            setHasSetBudget(true);
          } else {
            setBudgetLimits(DEFAULT_BUDGET);
            setHasSetBudget(false);
          }
        }
      } catch (err) {
        console.error('Error loading budget:', err);
        setBudgetLimits(DEFAULT_BUDGET);
        setHasSetBudget(true);
      }
    };
    loadBudget();
  }, [currentUser]);

  const handleSaveBudget = (limits) => {
    setBudgetLimits(limits);
    setHasSetBudget(true);
    if (currentUser) {
      setDoc(doc(db, 'userBudgets', currentUser.uid), {
        budgetLimits: limits,
        lastSaved: new Date(),
      }, { merge: true }).catch((err) => console.error('Error saving budget:', err));
    }
  };

  // Sync transactions from Firestore in real-time
  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = db
      .collection('users')
      .doc(currentUser.uid)
      .collection('transactions')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const txns = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setDispatches(txns);
      });
    return () => unsubscribe();
  }, [currentUser]);

  // Derived values
  const categories = budgetLimits ? Object.keys(budgetLimits) : [];
  const totalBudget = budgetLimits ? Object.values(budgetLimits).reduce((a, b) => a + b, 0) : 0;
  const totalSpent = dispatches.reduce((sum, d) => sum + Math.abs(d.amount), 0);
  const goldAmount = Math.max(0, totalBudget - totalSpent);
  const percentage = totalBudget > 0 ? Math.round((goldAmount / totalBudget) * 100) : 0;

  const spentByCategory = dispatches.reduce((acc, d) => {
    if (d.isSplurge) return acc;
    acc[d.category] = (acc[d.category] || 0) + Math.abs(d.amount);
    return acc;
  }, {});

  const persistStats = (newDispatches) => {
    const spent = newDispatches.reduce((sum, d) => sum + Math.abs(d.amount), 0);
    const gold = Math.max(0, totalBudget - spent);
    saveUserStats({
      displayName: currentUser.email.split('@')[0],
      budget: totalBudget,
      spent,
      saved: gold,
      savingsPercentage: Math.round((gold / totalBudget) * 100),
    });
  };

  const saveTransactionToFirestore = async (dispatch) => {
    if (!currentUser) return;
    await db
      .collection('users')
      .doc(currentUser.uid)
      .collection('transactions')
      .add({ ...dispatch, createdAt: new Date() });
  };

  const triggerBanditHeist = (description, amount, date = TODAY) => {
    setBanditAmount(amount);
    setShowBandit(true);
    setShowNotification(true);
    setTimeout(() => setShowBandit(false), 2000);
    setTimeout(() => setShowNotification(false), 2000);

    const newDispatch = {
      description: `🏴‍☠️ ${description}`,
      category: "💔 SPLURGE - Bandits' Haul!",
      amount: -amount,
      isSplurge: true,
      date,
    };
    saveTransactionToFirestore(newDispatch);
    // Optimistic update for leaderboard stats
    const updated = [newDispatch, ...dispatches];
    persistStats(updated);
  };

  const handleAddTransaction = ({ description, amount, category, date, isSplurge }) => {
    if (isSplurge) {
      triggerBanditHeist(description, amount, date);
      return;
    }
    const newDispatch = {
      description,
      category,
      amount: -amount,
      isSplurge: false,
      date,
    };
    saveTransactionToFirestore(newDispatch);
    persistStats([newDispatch, ...dispatches]);
  };

  const connectBank = async () => {
    try {
      const res = await fetch('/create-link-token', { method: 'POST' });
      const { link_token } = await res.json();
      if (window.Plaid) {
        const handler = window.Plaid.create({
          token: link_token,
          onSuccess: async (public_token) => {
            await fetch('/exchange-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ public_token }),
            });
            setIsPlaidConnected(true);

            // Auto-import transactions from Plaid
            try {
              const txnRes = await fetch('/transactions');
              const txnData = await txnRes.json();

              if (txnData.transactions && txnData.transactions.length > 0) {
                const CATEGORY_MAP = {
                  'Food and Drink': 'Provisions',
                  'Shops': 'Other',
                  'Travel': 'Transport',
                  'Recreation': 'Saloon & Fun',
                  'Payment': 'Other',
                  'Transfer': 'Other',
                };

                for (const t of txnData.transactions) {
                  const plaidCategory = t.category?.[0] || 'Other';
                  const mappedCategory = CATEGORY_MAP[plaidCategory] || 'Other';
                  await saveTransactionToFirestore({
                    description: t.name,
                    amount: -Math.abs(t.amount),
                    category: mappedCategory,
                    date: t.date,
                    isSplurge: false,
                    fromPlaid: true,
                  });
                }
                alert(`✅ Bank connected! Imported ${txnData.transactions.length} transactions.`);
              } else {
                alert('✅ Bank connected successfully!');
              }
            } catch (err) {
              console.error('Error importing transactions:', err);
              alert('✅ Bank connected! Could not import transactions.');
            }
          },
          onExit: (err) => console.log('Plaid exited', err),
          onEvent: (event) => console.log(event),
        });
        handler.open();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('⚠️ Make sure the server is running on http://localhost:3001');
    }
  };

  if (!currentUser) {
    return (
      <>
        {authView === 'login' ? (
          <Login onSwitchToSignup={() => setAuthView('signup')} />
        ) : (
          <Signup onSwitchToLogin={() => setAuthView('login')} />
        )}
      </>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <div className="header-title-row">
              <button
                type="button"
                className="header-logo-btn"
                onClick={() => setActiveTab('home')}
                aria-label="Go to home"
              >
                <img
                  src="/assets/goldrush-logo.png"
                  alt="Gold Rush"
                  className="header-logo"
                />
              </button>
              <button
                type="button"
                className="header-text-btn"
                onClick={() => setActiveTab('home')}
                aria-label="Go to home"
              >
                <h1>GOLD RUSH</h1>
              </button>
            </div>
            <p className="subtitle">Pan for Gold, Not Debt</p>
          </div>
          <div className="header-user">
            <ProfilePic />
            <span className="user-email">{currentUser.email}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {showBandit && <BanditAnimation amount={banditAmount} show={showNotification} />}

      <div className="container">
        <nav className="tab-nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="tab-content">
          {activeTab === 'home' && (
            <div>
              <div className="main-content">
                <GoldPile
                  goldAmount={goldAmount}
                  monthlyBudget={hasSetBudget ? totalBudget : null}
                  percentage={percentage}
                  onConnectBank={connectBank}
                  isPlaidConnected={isPlaidConnected}
                />
                <ClaimsSection
                  budgetLimits={budgetLimits || {}}
                  spentByCategory={spentByCategory}
                />
              </div>
              <WantedPosters />
              <AddFriend />
            </div>
          )}

          {activeTab === 'transactions' && (
            <DispatchesFeed dispatches={dispatches} />
          )}

          {activeTab === 'add' && (
            <AddTransaction
              categories={categories}
              onAddTransaction={handleAddTransaction}
            />
          )}

          {activeTab === 'budget' && (
            <SetBudget
              budgetLimits={hasSetBudget ? (budgetLimits || {}) : {}}
              onSaveBudget={handleSaveBudget}
            />
          )}

          {activeTab === 'friend' && <AddFriend />}

        </div>
      </div>
    </div>
  );
}
