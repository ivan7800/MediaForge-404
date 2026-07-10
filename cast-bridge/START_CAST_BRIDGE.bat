@echo off
setlocal
chcp 65001 >nul
if "%~1"=="" (
  echo.
  echo MediaForge Cast Bridge
  echo ======================
  echo Arrastra un archivo de video o audio encima de este BAT.
  echo.
  pause
  exit /b 1
)
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 "%~dp0MediaForgeCastBridge.py" "%~1"
) else (
  where python >nul 2>nul
  if errorlevel 1 (
    echo Python 3 no esta instalado o no esta en PATH.
    echo Descargalo desde python.org y marca "Add Python to PATH".
    pause
    exit /b 2
  )
  python "%~dp0MediaForgeCastBridge.py" "%~1"
)
pause
