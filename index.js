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
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    await client.connect();
    db = client.db("financeDB");
  }
  return db;
}

app.get('/', (req, res) => {
  res.send('Welcome to Finance Management API');
});

// Transaction routes
app.get('/my-transactions', async (req, res) => {
  try {
    const database = await connectDB();
    const email = req.query.email;
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