import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

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

    // Generate unique filename with enhanced security
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = sanitizedFileName.split('.').pop() || 'txt';
    const fileName = `${timestamp}-${randomString}.${fileExt}`;
    const filePath = join(jobApplicationsDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return the file URL
    const fileUrl = `/uploads/job-applications/${fileName}`;

    return NextResponse.json({ 
      success: true, 
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}