#!/usr/bin/env python3

from app import create_app, db
from app.models.team import Team
import json

def add_sample_teams():
    app = create_app()
    with app.app_context():
        print("👥 Adding sample team members...")
        
        # Sample team data
        sample_teams = [
            {
                "name": "John Doe",
                "role": "Senior Frontend Developer",
                "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                "bio": "Experienced frontend developer with 5+ years in React and modern web technologies.",
                "email": "john.doe@galvanai.com",
                "linkedin": "https://linkedin.com/in/johndoe",
                "github": "https://github.com/johndoe",
                "twitter": "https://twitter.com/johndoe",
                "website": "https://johndoe.dev",
                "department": "Engineering",
                "position": "Senior",
                "skills": json.dumps(["React", "TypeScript", "Next.js", "Tailwind CSS"]),
                "background": json.dumps(["Computer Science Degree", "5+ years experience", "Frontend Specialist"]),
                "interests": json.dumps(["AI/ML", "Open Source", "Tech Blogging"]),
                "awards": json.dumps(["Best Developer 2023", "Open Source Contributor"]),
                "certifications": json.dumps(["AWS Certified", "Google Cloud Certified"]),
                "location": "San Francisco, CA",
                "languages": json.dumps(["English", "Spanish"]),
                "fun_fact": "Can solve a Rubik's cube in under 2 minutes",
                "quote": "Code is poetry in motion"
            },
            {
                "name": "Sarah Johnson",
                "role": "UX/UI Designer",
                "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                "bio": "Creative designer passionate about user-centered design and creating beautiful interfaces.",
                "email": "sarah.johnson@galvanai.com",
                "linkedin": "https://linkedin.com/in/sarahjohnson",
                "github": "https://github.com/sarahjohnson",
                "twitter": "https://twitter.com/sarahjohnson",
                "website": "https://sarahjohnson.design",
                "department": "Design",
                "position": "Lead",
                "skills": json.dumps(["Figma", "Adobe Creative Suite", "Prototyping", "User Research"]),
                "background": json.dumps(["Design Degree", "8+ years experience", "UX Specialist"]),
                "interests": json.dumps(["Art History", "Photography", "Travel"]),
                "awards": json.dumps(["Design Excellence Award 2023"]),
                "certifications": json.dumps(["Google UX Design Certificate"]),
                "location": "New York, NY",
                "languages": json.dumps(["English", "French"]),
                "fun_fact": "Has visited 15 countries and counting",
                "quote": "Design is not just what it looks like, it's how it works"
            }
        ]
        
        for team_data in sample_teams:
            try:
                team = Team(**team_data)
                db.session.add(team)
                print(f"✅ Added {team_data['name']}")
            except Exception as e:
                print(f"❌ Error adding {team_data['name']}: {e}")
                db.session.rollback()
                continue
        
        try:
            db.session.commit()
            print("🎉 Sample team members added successfully!")
        except Exception as e:
            print(f"❌ Error committing data: {e}")
            db.session.rollback()

if __name__ == "__main__":
    add_sample_teams() 