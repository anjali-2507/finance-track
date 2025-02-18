import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://anjali:1234@alka.tsoau.mongodb.net/alka?retryWrites=true&w=majority";
const MONGODB_DB = process.env.MONGODB_DB || "alka";

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!MONGODB_DB) {
    throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
    // If we have a cached connection, use it
    if (cachedClient && cachedDb) {
        return {
            client: cachedClient,
            db: cachedDb,
        };
    }

    // If no cached connection, create a new one
    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = client.db(MONGODB_DB);

    // Cache the connection
    cachedClient = client;
    cachedDb = db;

    return {
        client,
        db,
    };
} 