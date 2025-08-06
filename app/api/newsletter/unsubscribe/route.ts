import { NextRequest, NextResponse } from 'next/server';
import { newsletterService } from '@/lib/newsletter-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unsubscribe token is required.' },
        { status: 400 }
      );
    }

    const result = await newsletterService.unsubscribeFromNewsletter(token);
    
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Newsletter unsubscription API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
} 