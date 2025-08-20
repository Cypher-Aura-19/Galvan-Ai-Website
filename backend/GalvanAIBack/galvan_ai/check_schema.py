#!/usr/bin/env python3
"""
Check current database schema
"""

import sqlite3
import os

def check_database_schema():
    db_path = 'instance/galvan_ai.db'
    
    if not os.path.exists(db_path):
        print("❌ Database file not found!")
        return
    
    print("🔍 Current Database Schema")
    print("=" * 50)
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        
        print(f"📊 Found {len(tables)} tables:")
        for table in tables:
            table_name = table[0]
            print(f"\n📋 Table: {table_name}")
            print("-" * 30)
            
            # Get table schema
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = cursor.fetchall()
            
            for col in columns:
                col_id, col_name, col_type, not_null, default_val, pk = col
                nullable = "NOT NULL" if not_null else "NULL"
                primary_key = " (PK)" if pk else ""
                default = f" DEFAULT {default_val}" if default_val else ""
                
                print(f"  {col_name}: {col_type} {nullable}{default}{primary_key}")
            
            # Get row count
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            count = cursor.fetchone()[0]
            print(f"  📈 Rows: {count}")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error reading database: {e}")

if __name__ == "__main__":
    check_database_schema()
