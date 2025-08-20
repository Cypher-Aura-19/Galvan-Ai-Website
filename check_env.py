#!/usr/bin/env python3
"""
Check environment configuration for debugging
"""

import os

def check_environment():
    print("🔍 Environment Configuration Check")
    print("=" * 50)
    
    # Check Next.js environment variables
    print("\n📱 Next.js Environment:")
    nextjs_vars = [
        'NEXT_PUBLIC_API_URL',
        'NEXT_PUBLIC_APP_URL',
        'NODE_ENV'
    ]
    
    for var in nextjs_vars:
        value = os.environ.get(var, 'NOT SET')
        print(f"  {var}: {value}")
    
    # Check Cloudinary environment variables
    print("\n☁️ Cloudinary Environment:")
    cloudinary_vars = [
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET'
    ]
    
    for var in cloudinary_vars:
        value = os.environ.get(var, 'NOT SET')
        if var == 'CLOUDINARY_API_SECRET' and value != 'NOT SET':
            # Show only first few characters for security
            value = value[:8] + '...' if len(value) > 8 else value
        print(f"  {var}: {value}")
    
    # Check if .env.local exists
    print("\n📁 Environment Files:")
    env_files = ['.env.local', '.env', '.env.example']
    for env_file in env_files:
        if os.path.exists(env_file):
            print(f"  ✅ {env_file} exists")
        else:
            print(f"  ❌ {env_file} not found")
    
    # Check current working directory
    print(f"\n📂 Current Working Directory: {os.getcwd()}")
    
    # Check if we're in the right directory for Next.js
    if os.path.exists('package.json'):
        print("  ✅ package.json found (likely in Next.js root)")
    else:
        print("  ❌ package.json not found (might be in wrong directory)")

if __name__ == "__main__":
    check_environment()
