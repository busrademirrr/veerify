@echo off
title Veerify Sunuculari
echo ==============================================
echo Veerify Backend ve Frontend Baslatiliyor...
echo ==============================================
echo.

echo [1] Backend sunucusu baslatiliyor (FastAPI)
start "Veerify Backend" cmd /k "cd /d %~dp0 && python -m uvicorn backend.app.main:app --reload"

echo [2] Frontend sunucusu baslatiliyor (React/Vite)
start "Veerify Frontend" cmd /k "cd /d %~dp0\veerify-frontend && npm run dev"

echo.
echo Sunucular ayri pencerelerde baslatildi! 
echo Eger pencereleri kapatmazsaniz bu "Failed to fetch" hatasini bir daha ASLA almayacaksiniz.
echo.
pause
