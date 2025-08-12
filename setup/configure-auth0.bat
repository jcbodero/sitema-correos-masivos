@echo off
echo ========================================
echo Configuración de Auth0
echo ========================================

echo.
echo PASOS PARA CONFIGURAR AUTH0:
echo.
echo 1. Crear cuenta en https://auth0.com
echo 2. Crear tenant: correos-masivos
echo 3. Crear aplicación SPA para frontend
echo 4. Crear API: correos-masivos-api
echo 5. Configurar scopes y roles
echo.
echo Ver guía completa en: config\auth0-setup.md
echo.
echo VARIABLES A CONFIGURAR EN .env:
echo AUTH0_DOMAIN=your-domain.auth0.com
echo AUTH0_ISSUER_URI=https://your-domain.auth0.com/
echo AUTH0_AUDIENCE=correos-masivos-api
echo AUTH0_CLIENT_ID=your-client-id
echo AUTH0_CLIENT_SECRET=your-client-secret
echo.
echo ========================================
pause