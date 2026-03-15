@echo off
echo ====================================
echo  MongoDB Data Import - EyeCareHub
echo ====================================
echo.

set DB_NAME=EyeCareHub
set IMPORT_DIR=mongodb_backup

:: Check if backup directory exists
if not exist "%IMPORT_DIR%" (
    echo Error: Backup directory "%IMPORT_DIR%" not found!
    echo Please run export_data.bat first or create the directory with JSON files.
    pause
    exit /b 1
)

echo WARNING: This will replace existing data in database "%DB_NAME%"
echo.
set /p CONFIRM="Are you sure you want to continue? (Y/N): "
if /i not "%CONFIRM%"=="Y" (
    echo Import cancelled.
    pause
    exit /b 0
)

echo.
echo Importing data to MongoDB...
echo.

:: Import Users collection
if exist "%IMPORT_DIR%\users.json" (
    echo [1/4] Importing Users...
    mongoimport --db=%DB_NAME% --collection=users --file=%IMPORT_DIR%/users.json --jsonArray --drop
    if %ERRORLEVEL% EQU 0 (
        echo     ✓ Users imported successfully
    ) else (
        echo     ✗ Failed to import Users
    )
) else (
    echo [1/4] Users file not found, skipping...
)

:: Import Orders collection
if exist "%IMPORT_DIR%\orders.json" (
    echo [2/4] Importing Orders...
    mongoimport --db=%DB_NAME% --collection=orders --file=%IMPORT_DIR%/orders.json --jsonArray --drop
    if %ERRORLEVEL% EQU 0 (
        echo     ✓ Orders imported successfully
    ) else (
        echo     ✗ Failed to import Orders
    )
) else (
    echo [2/4] Orders file not found, skipping...
)

:: Import Carts collection
if exist "%IMPORT_DIR%\carts.json" (
    echo [3/4] Importing Carts...
    mongoimport --db=%DB_NAME% --collection=carts --file=%IMPORT_DIR%/carts.json --jsonArray --drop
    if %ERRORLEVEL% EQU 0 (
        echo     ✓ Carts imported successfully
    ) else (
        echo     ✗ Failed to import Carts
    )
) else (
    echo [3/4] Carts file not found, skipping...
)

:: Import Products collection
if exist "%IMPORT_DIR%\products.json" (
    echo [4/4] Importing Products...
    mongoimport --db=%DB_NAME% --collection=products --file=%IMPORT_DIR%/products.json --jsonArray --drop
    if %ERRORLEVEL% EQU 0 (
        echo     ✓ Products imported successfully
    ) else (
        echo     ✗ Failed to import Products
    )
) else (
    echo [4/4] Products file not found, skipping...
)

echo.
echo ====================================
echo Import completed!
echo ====================================
echo.
pause
