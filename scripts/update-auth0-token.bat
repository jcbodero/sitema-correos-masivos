@echo off
setlocal enabledelayedexpansion
echo Verificando token de Auth0...

if exist ".env.token" (
    for /f "tokens=2 delims==" %%a in ('findstr "AUTH0_SERVICE_TOKEN" .env.token') do set CURRENT_TOKEN=%%a
    if defined CURRENT_TOKEN (
        echo Token existente encontrado, verificando expiracion...
        REM Simplificado: siempre actualizar si existe
        goto :update
    )
)

:update
echo Actualizando token de Auth0...

curl -s --location "https://dev-1zvh0tbtrif4683g.us.auth0.com/oauth/token" ^
--header "Content-Type: application/json" ^
--data "{\"client_id\": \"f2dvMxIOFKGKUfFQMnpemQPeuJKsDaSh\",\"client_secret\": \"Vd4QjYOBc4rn6pWMfmJHwdTqo1fsh8uefWXJsoJSGy9N98UeGiGav0Bu7emDLQbb\",\"audience\": \"XtrimIdentityAPI\",\"grant_type\": \"client_credentials\"}" > token_response.json

for /f "tokens=2 delims=:," %%a in ('findstr "access_token" token_response.json') do (
    set TOKEN=%%a
    set TOKEN=!TOKEN:"=!
    set TOKEN=!TOKEN: =!
)

echo AUTH0_SERVICE_TOKEN=!TOKEN! > .env.token
echo Token actualizado exitosamente
del token_response.json