import { NextRequest, NextResponse } from "next/server";

const FLASK_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export type Project = {
  _id?: string;
  id?: number;
  hero: {
    subtitle: string;
    description: string;
    banner: string;
  };
  gallery: string[];
  features: string[];
  team: { name: string; role: string; avatar: string }[];
  timeline: { phase: string; date: string }[];
  testimonials: { quote: string; author: string }[];
  technologies: string[];
  longDescription: string;
  bestProject?: boolean;
};

export async function GET() {
  try {
    const response = await fetch(`${FLASK_BACKEND_URL}/api/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Failed to fetch projects' }, { status: response.status });
    }

    const projects = await response.json();
    
    // Map Flask backend response to frontend format
    const mapped = projects.map((p: any) => ({
      ...p,
      _id: p.id?.toString(), // Convert Flask id to _id for compatibility
      id: p.id, // Keep original id as well
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const response = await fetch(`${FLASK_BACKEND_URL}/api/projects`, {
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
      return NextResponse.json({ error: result.error || 'Failed to create project' }, { status: response.status });
    }

    return NextResponse.json({ insertedId: result.id });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { _id, ...update } = data;
    
    if (!_id) {
      return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    }

    const response = await fetch(`${FLASK_BACKEND_URL}/api/projects/${_id}`, {
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
      return NextResponse.json({ error: result.error || 'Failed to update project' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { _id } = await req.json();
    
    if (!_id) {
      return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    }

    const response = await fetch(`${FLASK_BACKEND_URL}/api/projects/${_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: result.error || 'Failed to delete project' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
} 