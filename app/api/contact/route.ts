import { NextRequest, NextResponse } from "next/server";

const FLASK_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

export type ContactFormData = {
  name: string;
  email: string;
  company: string;
  projectDetails: string;
  createdAt?: string;
  _id?: string;
};

export async function POST(req: NextRequest) {
  try {
    const data: ContactFormData = await req.json();
    const res = await fetch(`${FLASK_BACKEND_URL}/api/contact-quotes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": req.headers.get("idempotency-key") || "",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: result.error || "Failed to submit contact form" }, { status: res.status });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const res = await fetch(`${FLASK_BACKEND_URL}/api/contact-quotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.error || "Failed to fetch quotes" }, { status: res.status });
    }
    // Map id to _id for frontend compatibility
    const mapped = Array.isArray(data)
      ? data.map((q) => ({ ...q, _id: q._id || q.id?.toString() }))
      : data;
    return NextResponse.json(mapped);
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
    const res = await fetch(`${FLASK_BACKEND_URL}/api/contact-quotes/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "",
      },
      credentials: "include",
    });
    const result = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: result.error || "Failed to delete quote" }, { status: res.status });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 