import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

async function checkIndexes() {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('users');
    
    // Get all indexes
    const indexes = await collection.indexes();
    console.log('Current indexes on users collection:');
    console.log(JSON.stringify(indexes, null, 2));
    
    // Drop the problematic username index if it exists
    try {
      await collection.dropIndex('username_1');
      console.log('Successfully dropped username_1 index');
    } catch (error) {
      console.log('username_1 index might not exist or already dropped');
    }
    
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

checkIndexes();