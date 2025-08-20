#!/usr/bin/env python3
"""
Migration script to add status and notes fields to job_applications table
Run this script to update your existing database schema
"""

import sqlite3
import os
from datetime import datetime

def migrate_job_applications():
    """Add missing fields to job_applications table"""
    
    # Database path
    db_path = os.path.join(os.path.dirname(__file__), 'instance', 'galvan_ai.db')
    
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        print("Please run the application first to create the database")
        return False
    
    try:
        # Connect to database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print("Connected to database successfully")
        
        # Check if columns already exist
        cursor.execute("PRAGMA table_info(job_applications)")
        columns = [column[1] for column in cursor.fetchall()]
        
        print(f"Current columns: {columns}")
        
        # Add status column if it doesn't exist
        if 'status' not in columns:
            print("Adding status column...")
            cursor.execute("ALTER TABLE job_applications ADD COLUMN status VARCHAR(50)")
            print("✓ Status column added")
        else:
            print("✓ Status column already exists")
        
        # Add notes column if it doesn't exist
        if 'notes' not in columns:
            print("Adding notes column...")
            cursor.execute("ALTER TABLE job_applications ADD COLUMN notes TEXT")
            print("✓ Notes column added")
        else:
            print("✓ Notes column already exists")
        
        # Add updated_at column if it doesn't exist
        if 'updated_at' not in columns:
            print("Adding updated_at column...")
            cursor.execute("ALTER TABLE job_applications ADD COLUMN updated_at DATETIME")
            print("✓ Updated_at column added")
        else:
            print("✓ Updated_at column already exists")
        
        # Update existing records to set default values
        current_time = datetime.utcnow().isoformat()
        
        # Set status to 'pending' for existing records
        cursor.execute("UPDATE job_applications SET status = 'pending' WHERE status IS NULL")
        updated_status_count = cursor.rowcount
        if updated_status_count > 0:
            print(f"✓ Updated {updated_status_count} existing records with status 'pending'")
        
        # Set updated_at to current time for existing records
        cursor.execute("UPDATE job_applications SET updated_at = ? WHERE updated_at IS NULL", (current_time,))
        updated_time_count = cursor.rowcount
        if updated_time_count > 0:
            print(f"✓ Updated {updated_time_count} existing records with current timestamp")
        
        # Commit changes
        conn.commit()
        print("\n✓ Migration completed successfully!")
        
        # Verify the new structure
        cursor.execute("PRAGMA table_info(job_applications)")
        new_columns = [column[1] for column in cursor.fetchall()]
        print(f"New table structure: {new_columns}")
        
        return True
        
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return False
    except Exception as e:
        print(f"Error: {e}")
        return False
    finally:
        if conn:
            conn.close()
            print("Database connection closed")

if __name__ == "__main__":
    print("Starting job_applications table migration...")
    print("=" * 50)
    
    success = migrate_job_applications()
    
    if success:
        print("\n🎉 Migration completed successfully!")
        print("Your database is now ready for the new file storage system.")
    else:
        print("\n❌ Migration failed!")
        print("Please check the error messages above and try again.")
