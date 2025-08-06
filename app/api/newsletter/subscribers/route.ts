import { NextRequest, NextResponse } from 'next/server';
import { newsletterService } from '@/lib/newsletter-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = parseInt(searchParams.get('skip') || '0');

    const subscribers = await newsletterService.getSubscribers(limit, skip);
    return NextResponse.json({ success: true, subscribers }, { status: 200 });
  } catch (error) {
    console.error('Newsletter subscribers API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
} 