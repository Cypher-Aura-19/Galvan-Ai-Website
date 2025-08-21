import { NextRequest, NextResponse } from "next/server";

const FLASK_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const res = await fetch(`${FLASK_BACKEND_URL}/api/job-applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": req.headers.get("idempotency-key") || "",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: result.error || "Failed to submit application" }, { status: res.status });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const params = url.search ? url.search : "";
    const res = await fetch(`${FLASK_BACKEND_URL}/api/job-applications${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.error || "Failed to fetch applications" }, { status: res.status });
    }
    // Map id to _id for frontend compatibility
    const mapped = Array.isArray(data)
      ? data.map((a) => ({
          ...a,
          _id: a._id || a.id?.toString(),
          status: typeof a.status === 'string' ? a.status : 'pending',
        }))
      : data;
    return NextResponse.json(mapped);
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
    const res = await fetch(`${FLASK_BACKEND_URL}/api/job-applications/${data._id}`, {
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
      return NextResponse.json({ error: result.error || "Failed to update application" }, { status: res.status });
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
    const res = await fetch(`${FLASK_BACKEND_URL}/api/job-applications/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "",
      },
      credentials: "include",
    });
    const result = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: result.error || "Failed to delete application" }, { status: res.status });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 