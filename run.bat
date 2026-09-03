@echo off
title Mini ERP + CRM Operations Portal
color 0A

echo.
echo  ====================================
echo   Mini ERP + CRM Operations Portal
echo  ====================================
echo.

:: Check if Docker is running
docker info >nul 2>&1
if %ERRORLEVEL% neq 0 (
    color 0C
    echo  [ERROR] Docker is not running!
    echo.
    echo  Please start Docker Desktop and try again.
    echo  Download: https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

echo  [OK] Docker is running
echo.
echo  Starting all services...
echo  This may take a few minutes on first run.
echo.
echo  ----------------------------------------
echo   Frontend :  http://localhost:5173
echo   Backend  :  http://localhost:3000
echo  ----------------------------------------
echo.
echo  Login with: admin@erp.com / admin123
echo.
echo  Press Ctrl+C to stop all services.
echo.

:: Open browser after a delay (in background)
start /b cmd /c "timeout /t 15 /nobreak >nul && start http://localhost:5173"

:: Run docker-compose
docker-compose up --build
