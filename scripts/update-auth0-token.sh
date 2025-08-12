#!/bin/bash

# Script para actualizar el token de Auth0
echo "Verificando token de Auth0..."

# Verificar si existe token actual
if [ -f ".env.token" ]; then
    CURRENT_TOKEN=$(grep AUTH0_SERVICE_TOKEN .env.token | cut -d'=' -f2)
    if [ ! -z "$CURRENT_TOKEN" ]; then
        # Decodificar payload del JWT
        PAYLOAD=$(echo $CURRENT_TOKEN | cut -d'.' -f2)
        # Agregar padding si es necesario
        PAYLOAD="$PAYLOAD$(printf '%*s' $(((4 - ${#PAYLOAD} % 4) % 4)) '' | tr ' ' '=')"
        EXP=$(echo $PAYLOAD | base64 -d 2>/dev/null | jq -r '.exp' 2>/dev/null)
        
        if [ "$EXP" != "null" ] && [ ! -z "$EXP" ]; then
            CURRENT_TIME=$(date +%s)
            if [ $CURRENT_TIME -lt $EXP ]; then
                echo "Token aún válido, no necesita actualización"
                exit 0
            fi
        fi
    fi
fi

echo "Actualizando token de Auth0..."

TOKEN_RESPONSE=$(curl -s --location 'https://dev-1zvh0tbtrif4683g.us.auth0.com/oauth/token' \
--header 'Content-Type: application/json' \
--data '{
    "client_id": "f2dvMxIOFKGKUfFQMnpemQPeuJKsDaSh",
    "client_secret": "Vd4QjYOBc4rn6pWMfmJHwdTqo1fsh8uefWXJsoJSGy9N98UeGiGav0Bu7emDLQbb",
    "audience": "XtrimIdentityAPI",
    "grant_type": "client_credentials"
}')

ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.access_token')

if [ "$ACCESS_TOKEN" != "null" ] && [ "$ACCESS_TOKEN" != "" ]; then
    export AUTH0_SERVICE_TOKEN=$ACCESS_TOKEN
    echo "Token actualizado exitosamente"
    echo "AUTH0_SERVICE_TOKEN=$ACCESS_TOKEN" > .env.token
else
    echo "Error al obtener el token"
    exit 1
fi