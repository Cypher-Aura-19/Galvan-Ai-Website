import { NextRequest, NextResponse } from 'next/server';
import { newsletterService } from '@/lib/newsletter-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = params.id;
    
    if (!campaignId) {
      return NextResponse.json(
        { success: false, message: 'Campaign ID is required.' },
        { status: 400 }
      );
    }

    const result = await newsletterService.sendCampaign(campaignId);
    
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Newsletter campaign send API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
} 