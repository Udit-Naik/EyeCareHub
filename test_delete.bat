@echo off
echo Testing DELETE endpoint...
echo.
curl -X DELETE http://localhost:8080/api/admin/users/test123 ^
  -H "Authorization: Bearer %1" ^
  -H "Content-Type: application/json"
echo.
echo.
echo If you see "404 Not Found" - endpoint doesn't exist
echo If you see "401 Unauthorized" - token missing/invalid (expected)
echo If you see "403 Forbidden" - not admin
pause
