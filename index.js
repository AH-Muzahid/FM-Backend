const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Welcome to Finance Management API');
});


// MongoDB Connection

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const financeDB = client.db("financeDB");
    const usersCollection = financeDB.collection("users");
    const transactionsCollection = financeDB.collection("transactions");
    const categoriesCollection = financeDB.collection("categories");
    const budgetsCollection = financeDB.collection("budgets");


    // Define your database and collection here
    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log('user received:', user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    // Transaction CRUD routes
    // GET /my-transactions
    app.get('/my-transactions', async (req, res) => {
      const email = req.query.email;
      const sortBy = req.query.sortBy || 'date';
      const sortOrder = req.query.sortOrder || 'desc';
      
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
      
      const query = { email: email };
      const result = await transactionsCollection.find(query).sort(sortOptions).toArray();
      res.send(result);
    });

    // POST /add-transaction 
    app.post('/add-transaction', async (req, res) => {
      const transaction = { ...req.body, createdAt: new Date() };
      const result = await transactionsCollection.insertOne(transaction);
      res.send(result);
    });

    // GET /transaction/:id
    app.get('/transaction/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await transactionsCollection.findOne(query);
      res.send(result);
    });

    // PUT /transaction/update/:id 
    app.put('/transaction/update/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = { $set: { ...req.body, updatedAt: new Date() } };
      const result = await transactionsCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // DELETE /transaction/:id 
    app.delete('/transaction/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await transactionsCollection.deleteOne(query);
      res.send(result);
    });

    // Categories routes
    app.get('/api/categories', async (req, res) => {
      const result = await categoriesCollection.find().toArray();
      res.send(result);
    });




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }

}
run().catch(console.dir);



module.exports = app;