import { NextRequest, NextResponse } from 'next/server';
import { newsletterService } from '@/lib/newsletter-service';

export async function GET(request: NextRequest) {
  try {
    const stats = await newsletterService.getNewsletterStats();
    return NextResponse.json({ success: true, stats }, { status: 200 });
  } catch (error) {
    console.error('Newsletter stats API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
} 