# Cloudinary Integration Setup Guide

This guide will help you set up Cloudinary for file uploads in the job application system.

## Prerequisites
- Cloudinary account (free tier available)
- Node.js project with `cloudinary` package installed

## Step 1: Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/) and click "Sign Up For Free"
2. Fill in your details and create an account
3. Verify your email address

## Step 2: Get Your Credentials

1. Log in to your [Cloudinary Dashboard](https://cloudinary.com/console)
2. Go to "Settings" > "Access Keys"
3. You'll see your credentials:
   - **Cloud Name**: Your unique cloud identifier
   - **API Key**: Your API access key
   - **API Secret**: Your API secret key

## Step 3: Configure Environment Variables

Add these to your `.env.local` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## Step 4: Test the Integration

1. Start your development server
2. Try uploading a file through the job application form
3. Check your Cloudinary Media Library to see uploaded files

## File Storage Structure

Files will be stored in Cloudinary with the following structure:
```
job-applications/
├── 1754386902031-abc123-resume
├── 1754386902032-def456-questionnaire
└── ...
```

## Security Features

- Files are uploaded with unique timestamps and random strings
- Original filenames are preserved for user reference
- Files are automatically optimized by Cloudinary
- File type validation prevents malicious uploads
- File size limits are enforced
- Automatic virus scanning (Cloudinary feature)

## Benefits of Cloudinary

✅ **Easy Setup** - Just 3 environment variables  
✅ **Free Tier** - 25GB storage, 25GB bandwidth/month  
✅ **Automatic Optimization** - Images and videos optimized  
✅ **CDN** - Global content delivery network  
✅ **Virus Scanning** - Built-in security  
✅ **Transformations** - Resize, crop, format conversion  
✅ **Reliable** - 99.9% uptime guarantee  

## Troubleshooting

### Common Issues:

1. **"Invalid credentials" error**
   - Double-check your Cloud Name, API Key, and API Secret
   - Ensure there are no extra spaces or characters

2. **"Upload failed" error**
   - Check your internet connection
   - Verify file size is within limits
   - Check Cloudinary service status

3. **"File too large" error**
   - Free tier has file size limits
   - Consider upgrading or using local storage fallback

### Monitoring:

- Check Cloudinary Dashboard > Media Library for uploads
- Monitor usage in Dashboard > Settings > Usage
- Review application logs for upload errors

## Alternative Storage Options

If Cloudinary doesn't meet your needs, consider:

1. **AWS S3** - More scalable, better for production
2. **Firebase Storage** - Easy integration with other Firebase services
3. **Azure Blob Storage** - Microsoft's cloud storage solution
4. **Local Storage** - Built-in fallback system

## Cost Considerations

- **Free Tier**: 25GB storage, 25GB bandwidth/month
- **Pay-as-you-go**: $0.04/GB storage, $0.04/GB bandwidth
- **No hidden fees** - Only pay for what you use

## Production Deployment

For production deployment:

1. Use environment variables in your hosting platform
2. Set up proper CORS configuration
3. Implement rate limiting
4. Add monitoring and logging
5. Consider using Cloudinary's advanced features
6. Set up backup strategies for uploaded files

## Advanced Features

Cloudinary offers many advanced features you can explore:

- **Image Transformations**: Resize, crop, apply filters
- **Video Processing**: Transcode, compress, add watermarks
- **AI-powered**: Automatic tagging, moderation
- **Webhooks**: Real-time notifications
- **Analytics**: Detailed usage statistics
