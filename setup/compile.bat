@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-11
set MAVEN_HOME=C:\apache\maven-mvnd-1.0.2-windows-amd64
set PATH=%JAVA_HOME%\bin;%MAVEN_HOME%\bin;%PATH%

echo ========================================
echo   Compilando Sistema de Correos Masivos
echo ========================================
echo Java Home: %JAVA_HOME%
echo Maven Home: %MAVEN_HOME%
echo.

echo Verificando versiones...
java -version
echo.
mvnd -version
echo.

echo Compilando proyecto...
cd ..
call mvnd clean compile -DskipTests

if %ERRORLEVEL% neq 0 (
    echo ERROR: Fallo en la compilacion
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Compilacion completada exitosamente
echo ========================================
pause