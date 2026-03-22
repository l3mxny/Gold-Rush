# 🏴‍☠️ Gold Rush - Wild West Budget Dashboard

A fun, gamified budget tracking app themed like a Wild West gold rush! Watch your gold pile, catch bandits stealing your splurges, and compete on the wanted poster leaderboard.

## ✨ Features

- **Gold Pile Visualization**: Watch your monthly budget deplete visually as you spend
- **Budget Claims**: Organize spending into themed categories (Homestead, Provisions, Saloon & Fun, Transport)
- **Bandit Heist Animation**: When you splurge on non-essentials, pixelated bandits animate across the screen stealing your gold!
- **Wanted Poster Leaderboard**: Compete with friends - ranked by savings amount in authentic wild west wanted poster format
- **Plaid Bank Integration**: Connect your real bank account to auto-sync transactions (sandbox mode for testing)
- **Transaction Dispatch Feed**: See your recent transactions with automatic categorization

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- A free Firebase account (for user authentication)

### Setup

1. **Clone/Navigate to the project**
   ```bash
   cd /Users/victoriaxiao/HooHacks
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase Auth** (REQUIRED for login/signup)
   - Follow the [Firebase Setup Guide](./FIREBASE_SETUP.md)
   - Add your Firebase credentials to `.env`

4. **Start the app**
   ```bash
   npm start
   ```
   
   Opens at `http://localhost:3000`

5. **Create an account**
   - Sign up with any email and password
   - Start tracking your budget!

## 📋 How to Use

### Authentication

1. **Sign Up**
   - Create a new account with an email and password
   - Choose your "Outlaw Name" (your alias)

2. **Log In**
   - Use your email and password to access your account
   - Each user has their own gold rush dashboard!

3. **Log Out**
   - Click the **Logout** button in the top right

### Test Features

1. **Click splurge buttons** in the "Test Splurge Transactions" section
   - Watch bandits animate and steal gold
   - See your gold pile shrink in real-time
   - Transaction appears in the dispatches feed

2. **Add your friends to the leaderboard**
   - Fill in the "Post a Wanted Notice" form
   - Enter your friend's name, their budget, and how much they saved
   - Click "Post" to add them to the wanted posters
   - The leaderboard ranks by savings amount!

## 🎨 Design Highlights

- **Gold Pile**: Layered SVG with animated depletion
- **Wanted Posters**: Tilted, aged-paper aesthetic with rankings
- **Bandit Sprites**: Pixelated outlaws with ride-in animation
- **Color Scheme**: Warm golds (#ffd700, #d4af37) on dark wood backgrounds (#2c2416)
- **Typography**: Georgia serif font for authentic wild west feel

## 📱 Responsive Design

Works on desktop and tablet. Mobile is simplified for smaller screens.

## 🔗 File Structure

```
/Users/victoriaxiao/HooHacks/
├── gold_rush_visual_dashboard.html    # Main dashboard (open in browser)
├── server.js                           # Backend with Plaid integration
├── package.json                        # Node.js dependencies
├── .env.example                        # Template for environment variables
└── .env                                # Your actual credentials (don't commit!)
```

## 🔐 Security Notes

- **Never commit `.env` to GitHub** - it contains your Plaid keys
- Plaid never sees real bank credentials - just your transactions
- In production, use a real database to store access tokens (not in-memory)
- Consider adding user authentication for multi-user support

## 🚀 Future Enhancements

- Real-time spending alerts
- Budget goal tracking
- Multi-account support
- Mobile app version
- Integration with more financial institutions
- Recurring transaction detection
- Savings goals with milestone animations

## 💡 Plaid Sandbox Testing

Sandbox mode is perfect for development! You get:
- Fake bank accounts with pre-populated transactions
- No real banking credentials needed
- Instant connections
- Test data for all scenarios

When ready for production:
1. Apply for Plaid production access
2. Change `PlaidEnvironments.sandbox` → `PlaidEnvironments.production`
3. Use real banks instead of Platypus Bank

## 🎮 Easter Eggs

- Try clicking bandits rapidly to trigger multiple heists!
- Splurge enough times and your gold pile will be completely empty
- Different wanted poster rotations based on savings percentage

## 📞 Support

For issues:
1. Make sure the server is running on `http://localhost:3001`
2. Check that `.env` has valid Plaid credentials
3. Open browser console (F12) for network errors
4. Verify Node.js version: `node --version`

---

**Happy budgeting, prospector! 🤠⛏️**
