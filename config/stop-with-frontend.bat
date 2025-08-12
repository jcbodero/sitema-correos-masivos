@echo off
echo ========================================
echo  Deteniendo Microservicios con Frontend
echo ========================================

echo.
echo [1/2] Deteniendo microservicios...
docker-compose -f docker-compose.microservices.yml down

echo.
echo [2/2] Deteniendo infraestructura...
call stop-infrastructure.bat

echo.
echo ========================================
echo  Todos los servicios han sido detenidos
echo ========================================
echo.
pause