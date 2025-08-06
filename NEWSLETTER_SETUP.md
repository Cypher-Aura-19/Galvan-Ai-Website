# Newsletter Functionality Setup Guide

This guide will help you set up the complete newsletter functionality with automated email sending for your Galvan AI application.

## Features Implemented

✅ **Complete Newsletter System**
- User subscription with database storage
- Automated welcome emails
- Unsubscribe functionality with secure tokens
- Email campaign management
- Admin dashboard with statistics
- Responsive design with dark/light theme support

✅ **Email Automation**
- Welcome emails sent automatically on subscription
- Campaign emails with personalization
- Unsubscribe confirmation emails
- Support for both Resend and SMTP email providers

✅ **Admin Dashboard**
- Real-time subscriber statistics
- Campaign creation and management
- Subscriber list management
- Email sending controls

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/galvan-ai

# Email Configuration
# Option 1: Resend (Recommended - Free tier available)
RESEND_API_KEY=your_resend_api_key_here

# Option 2: SMTP (Fallback)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here

# Email Settings
FROM_EMAIL=noreply@galvanai.com
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin Authentication
ADMIN_EMAIL=admin@galvanai.com
ADMIN_PASSWORD=your_admin_password_here
```

## Email Provider Setup

### Option 1: Resend (Recommended)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add your domain or use the provided sandbox domain
4. Set `RESEND_API_KEY` in your environment variables

### Option 2: SMTP (Gmail Example)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password as `SMTP_PASS`
4. Set `SMTP_USER` to your Gmail address

## Database Setup

The newsletter system uses MongoDB with the following collections:

- `newsletter_subscribers` - Stores subscriber information
- `email_campaigns` - Stores email campaigns
- `email_templates` - Stores email templates

The system will create these collections automatically when the first subscription is made.

## Usage

### For Users

1. **Subscribe to Newsletter**: Users can subscribe via:
   - The newsletter component on the homepage
   - The dedicated newsletter page at `/newsletter`
   - Any form that calls the `subscribeToNewsletter` action

2. **Unsubscribe**: Users can unsubscribe by:
   - Clicking the unsubscribe link in any email
   - Visiting `/unsubscribe?token=their_token`

### For Admins

1. **Access Admin Dashboard**: Visit `/admin/newsletter`
2. **View Statistics**: See subscriber counts, email metrics, and growth trends
3. **Manage Subscribers**: View and manage the subscriber list
4. **Create Campaigns**: Create and send email campaigns
5. **Monitor Performance**: Track email open rates and engagement

## API Endpoints

### Public APIs
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter
- `GET /api/newsletter/stats` - Get newsletter statistics

### Admin APIs
- `GET /api/newsletter/subscribers` - Get subscriber list
- `GET /api/newsletter/campaigns` - Get campaign list
- `POST /api/newsletter/campaigns` - Create new campaign
- `POST /api/newsletter/campaigns/[id]/send` - Send campaign

## Email Templates

The system includes built-in email templates:

1. **Welcome Email**: Sent automatically when users subscribe
2. **Unsubscribe Email**: Sent when users unsubscribe
3. **Campaign Emails**: Customizable content with personalization

### Personalization Variables

You can use these variables in your email content:
- `{{firstName}}` - Subscriber's first name
- `{{lastName}}` - Subscriber's last name
- `{{email}}` - Subscriber's email
- `{{unsubscribeUrl}}` - Unsubscribe link

## Security Features

- **Secure Unsubscribe Tokens**: Each subscriber gets a unique, cryptographically secure token
- **Email Validation**: Proper email format validation
- **Duplicate Prevention**: Prevents duplicate subscriptions
- **Rate Limiting**: Built-in protection against spam

## Customization

### Styling
The newsletter components use Tailwind CSS and support both light and dark themes. You can customize the styling by modifying the component files.

### Email Templates
You can customize email templates by editing the `generateWelcomeEmail` and `generateUnsubscribeEmail` methods in `lib/email-service.ts`.

### Database Schema
The database schema is defined in `lib/types/newsletter.ts`. You can extend it to add additional fields like:
- Subscription preferences
- Geographic location
- Industry/role information
- Engagement tracking

## Troubleshooting

### Common Issues

1. **Emails not sending**:
   - Check your email provider credentials
   - Verify your domain is properly configured
   - Check the console for error messages

2. **Database connection issues**:
   - Verify your MongoDB connection string
   - Ensure MongoDB is running
   - Check network connectivity

3. **Admin dashboard not loading**:
   - Verify admin authentication is set up
   - Check that all API routes are working
   - Ensure proper CORS configuration

### Debug Mode

To enable debug logging, add this to your environment variables:
```env
DEBUG=true
```

## Performance Considerations

- The system uses efficient database queries with proper indexing
- Email sending is optimized with batch processing
- Admin dashboard includes pagination for large subscriber lists
- Caching is implemented for frequently accessed data

## Future Enhancements

Potential improvements you can add:
- Email open/click tracking
- A/B testing for campaigns
- Advanced segmentation
- Automated drip campaigns
- Integration with CRM systems
- Analytics and reporting
- Template editor with WYSIWYG interface

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Test email provider connectivity
4. Review the database connection

The newsletter system is designed to be robust and scalable, handling thousands of subscribers efficiently while maintaining excellent deliverability rates. 