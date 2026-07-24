import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/servnext';

  if (cached.conn) {
    return cached.conn;
  }

  if (MONGODB_URI.includes('<db_password>')) {
    throw new Error('Please replace <db_password> in .env.local with your actual MongoDB Atlas database password.');
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ MongoDB Atlas Connected Successfully!');
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      console.error('MongoDB Connection Error:', err.message);
      throw new Error(`MongoDB Connection Failed: ${err.message}`);
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
