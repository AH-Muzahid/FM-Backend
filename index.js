const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI;
let client;
let db;

async function connectDB() {
  try {
    if (!uri) {
      throw new Error('MongoDB URI not found in environment variables');
    }
    
    // Simple connection for serverless
    const client = new MongoClient(uri);
    await client.connect();
    return client.db("financeDB");
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

app.get('/', (req, res) => {
  res.send('Welcome to Finance Management API');
});

// Debug route
app.get('/debug', (req, res) => {
  res.json({
    mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not Set',
    nodeEnv: process.env.NODE_ENV || 'Not Set'
  });
});

// Transaction routes
app.get('/my-transactions', async (req, res) => {
  try {
    const database = await connectDB();
    if (!database) {
      throw new Error('Database connection failed');
    }
    
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }
    
    const sortBy = req.query.sortBy || 'date';
    const sortOrder = req.query.sortOrder || 'desc';
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const result = await database.collection('transactions')
      .find({ email })
      .sort(sortOptions)
      .toArray();
    res.json(result);
  } catch (error) {
    console.error('Error in /my-transactions:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/add-transaction', async (req, res) => {
  try {
    const database = await connectDB();
    const transaction = { ...req.body, createdAt: new Date() };
    const result = await database.collection('transactions').insertOne(transaction);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/transaction/:id', async (req, res) => {
  try {
    const database = await connectDB();
    const result = await database.collection('transactions').findOne({ _id: new ObjectId(req.params.id) });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/transaction/update/:id', async (req, res) => {
  try {
    const database = await connectDB();
    const updateDoc = { $set: { ...req.body, updatedAt: new Date() } };
    const result = await database.collection('transactions').updateOne(
      { _id: new ObjectId(req.params.id) },
      updateDoc
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/transaction/:id', async (req, res) => {
  try {
    const database = await connectDB();
    const result = await database.collection('transactions').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const database = await connectDB();
    const result = await database.collection('categories').find().toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;