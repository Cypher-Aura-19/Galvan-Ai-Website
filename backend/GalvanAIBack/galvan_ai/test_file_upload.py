#!/usr/bin/env python3
"""
Test script to verify file upload system and database integration
This script tests the complete flow from file upload to database storage
"""

import requests
import json
import os
from datetime import datetime

def test_file_upload():
    """Test the complete file upload flow"""
    
    # Test configuration
    base_url = "http://localhost:3000"  # Next.js frontend
    api_url = "http://localhost:5000"   # Flask backend
    
    print("🧪 Testing File Upload System")
    print("=" * 50)
    
    # Test 1: Check if services are running
    print("\n1. Checking service availability...")
    
    try:
        # Check Next.js frontend
        frontend_response = requests.get(f"{base_url}/api/upload", timeout=5)
        print(f"✓ Frontend API accessible: {frontend_response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Frontend not accessible: {e}")
        print("   Make sure to start your Next.js development server")
        return False
    
    try:
        # Check Flask backend
        backend_response = requests.get(f"{api_url}/api/jobs", timeout=5)
        print(f"✓ Backend API accessible: {backend_response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Backend not accessible: {e}")
        print("   Make sure to start your Flask backend server")
        return False
    
    # Test 2: Test file upload endpoint
    print("\n2. Testing file upload endpoint...")
    
    # Create a test PDF file
    test_file_path = "test_resume.pdf"
    test_content = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Test Resume) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000053 00000 n \n0000000112 00000 n \n0000000206 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n297\n%%EOF"
    
    with open(test_file_path, "wb") as f:
        f.write(test_content)
    
    print(f"✓ Created test PDF file: {test_file_path}")
    
    # Test file upload
    try:
        with open(test_file_path, "rb") as f:
            files = {"file": ("test_resume.pdf", f, "application/pdf")}
            data = {"questionId": ""}  # Empty questionId means this is a resume upload
            
            upload_response = requests.post(
                f"{base_url}/api/upload",
                files=files,
                data=data,
                timeout=30
            )
        
        if upload_response.status_code == 200:
            upload_result = upload_response.json()
            print("✓ File upload successful!")
            print(f"   File URL: {upload_result.get('fileUrl', 'N/A')}")
            print(f"   Storage Type: {upload_result.get('storageType', 'N/A')}")
            print(f"   File Size: {upload_result.get('fileSize', 'N/A')} bytes")
            
            # Store the file URL for the next test
            file_url = upload_result.get('fileUrl')
            file_data = {
                'fileUrl': file_url,
                'fileName': 'test_resume.pdf',
                'fileSize': len(test_content),
                'fileType': 'application/pdf',
                'storageType': upload_result.get('storageType', 'local')
            }
            
        else:
            print(f"❌ File upload failed: {upload_response.status_code}")
            print(f"   Response: {upload_response.text}")
            return False
            
    except Exception as e:
        print(f"❌ File upload test failed: {e}")
        return False
    
    # Test 3: Test job application submission
    print("\n3. Testing job application submission...")
    
    # Create test job application data
    application_data = {
        "jobId": "test-job-001",
        "jobTitle": "Software Developer",
        "applicantName": "Test User",
        "applicantEmail": "test@example.com",
        "applicantPhone": "+1234567890",
        "coverLetter": "This is a test cover letter for testing purposes.",
        "resume": file_data,
        "responses": []
    }
    
    try:
        app_response = requests.post(
            f"{api_url}/api/job-applications",
            json=application_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        if app_response.status_code == 200:
            app_result = app_response.json()
            print("✓ Job application submitted successfully!")
            print(f"   Application ID: {app_result.get('applicationId', 'N/A')}")
            
            # Store application ID for the next test
            application_id = app_result.get('applicationId')
            
        else:
            print(f"❌ Job application submission failed: {app_response.status_code}")
            print(f"   Response: {app_response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Job application test failed: {e}")
        return False
    
    # Test 4: Verify application in database
    print("\n4. Verifying application in database...")
    
    try:
        # Get the submitted application
        get_response = requests.get(f"{api_url}/api/job-applications", timeout=10)
        
        if get_response.status_code == 200:
            applications = get_response.json()
            
            # Find our test application
            test_app = None
            for app in applications:
                if app.get('applicantEmail') == 'test@example.com':
                    test_app = app
                    break
            
            if test_app:
                print("✓ Application found in database!")
                print(f"   Status: {test_app.get('status', 'N/A')}")
                print(f"   Resume URL: {test_app.get('resume', {}).get('fileUrl', 'N/A')}")
                print(f"   Created: {test_app.get('createdAt', 'N/A')}")
                
                # Test status update
                if application_id:
                    print("\n5. Testing status update...")
                    
                    update_data = {
                        "status": "reviewed",
                        "notes": "Test application for system verification"
                    }
                    
                    update_response = requests.put(
                        f"{api_url}/api/job-applications/{application_id}",
                        json=update_data,
                        headers={"Content-Type": "application/json"},
                        timeout=10
                    )
                    
                    if update_response.status_code == 200:
                        print("✓ Status update successful!")
                    else:
                        print(f"❌ Status update failed: {update_response.status_code}")
                
            else:
                print("❌ Test application not found in database")
                return False
                
        else:
            print(f"❌ Failed to retrieve applications: {get_response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Database verification failed: {e}")
        return False
    
    # Cleanup
    print("\n6. Cleaning up test files...")
    
    try:
        if os.path.exists(test_file_path):
            os.remove(test_file_path)
            print("✓ Test PDF file removed")
    except Exception as e:
        print(f"⚠️  Could not remove test file: {e}")
    
    print("\n🎉 All tests completed successfully!")
    print("Your file upload system is working correctly!")
    
    return True

if __name__ == "__main__":
    print("Starting file upload system tests...")
    print("Make sure both your Next.js frontend and Flask backend are running!")
    print()
    
    success = test_file_upload()
    
    if not success:
        print("\n❌ Some tests failed!")
        print("Please check the error messages above and ensure all services are running.")
    else:
        print("\n✅ File upload system is fully functional!")
        print("You can now use the system for real job applications.")
