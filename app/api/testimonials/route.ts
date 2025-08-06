import { NextRequest, NextResponse } from "next/server";

const FLASK_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export type Testimonial = {
  _id?: string;
  id?: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  title: string;
  content: string;
  longContent?: string;
  rating: number;
  featured?: boolean;
  tags?: string[];
};

export async function GET() {
  try {
    const response = await fetch(`${FLASK_BACKEND_URL}/api/testimonials`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Failed to fetch testimonials' }, { status: response.status });
    }

    const testimonials = await response.json();

    // Map Flask backend response to frontend format
    const mapped = testimonials.map((t: any) => ({
      ...t,
      _id: t.id?.toString(), // Convert Flask id to _id for compatibility
      id: t.id, // Keep original id as well
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const response = await fetch(`${FLASK_BACKEND_URL}/api/testimonials`, {
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
      return NextResponse.json({ error: result.error || 'Failed to create testimonial' }, { status: response.status });
    }

    return NextResponse.json({ insertedId: result.id });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { _id, ...update } = data;

    if (!_id) {
      return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    }

    const response = await fetch(`${FLASK_BACKEND_URL}/api/testimonials/${_id}`, {
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
      return NextResponse.json({ error: result.error || 'Failed to update testimonial' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { _id } = await req.json();

    if (!_id) {
      return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    }

    const response = await fetch(`${FLASK_BACKEND_URL}/api/testimonials/${_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: result.error || 'Failed to delete testimonial' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
} 