import { NextRequest, NextResponse } from "next/server";

const FLASK_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    // Create form data for Flask backend
    const flaskFormData = new FormData();
    flaskFormData.append('username', username);
    flaskFormData.append('password', password);

    // Make request to Flask backend
    const response = await fetch(`${FLASK_BACKEND_URL}/login`, {
      method: 'POST',
      body: flaskFormData,
      credentials: 'include',
      redirect: 'manual', // Don't follow redirects automatically
    });

    // Check if we got a redirect (302) - this means successful login
    if (response.status === 302) {
      // Get cookies from Flask response
      const flaskCookies = response.headers.get('set-cookie');
      
      const res = NextResponse.json({ 
        success: true, 
        message: 'Login successful',
        user: { username }
      });

      // Forward Flask session cookies
      if (flaskCookies) {
        res.headers.set('set-cookie', flaskCookies);
      }

      return res;
    } 
    // Check if we got a 200 response (login page rendered again - failed login)
    else if (response.status === 200) {
      // Check if there's a flash message indicating login failure
      const responseText = await response.text();
      
      // Look for flash messages in the HTML response
      if (responseText.includes('Invalid username or password') || 
          responseText.includes('get_flashed_messages') ||
          responseText.includes('<ul>') && responseText.includes('</ul>')) {
        return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
      }
      
      // If we get a 200 response but no clear error, it's likely a failed login
      // (Flask renders the login page again on failed login)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    // Any other status code is an error
    else {
      console.log('Flask response status:', response.status);
      return NextResponse.json({ error: "Login failed" }, { status: 401 });
    }
  } catch (error) {
    console.error('Login proxy error:', error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
} 