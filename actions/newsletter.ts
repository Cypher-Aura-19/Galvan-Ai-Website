"use server"

import { newsletterService } from '@/lib/newsletter-service';
import { revalidatePath } from 'next/cache';

/**
 * Subscribes an email to the newsletter with automated welcome email.
 */
export async function subscribeToNewsletter(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const source = formData.get("source") as string || 'website';

    if (!email || !email.includes("@")) {
      return {
        success: false,
        message: "Please enter a valid email address.",
      }
    }

    const result = await newsletterService.subscribeToNewsletter(email, firstName, lastName, source);
    revalidatePath('/');
    return result;
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      message: "Failed to subscribe. Please try again.",
    }
  }
}

/**
 * Unsubscribes an email from the newsletter.
 */
export async function unsubscribeFromNewsletter(token: string) {
  try {
    return await newsletterService.unsubscribeFromNewsletter(token);
  } catch (error) {
    console.error('Newsletter unsubscription error:', error);
    return {
      success: false,
      message: "Failed to unsubscribe. Please try again.",
    }
  }
}

/**
 * Gets newsletter statistics for admin dashboard.
 */
export async function getNewsletterStats() {
  try {
    return await newsletterService.getNewsletterStats();
  } catch (error) {
    console.error('Failed to get newsletter stats:', error);
    return {
      totalSubscribers: 0,
      activeSubscribers: 0,
      newSubscribersThisMonth: 0,
      emailsSentThisMonth: 0,
      averageOpenRate: 0,
      averageClickRate: 0
    };
  }
}

/**
 * Gets all subscribers for admin dashboard.
 */
export async function getSubscribers(limit = 100, skip = 0) {
  try {
    return await newsletterService.getSubscribers(limit, skip);
  } catch (error) {
    console.error('Failed to get subscribers:', error);
    return [];
  }
}

/**
 * Creates a new email campaign.
 */
export async function createEmailCampaign(formData: FormData) {
  try {
    const subject = formData.get("subject") as string;
    const content = formData.get("content") as string;
    const htmlContent = formData.get("htmlContent") as string;
    const status = formData.get("status") as 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
    const scheduledAt = formData.get("scheduledAt") as string;

    if (!subject || !content) {
      return {
        success: false,
        message: "Subject and content are required.",
      }
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
    revalidatePath('/admin/newsletter');
    return result;
  } catch (error) {
    console.error('Failed to create campaign:', error);
    return {
      success: false,
      message: "Failed to create campaign. Please try again.",
    }
  }
}

/**
 * Sends an email campaign to all subscribers.
 */
export async function sendEmailCampaign(campaignId: string) {
  try {
    const result = await newsletterService.sendCampaign(campaignId);
    revalidatePath('/admin/newsletter');
    return result;
  } catch (error) {
    console.error('Failed to send campaign:', error);
    return {
      success: false,
      message: "Failed to send campaign. Please try again.",
    }
  }
}

/**
 * Gets all email campaigns for admin dashboard.
 */
export async function getEmailCampaigns() {
  try {
    return await newsletterService.getCampaigns();
  } catch (error) {
    console.error('Failed to get campaigns:', error);
    return [];
  }
}
