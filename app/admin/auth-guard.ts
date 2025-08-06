import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  
  if (!sessionCookie) {
    redirect("/admin/login");
  }

  // Check if the session is valid by calling the Flask backend
  try {
    const flaskBackendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const response = await fetch(`${flaskBackendUrl}/`, {
      method: 'GET',
      headers: {
        'Cookie': `session=${sessionCookie}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      redirect("/admin/login");
    }
  } catch (error) {
    console.error('Auth check error:', error);
    redirect("/admin/login");
  }
} 