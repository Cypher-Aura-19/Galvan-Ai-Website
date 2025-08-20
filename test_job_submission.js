// Simple test script to verify job application submission works
// Run this in your browser console or as a Node.js script

async function testJobSubmission() {
  console.log('🧪 Testing Job Application Submission...');
  
  try {
    // Test data
    const applicationData = {
      jobId: "test-job-001",
      jobTitle: "Software Developer",
      applicantName: "Test User",
      applicantEmail: "test@example.com",
      applicantPhone: "+1234567890",
      coverLetter: "This is a test cover letter for testing purposes.",
      resume: {
        fileUrl: "https://example.com/test-resume.pdf",
        fileName: "test_resume.pdf",
        fileSize: 1024000,
        fileType: "application/pdf",
        storageType: "local"
      },
      responses: []
    };

    console.log('📝 Submitting application data:', applicationData);

    // Submit to Next.js API route
    const response = await fetch('/api/job-applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', response.headers);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Success! Application submitted:', result);
    } else {
      const error = await response.text();
      console.log('❌ Error response:', error);
    }

  } catch (error) {
    console.error('💥 Network error:', error);
  }
}

// Run the test
testJobSubmission();
