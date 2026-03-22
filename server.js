require('dotenv').config();
const express = require('express');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Plaid client
const plaidClient = new PlaidApi(new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
}));

// Store access tokens in memory (in production, use a database)
let accessTokens = {};

// Step 1: Create a link token (frontend calls this first)
app.post('/create-link-token', async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'gold-rush-user-123' },
      client_name: 'Gold Rush',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error creating link token:', error);
    res.status(500).json({ error: error.message });
  }
});

// Step 2: Exchange public token for access token
app.post('/exchange-token', async (req, res) => {
  try {
    const { public_token } = req.body;
    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    const access_token = response.data.access_token;
    const item_id = response.data.item_id;

    // Store the access token (in production, save to database with user ID)
    accessTokens[item_id] = access_token;

    res.json({ 
      success: true, 
      item_id: item_id,
      message: 'Bank account linked successfully!'
    });
  } catch (error) {
    console.error('Error exchanging token:', error);
    res.status(500).json({ error: error.message });
  }
});

// Step 3: Fetch transactions
app.get('/transactions', async (req, res) => {
  try {
    // Get the first stored access token (for demo purposes)
    const access_token = Object.values(accessTokens)[0];

    if (!access_token) {
      return res.status(400).json({ error: 'No linked accounts found. Please connect a bank account first.' });
    }

    // Get current date and 30 days ago
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const response = await plaidClient.transactionsGet({
      access_token: access_token,
      start_date: startDate,
      end_date: endDate,
      options: {
        count: 100,
        offset: 0,
      },
    });

    res.json({
      transactions: response.data.transactions,
      accounts: response.data.accounts,
      total_transactions: response.data.total_transactions,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get account balances
app.get('/balances', async (req, res) => {
  try {
    const access_token = Object.values(accessTokens)[0];

    if (!access_token) {
      return res.status(400).json({ error: 'No linked accounts found.' });
    }

    const response = await plaidClient.accountsBalanceGet({
      access_token: access_token,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching balances:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// Check if Plaid is connected
app.get('/plaid-status', (req, res) => {
  res.json({ connected: Object.keys(accessTokens).length > 0 });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🏗️ Gold Rush server running on port ${PORT}`);
  console.log('Make sure you have set PLAID_CLIENT_ID and PLAID_SECRET in your .env file');
});
