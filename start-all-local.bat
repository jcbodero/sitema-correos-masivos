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

cd ..

echo.
echo ========================================
echo PASO 2: Compilando microservicios
echo ========================================

echo Ejecutando Maven clean install...
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Falló la compilación de los microservicios
    pause
    exit /b 1
)

echo.
echo ========================================
echo PASO 3: Iniciando microservicios
echo ========================================

cd setup

echo Iniciando API Gateway...
start "API Gateway" cmd /k "java -jar ..\apigateway\api-gateway\target\api-gateway-1.0.0-SNAPSHOT.jar"
timeout /t 10 /nobreak >nul

echo Iniciando User Service...
start "User Service" cmd /k "java -jar ..\microservicios\user-service\target\user-service-1.0.0-SNAPSHOT.jar"
timeout /t 5 /nobreak >nul

echo Iniciando Contact Service...
start "Contact Service" cmd /k "java -jar ..\microservicios\contact-service\target\contact-service-1.0.0-SNAPSHOT.jar"
timeout /t 5 /nobreak >nul

echo Iniciando Campaign Service...
start "Campaign Service" cmd /k "java -jar ..\microservicios\campaign-service\target\campaign-service-1.0.0-SNAPSHOT.jar"
timeout /t 5 /nobreak >nul

echo Iniciando Email Service...
start "Email Service" cmd /k "java -jar ..\microservicios\email-service\target\email-service-1.0.0-SNAPSHOT.jar"
timeout /t 5 /nobreak >nul

echo Iniciando Template Service...
start "Template Service" cmd /k "java -jar ..\microservicios\template-service\target\template-service-1.0.0-SNAPSHOT.jar"

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
echo   Prometheus:     http://localhost:9090
echo   Grafana:        http://localhost:3000 (admin/admin)
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