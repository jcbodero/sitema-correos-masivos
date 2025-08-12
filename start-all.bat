@echo off
setlocal enabledelayedexpansion
set JAVA_HOME=C:\Program Files\Java\jdk-11
set MAVEN_HOME=C:\apache\maven-mvnd-1.0.2-windows-amd64
set PATH=%JAVA_HOME%\bin;%MAVEN_HOME%\bin;%PATH%
echo ========================================
echo SISTEMA DE CORREOS MASIVOS
echo Iniciando infraestructura y microservicios
echo ========================================

cd /d "%~dp0"

:: Cargar variables de entorno si existe .env
if exist .env (
    echo Cargando variables de entorno...
    for /f "usebackq tokens=1,2 delims==" %%a in (".env") do (
        if not "%%a"=="" if not "%%a:~0,1%"=="#" (
            set "%%a=%%b"
        )
    )
)

echo.
echo ========================================
echo PASO 1: Iniciando infraestructura Docker
echo ========================================

cd config
echo Verificando Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker no está instalado o no está ejecutándose
    pause
    exit /b 1
)

echo Iniciando servicios de infraestructura...
docker-compose up -d

echo Esperando que los servicios estén listos...
timeout /t 30 /nobreak >nul

echo Verificando servicios críticos...
:check_postgres
echo Verificando PostgreSQL...
docker exec correos-postgres pg_isready -U postgres >nul 2>&1
if %errorlevel% neq 0 (
    echo PostgreSQL no está listo, esperando...
    timeout /t 5 /nobreak >nul
    goto check_postgres
)
echo ✓ PostgreSQL listo

:check_redis
echo Verificando Redis...
powershell -Command "try { $client = New-Object System.Net.Sockets.TcpClient; $client.Connect('localhost', 6379); $client.Close(); exit 0 } catch { exit 1 }" >nul 2>&1
if %errorlevel% neq 0 (
    echo Redis no está listo, esperando...
    timeout /t 5 /nobreak >nul
    goto check_redis
)
echo ✓ Redis listo



echo.
echo ========================================
echo PASO 2: Iniciando microservicios
echo ========================================
echo Creando red Docker si no existe...
docker network create correos-network 2>nul

echo Iniciando microservicios...
docker-compose -f docker-compose.microservices.yml up -d

echo Esperando que los microservicios estén listos...
timeout /t 20 /nobreak >nul

cd ..

echo.
echo ========================================
echo SISTEMA INICIADO COMPLETAMENTE
echo ========================================
echo.
echo INFRAESTRUCTURA:
echo   PostgreSQL:     http://localhost:5433
echo   Redis:          http://localhost:6379
echo   RabbitMQ:       http://localhost:15672 (admin/password)
echo   MailHog:        http://localhost:8025
echo   pgAdmin:        http://localhost:5050 (admin@correos.com/admin)
echo.
echo MICROSERVICIOS:
echo   API Gateway:    http://localhost:8080
echo   User Service:   http://localhost:8081
echo   Contact Service: http://localhost:8082
echo   Campaign Service: http://localhost:8083
echo   Email Service:  http://localhost:8084
echo   Template Service: http://localhost:8085
echo.
echo ENDPOINTS PRINCIPALES:
echo   Users:          http://localhost:8080/api/users
echo   Contacts:       http://localhost:8080/api/contacts
echo   Campaigns:      http://localhost:8080/api/campaigns
echo   Emails:         http://localhost:8080/api/emails
echo   Templates:      http://localhost:8080/api/templates
echo.
echo Para detener todo el sistema ejecuta: stop-all.bat
echo ========================================
pause