@echo off
echo ====================================
echo  Setup EyeCareHub Database
echo ====================================
echo.

set DB_NAME=EyeCareHub

echo This script will:
echo 1. Create admin user
echo 2. Initialize database structure
echo.
pause

:: Create admin user
echo.
echo [1/2] Creating admin user...
curl -X POST http://localhost:8080/api/auth/signup -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"email\":\"admin@eyecarehub.com\",\"password\":\"admin123\",\"roles\":[\"admin\"]}"

echo.
echo.
echo [2/2] Creating test user...
curl -X POST http://localhost:8080/api/auth/signup -H "Content-Type: application/json" -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"test123\",\"roles\":[\"user\"]}"

echo.
echo.
echo ====================================
echo Setup completed!
echo ====================================
echo.
echo Login credentials:
echo.
echo Admin:
echo   Email: admin@eyecarehub.com
echo   Password: admin123
echo.
echo Test User:
echo   Email: test@example.com
echo   Password: test123
echo.
pause
