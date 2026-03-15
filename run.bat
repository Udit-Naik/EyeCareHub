@echo off
echo ========================================
echo Starting EyeCareHub Application
echo ========================================
echo.
echo Make sure MongoDB is running on localhost:27017
echo.
set JAVA_HOME=C:\Program Files\Java\jdk-25
set MAVEN_HOME=C:\Users\sunny\maven\apache-maven-3.9.6
set PATH=%MAVEN_HOME%\bin;%JAVA_HOME%\bin;%PATH%
cd /d "%~dp0"
echo.
echo Starting application...
echo This may take 30-60 seconds...
echo.
mvn spring-boot:run -Dmaven.test.skip=true // ye command se run hoga 
pause
