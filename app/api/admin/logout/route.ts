import { NextRequest, NextResponse } from "next/server";

const FLASK_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET(req: NextRequest) {
  try {
    // Forward the request to Flask backend
    const response = await fetch(`${FLASK_BACKEND_URL}/logout`, {
      method: 'GET',
      headers: {
        'Cookie': req.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    if (response.ok) {
      // Create response with cleared cookie
      const res = NextResponse.json({ success: true, message: 'Logout successful' });
      
      // Clear any session cookies
      res.cookies.set("session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0, // Expire immediately
      });
      
      return res;
    } else {
      return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 