// Debug script to identify authentication issues
// Run this in your browser console

async function debugAuthIssue() {
  console.log('🔍 Debugging Authentication Issue...');
  console.log('=' * 50);
  
  // Test 1: Check if Flask backend is accessible
  console.log('\n1. Testing Flask Backend Accessibility...');
  try {
    const backendResponse = await fetch('http://localhost:5000/api/jobs', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(`✓ Backend accessible: ${backendResponse.status}`);
  } catch (error) {
    console.log(`❌ Backend not accessible: ${error.message}`);
    console.log('   Make sure Flask backend is running on port 5000');
    return;
  }
  
  // Test 2: Test direct Flask backend job application submission
  console.log('\n2. Testing Direct Flask Backend Submission...');
  try {
    const testData = {
      jobId: "test-job-001",
      jobTitle: "Software Developer",
      applicantName: "Test User",
      applicantEmail: "test@example.com",
      applicantPhone: "+1234567890",
      coverLetter: "This is a test cover letter.",
      resume: {
        fileUrl: "https://example.com/test.pdf",
        fileName: "test.pdf",
        fileSize: 1024000,
        fileType: "application/pdf"
      },
      responses: []
    };
    
    const directResponse = await fetch('http://localhost:5000/api/job-applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    console.log(`📡 Direct backend response: ${directResponse.status}`);
    if (directResponse.ok) {
      const result = await directResponse.json();
      console.log('✅ Direct backend submission successful:', result);
    } else {
      const error = await directResponse.text();
      console.log('❌ Direct backend submission failed:', error);
    }
  } catch (error) {
    console.log(`❌ Direct backend test failed: ${error.message}`);
  }
  
  // Test 3: Test Next.js API route
  console.log('\n3. Testing Next.js API Route...');
  try {
    const testData = {
      jobId: "test-job-002",
      jobTitle: "Frontend Developer",
      applicantName: "Test User 2",
      applicantEmail: "test2@example.com",
      applicantPhone: "+1234567891",
      coverLetter: "This is another test cover letter.",
      resume: {
        fileUrl: "https://example.com/test2.pdf",
        fileName: "test2.pdf",
        fileSize: 1024000,
        fileType: "application/pdf"
      },
      responses: []
    };
    
    const nextjsResponse = await fetch('/api/job-applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    console.log(`📡 Next.js API response: ${nextjsResponse.status}`);
    if (nextjsResponse.ok) {
      const result = await nextjsResponse.json();
      console.log('✅ Next.js API submission successful:', result);
    } else {
      const error = await nextjsResponse.text();
      console.log('❌ Next.js API submission failed:', error);
    }
  } catch (error) {
    console.log(`❌ Next.js API test failed: ${error.message}`);
  }
  
  // Test 4: Check environment variables
  console.log('\n4. Checking Environment Variables...');
  try {
    const envResponse = await fetch('/api/job-applications');
    console.log(`📡 Environment test response: ${envResponse.status}`);
  } catch (error) {
    console.log(`❌ Environment test failed: ${error.message}`);
  }
  
  console.log('\n🔍 Debug complete! Check the results above.');
}

// Run the debug
debugAuthIssue();
