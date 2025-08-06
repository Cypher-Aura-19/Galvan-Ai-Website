import { NextRequest, NextResponse } from "next/server";

const FLASK_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export type Team = {
  _id?: string;
  id?: number;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  email: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  department: string;
  position: string;
  skills?: string[];
};

export async function GET() {
  try {
    const response = await fetch(`${FLASK_BACKEND_URL}/api/teams`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Failed to fetch teams' }, { status: response.status });
    }

    const teams = await response.json();

    // Map Flask backend response to frontend format
    const mapped = teams.map((t: any) => ({
      ...t,
      _id: t.id?.toString(), // Convert Flask id to _id for compatibility
      id: t.id, // Keep original id as well
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const response = await fetch(`${FLASK_BACKEND_URL}/api/teams`, {
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
      return NextResponse.json({ error: result.error || 'Failed to create team member' }, { status: response.status });
    }

    return NextResponse.json({ insertedId: result.id });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { _id, ...update } = data;

    if (!_id) {
      return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    }

    const response = await fetch(`${FLASK_BACKEND_URL}/api/teams/${_id}`, {
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
      return NextResponse.json({ error: result.error || 'Failed to update team member' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { _id } = await req.json();

    if (!_id) {
      return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    }

    const response = await fetch(`${FLASK_BACKEND_URL}/api/teams/${_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: result.error || 'Failed to delete team member' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
  }
} 