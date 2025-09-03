equire('dotenv').config();
const mongoose = require('mongoose');

const createIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create indexes for better performance
    const db = mongoose.connection.db;

    // Messages indexes
    await db.collection('messages').createIndex({ candidateId: 1, createdAt: -1 });
    await db.collection('messages').createIndex({ taggedUsers: 1, createdAt: -1 });
    
    // Notifications indexes
    await db.collection('notifications').createIndex({ userId: 1, isRead: 1, createdAt: -1 });
    await db.collection('notifications').createIndex({ userId: 1, createdAt: -1 });
    
    // Users indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ name: 1 });
    
    // Candidates indexes
    await db.collection('candidates').createIndex({ createdBy: 1, createdAt: -1 });
    await db.collection('candidates').createIndex({ name: 1 });

    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createIndexes();