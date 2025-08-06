import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI as string;
if (!uri) throw new Error("Please define the MONGODB_URI environment variable in .env.local");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!(global as any)._mongoClientPromise) {
  client = new MongoClient(uri);
  (global as any)._mongoClientPromise = client.connect();
}
clientPromise = (global as any)._mongoClientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
} 