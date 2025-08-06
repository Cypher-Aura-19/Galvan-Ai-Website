export interface NewsletterSubscriber {
  _id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  subscribedAt: Date;
  isActive: boolean;
  tags?: string[];
  source?: string;
  lastEmailSent?: Date;
  unsubscribeToken?: string;
}

export interface EmailCampaign {
  _id?: string;
  subject: string;
  content: string;
  htmlContent?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduledAt?: Date;
  sentAt?: Date;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  templateId?: string;
}

export interface EmailTemplate {
  _id?: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  newSubscribersThisMonth: number;
  emailsSentThisMonth: number;
  averageOpenRate: number;
  averageClickRate: number;
} 