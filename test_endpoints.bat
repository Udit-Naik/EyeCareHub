@echo off
echo Testing EyeCareHub Endpoints...

echo 1. Testing Public Product Access...
curl -s -o /dev/null -w "%%{http_code}" http://localhost:8080/api/products
echo.

echo 2. Testing Signup (Success)...
curl -X POST http://localhost:8080/api/auth/signup -H "Content-Type: application/json" -d "{\"username\":\"batchUser\", \"email\":\"batch@example.com\", \"password\":\"password123\"}"
echo.

echo 3. Testing Signup (Duplicate)...
curl -X POST http://localhost:8080/api/auth/signup -H "Content-Type: application/json" -d "{\"username\":\"batchUser\", \"email\":\"batch@example.com\", \"password\":\"password123\"}"
echo.

echo 4. Testing Signin...
curl -X POST http://localhost:8080/api/auth/signin -H "Content-Type: application/json" -d "{\"username\":\"batchUser\", \"password\":\"password123\"}"
echo.

echo Done.
pause
