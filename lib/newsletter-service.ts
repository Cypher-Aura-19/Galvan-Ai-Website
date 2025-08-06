import { getDb } from './mongodb';
import { NewsletterSubscriber, EmailCampaign, EmailTemplate, NewsletterStats } from './types/newsletter';
import { emailService } from './email-service';
import crypto from 'crypto';

export class NewsletterService {
  private db: any = null;
  private isInitialized = false;

  constructor() {
    // Don't initialize immediately to prevent startup errors
  }

  private async initDb() {
    if (this.isInitialized) return;
    
    try {
      this.db = await getDb();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw new Error('Database connection failed');
    }
  }

  private async getCollection(collectionName: string) {
    if (!this.isInitialized) {
      await this.initDb();
    }
    return this.db.collection(collectionName);
  }

  // Subscriber Management
  async subscribeToNewsletter(email: string, firstName?: string, lastName?: string, source?: string): Promise<{ success: boolean; message: string; subscriber?: NewsletterSubscriber }> {
    try {
      const collection = await this.getCollection('newsletter_subscribers');
      
      // Check if already subscribed
      const existing = await collection.findOne({ email: email.toLowerCase() });
      if (existing) {
        if (existing.isActive) {
          return { success: false, message: 'You are already subscribed to our newsletter!' };
        } else {
          // Reactivate subscription
          await collection.updateOne(
            { email: email.toLowerCase() },
            { 
              $set: { 
                isActive: true, 
                subscribedAt: new Date(),
                firstName,
                lastName,
                source,
                unsubscribeToken: this.generateUnsubscribeToken()
              }
            }
          );
          const reactivated = await collection.findOne({ email: email.toLowerCase() });
          await emailService.sendWelcomeEmail(reactivated);
          return { success: true, message: 'Welcome back! You have been resubscribed to our newsletter.', subscriber: reactivated };
        }
      }

      // Create new subscriber
      const subscriber: NewsletterSubscriber = {
        email: email.toLowerCase(),
        firstName,
        lastName,
        subscribedAt: new Date(),
        isActive: true,
        source,
        tags: [],
        unsubscribeToken: this.generateUnsubscribeToken()
      };

      await collection.insertOne(subscriber);
      
      // Send welcome email
      await emailService.sendWelcomeEmail(subscriber);

      return { success: true, message: 'Successfully subscribed to our newsletter! Check your inbox for a welcome email.', subscriber };
    } catch (error) {
      console.error('Failed to subscribe to newsletter:', error);
      return { success: false, message: 'Failed to subscribe. Please try again.' };
    }
  }

