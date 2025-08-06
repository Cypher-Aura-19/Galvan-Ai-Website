import { NextRequest, NextResponse } from "next/server";

const FLASK_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET(req: NextRequest) {
  try {
    // Forward the request to Flask backend to check authentication
    const response = await fetch(`${FLASK_BACKEND_URL}/`, {
      method: 'GET',
      headers: {
        'Cookie': req.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    if (response.ok) {
      // User is authenticated
      return NextResponse.json({ 
        success: true, 
        authenticated: true,
        message: 'User is authenticated'
      });
    } else {
      // User is not authenticated
      return NextResponse.json({ 
        success: false, 
        authenticated: false,
        message: 'User is not authenticated'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Dashboard check error:', error);
    return NextResponse.json({ 
      success: false, 
      authenticated: false,
      message: 'Authentication check failed'
    }, { status: 500 });
  }
} 