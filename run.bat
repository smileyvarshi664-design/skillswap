@echo off
echo ========================================================
echo   SkillSwap - Student Skill Exchange Platform
echo ========================================================
echo.
echo Starting Backend API Server (Port 5000)...
start "SkillSwap Backend" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Dev Server (Port 5173)...
start "SkillSwap Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo Opening SkillSwap in your browser...
start http://localhost:5173

echo.
echo ========================================================
echo  SkillSwap is running!
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:5000
echo ========================================================
echo.
pause
