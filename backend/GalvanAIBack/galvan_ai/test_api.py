import requests
import json

BASE_URL = "http://localhost:5000"

def test_get_projects():
    """Test getting all projects"""
    try:
        response = requests.get(f"{BASE_URL}/api/projects")
        print(f"GET /api/projects - Status: {response.status_code}")
        if response.status_code == 200:
            projects = response.json()
            print(f"Found {len(projects)} projects")
            for project in projects:
                print(f"  - {project['hero']['subtitle']} (Best: {project.get('bestProject', False)})")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error testing GET /api/projects: {e}")

def test_get_best_projects():
    """Test getting best projects only"""
    try:
        response = requests.get(f"{BASE_URL}/api/projects/best")
        print(f"\nGET /api/projects/best - Status: {response.status_code}")
        if response.status_code == 200:
            projects = response.json()
            print(f"Found {len(projects)} best projects")
            for project in projects:
                print(f"  - {project['hero']['subtitle']}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error testing GET /api/projects/best: {e}")

def test_create_project():
    """Test creating a new project"""
    try:
        project_data = {
            "hero": {
                "subtitle": "Test Project",
                "description": "A test project for API validation",
                "banner": "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&fit=crop&w=900&q=80"
            },
            "gallery": ["https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&fit=crop&w=900&q=80"],
            "features": ["Test Feature 1", "Test Feature 2"],
            "team": [
                {
                    "name": "Test Developer",
                    "role": "Developer",
                    "avatar": "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&fit=crop&w=900&q=80"
                }
            ],
            "timeline": [
                {
                    "phase": "Development",
                    "date": "2024-01-01"
                }
            ],
            "testimonials": [
                {
                    "quote": "Great test project",
                    "author": "Test User"
                }
            ],
            "technologies": ["Python", "Flask"],
            "longDescription": "This is a test project to validate the API endpoints.",
            "bestProject": False
        }
        
        response = requests.post(
            f"{BASE_URL}/api/projects",
            json=project_data,
            headers={'Content-Type': 'application/json'}
        )
        print(f"\nPOST /api/projects - Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Project created successfully: {result}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error testing POST /api/projects: {e}")

def test_validation():
    """Test validation errors"""
    print("\n=== Testing Validation ===")
    
    # Test missing hero
    invalid_data = {
        "longDescription": "Test description",
        "bestProject": False
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/projects",
            json=invalid_data,
            headers={'Content-Type': 'application/json'}
        )
        print(f"POST /api/projects (invalid data) - Status: {response.status_code}")
        if response.status_code == 400:
            error = response.json()
            print(f"Validation error caught: {error.get('error')}")
        else:
            print("Expected validation error but got success")
    except Exception as e:
        print(f"Error testing validation: {e}")

if __name__ == "__main__":
    print("Testing Flask Backend API...")
    print("=" * 50)
    
    test_get_projects()
    test_get_best_projects()
    test_validation()
    
    print("\n" + "=" * 50)
    print("API Testing Complete!") 