#!/usr/bin/env node
/**
 * Script to clear all users from MongoDB database
 * AUTO MODE - Deletes without confirmation
 */

import mongoose from 'mongoose';

const DATABASE_URL = 'mongodb+srv://qadirdad57332:Password1@test.pebj46q.mongodb.net/?retryWrites=true&w=majority&appName=Test';

// Define User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function clearAllUsers() {
  console.log('\n🗑️  CLEARING ALL USERS FROM DATABASE\n');
  console.log('═'.repeat(60));
  
  try {
    // Connect to MongoDB
    console.log('\n🔌 Connecting to MongoDB...');
    await mongoose.connect(DATABASE_URL, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ Connected to MongoDB');
    
    // Count existing users
    const userCount = await User.countDocuments();
    console.log(`\n📊 Found ${userCount} user(s) in database`);
    
    if (userCount === 0) {
      console.log('\n✨ Database is already empty! No users to delete.');
      await mongoose.connection.close();
      return;
    }
    
    // List all users (without passwords)
    console.log('\n👥 Current users:');
    const users = await User.find().select('email name createdAt');
    users.forEach((user, index) => {
      const date = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown';
      console.log(`   ${index + 1}. ${user.email} - ${user.name} (Created: ${date})`);
    });
    
    console.log('\n🗑️  Deleting all users...');
    
    const result = await User.deleteMany({});
    
    console.log(`\n✅ Successfully deleted ${result.deletedCount} user(s)!`);
    console.log('\n✨ Database is now clean!');
    console.log('   You can now test registration with ANY email address.');
    
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
    console.log('═'.repeat(60) + '\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the script
clearAllUsers();

