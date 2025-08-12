@echo off
echo ========================================
echo Deteniendo infraestructura Docker
echo ========================================

cd /d "%~dp0"

echo Deteniendo servicios...
docker-compose down

echo.
echo ========================================
echo Servicios detenidos
echo ========================================
echo.
echo Para eliminar también los volúmenes:
echo docker-compose down -v
echo.
echo Para ver el estado de los contenedores:
echo docker-compose ps
echo ========================================
pause