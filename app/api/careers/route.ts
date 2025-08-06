import { NextRequest, NextResponse } from "next/server";

const FLASK_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export type Career = {
  _id?: string;
  id?: number;
  title: string;
  company: string;
  location: string;
  type: string;
  department: string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  salary_range?: string;
  experience_level?: string;
  skills_required?: string[];
  application_deadline?: string;
  is_active?: boolean;
};

export async function GET() {
  try {
    const response = await fetch(`${FLASK_BACKEND_URL}/api/careers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Failed to fetch careers' }, { status: response.status });
    }

    const careers = await response.json();

    // Map Flask backend response to frontend format
    const mapped = careers.map((c: any) => ({
      ...c,
      _id: c.id?.toString(), // Convert Flask id to _id for compatibility
      id: c.id, // Keep original id as well
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Error fetching careers:', error);
    return NextResponse.json({ error: 'Failed to fetch careers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const response = await fetch(`${FLASK_BACKEND_URL}/api/careers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.get('cookie') || '',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: result.error || 'Failed to create career' }, { status: response.status });
    }

    return NextResponse.json({ insertedId: result.id });
  } catch (error) {
    console.error('Error creating career:', error);
    return NextResponse.json({ error: 'Failed to create career' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { _id, ...update } = data;

    if (!_id) {
      return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    }

    const response = await fetch(`${FLASK_BACKEND_URL}/api/careers/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.get('cookie') || '',
      },
      credentials: 'include',
      body: JSON.stringify(update),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: result.error || 'Failed to update career' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating career:', error);
    return NextResponse.json({ error: 'Failed to update career' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { _id } = await req.json();

    if (!_id) {
      return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    }

    const response = await fetch(`${FLASK_BACKEND_URL}/api/careers/${_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: result.error || 'Failed to delete career' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting career:', error);
    return NextResponse.json({ error: 'Failed to delete career' }, { status: 500 });
  }
} 