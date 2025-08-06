#!/usr/bin/env python3

from app import create_app, db
from app.models.team import Team
import os

def recreate_database():
    app = create_app()
    with app.app_context():
        print("🗑️ Dropping all existing tables...")
        db.drop_all()
        
        print("🏗️ Creating new tables with updated schema...")
        db.create_all()
        
        # Check if database file was created
        db_path = 'galvan_ai.db'
        if os.path.exists(db_path):
            print(f"✅ Database created successfully at: {os.path.abspath(db_path)}")
            print(f"📊 Database size: {os.path.getsize(db_path)} bytes")
        else:
            print("❌ Database file not found")
            
        # Test creating a team member with new fields
        try:
            test_team = Team(
                name="Test Member",
                role="Test Role",
                avatar="test_avatar.jpg",
                bio="Test bio",
                email="test@example.com",
                department="Test Department",
                position="Test Position",
                skills='["Python", "Flask"]',
                background_interests='["AI", "Machine Learning"]',
                awards='["Best Developer 2023"]',
                certifications='["AWS Certified"]',
                location="Test City",
                languages='["English", "Spanish"]',
                fun_fact="Loves coding",
                quote="Test quote"
            )
            
            db.session.add(test_team)
            db.session.commit()
            print("✅ Test team member created successfully with all new fields")
            
            # Clean up test data
            db.session.delete(test_team)
            db.session.commit()
            print("✅ Test data cleaned up")
            print("🎉 Database recreation completed successfully!")
            
        except Exception as e:
            print(f"❌ Error creating test team member: {e}")
            db.session.rollback()

if __name__ == "__main__":
    recreate_database() 