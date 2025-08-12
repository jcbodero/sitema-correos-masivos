@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-11
set PATH=%JAVA_HOME%\bin;%PATH%

echo ========================================
echo   Iniciando Sistema de Correos Masivos
echo ========================================
echo Java Home: %JAVA_HOME%
echo.

echo Iniciando servicios en segundo plano...

echo Iniciando API Gateway (Puerto 8080)...
start "API Gateway" cmd /k ""%JAVA_HOME%\bin\java" -jar ../apigateway/api-gateway/target/api-gateway-1.0.0-SNAPSHOT.jar"

timeout /t 5 /nobreak > nul

echo Iniciando User Service (Puerto 8081)...
start "User Service" cmd /k ""%JAVA_HOME%\bin\java" -jar ../microservicios/user-service/target/user-service-1.0.0-SNAPSHOT.jar"

timeout /t 3 /nobreak > nul

echo Iniciando Contact Service (Puerto 8082)...
start "Contact Service" cmd /k ""%JAVA_HOME%\bin\java" -jar ../microservicios/contact-service/target/contact-service-1.0.0-SNAPSHOT.jar"

timeout /t 3 /nobreak > nul

echo Iniciando Campaign Service (Puerto 8083)...
start "Campaign Service" cmd /k ""%JAVA_HOME%\bin\java" -jar ../microservicios/campaign-service/target/campaign-service-1.0.0-SNAPSHOT.jar"

timeout /t 3 /nobreak > nul

echo Iniciando Email Service (Puerto 8084)...
start "Email Service" cmd /k ""%JAVA_HOME%\bin\java" -jar ../microservicios/email-service/target/email-service-1.0.0-SNAPSHOT.jar"

timeout /t 3 /nobreak > nul

echo Iniciando Template Service (Puerto 8085)...
start "Template Service" cmd /k ""%JAVA_HOME%\bin\java" -jar ../microservicios/template-service/target/template-service-1.0.0-SNAPSHOT.jar"

echo.
echo ========================================
echo   Todos los servicios iniciados
echo ========================================
echo.
echo Endpoints disponibles:
echo - API Gateway: http://localhost:8080
echo - Users: http://localhost:8080/api/users/health
echo - Contacts: http://localhost:8080/api/contacts/health
echo - Campaigns: http://localhost:8080/api/campaigns/health
echo - Emails: http://localhost:8080/api/emails/health
echo - Templates: http://localhost:8080/api/templates/health
echo.
echo Para detener los servicios, usa: stop-services.bat
echo.
pause