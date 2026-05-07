import mongoose from "mongoose";

const mongoUri = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    if (!mongoUri) {
        throw new Error("MONGODB_URI is missing. Add it to .env.local before starting the app.");
    }

    if (cached.conn) {
        return true;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000,
        };

        cached.promise = mongoose
            .connect(mongoUri, opts)
            .then(() => {
                return true;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return true;
}
