import React, { useState } from 'react';
import './App.css';
import { useAuth } from './context/AuthContext';
import GoldPile from './components/GoldPile';
import ClaimsSection from './components/ClaimsSection';
import DispatchesFeed from './components/DispatchesFeed';
import WantedPosters from './components/WantedPosters';
import BanditAnimation from './components/BanditAnimation';
import Login from './components/Login';
import Signup from './components/Signup';

export default function App() {
  const { currentUser, logout } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' or 'signup'
  const [goldAmount, setGoldAmount] = useState(2000);
  const [monthlyBudget] = useState(2000);
  const [dispatches, setDispatches] = useState([
    { id: 1, description: 'Whole Foods Market', category: 'Provisions', amount: -45.23, isSplurge: false },
    { id: 2, description: 'Rent Payment', category: 'Homestead', amount: -1000, isSplurge: false },
    { id: 3, description: 'Luxury Boutique', category: 'SPLURGE', amount: -125, isSplurge: true },
    { id: 4, description: 'Starbucks', category: 'Saloon & Fun', amount: -6.50, isSplurge: false },
  ]);
  const [outlaws, setOutlaws] = useState([
    {
      name: 'Billy the Kid',
      budget: 3000,
      saved: 1500,
      crime: 'Spent 50% of monthly budget',
      transactions: [
        { category: 'Homestead', amount: 1000 },
        { category: 'Dining Out', amount: 400 },
        { category: 'Saloon & Fun', amount: 100 },
      ],
    },
    {
      name: 'Wyatt Earp',
      budget: 2500,
      saved: 1200,
      crime: 'Spent 52% of monthly budget',
      transactions: [
        { category: 'Dining Out', amount: 700 },
        { category: 'Provisions', amount: 400 },
        { category: 'Saloon & Fun', amount: 200 },
      ],
    },
    {
      name: 'Jesse James',
      budget: 2000,
      saved: 900,
      crime: 'Spent 55% of monthly budget',
      transactions: [
        { category: 'Saloon & Fun', amount: 650 },
        { category: 'SPLURGE', amount: 450 },
      ],
    },
    {
      name: 'Doc Holliday',
      budget: 3500,
      saved: 800,
      crime: 'Spent 77% of monthly budget',
      transactions: [
        { category: 'Homestead', amount: 1000 },
        { category: 'SPLURGE', amount: 900 },
        { category: 'Dining Out', amount: 800 },
      ],
    },
  ]);
  const [showBandit, setShowBandit] = useState(false);
  const [banditAmount, setBanditAmount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  const triggerBanditHeist = (description, amount) => {
    setGoldAmount(prev => Math.max(0, prev - amount));
    setBanditAmount(amount);
    setShowBandit(true);
    setShowNotification(true);

    setTimeout(() => setShowBandit(false), 2000);
    setTimeout(() => setShowNotification(false), 2000);

    const newDispatch = {
      id: Date.now(),
      description: `🏴‍☠️ ${description}`,
      category: '💔 SPLURGE - Bandits\' Haul!',
      amount: -amount,
      isSplurge: true
    };
    setDispatches(prev => [newDispatch, ...prev]);
  };

  const addOutlaw = (name, budget, spent, spendingType) => {
    const b = parseInt(budget, 10);
    const sp = parseInt(spent, 10);
    if (!name || Number.isNaN(b) || b <= 0 || Number.isNaN(sp) || sp < 0) return;

    const saved = b - sp;
    const spendPct = Math.round((sp / b) * 100);
    const overbudgetPercent = sp > b ? Math.round(((sp - b) / b) * 100) : 0;
    const category = (spendingType && String(spendingType).trim()) || 'Other';

    setOutlaws(prev => [...prev, {
      id: `wanted-${Date.now()}`,
      postedAsWanted: true,
      name,
      budget: b,
      saved,
      spendingType: category,
      overbudgetPercent,
      crime: overbudgetPercent > 0
        ? `Spent ${spendPct}% of budget (${overbudgetPercent}% over) — ${category}`
        : `Spent ${spendPct}% of monthly budget — ${category}`,
      transactions: [{ category, amount: sp }],
    }]);
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
            loadTransactions();
            alert('✅ Bank connected successfully!');
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

  const loadTransactions = async () => {
    try {
      const res = await fetch('/transactions');
      const data = await res.json();
      console.log('Transactions:', data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const percentage = Math.round((goldAmount / monthlyBudget) * 100);

  // Show login/signup if not authenticated
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

  // Show dashboard if authenticated
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <h1>⛏️ GOLD RUSH ⛏️</h1>
            <p className="subtitle">Pan for Gold, Not Debt</p>
          </div>
          <div className="header-user">
            <span className="user-email">{currentUser.email}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {showBandit && <BanditAnimation amount={banditAmount} show={showNotification} />}

      <div className="container">
        <div className="main-content">
          <GoldPile 
            goldAmount={goldAmount} 
            monthlyBudget={monthlyBudget}
            percentage={percentage}
            onConnectBank={connectBank}
          />
          <ClaimsSection />
        </div>

        <DispatchesFeed 
          dispatches={dispatches}
          onSplurge={triggerBanditHeist}
        />

        <WantedPosters 
          outlaws={outlaws}
          onAddOutlaw={addOutlaw}
        />
      </div>
    </div>
  );
}
