const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function importCategories() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db("financeDB");
    const categoriesCollection = db.collection('categories');

    // Read categories from JSON file
    const categoriesPath = path.join(__dirname, '..', 'categories.json');
    const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));

    // Clear existing categories
    await categoriesCollection.deleteMany({});
    console.log('Cleared existing categories');

    // Insert new categories
    const result = await categoriesCollection.insertMany(categoriesData);
    console.log(`Imported ${result.insertedCount} categories successfully`);

  } catch (error) {
    console.error('Error importing categories:', error);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

importCategories();
