# Frontend - Admin Platform

Plataforma administrativa desarrollada con Next.js 14 para la gestión del sistema de correos masivos.

## Características Implementadas ✅

### Tarea 5.1 - Configuración de Next.js Admin Platform

- ✅ **Next.js 14** con App Router
- ✅ **Autenticación Auth0** integrada
- ✅ **Dashboard básico** con métricas y gráficos
- ✅ **Diseño responsive** con Tailwind CSS
- ✅ **Protección de rutas** con Auth0
- ✅ **Tema claro/oscuro** implementado
- ✅ **Sistema de diseño Xtrim** aplicado

## Tecnologías Utilizadas

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **Auth0** - Autenticación y autorización
- **Recharts** - Gráficos y visualizaciones
- **Heroicons** - Iconografía

## Estructura del Proyecto

```
admin-platform/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── api/auth/[auth0]/   # Rutas de Auth0
│   │   ├── dashboard/          # Páginas del dashboard
│   │   ├── globals.css         # Estilos globales
│   │   ├── layout.tsx          # Layout principal
│   │   └── page.tsx            # Página de inicio
│   ├── components/             # Componentes React
│   │   ├── Dashboard.tsx       # Dashboard principal
│   │   ├── Header.tsx          # Header con usuario
│   │   ├── LoginPage.tsx       # Página de login
│   │   ├── Sidebar.tsx         # Navegación lateral
│   │   └── ThemeProvider.tsx   # Proveedor de tema
│   ├── lib/                    # Utilidades
│   │   └── api.ts              # Cliente API
│   └── types/                  # Tipos TypeScript
│       └── index.ts            # Definiciones de tipos
├── public/                     # Archivos estáticos
├── .env.local                  # Variables de entorno
├── next.config.js              # Configuración Next.js
├── tailwind.config.js          # Configuración Tailwind
└── package.json                # Dependencias
```

## Configuración

### Variables de Entorno

Configurar en `.env.local`:

```env
# Auth0 Configuration
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://dev-correos-masivos.us.auth0.com'
AUTH0_CLIENT_ID='your-auth0-client-id'
AUTH0_CLIENT_SECRET='your-auth0-client-secret'

# API Configuration
NEXT_PUBLIC_API_URL='http://localhost:8080/api'
```

### Auth0 Setup

1. Crear cuenta en Auth0
2. Configurar aplicación SPA
3. Configurar URLs de callback: `http://localhost:3000/api/auth/callback`
4. Configurar URLs de logout: `http://localhost:3000`
5. Actualizar variables de entorno

## Instalación y Ejecución

### Opción 1: Script Automático

```bash
cd frontend
start-frontend.bat
```

### Opción 2: Manual

```bash
cd frontend/admin-platform
npm install --legacy-peer-deps
npm run dev
```

### Resolución de Conflictos de Dependencias

Si encuentras errores de dependencias, usa:

```bash
npm install --legacy-peer-deps
```

Esto resuelve conflictos entre Next.js 15 y Auth0.

El frontend estará disponible en: `http://localhost:3000`

## Funcionalidades del Dashboard

### Dashboard Principal
- **Métricas en tiempo real**: Contactos, campañas, plantillas, emails enviados
- **Gráfico de barras**: Emails enviados por mes
- **Actividad reciente**: Últimas acciones del sistema
- **Diseño responsive**: Adaptable a diferentes tamaños de pantalla

### Autenticación
- **Login con Auth0**: Integración completa
- **Protección de rutas**: Solo usuarios autenticados
- **Información de usuario**: Nombre, email, foto de perfil
- **Logout seguro**: Cierre de sesión completo

### Navegación
- **Sidebar responsivo**: Navegación principal
- **Header con usuario**: Información y controles
- **Tema claro/oscuro**: Toggle entre temas
- **Rutas protegidas**: Acceso controlado

## Sistema de Diseño Xtrim

### Colores Principales
- **Primary**: `#6F1EAB` (Púrpura principal)
- **Secondary**: `#9C27B0` (Púrpura secundario)
- **Tertiary**: `#C2185B` (Rosa)
- **Accent**: `#FFD700` (Dorado)

### Componentes Estilizados
- **Botones**: Primarios (dorado) y secundarios (transparente)
- **Cards**: Efecto glass con backdrop blur
- **Gradientes**: Degradado de colores principales
- **Tipografía**: Inter como fuente principal

## Próximos Pasos

Las siguientes tareas incluyen:

- **Tarea 5.2**: Módulo de Gestión de Contactos
- **Tarea 5.3**: Módulo de Campañas
- **Tarea 5.4**: Editor de Plantillas y Dashboard avanzado

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construcción para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linting del código