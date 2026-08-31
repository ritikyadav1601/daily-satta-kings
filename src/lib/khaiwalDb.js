import mongoose from "mongoose";

const uri = process.env.KHAIWAL_MONGODB_URI;
let cached = global.khaiwalMongoose;
if (!cached) cached = global.khaiwalMongoose = { conn: null, promise: null };

export async function connectKhaiwalDB() {
  if (!uri) throw new Error("KHAIWAL_MONGODB_URI is missing.");
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.createConnection(uri, {
      dbName: process.env.KHAIWAL_MONGODB_DATABASE || "khaiwal_management",
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    }).asPromise();
  }
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  return cached.conn;
}
