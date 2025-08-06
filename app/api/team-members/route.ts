import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export type TeamMember = {
  _id?: string;
  name: string;
  img: string;
  role: string;
  about: string;
  background: string;
  interests: string;
  skills: string[];
  quote: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    dribbble?: string;
  };
  awards: string[];
  certifications: string[];
  location: string;
  languages: string[];
  funFact: string;
};

const COLLECTION = "teamMembers";

export async function GET() {
  const db = await getDb();
  const members = await db.collection(COLLECTION).find({}).toArray();
  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const db = await getDb();
  const data = await req.json();
  // Backend validation
  if (!data.name || typeof data.name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!data.role || typeof data.role !== "string") {
    return NextResponse.json({ error: "Role is required" }, { status: 400 });
  }
  // Optionally validate other fields here
  const result = await db.collection(COLLECTION).insertOne(data);
  return NextResponse.json({ insertedId: result.insertedId });
}

export async function PUT(req: NextRequest) {
  const db = await getDb();
  const { _id, ...update } = await req.json();
  if (!_id) return NextResponse.json({ error: "Missing _id" }, { status: 400 });
  await db.collection(COLLECTION).updateOne({ _id: new ObjectId(_id) }, { $set: update });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const db = await getDb();
  const { _id } = await req.json();
  if (!_id) return NextResponse.json({ error: "Missing _id" }, { status: 400 });
  await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(_id) });
  return NextResponse.json({ success: true });
} 