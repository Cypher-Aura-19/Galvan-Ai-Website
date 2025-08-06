import { NextRequest, NextResponse } from "next/server";

const FLASK_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export type BlogPost = {
  _id?: string;
  id?: number;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    bio: string;
  };
  readTime: string;
  publishDate: string;
  category: string;
  image: string;
  tags: string[];
  featured?: boolean;
  intro: string;
  keyConcepts: string[];
  implementation: string;
  bestPractices: string[];
  conclusion: string;
};

export async function GET() {
  try {
    const response = await fetch(`${FLASK_BACKEND_URL}/api/blog-posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Failed to fetch blog posts' }, { status: response.status });
    }

    const blogPosts = await response.json();
    
    // Map Flask backend response to frontend format
    const mapped = blogPosts.map((p: any) => ({
      ...p,
      _id: p.id?.toString(), // Convert Flask id to _id for compatibility
      id: p.id, // Keep original id as well
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const response = await fetch(`${FLASK_BACKEND_URL}/api/blog-posts`, {
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
      return NextResponse.json({ error: result.error || 'Failed to create blog post' }, { status: response.status });
    }

    return NextResponse.json({ insertedId: result.id });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { _id, ...update } = data;
    
    if (!_id) {
      return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    }

    const response = await fetch(`${FLASK_BACKEND_URL}/api/blog-posts/${_id}`, {
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
      return NextResponse.json({ error: result.error || 'Failed to update blog post' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { _id } = await req.json();
    
    if (!_id) {
      return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    }

    const response = await fetch(`${FLASK_BACKEND_URL}/api/blog-posts/${_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: result.error || 'Failed to delete blog post' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
} 