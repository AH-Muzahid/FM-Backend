# Finance Management Backend

A Node.js + Express server for managing financial transactions with MongoDB database integration.

## 🎯 Features

- **REST API**: Complete API for transaction management
- **MongoDB Integration**: NoSQL database for data persistence
- **Authentication**: JWT-based authentication
- **CORS Support**: Cross-origin requests handling
- **Error Handling**: Comprehensive error management
- **Environment Configuration**: Secure environment variable management
- **Vercel Deployment**: Ready for Vercel deployment

## 📋 API Endpoints

### Base URL
```
http://localhost:5000
```

### Transactions Endpoints

#### Get All Transactions
```http
GET /api/transactions
```
**Query Parameters:**
- `userId`: Filter by user ID
- `category`: Filter by transaction category
- `startDate`: Filter from date
- `endDate`: Filter to date

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "transaction_id",
      "userId": "user_id",
      "amount": 100,
      "category": "Food",
      "description": "Lunch",
      "date": "2025-11-13",
      "type": "expense",
      "createdAt": "2025-11-13T10:00:00Z"
    }
  ]
}
```

#### Get Single Transaction
```http
GET /api/transactions/:id
```

**Response:**
```json
{
  "success": true,
  "data": { /* transaction object */ }
}
```

#### Create Transaction
```http
POST /api/transactions
Content-Type: application/json

{
  "userId": "user_id",
  "amount": 100,
  "category": "Food",
  "description": "Lunch",
  "date": "2025-11-13",
  "type": "expense"
}
```

**Response:** `201 Created`

#### Update Transaction
```http
PUT /api/transactions/:id
Content-Type: application/json

{
  "amount": 150,
  "category": "Dining",
  "description": "Dinner"
}
```

**Response:** `200 OK`

#### Delete Transaction
```http
DELETE /api/transactions/:id
```

**Response:** `200 OK`

## 🚀 Getting Started

### Prerequisites
- Node.js v14 or higher
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Express.js knowledge

### Installation

```bash
# Install dependencies
npm install

# Create .env file (see Configuration section)

# Start development server
npm run dev

# Or start production server
npm start
```

## ⚙️ Configuration

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-db?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Environment Variables Explanation

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key` |
| `NODE_ENV` | Environment type | `development`, `production` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |

## 📦 Dependencies

```json
{
  "express": "^5.1.0",        // Web framework
  "mongodb": "^6.20.0",       // Database driver
  "dotenv": "^17.2.3",        // Environment variables
  "cors": "^2.8.5"            // CORS middleware
}
```

### Optional Dependencies for Enhancement
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `validator` - Input validation
- `helmet` - Security headers
- `morgan` - HTTP logging

## 🔧 Available Scripts

```bash
# Start server
npm start

# Development mode (with nodemon)
npm run dev

# Production mode
npm run build
```

## 📁 Project Structure

```
FM-BackEnd/
├── index.js              # Main server file
├── package.json          # Project metadata & dependencies
├── package-lock.json     # Dependency lock file
├── .env                  # Environment variables (git ignored)
├── .env.example          # Example environment file
├── vercel.json          # Vercel deployment config
├── .gitignore           # Git ignore rules
└── node_modules/        # Dependencies
```

## 💻 Server Implementation

### Basic Server Setup

```javascript
// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/transactions', (req, res) => {
  // Get all transactions
});

app.post('/api/transactions', (req, res) => {
  // Create new transaction
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 🗄️ Database Schema

### Transaction Collection

```javascript
{
  _id: ObjectId,
  userId: String,        // Firebase UID
  amount: Number,        // Transaction amount
  category: String,      // Transaction category
  description: String,   // Transaction description
  date: Date,           // Transaction date
  type: String,         // "income" or "expense"
  createdAt: Date,      // Creation timestamp
  updatedAt: Date       // Last update timestamp
}
```

## 🔒 Security Best Practices

1. **Environment Variables**: Keep sensitive data in `.env` file
2. **CORS Configuration**: Only allow trusted origins
3. **Input Validation**: Validate all incoming data
4. **Error Handling**: Don't expose sensitive error details
5. **Authentication**: Use JWT tokens for user verification
6. **HTTPS**: Use HTTPS in production

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Configure Environment Variables:**
   - Go to Vercel dashboard
   - Add environment variables in project settings
   - Redeploy

### Deploy to Heroku

1. **Create Procfile:**
```
web: node index.js
```

2. **Deploy:**
```bash
heroku create your-app-name
git push heroku main
heroku config:set PORT=5000
```

## 📝 Development Guidelines

1. **Code Structure**: Keep routes, controllers, and models separate
2. **Error Handling**: Always handle promises and async/await
3. **Logging**: Log important operations for debugging
4. **Testing**: Write tests for critical functions
5. **Comments**: Document complex logic
6. **Validation**: Validate input data before processing

## 🐛 Common Issues

### MongoDB Connection Error
- Verify `MONGODB_URI` is correct
- Check if MongoDB Atlas IP whitelist includes your IP
- Ensure database user has proper permissions

### CORS Errors
- Check `CORS_ORIGIN` matches frontend URL
- For development, you can use `*` (not recommended for production)

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

## 📚 Resources

- [Express Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides)

## 🧪 Testing

### Test API Endpoints with cURL

```bash
# Get all transactions
curl -X GET http://localhost:5000/api/transactions

# Create transaction
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"userId":"123","amount":100,"category":"Food","type":"expense"}'

# Get transaction by ID
curl -X GET http://localhost:5000/api/transactions/transaction_id

# Update transaction
curl -X PUT http://localhost:5000/api/transactions/transaction_id \
  -H "Content-Type: application/json" \
  -d '{"amount":150}'

# Delete transaction
curl -X DELETE http://localhost:5000/api/transactions/transaction_id
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push to your branch
6. Create a pull request

## 📄 License

This project is open source and available under the MIT License.

---

**Last Updated**: November 13, 2025
