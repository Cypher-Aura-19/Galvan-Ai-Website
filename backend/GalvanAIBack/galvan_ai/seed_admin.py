#!/usr/bin/env python3

from app import create_app, db
from app.models.user import User
from werkzeug.security import generate_password_hash
import os

def seed_admin():
    app = create_app()
    with app.app_context():
        print("🌱 Seeding superadmin user...")
        
        # Check if admin already exists
        existing_admin = User.query.filter_by(username='admin').first()
        if existing_admin:
            print("⚠️ Admin user already exists!")
            print(f"Username: {existing_admin.username}")
            return
        
        # Create admin user
        admin_user = User(
            username='admin',
            password=generate_password_hash('admin123')
        )
        
        try:
            db.session.add(admin_user)
            db.session.commit()
            print("✅ Superadmin created successfully!")
            print("📋 Login credentials:")
            print("   Username: admin")
            print("   Password: admin123")
            print("🔐 Please change the password after first login!")
            
        except Exception as e:
            print(f"❌ Error creating admin user: {e}")
            db.session.rollback()

if __name__ == "__main__":
    seed_admin() 