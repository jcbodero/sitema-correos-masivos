@echo off
echo ========================================
echo Validando conexiones a bases de datos
echo ========================================

echo.
echo Verificando PostgreSQL...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PostgreSQL no está instalado o no está en el PATH
    pause
    exit /b 1
)

echo PostgreSQL encontrado.
echo.

echo Verificando Redis...
redis-cli --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ADVERTENCIA: Redis CLI no está instalado o no está en el PATH
    echo Continuando sin verificación de Redis...
) else (
    echo Redis CLI encontrado.
)

echo.
echo ========================================
echo Creando bases de datos si no existen...
echo ========================================

set PGPASSWORD=%DB_PASSWORD%

echo Creando base de datos para User Service...
psql -h %DB_HOST% -p 5433 -U %DB_USERNAME% -d postgres -c "CREATE DATABASE correos_masivos_users;" 2>nul
if %errorlevel% equ 0 (
    echo ✓ Base de datos correos_masivos_users creada
) else (
    echo ℹ Base de datos correos_masivos_users ya existe
)

echo Creando base de datos para Contact Service...
psql -h %DB_HOST% -p 5433 -U %DB_USERNAME% -d postgres -c "CREATE DATABASE correos_masivos_contacts;" 2>nul
if %errorlevel% equ 0 (
    echo ✓ Base de datos correos_masivos_contacts creada
) else (
    echo ℹ Base de datos correos_masivos_contacts ya existe
)

echo Creando base de datos para Campaign Service...
psql -h %DB_HOST% -p 5433 -U %DB_USERNAME% -d postgres -c "CREATE DATABASE correos_masivos_campaigns;" 2>nul
if %errorlevel% equ 0 (
    echo ✓ Base de datos correos_masivos_campaigns creada
) else (
    echo ℹ Base de datos correos_masivos_campaigns ya existe
)

echo Creando base de datos para Email Service...
psql -h %DB_HOST% -p 5433 -U %DB_USERNAME% -d postgres -c "CREATE DATABASE correos_masivos_emails;" 2>nul
if %errorlevel% equ 0 (
    echo ✓ Base de datos correos_masivos_emails creada
) else (
    echo ℹ Base de datos correos_masivos_emails ya existe
)

echo Creando base de datos para Template Service...
psql -h %DB_HOST% -p 5433 -U %DB_USERNAME% -d postgres -c "CREATE DATABASE correos_masivos_templates;" 2>nul
if %errorlevel% equ 0 (
    echo ✓ Base de datos correos_masivos_templates creada
) else (
    echo ℹ Base de datos correos_masivos_templates ya existe
)

echo.
echo ========================================
echo Verificando conexiones a las bases de datos...
echo ========================================

echo Verificando User Service DB...
psql -h %DB_HOST% -p 5433 -U %DB_USERNAME% -d correos_masivos_users -c "SELECT 1;" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Conexión exitosa a correos_masivos_users
) else (
    echo ✗ Error conectando a correos_masivos_users
)

echo Verificando Contact Service DB...
psql -h %DB_HOST% -p 5433 -U %DB_USERNAME% -d correos_masivos_contacts -c "SELECT 1;" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Conexión exitosa a correos_masivos_contacts
) else (
    echo ✗ Error conectando a correos_masivos_contacts
)

echo Verificando Campaign Service DB...
psql -h %DB_HOST% -p 5433 -U %DB_USERNAME% -d correos_masivos_campaigns -c "SELECT 1;" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Conexión exitosa a correos_masivos_campaigns
) else (
    echo ✗ Error conectando a correos_masivos_campaigns
)

echo Verificando Email Service DB...
psql -h %DB_HOST% -p 5433 -U %DB_USERNAME% -d correos_masivos_emails -c "SELECT 1;" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Conexión exitosa a correos_masivos_emails
) else (
    echo ✗ Error conectando a correos_masivos_emails
)

echo Verificando Template Service DB...
psql -h %DB_HOST% -p 5433 -U %DB_USERNAME% -d correos_masivos_templates -c "SELECT 1;" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Conexión exitosa a correos_masivos_templates
) else (
    echo ✗ Error conectando a correos_masivos_templates
)

echo.
echo ========================================
echo Validación completada
echo ========================================
pause