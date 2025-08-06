import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function GET() {
  const db = await getDb();
  const email = "admin@example.com";
  const password = "securepassword";
  const passwordHash = await bcrypt.hash(password, 10);
  await db.collection("admins").insertOne({ email, passwordHash });
  return NextResponse.json({ success: true, email, password });
} 