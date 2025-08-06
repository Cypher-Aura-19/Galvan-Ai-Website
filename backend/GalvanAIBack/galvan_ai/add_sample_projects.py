#!/usr/bin/env python3

from app import create_app, db
from app.models.project import Project
import json

def add_sample_projects():
    app = create_app()
    with app.app_context():
        print("🚀 Adding sample projects...")
        
        # Sample projects data
        sample_projects = [
            {
                "hero": {
                    "subtitle": "AI-Powered E-commerce Platform",
                    "description": "A modern e-commerce platform with AI-driven product recommendations and personalized shopping experience.",
                    "banner": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop"
                },
                "gallery": [
                    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
                    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop"
                ],
                "features": [
                    "AI Product Recommendations",
                    "Personalized Shopping Experience",
                    "Real-time Inventory Management",
                    "Advanced Analytics Dashboard"
                ],
                "team": [
                    {
                        "name": "John Doe",
                        "role": "Lead Developer",
                        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                    },
                    {
                        "name": "Sarah Johnson",
                        "role": "UX Designer",
                        "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
                    }
                ],
                "timeline": [
                    {
                        "phase": "Planning & Research",
                        "date": "January 2024"
                    },
                    {
                        "phase": "Development",
                        "date": "February - March 2024"
                    },
                    {
                        "phase": "Testing & Launch",
                        "date": "April 2024"
                    }
                ],
                "testimonials": [
                    {
                        "quote": "This platform revolutionized our online business!",
                        "author": "CEO, TechCorp"
                    }
                ],
                "technologies": ["React", "Node.js", "Python", "TensorFlow", "AWS"],
                "longDescription": "A comprehensive e-commerce solution that leverages artificial intelligence to provide personalized shopping experiences. The platform includes advanced features like real-time inventory management, AI-driven product recommendations, and a sophisticated analytics dashboard.",
                "bestProject": True
            },
            {
                "hero": {
                    "subtitle": "Mobile Banking App",
                    "description": "A secure and user-friendly mobile banking application with biometric authentication and real-time transactions.",
                    "banner": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop"
                },
                "gallery": [
                    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
                    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop"
                ],
                "features": [
                    "Biometric Authentication",
                    "Real-time Transactions",
                    "Investment Portfolio Management",
                    "Secure Messaging System"
                ],
                "team": [
                    {
                        "name": "Mike Chen",
                        "role": "Mobile Developer",
                        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                    },
                    {
                        "name": "Emily Davis",
                        "role": "Security Engineer",
                        "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
                    }
                ],
                "timeline": [
                    {
                        "phase": "Security Planning",
                        "date": "March 2024"
                    },
                    {
                        "phase": "Development",
                        "date": "April - May 2024"
                    },
                    {
                        "phase": "Security Audit & Launch",
                        "date": "June 2024"
                    }
                ],
                "testimonials": [
                    {
                        "quote": "The most secure banking app I've ever used!",
                        "author": "CFO, BankSecure"
                    }
                ],
                "technologies": ["React Native", "Firebase", "Biometric SDK", "Encryption", "AWS"],
                "longDescription": "A state-of-the-art mobile banking application that prioritizes security and user experience. Features include biometric authentication, real-time transaction processing, investment portfolio management, and a secure messaging system for customer support.",
                "bestProject": True
            },
            {
                "hero": {
                    "subtitle": "Smart Home IoT Platform",
                    "description": "An intelligent home automation system that connects and controls all smart devices through a unified platform.",
                    "banner": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop"
                },
                "gallery": [
                    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
                    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop"
                ],
                "features": [
                    "Device Integration",
                    "Voice Control",
                    "Energy Optimization",
                    "Remote Monitoring"
                ],
                "team": [
                    {
                        "name": "Alex Rodriguez",
                        "role": "IoT Engineer",
                        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                    },
                    {
                        "name": "Lisa Wang",
                        "role": "Backend Developer",
                        "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
                    }
                ],
                "timeline": [
                    {
                        "phase": "Hardware Integration",
                        "date": "May 2024"
                    },
                    {
                        "phase": "Software Development",
                        "date": "June - July 2024"
                    },
                    {
                        "phase": "Testing & Deployment",
                        "date": "August 2024"
                    }
                ],
                "testimonials": [
                    {
                        "quote": "This platform made my home truly smart!",
                        "author": "Homeowner, SmartLiving"
                    }
                ],
                "technologies": ["Python", "MQTT", "React", "Docker", "Raspberry Pi"],
                "longDescription": "A comprehensive IoT platform that seamlessly integrates various smart home devices. The system includes voice control capabilities, energy optimization algorithms, and remote monitoring features for complete home automation.",
                "bestProject": False
            }
        ]
        
        for project_data in sample_projects:
            try:
                project = Project.from_dict(project_data)
                db.session.add(project)
                print(f"✅ Added project: {project_data['hero']['subtitle']} (Best: {project_data['bestProject']})")
            except Exception as e:
                print(f"❌ Error adding project {project_data['hero']['subtitle']}: {e}")
                db.session.rollback()
                continue
        
        try:
            db.session.commit()
            print("🎉 Sample projects added successfully!")
            print("📊 Summary:")
            print("   - 2 Best Projects (for Timeline)")
            print("   - 1 Regular Project")
            print("   - Total: 3 Projects")
        except Exception as e:
            print(f"❌ Error committing data: {e}")
            db.session.rollback()

if __name__ == "__main__":
    add_sample_projects() 