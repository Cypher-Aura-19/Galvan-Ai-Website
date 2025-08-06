import { NextRequest, NextResponse } from "next/server";
import { getFlaskUrl, proxyRequest } from "@/lib/flaskProxy";

const FLASK_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const FLASK_ENDPOINT = FLASK_BASE + "/api/questionnaires";

// Proxy GET (all or by jobId)
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const jobId = url.searchParams.get("jobId");
  let flaskUrl = FLASK_ENDPOINT;
  if (jobId) flaskUrl += `?jobId=${encodeURIComponent(jobId)}`;
  const flaskRes = await fetch(flaskUrl, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const data = await flaskRes.json();
  // Map id <-> _id for frontend compatibility
  if (Array.isArray(data)) {
    data.forEach((q: any) => {
      if (q.id && !q._id) q._id = String(q.id);
    });
  }
  return NextResponse.json(data, { status: flaskRes.status });
}

// Proxy POST (create)
export async function POST(req: NextRequest) {
  const body = await req.text();
  const flaskRes = await fetch(FLASK_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": req.headers.get("cookie") || "",
    },
    body,
    credentials: "include",
  });
  const data = await flaskRes.json();
  return NextResponse.json(data, { status: flaskRes.status });
}

// Proxy PUT (update)
export async function PUT(req: NextRequest) {
  const body = await req.json();
  // Flask expects /api/questionnaires/<id> (integer)
  let id = body._id || body.id;
  if (!id) return NextResponse.json({ error: "Missing _id" }, { status: 400 });
  id = parseInt(id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid _id" }, { status: 400 });
  const flaskRes = await fetch(`${FLASK_ENDPOINT}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Cookie": req.headers.get("cookie") || "",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  let data;
  try {
    data = await flaskRes.json();
  } catch {
    data = { error: "Invalid response from backend" };
  }
  if (!flaskRes.ok) {
    return NextResponse.json({ error: data.error || "Failed to update questionnaire" }, { status: flaskRes.status });
  }
  return NextResponse.json(data, { status: flaskRes.status });
}

// Proxy DELETE
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  let id = body._id || body.id;
  if (!id) return NextResponse.json({ error: "Missing _id" }, { status: 400 });
  id = parseInt(id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid _id" }, { status: 400 });
  const flaskRes = await fetch(`${FLASK_ENDPOINT}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Cookie": req.headers.get("cookie") || "",
    },
    credentials: "include",
  });
  let data;
  try {
    data = await flaskRes.json();
  } catch {
    data = { error: "Invalid response from backend" };
  }
  if (!flaskRes.ok) {
    return NextResponse.json({ error: data.error || "Failed to delete questionnaire" }, { status: flaskRes.status });
  }
  return NextResponse.json(data, { status: flaskRes.status });
} 