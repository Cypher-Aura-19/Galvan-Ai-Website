import { NextResponse } from "next/server";

const FLASK_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET() {
  try {
    const response = await fetch(`${FLASK_BACKEND_URL}/api/careers/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Failed to fetch active careers' }, { status: response.status });
    }

    const activeCareers = await response.json();

    // Map Flask backend response to frontend format
    const mapped = activeCareers.map((c: any) => ({
      ...c,
      _id: c.id?.toString(), // Convert Flask id to _id for compatibility
      id: c.id, // Keep original id as well
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Error fetching active careers:', error);
    return NextResponse.json({ error: 'Failed to fetch active careers' }, { status: 500 });
  }
} 