  async unsubscribeFromNewsletter(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const collection = await this.getCollection('newsletter_subscribers');
      
      const subscriber = await collection.findOne({ unsubscribeToken: token, isActive: true });
      if (!subscriber) {
        return { success: false, message: 'Invalid or expired unsubscribe link.' };
      }

      await collection.updateOne(
        { unsubscribeToken: token },
        { $set: { isActive: false } }
      );

      // Send unsubscribe confirmation email
      await emailService.sendUnsubscribeEmail(subscriber);

      return { success: true, message: 'You have been successfully unsubscribed from our newsletter.' };
    } catch (error) {
      console.error('Failed to unsubscribe from newsletter:', error);
      return { success: false, message: 'Failed to unsubscribe. Please try again.' };
    }
  }

  async getSubscribers(limit = 100, skip = 0): Promise<NewsletterSubscriber[]> {
    try {
      const collection = await this.getCollection('newsletter_subscribers');
      return await collection.find({ isActive: true }).skip(skip).limit(limit).toArray();
    } catch (error) {
      console.error('Failed to get subscribers:', error);
      return [];
    }
  }

  async getSubscriberCount(): Promise<number> {
    try {
      const collection = await this.getCollection('newsletter_subscribers');
      return await collection.countDocuments({ isActive: true });
    } catch (error) {
      console.error('Failed to get subscriber count:', error);
      return 0;
    }
  }

  // Campaign Management
  async createCampaign(campaign: Omit<EmailCampaign, '_id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; message: string; campaign?: EmailCampaign }> {
    try {
      const collection = await this.getCollection('email_campaigns');
      
      const newCampaign: EmailCampaign = {
        ...campaign,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await collection.insertOne(newCampaign);
      return { success: true, message: 'Campaign created successfully!', campaign: newCampaign };
    } catch (error) {
      console.error('Failed to create campaign:', error);
      return { success: false, message: 'Failed to create campaign.' };
    }
  }

  async sendCampaign(campaignId: string): Promise<{ success: boolean; message: string; stats?: { sent: number; failed: number } }> {
    try {
      const campaignsCollection = await this.getCollection('email_campaigns');
      const subscribersCollection = await this.getCollection('newsletter_subscribers');

      const campaign = await campaignsCollection.findOne({ _id: campaignId });
      if (!campaign) {
        return { success: false, message: 'Campaign not found.' };
      }

      if (campaign.status === 'sent') {
        return { success: false, message: 'Campaign has already been sent.' };
      }

      // Update campaign status to sending
      await campaignsCollection.updateOne(
        { _id: campaignId },
        { $set: { status: 'sending', updatedAt: new Date() } }
      );

      // Get active subscribers
      const subscribers = await subscribersCollection.find({ isActive: true }).toArray();

      // Send emails
      const stats = await emailService.sendNewsletter(campaign, subscribers);

      // Update campaign with results
      await campaignsCollection.updateOne(
        { _id: campaignId },
        { 
          $set: { 
            status: 'sent',
            sentAt: new Date(),
            sentCount: stats.sent,
            failedCount: stats.failed,
            recipientCount: subscribers.length,
            updatedAt: new Date()
          }
        }
      );

      return { 
        success: true, 
        message: `Campaign sent successfully! ${stats.sent} emails sent, ${stats.failed} failed.`,
        stats
      };
    } catch (error) {
      console.error('Failed to send campaign:', error);
      return { success: false, message: 'Failed to send campaign.' };
    }
  }

  async getCampaigns(): Promise<EmailCampaign[]> {
    try {
      const collection = await this.getCollection('email_campaigns');
      return await collection.find({}).sort({ createdAt: -1 }).toArray();
    } catch (error) {
      console.error('Failed to get campaigns:', error);
      return [];
    }
  }

  // Template Management
  async createTemplate(template: Omit<EmailTemplate, '_id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; message: string; template?: EmailTemplate }> {
    try {
      const collection = await this.getCollection('email_templates');
      
      const newTemplate: EmailTemplate = {
        ...template,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await collection.insertOne(newTemplate);
      return { success: true, message: 'Template created successfully!', template: newTemplate };
    } catch (error) {
      console.error('Failed to create template:', error);
      return { success: false, message: 'Failed to create template.' };
    }
  }

  async getTemplates(): Promise<EmailTemplate[]> {
    try {
      const collection = await this.getCollection('email_templates');
      return await collection.find({ isActive: true }).sort({ createdAt: -1 }).toArray();
    } catch (error) {
      console.error('Failed to get templates:', error);
      return [];
    }
  }

  // Statistics
  async getNewsletterStats(): Promise<NewsletterStats> {
    try {
      const subscribersCollection = await this.getCollection('newsletter_subscribers');
      const campaignsCollection = await this.getCollection('email_campaigns');

      const totalSubscribers = await subscribersCollection.countDocuments({ isActive: true });
      
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const newSubscribersThisMonth = await subscribersCollection.countDocuments({
        isActive: true,
        subscribedAt: { $gte: thisMonth }
      });

      const campaignsThisMonth = await campaignsCollection.find({
        status: 'sent',
        sentAt: { $gte: thisMonth }
      }).toArray();

      const emailsSentThisMonth = campaignsThisMonth.reduce((total, campaign) => total + campaign.sentCount, 0);

      // Calculate average rates (simplified - in real app you'd track opens/clicks)
      const totalSent = campaignsThisMonth.reduce((total, campaign) => total + campaign.sentCount, 0);
      const averageOpenRate = totalSent > 0 ? 0.25 : 0; // Placeholder
      const averageClickRate = totalSent > 0 ? 0.05 : 0; // Placeholder

      return {
        totalSubscribers,
        activeSubscribers: totalSubscribers,
        newSubscribersThisMonth,
        emailsSentThisMonth,
        averageOpenRate,
        averageClickRate
      };
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

  private generateUnsubscribeToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}

export const newsletterService = new NewsletterService(); 