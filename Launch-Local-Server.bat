@echo off
title JobFoodie Local Web Server
cd /d "%~dp0"

echo ========================================================
echo   JobFoodie - Starting Local Web Server
echo ========================================================
echo.

where python >nul 2>nul
if %errorlevel% equ 0 (
    echo Python detected. Starting server at http://localhost:8080 ...
    start "" "http://localhost:8080"
    python -m http.server 8080
    goto end
)

where py >nul 2>nul
if %errorlevel% equ 0 (
    echo Python launcher detected. Starting server at http://localhost:8080 ...
    start "" "http://localhost:8080"
    py -m http.server 8080
    goto end
)

where npx >nul 2>nul
if %errorlevel% equ 0 (
    echo Node.js detected. Starting server at http://localhost:8080 ...
    start "" "http://localhost:8080"
    npx -y serve -p 8080 .
    goto end
)

echo No local server runtime found. Opening direct browser link...
start "" "file:///%~dp0index.html"

:end
