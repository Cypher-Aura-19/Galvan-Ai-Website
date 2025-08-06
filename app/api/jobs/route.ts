import { NextRequest, NextResponse } from "next/server";

const FLASK_BACKEND_URL = process.env.NEXT_PUBLIC_FLASK_BACKEND_URL || "http://127.0.0.1:5000";

export async function GET() {
  try {
    const res = await fetch(`${FLASK_BACKEND_URL}/api/careers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.error || "Failed to fetch jobs" }, { status: res.status });
    }
    // Map id to id and _id for frontend compatibility
    const mapped = Array.isArray(data)
      ? data.map((j) => ({
          ...j,
          id: j.id?.toString(),
          _id: j.id?.toString(),
          applicationProcess: Array.isArray(j.applicationProcess) ? j.applicationProcess : [],
        }))
      : data;
    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const res = await fetch(`${FLASK_BACKEND_URL}/api/careers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    const result = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: result.error || "Failed to create job" }, { status: res.status });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data._id) {
      return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    }
    const res = await fetch(`${FLASK_BACKEND_URL}/api/careers/${data._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    const result = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: result.error || "Failed to update job" }, { status: res.status });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { _id } = await req.json();
    if (!_id) {
      return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    }
    const res = await fetch(`${FLASK_BACKEND_URL}/api/careers/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "",
      },
      credentials: "include",
    });
    const result = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: result.error || "Failed to delete job" }, { status: res.status });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 