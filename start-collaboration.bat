@echo off
echo ========================================
echo Starting CodeMentor Collaboration System
echo ========================================
echo.

echo Step 1: Installing WebSocket dependencies...
call npm install ws
echo.

echo Step 2: Starting WebSocket Server...
echo Server will run on port 8080
echo.
start cmd /k "node collaboration-server.js"

timeout /t 3 /nobreak >nul

echo.
echo Step 3: Starting Frontend...
echo Frontend will run on http://localhost:3000
echo.
call npm run dev

pause
