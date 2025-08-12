@echo off
echo ========================================
echo    Iniciando Frontend - Admin Platform
echo ========================================

cd admin-platform

echo Verificando dependencias...
if not exist node_modules (
    echo Instalando dependencias de Node.js...
    npm install --legacy-peer-deps
    if errorlevel 1 (
        echo Error: No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
)

echo.
echo Iniciando servidor de desarrollo Next.js...
echo Frontend disponible en: http://localhost:3000
echo.

npm run dev