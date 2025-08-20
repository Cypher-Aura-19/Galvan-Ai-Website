import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(fileBuffer: Buffer, fileName: string, mimeType: string) {
  try {
    // Convert buffer to base64 for Cloudinary
    const base64File = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
    
    // Upload to Cloudinary with specific folder
    const result = await cloudinary.uploader.upload(base64File, {
      folder: 'job-applications',
      public_id: fileName.replace(/\.[^/.]+$/, ''), // Remove file extension for public_id
      resource_type: 'auto',
      overwrite: false, // Don't overwrite existing files
      unique_filename: true, // Ensure unique filenames
    });

    return {
      fileUrl: result.secure_url,
      fileId: result.public_id,
      webViewLink: result.secure_url,
      directDownloadLink: result.secure_url,
      cloudinaryId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
}

async function uploadToLocalStorage(fileBuffer: Buffer, fileName: string) {
  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Create job applications directory
    const jobApplicationsDir = join(uploadsDir, "job-applications");
    if (!existsSync(jobApplicationsDir)) {
      await mkdir(jobApplicationsDir, { recursive: true });
    }

    const filePath = join(jobApplicationsDir, fileName);
    await writeFile(filePath, fileBuffer);

    // Get the base URL from environment or default to localhost
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    // Return the full file URL
    const fileUrl = `${baseUrl}/uploads/job-applications/${fileName}`;

    return {
      fileUrl,
      fileId: null,
      webViewLink: null,
      webContentLink: null,
      directDownloadLink: fileUrl,
    };
  } catch (error) {
    console.error('Local storage upload error:', error);
    throw new Error('Failed to upload file to local storage');
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const questionId = formData.get('questionId');
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Enhanced security validation
    if (!file.name || typeof file.name !== 'string') {
      return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
    }

    // Sanitize filename to prevent path traversal attacks
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    if (sanitizedFileName.length > 255) {
      return NextResponse.json({ error: "File name too long" }, { status: 400 });
    }

    // Check for suspicious file extensions
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar', '.php', '.asp', '.aspx', '.jsp'];
    const fileExtension = file.name.toLowerCase().split('.').pop();
    if (suspiciousExtensions.includes(`.${fileExtension}`)) {
      return NextResponse.json({ error: "File type not allowed for security reasons" }, { status: 400 });
    }

    // Validate file type with enhanced security
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain"
    ];
    
    if (!questionId) {
      // This is a resume upload - only allow PDF
      if (file.type !== "application/pdf") {
        return NextResponse.json({ 
          error: "Resume must be a PDF file." 
        }, { status: 400 });
      }
    } else {
      // This is a questionnaire file upload - allow all types
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ 
          error: "Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed." 
        }, { status: 400 });
      }
    }

    // Validate file size based on upload type
    if (!questionId) {
      // This is a resume upload - 2MB limit
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        return NextResponse.json({ 
          error: "Resume file too large. Maximum size is 2MB." 
        }, { status: 400 });
      }
    } else {
      // This is a questionnaire file upload - 5MB limit
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return NextResponse.json({ 
          error: "File too large. Maximum size is 5MB." 
        }, { status: 400 });
      }
    }

    // Additional security: Check file header/magic bytes for PDF
    if (file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const header = Array.from(uint8Array.slice(0, 4)).map(byte => byte.toString(16).padStart(2, '0')).join('');
      
      if (header !== '25504446') { // PDF magic number
        return NextResponse.json({ error: "Invalid PDF file" }, { status: 400 });
      }
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = sanitizedFileName.split('.').pop() || 'txt';
    const fileName = `${timestamp}-${randomString}-${sanitizedFileName}`;

    // Try Cloudinary first, fallback to local storage
    let uploadResult;
    let actualStorageType = 'local'; // Default to local
    
    const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                         process.env.CLOUDINARY_API_KEY && 
                         process.env.CLOUDINARY_API_SECRET;

    console.log('Cloudinary configuration check:', {
      hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      useCloudinary
    });

    if (useCloudinary) {
      try {
        uploadResult = await uploadToCloudinary(buffer, fileName, file.type);
        actualStorageType = 'cloudinary';
        console.log('File uploaded to Cloudinary successfully');
      } catch (error) {
        console.warn('Cloudinary upload failed, falling back to local storage:', error);
        uploadResult = await uploadToLocalStorage(buffer, fileName);
        actualStorageType = 'local';
        console.log('File uploaded to local storage as fallback');
      }
    } else {
      uploadResult = await uploadToLocalStorage(buffer, fileName);
      actualStorageType = 'local';
      console.log('File uploaded to local storage (Cloudinary not configured)');
    }

    return NextResponse.json({ 
      success: true, 
      fileUrl: uploadResult.directDownloadLink,
      fileId: uploadResult.fileId,
      webViewLink: uploadResult.webViewLink,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      storageType: actualStorageType
    });

  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}