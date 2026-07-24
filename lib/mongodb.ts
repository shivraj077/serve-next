import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/servnext';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (MONGODB_URI.includes('<db_password>')) {
    throw new Error('Please replace <db_password> in .env.local with your actual MongoDB Atlas database password.');
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      console.error('MongoDB Connection Error:', err.message);
      throw new Error(`MongoDB Connection Failed: ${err.message}. Please check your MONGODB_URI password in .env.local`);
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
