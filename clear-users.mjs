#!/usr/bin/env node
/**
 * Script to clear all users from MongoDB database
 * Use with caution - this will delete ALL user data!
 */

import mongoose from 'mongoose';
import readline from 'readline';

const DATABASE_URL = 'mongodb+srv://qadirdad57332:Password1@test.pebj46q.mongodb.net/?retryWrites=true&w=majority&appName=Test';

// Define User Schema (same as in your app)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Create readline interface for confirmation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function clearAllUsers() {
  console.log('\n⚠️  WARNING: DATABASE USER DELETION ⚠️\n');
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
      rl.close();
      return;
    }
    
    // List all users (without passwords)
    console.log('\n👥 Current users:');
    const users = await User.find().select('email name createdAt');
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (${user.name})`);
    });
    
    // Ask for confirmation
    console.log('\n' + '═'.repeat(60));
    rl.question('\n❓ Are you sure you want to DELETE ALL users? (type "yes" to confirm): ', async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        console.log('\n🗑️  Deleting all users...');
        
        const result = await User.deleteMany({});
        
        console.log(`✅ Successfully deleted ${result.deletedCount} user(s)`);
        console.log('\n✨ Database is now clean! You can test registration with any email.');
        
      } else {
        console.log('\n❌ Operation cancelled. No users were deleted.');
      }
      
      await mongoose.connection.close();
      console.log('\n🔌 Disconnected from MongoDB');
      console.log('═'.repeat(60) + '\n');
      rl.close();
    });
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await mongoose.connection.close();
    rl.close();
    process.exit(1);
  }
}

// Run the script
clearAllUsers();

