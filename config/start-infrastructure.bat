@echo off
echo ========================================
echo Iniciando infraestructura con Docker
echo ========================================

cd /d "%~dp0"

echo Verificando Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker no está instalado o no está ejecutándose
    pause
    exit /b 1
)

echo Docker encontrado.
echo.

echo Iniciando servicios de infraestructura...
docker-compose up -d

echo.
echo ========================================
echo Servicios iniciados
echo ========================================
echo.
echo PostgreSQL:     http://localhost:5433
echo   - Usuario: postgres
echo   - Password: password
echo   - Bases de datos creadas automáticamente
echo.
echo Redis:           http://localhost:6379
echo.
echo RabbitMQ:        http://localhost:15672
echo   - Usuario: admin
echo   - Password: password
echo.
echo MailHog (SMTP):  http://localhost:8025
echo   - SMTP: localhost:1025
echo.
echo Prometheus:      http://localhost:9090
echo.
echo Grafana:         http://localhost:3000
echo   - Usuario: admin
echo   - Password: admin
echo.
echo pgAdmin:         http://localhost:5050
echo   - Email: admin@correos.com
echo   - Password: admin
echo.
echo ========================================
echo Para detener los servicios ejecuta:
echo docker-compose down
echo ========================================
pause