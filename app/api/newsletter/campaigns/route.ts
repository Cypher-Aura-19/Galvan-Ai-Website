import { NextRequest, NextResponse } from 'next/server';
import { newsletterService } from '@/lib/newsletter-service';

export async function GET(request: NextRequest) {
  try {
    const campaigns = await newsletterService.getCampaigns();
    return NextResponse.json({ success: true, campaigns }, { status: 200 });
  } catch (error) {
    console.error('Newsletter campaigns API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const subject = formData.get("subject") as string;
    const content = formData.get("content") as string;
    const htmlContent = formData.get("htmlContent") as string;
    const status = formData.get("status") as 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
    const scheduledAt = formData.get("scheduledAt") as string;

    if (!subject || !content) {
      return NextResponse.json(
        { success: false, message: "Subject and content are required." },
        { status: 400 }
      );
    }

    const campaign = {
      subject,
      content,
      htmlContent,
      status,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      recipientCount: 0,
      sentCount: 0,
      failedCount: 0,
      tags: []
    };

    const result = await newsletterService.createCampaign(campaign);
    
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Newsletter campaign creation API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
} 