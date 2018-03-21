@echo off
color 27
title App - Votaciones IE Cascajal
echo.
echo.
echo ===============================================
echo.
echo Bienvenidos al sistema de votaciones
echo.
echo I. E. Cascajal
echo.
echo Iniciado servidor...
echo.
echo ===============================================
echo.
echo.
echo No cerrar esta ventana por favor

"C:/Program Files (x86)/Google/Chrome/Application/chrome.exe" "http://localhost:8080"

node c:/votaciones_iecascajal/app.js

pause 