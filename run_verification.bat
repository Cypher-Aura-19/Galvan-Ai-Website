@echo off
echo 🚀 Running File Storage System Verification...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

REM Install requirements if needed
echo 📦 Installing requirements...
pip install -r verify_requirements.txt

REM Run the verification script
echo.
echo 🔍 Starting verification...
python verify_file_storage.py

echo.
echo ✅ Verification complete!
pause
