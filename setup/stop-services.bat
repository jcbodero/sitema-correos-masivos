@echo off
echo ========================================
echo   Deteniendo Sistema de Correos Masivos
echo ========================================

echo.
echo Deteniendo servicios Java...

taskkill /f /im java.exe 2>nul
if %ERRORLEVEL% equ 0 (
    echo Servicios Java detenidos exitosamente
) else (
    echo No se encontraron servicios Java ejecutandose
)

echo.
echo ========================================
echo   Servicios detenidos
echo ========================================
echo.
pause