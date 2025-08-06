import nodemailer from 'nodemailer';
import { NewsletterSubscriber, EmailCampaign } from './types/newsletter';

// Initialize Resend only if API key is available
let resend: any = null;
try {
  if (process.env.RESEND_API_KEY) {
    const { Resend } = require('resend');
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (error) {
  console.warn('Resend initialization failed:', error);
}

// Create Nodemailer transporter as fallback
const createTransporter = () => {
  // Only create transporter if SMTP credentials are available
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export class EmailService {
  private transporter: nodemailer.Transporter | null;

  constructor() {
    this.transporter = createTransporter();
  }

  async sendWelcomeEmail(subscriber: NewsletterSubscriber): Promise<boolean> {
    try {
      const htmlContent = this.generateWelcomeEmail(subscriber);
      
      // Try Resend first if available
      if (resend) {
        await resend.emails.send({
          from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
          to: subscriber.email,
          subject: 'Welcome to Galvan AI Newsletter! 🚀',
          html: htmlContent,
        });
        console.log('Welcome email sent via Resend to:', subscriber.email);
        return true;
      }

      // Fallback to Nodemailer if available
      if (this.transporter) {
        await this.transporter.sendMail({
          from: process.env.FROM_EMAIL || 'noreply@galvanai.com',
          to: subscriber.email,
          subject: 'Welcome to Galvan AI Newsletter! 🚀',
          html: htmlContent,
        });
        console.log('Welcome email sent via SMTP to:', subscriber.email);
        return true;
      }

      // If no email service is configured, just log the email
      console.log('Email service not configured. Would send welcome email to:', subscriber.email);
      console.log('Email content:', htmlContent);
      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }

  async sendNewsletter(campaign: EmailCampaign, subscribers: NewsletterSubscriber[]): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      try {
        const personalizedContent = this.personalizeContent(campaign.htmlContent || campaign.content, subscriber);
        
        // Try Resend first if available
        if (resend) {
          await resend.emails.send({
            from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
            to: subscriber.email,
            subject: campaign.subject,
            html: personalizedContent,
          });
          sent++;
        } else if (this.transporter) {
          // Fallback to Nodemailer
          await this.transporter.sendMail({
            from: process.env.FROM_EMAIL || 'noreply@galvanai.com',
            to: subscriber.email,
            subject: campaign.subject,
            html: personalizedContent,
          });
          sent++;
        } else {
          // If no email service is configured, just log
          console.log('Email service not configured. Would send newsletter to:', subscriber.email);
          console.log('Subject:', campaign.subject);
          sent++;
        }
      } catch (error) {
        console.error(`Failed to send newsletter to ${subscriber.email}:`, error);
        failed++;
      }
    }

    return { sent, failed };
  }

  async sendUnsubscribeEmail(subscriber: NewsletterSubscriber): Promise<boolean> {
    try {
      const htmlContent = this.generateUnsubscribeEmail(subscriber);
      
      if (resend) {
        await resend.emails.send({
          from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
          to: subscriber.email,
          subject: 'You\'ve been unsubscribed from Galvan AI Newsletter',
          html: htmlContent,
        });
        console.log('Unsubscribe email sent via Resend to:', subscriber.email);
        return true;
      }

      if (this.transporter) {
        await this.transporter.sendMail({
          from: process.env.FROM_EMAIL || 'noreply@galvanai.com',
          to: subscriber.email,
          subject: 'You\'ve been unsubscribed from Galvan AI Newsletter',
          html: htmlContent,
        });
        console.log('Unsubscribe email sent via SMTP to:', subscriber.email);
        return true;
      }

      // If no email service is configured, just log
      console.log('Email service not configured. Would send unsubscribe email to:', subscriber.email);
      return true;
    } catch (error) {
      console.error('Failed to send unsubscribe email:', error);
      return false;
    }
  }

  private generateWelcomeEmail(subscriber: NewsletterSubscriber): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Galvan AI Newsletter</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Welcome to Galvan AI!</h1>
            <p>You're now part of our exclusive AI innovation community</p>
          </div>
          <div class="content">
            <h2>Hi ${subscriber.firstName || 'there'}!</h2>
            <p>Thank you for subscribing to our newsletter. You'll now receive:</p>
            <ul>
              <li>🎯 Latest AI insights and trends</li>
              <li>🚀 Product updates and new features</li>
              <li>📚 Exclusive webinars and events</li>
              <li>💡 Expert tips and best practices</li>
            </ul>
            <p>We're excited to share the future of AI with you!</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" class="button">Visit Our Website</a>
          </div>
          <div class="footer">
            <p>If you no longer wish to receive these emails, you can <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/unsubscribe?token=${subscriber.unsubscribeToken}">unsubscribe here</a>.</p>
            <p>© 2024 Galvan AI. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateUnsubscribeEmail(subscriber: NewsletterSubscriber): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Unsubscribed from Galvan AI Newsletter</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>👋 You've been unsubscribed</h1>
          </div>
          <div class="content">
            <p>Hi ${subscriber.firstName || 'there'},</p>
            <p>You have been successfully unsubscribed from the Galvan AI newsletter.</p>
            <p>We're sorry to see you go! If you change your mind, you can always <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/newsletter">resubscribe here</a>.</p>
            <p>Thank you for being part of our community.</p>
          </div>
          <div class="footer">
            <p>© 2024 Galvan AI. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private personalizeContent(content: string, subscriber: NewsletterSubscriber): string {
    return content
      .replace(/\{\{firstName\}\}/g, subscriber.firstName || 'there')
      .replace(/\{\{lastName\}\}/g, subscriber.lastName || '')
      .replace(/\{\{email\}\}/g, subscriber.email)
      .replace(/\{\{unsubscribeUrl\}\}/g, `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/unsubscribe?token=${subscriber.unsubscribeToken}`);
  }
}

export const emailService = new EmailService(); 