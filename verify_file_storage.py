#!/usr/bin/env python3
"""
Comprehensive File Storage System Verification Script
This script tests the complete flow: file upload → job application → database storage
"""

import requests
import json
import os
import sqlite3
from datetime import datetime
import time

class FileStorageVerifier:
    def __init__(self):
        self.nextjs_url = "http://localhost:3000"
        self.flask_url = "http://localhost:5000"
        self.test_results = {}
        
    def print_header(self, title):
        print(f"\n{'='*60}")
        print(f"🔍 {title}")
        print(f"{'='*60}")
    
    def print_success(self, message):
        print(f"✅ {message}")
        
    def print_error(self, message):
        print(f"❌ {message}")
        
    def print_info(self, message):
        print(f"ℹ️  {message}")
        
    def print_warning(self, message):
        print(f"⚠️  {message}")
    
    def test_service_availability(self):
        """Test if both Next.js and Flask services are running"""
        self.print_header("Testing Service Availability")
        
        # Test Next.js frontend
        try:
            response = requests.get(f"{self.nextjs_url}/api/upload", timeout=5)
            if response.status_code == 405:  # Method not allowed is OK for GET
                self.print_success("Next.js frontend is running")
                self.test_results['nextjs_running'] = True
            else:
                self.print_info(f"Next.js frontend response: {response.status_code}")
                self.test_results['nextjs_running'] = True
        except requests.exceptions.RequestException as e:
            self.print_error(f"Next.js frontend not accessible: {e}")
            self.test_results['nextjs_running'] = False
            return False
        
        # Test Flask backend
        try:
            response = requests.get(f"{self.flask_url}/api/jobs", timeout=5)
            if response.status_code == 200:
                self.print_success("Flask backend is running")
                self.test_results['flask_running'] = True
            else:
                self.print_info(f"Flask backend response: {response.status_code}")
                self.test_results['flask_running'] = True
        except requests.exceptions.RequestException as e:
            self.print_error(f"Flask backend not accessible: {e}")
            self.test_results['flask_running'] = False
            return False
            
        return True
    
    def create_test_file(self):
        """Create a test PDF file for upload testing"""
        self.print_header("Creating Test File")
        
        # Create a simple PDF-like content (not a real PDF, but good for testing)
        test_content = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Test Resume) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000053 00000 n \n0000000112 00000 n \n0000000206 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n297\n%%EOF"
        
        test_file_path = "test_resume.pdf"
        with open(test_file_path, "wb") as f:
            f.write(test_content)
            
        self.print_success(f"Created test file: {test_file_path} ({len(test_content)} bytes)")
        self.test_results['test_file_path'] = test_file_path
        self.test_results['test_file_size'] = len(test_content)
        return test_file_path
    
    def test_file_upload(self, test_file_path):
        """Test file upload to the system"""
        self.print_header("Testing File Upload")
        
        try:
            with open(test_file_path, "rb") as f:
                files = {"file": ("test_resume.pdf", f, "application/pdf")}
                data = {"questionId": ""}  # Empty questionId means resume upload
                
                response = requests.post(
                    f"{self.nextjs_url}/api/upload",
                    files=files,
                    data=data,
                    timeout=30
                )
            
            if response.status_code == 200:
                result = response.json()
                self.print_success("File upload successful!")
                self.print_info(f"File URL: {result.get('fileUrl', 'N/A')}")
                self.print_info(f"Storage Type: {result.get('storageType', 'N/A')}")
                self.print_info(f"File ID: {result.get('fileId', 'N/A')}")
                self.print_info(f"File Size: {result.get('fileSize', 'N/A')} bytes")
                
                self.test_results['upload_success'] = True
                self.test_results['upload_result'] = result
                return result
            else:
                error_text = response.text
                self.print_error(f"File upload failed: {response.status_code}")
                self.print_error(f"Error: {error_text}")
                self.test_results['upload_success'] = False
                self.test_results['upload_error'] = error_text
                return None
                
        except Exception as e:
            self.print_error(f"File upload test failed: {e}")
            self.test_results['upload_success'] = False
            self.test_results['upload_error'] = str(e)
            return None
    
    def test_job_application_submission(self, file_data):
        """Test job application submission with uploaded file"""
        self.print_header("Testing Job Application Submission")
        
        if not file_data:
            self.print_error("No file data provided for job application")
            return None
            
        application_data = {
            "jobId": "test-job-001",
            "jobTitle": "Software Developer",
            "applicantName": "Test User",
            "applicantEmail": "test@example.com",
            "applicantPhone": "+1234567890",
            "coverLetter": "This is a test cover letter for system verification.",
            "resume": {
                'fileUrl': file_data.get('fileUrl'),
                'fileName': file_data.get('fileName'),
                'fileSize': file_data.get('fileSize'),
                'fileType': file_data.get('fileType'),
                'storageType': file_data.get('storageType')
            },
            "responses": []
        }
        
        try:
            response = requests.post(
                f"{self.nextjs_url}/api/job-applications",
                json=application_data,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                self.print_success("Job application submitted successfully!")
                self.print_info(f"Application ID: {result.get('applicationId', 'N/A')}")
                
                self.test_results['application_success'] = True
                self.test_results['application_result'] = result
                return result
            else:
                error_text = response.text
                self.print_error(f"Job application failed: {response.status_code}")
                self.print_error(f"Error: {error_text}")
                
                self.test_results['application_success'] = False
                self.test_results['application_error'] = error_text
                return None
                
        except Exception as e:
            self.print_error(f"Job application test failed: {e}")
            self.test_results['application_success'] = False
            self.test_results['application_error'] = str(e)
            return None
    
    def verify_database_storage(self):
        """Verify that the application was stored in the database"""
        self.print_header("Verifying Database Storage")
        
        try:
            # Get applications from Flask backend
            response = requests.get(f"{self.flask_url}/api/job-applications", timeout=10)
            
            if response.status_code == 200:
                applications = response.json()
                
                # Find our test application
                test_app = None
                for app in applications:
                    if app.get('applicantEmail') == 'test@example.com':
                        test_app = app
                        break
                
                if test_app:
                    self.print_success("Test application found in database!")
                    self.print_info(f"Application ID: {test_app.get('_id', 'N/A')}")
                    self.print_info(f"Status: {test_app.get('status', 'N/A')}")
                    self.print_info(f"Created: {test_app.get('createdAt', 'N/A')}")
                    
                    # Check resume data
                    resume = test_app.get('resume')
                    if resume:
                        self.print_success("Resume data stored correctly!")
                        self.print_info(f"File URL: {resume.get('fileUrl', 'N/A')}")
                        self.print_info(f"File Name: {resume.get('fileName', 'N/A')}")
                        self.print_info(f"Storage Type: {resume.get('storageType', 'N/A')}")
                        
                        # Test file accessibility
                        self.test_file_accessibility(resume.get('fileUrl'))
                    else:
                        self.print_error("No resume data found in application")
                    
                    self.test_results['database_verification'] = True
                    self.test_results['stored_application'] = test_app
                    
                else:
                    self.print_error("Test application not found in database")
                    self.test_results['database_verification'] = False
                    
            else:
                self.print_error(f"Failed to retrieve applications: {response.status_code}")
                self.test_results['database_verification'] = False
                
        except Exception as e:
            self.print_error(f"Database verification failed: {e}")
            self.test_results['database_verification'] = False
    
    def test_file_accessibility(self, file_url):
        """Test if the uploaded file is accessible via URL"""
        self.print_header("Testing File Accessibility")
        
        if not file_url:
            self.print_error("No file URL provided")
            return
            
        # Fix relative URLs to absolute URLs
        if file_url.startswith('/'):
            file_url = f"{self.nextjs_url}{file_url}"
            self.print_info(f"Converted relative URL to: {file_url}")
        
        try:
            response = requests.get(file_url, timeout=10)
            
            if response.status_code == 200:
                self.print_success("File is accessible via URL!")
                self.print_info(f"Content-Type: {response.headers.get('content-type', 'N/A')}")
                self.print_info(f"Content-Length: {response.headers.get('content-length', 'N/A')} bytes")
                
                # Check if it's our test content
                content = response.content
                if b"Test Resume" in content:
                    self.print_success("File content matches test file!")
                else:
                    self.print_warning("File content doesn't match test file (might be processed)")
                
                self.test_results['file_accessibility'] = True
                
            else:
                self.print_error(f"File not accessible: {response.status_code}")
                self.print_info(f"Response: {response.text[:200]}...")  # Show first 200 chars
                self.test_results['file_accessibility'] = False
                
        except Exception as e:
            self.print_error(f"File accessibility test failed: {e}")
            self.test_results['file_accessibility'] = False
    
    def check_local_storage(self):
        """Check if files are stored locally as fallback"""
        self.print_header("Checking Local Storage")
        
        local_upload_path = "public/uploads/job-applications"
        
        if os.path.exists(local_upload_path):
            files = os.listdir(local_upload_path)
            if files:
                self.print_success(f"Local storage contains {len(files)} files:")
                for file in files[:5]:  # Show first 5 files
                    file_path = os.path.join(local_upload_path, file)
                    file_size = os.path.getsize(file_path)
                    self.print_info(f"  {file} ({file_size} bytes)")
                if len(files) > 5:
                    self.print_info(f"  ... and {len(files) - 5} more files")
                
                self.test_results['local_storage'] = True
                self.test_results['local_files_count'] = len(files)
            else:
                self.print_info("Local storage directory is empty")
                self.test_results['local_storage'] = True
                self.test_results['local_files_count'] = 0
        else:
            self.print_warning("Local storage directory not found")
            self.test_results['local_storage'] = False
    
    def cleanup_test_files(self):
        """Clean up test files created during testing"""
        self.print_header("Cleaning Up Test Files")
        
        test_file_path = self.test_results.get('test_file_path')
        if test_file_path and os.path.exists(test_file_path):
            try:
                os.remove(test_file_path)
                self.print_success(f"Removed test file: {test_file_path}")
            except Exception as e:
                self.print_warning(f"Could not remove test file: {e}")
    
    def print_summary(self):
        """Print a summary of all test results"""
        self.print_header("Test Results Summary")
        
        tests = [
            ('Next.js Frontend', 'nextjs_running'),
            ('Flask Backend', 'flask_running'),
            ('File Upload', 'upload_success'),
            ('Job Application', 'application_success'),
            ('Database Storage', 'database_verification'),
            ('File Accessibility', 'file_accessibility'),
            ('Local Storage', 'local_storage')
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_key in tests:
            result = self.test_results.get(test_key, False)
            if result:
                self.print_success(f"{test_name}: PASSED")
                passed += 1
            else:
                self.print_error(f"{test_name}: FAILED")
        
        print(f"\n📊 Results: {passed}/{total} tests passed")
        
        if passed == total:
            self.print_success("🎉 All tests passed! File storage system is working correctly!")
        else:
            self.print_error("❌ Some tests failed. Check the errors above.")
            
        return passed == total
    
    def run_all_tests(self):
        """Run all verification tests"""
        print("🚀 Starting File Storage System Verification...")
        print(f"Next.js URL: {self.nextjs_url}")
        print(f"Flask URL: {self.flask_url}")
        
        # Run tests
        if not self.test_service_availability():
            self.print_error("Services not available. Please start both Next.js and Flask servers.")
            return False
        
        test_file_path = self.create_test_file()
        file_data = self.test_file_upload(test_file_path)
        
        if file_data:
            self.test_job_application_submission(file_data)
            self.verify_database_storage()
        
        self.check_local_storage()
        self.cleanup_test_files()
        
        return self.print_summary()

def main():
    """Main function to run the verification"""
    verifier = FileStorageVerifier()
    
    try:
        success = verifier.run_all_tests()
        if success:
            print("\n🎯 File storage system is ready for production use!")
        else:
            print("\n🔧 Please fix the issues above before using the system.")
            
    except KeyboardInterrupt:
        print("\n\n⏹️  Testing interrupted by user")
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")

if __name__ == "__main__":
    main()
