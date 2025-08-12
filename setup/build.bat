@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-11
set MAVEN_HOME=C:\apache\maven-mvnd-1.0.2-windows-amd64
set PATH=%JAVA_HOME%\bin;%MAVEN_HOME%\bin;%PATH%

echo ========================================
echo   Construyendo Sistema de Correos Masivos
echo ========================================
echo Java Home: %JAVA_HOME%
echo Maven Home: %MAVEN_HOME%
echo.

echo Limpiando y compilando proyecto principal...
cd ..
call mvnd clean package -DskipTests

if %ERRORLEVEL% neq 0 (
    echo ERROR: Fallo en la construccion del proyecto
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Construccion completada exitosamente
echo ========================================
echo.
echo Los siguientes servicios estan listos:
echo - API Gateway (Puerto 8080)
echo - User Service (Puerto 8081)
echo - Contact Service (Puerto 8082)
echo - Campaign Service (Puerto 8083)
echo - Email Service (Puerto 8084)
echo - Template Service (Puerto 8085)
echo.
echo Para ejecutar los servicios, usa:
echo   start-services.bat
echo.
pause