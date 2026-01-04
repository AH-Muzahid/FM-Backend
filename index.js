const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI;

// Global variable for caching connection
let cachedClient = null;
let cachedDb = null;

async function connectDB() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    if (!uri) {
      throw new Error('MongoDB URI not found in environment variables');
    }

    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }

    });

    await client.connect();

    cachedClient = client;
    cachedDb = client.db("financeDB");
    return cachedDb;

  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

app.get('/', (req, res) => {
  res.send('Welcome to Finance Management API');
});

// Debug route
app.get('/debug', async (req, res) => {
  try {
    const db = await connectDB();
    res.json({
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not Set',
      nodeEnv: process.env.NODE_ENV || 'Not Set',
      dbStatus: cachedDb ? 'Connected' : 'Disconnected',
      ping: 'Successful'
    });
  } catch (error) {
    res.status(500).json({
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not Set',
      dbStatus: 'Connection Failed',
      error: error.message
    });
  }
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const collection = database.collection('transactions');
    const query = { email };

    // Apply Filters
    if (req.query.type && req.query.type !== 'all') {
      query.type = req.query.type;
    }

    if (req.query.date) {
      query.date = req.query.date;
    }

    if (req.query.search) {
      query.$or = [
        { description: { $regex: req.query.search, $options: 'i' } },
        { category: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const totalTransactions = await collection.countDocuments(query);
    const transactions = await collection
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .toArray();

    res.json({
      transactions,
      totalPages: Math.ceil(totalTransactions / limit),
      currentPage: page,
      totalTransactions
    });
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
    const id = req.params.id;

    // Basic validation to prevent crash
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const result = await database.collection('transactions').findOne({ _id: new ObjectId(id) });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/transaction/update/:id', async (req, res) => {
  try {
    const database = await connectDB();
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Remove _id from body to prevent immutable field error
    const { _id, ...updateFields } = req.body;
    const updateDoc = { $set: { ...updateFields, updatedAt: new Date() } };

    const result = await database.collection('transactions').updateOne(
      { _id: new ObjectId(id) },
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
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const result = await database.collection('transactions').deleteOne({ _id: new ObjectId(id) });
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

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}