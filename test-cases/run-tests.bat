@echo off
echo ========================================
echo  SISTEMA DE CORREOS MASIVOS - TEST SUITE
echo ========================================
echo.
setlocal enabledelayedexpansion
set JAVA_HOME=C:\Program Files\Java\jdk-11
set MAVEN_HOME=C:\apache\maven-mvnd-1.0.2-windows-amd64
set PATH=%JAVA_HOME%\bin;%MAVEN_HOME%\bin;%PATH%
set TEST_TYPE=%1
if "%TEST_TYPE%"=="" set TEST_TYPE=all

echo Iniciando pruebas: %TEST_TYPE%
echo.

cd ..

if "%TEST_TYPE%"=="all" goto :run_all
if "%TEST_TYPE%"=="unit" goto :run_unit
if "%TEST_TYPE%"=="integration" goto :run_integration
if "%TEST_TYPE%"=="performance" goto :run_performance
if "%TEST_TYPE%"=="security" goto :run_security

:run_all
echo Ejecutando todas las pruebas...
mvn test
goto :end

:run_unit
echo Ejecutando pruebas unitarias...
mvn test -Dtest=*ServiceTest
goto :end

:run_integration
echo Ejecutando pruebas de integración...
mvn test -Dtest=IntegrationTest
goto :end

:run_performance
echo Ejecutando pruebas de rendimiento...
mvn test -Dtest=PerformanceTest
goto :end

:run_security
echo Ejecutando pruebas de seguridad...
mvn test -Dtest=SecurityTest
goto :end

:end
echo.
echo Pruebas completadas.
pause