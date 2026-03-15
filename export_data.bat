@echo off
echo ====================================
echo  MongoDB Data Export - EyeCareHub
echo ====================================
echo.

set DB_NAME=EyeCareHub
set EXPORT_DIR=mongodb_backup

:: Create backup directory
if not exist "%EXPORT_DIR%" mkdir "%EXPORT_DIR%"

echo Exporting data from MongoDB...
echo.

:: Export Users collection
echo [1/4] Exporting Users...
mongoexport --db=%DB_NAME% --collection=users --out=%EXPORT_DIR%/users.json --jsonArray
if %ERRORLEVEL% EQU 0 (
    echo     ✓ Users exported successfully
) else (
    echo     ✗ Failed to export Users
)

:: Export Orders collection
echo [2/4] Exporting Orders...
mongoexport --db=%DB_NAME% --collection=orders --out=%EXPORT_DIR%/orders.json --jsonArray
if %ERRORLEVEL% EQU 0 (
    echo     ✓ Orders exported successfully
) else (
    echo     ✗ Failed to export Orders
)

:: Export Carts collection
echo [3/4] Exporting Carts...
mongoexport --db=%DB_NAME% --collection=carts --out=%EXPORT_DIR%/carts.json --jsonArray
if %ERRORLEVEL% EQU 0 (
    echo     ✓ Carts exported successfully
) else (
    echo     ✗ Failed to export Carts
)

:: Export Products collection (if exists)
echo [4/4] Exporting Products...
mongoexport --db=%DB_NAME% --collection=products --out=%EXPORT_DIR%/products.json --jsonArray
if %ERRORLEVEL% EQU 0 (
    echo     ✓ Products exported successfully
) else (
    echo     ✗ Failed to export Products ^(may not exist^)
)

echo.
echo ====================================
echo Export completed!
echo Data saved in: %EXPORT_DIR%\
echo ====================================
echo.
echo Files created:
dir /B %EXPORT_DIR%\*.json
echo.
pause
