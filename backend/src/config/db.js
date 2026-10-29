const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/room_radar';
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ [MongoDB Connected]: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`\n⚠️  [MongoDB Connection Failed]: ${error.message}`);
    console.log(`📌 To connect your cloud database:`);
    console.log(`   1. Open 'backend/.env'`);
    console.log(`   2. Set MONGO_URI to your MongoDB Atlas connection string:`);
    console.log(`      MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/room_radar?retryWrites=true&w=majority`);
    console.log(`   3. Restart the backend server with: npm run dev\n`);
  }
};

module.exports = connectDB;
