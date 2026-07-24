import mongoose from 'mongoose';

let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/servnext';

// If MONGODB_URI still contains placeholder `<db_password>`, fallback to local MongoDB to avoid auth failure
if (MONGODB_URI.includes('<db_password>')) {
  console.warn('⚠️ MONGODB_URI contains placeholder <db_password>. Falling back to local MongoDB mongodb://localhost:27017/servnext');
  MONGODB_URI = 'mongodb://localhost:27017/servnext';
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    }).catch((err) => {
      console.error('MongoDB Connection Error:', err.message);
      // Fallback to local MongoDB if remote connection fails (e.g. bad auth)
      if (MONGODB_URI !== 'mongodb://localhost:27017/servnext') {
        console.warn('Falling back to local MongoDB connection (mongodb://localhost:27017/servnext)');
        return mongoose.connect('mongodb://localhost:27017/servnext', opts);
      }
      throw err;
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
