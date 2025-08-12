@echo off
echo ========================================
echo  Iniciando Microservicios con Frontend
echo ========================================

echo.
echo [1/3] Iniciando infraestructura...
call start-infrastructure.bat

echo.
echo [2/3] Esperando que la infraestructura esté lista...
timeout /t 10 /nobreak > nul

echo.
echo [3/3] Iniciando microservicios con frontend...
docker-compose -f docker-compose.microservices.yml up -d

echo.
echo ========================================
echo  Servicios iniciados correctamente
echo ========================================
echo.
echo Frontend:     http://localhost:3000
echo API Gateway:  http://localhost:8080
echo MailHog:      http://localhost:8025
echo.
echo Para ver logs: docker-compose -f docker-compose.microservices.yml logs -f
echo Para detener:  docker-compose -f docker-compose.microservices.yml down
echo.
pause