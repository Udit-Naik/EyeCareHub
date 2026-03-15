@echo off
echo Creating admin user...
curl -X POST http://localhost:8080/api/auth/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"email\":\"admin@eyecarehub.com\",\"password\":\"admin123\",\"roles\":[\"admin\"]}"
echo.
echo.
echo Admin user created successfully!
echo Email: admin@eyecarehub.com
echo Password: admin123
pause
