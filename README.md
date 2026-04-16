# ⛏️ Gold Rush - Wild West Budget Dashboard

devpost: https://devpost.com/software/reelmoments

A gamified budget tracking app themed like the Wild West! Watch your gold pile, catch bandits stealing your splurges, compete on the leaderboard with friends, and connect your real bank account via Plaid.

## Features

- **Gold Pile Visualization**: Watch your monthly budget deplete visually as you spend
- **Budget Claims**: Organize spending into categories (Homestead, Provisions, Saloon & Fun, Transport)
- **Bandit Heist Animation**: Splurge on non-essentials and pixelated bandits steal your gold!
- **Leaderboard**: Compete with friends — Top Tycoons (best savers) and Most Wanted (biggest spenders)
- **Profile Pictures**: Upload a profile photo that shows on the leaderboard
- **Plaid Bank Integration**: Connect your real bank account to auto-import transactions (sandbox mode for testing)
- **Firestore Sync**: Transactions and budgets persist across sessions in real-time
- **Add Friends**: Challenge friends by adding them to your leaderboard

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 recommended)
- npm
- Firebase account
- Plaid developer account (for bank integration)

### 1. Clone the repo
```bash
git clone https://github.com/l3mxny/Gold-Rush.git
cd HooHacks
```

### 2. Install dependencies
```bash
npm install
npm install plaid express cors dotenv
```

### 3. Set up your `.env` file
Create a `.env` file in the project root with:
```
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_sandbox_secret
```

- **Firebase keys**: Firebase Console → Project Settings → Your Apps
- **Plaid keys**: dashboard.plaid.com → Developers → Keys

### 4. Run the app

You need **two terminals** open at the same time:

**Terminal 1** — Backend server (Plaid):
```bash
node server.js
```

**Terminal 2** — React frontend:
```bash
npm start
```

App opens at `http://localhost:3000`

## 🧪 Testing Plaid (Sandbox)

1. Click **"Connect Your Bank via Plaid"**
2. Select **"First Platypus Bank"**
3. Username: `user_good` / Password: `pass_good`
4. Verification code: `1234`
5. Transactions auto-import into your dashboard!

## 🔐 Security Notes

- **Never commit `.env`** — it contains your API keys
- Plaid sandbox uses fake bank data only — no real credentials
- In production, store Plaid access tokens in a database, not in memory

## 📁 File Structure

```
HooHacks/
├── src/
│   ├── App.jsx                    # Main app, tabs, state
│   ├── App.css                    # Global styles
│   ├── components/
│   │   ├── AddTransaction.jsx     # Log a transaction
│   │   ├── ClaimsSection.jsx      # Budget category bars
│   │   ├── DispatchesFeed.jsx     # Recent transactions
│   │   ├── GoldPile.jsx           # Animated gold pile
│   │   ├── ProfilePic.jsx         # Profile photo upload
│   │   ├── SetBudget.jsx          # Budget configuration
│   │   ├── WantedPosters.jsx      # Leaderboard
│   │   ├── AddFriend.jsx          # Add friends
│   │   └── BanditAnimation.jsx    # Splurge animation
│   ├── context/
│   │   ├── AuthContext.jsx        # Firebase auth
│   │   └── LeaderboardContext.jsx # Friends leaderboard
│   └── config/
│       └── firebase.js            # Firebase setup
├── server.js                      # Express backend (Plaid)
├── .env                           # API keys (don't commit!)
└── package.json
```

---

**Happy budgeting, prospector! 🤠⛏️**
