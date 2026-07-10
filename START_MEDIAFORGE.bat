@echo off
setlocal
cd /d "%~dp0"
PowerShell -NoProfile -ExecutionPolicy Bypass -File "%~dp0START_MEDIAFORGE.ps1"
if errorlevel 1 (
  echo.
  echo No se pudo iniciar MediaForge 404.
  echo Revisa que Python este instalado o publica la carpeta en GitHub Pages.
  echo.
  pause
)
