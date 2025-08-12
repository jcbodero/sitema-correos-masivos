# Módulo de Editor de Plantillas y Dashboard Avanzado

Módulo completo para la gestión y edición de plantillas de correo electrónico con dashboard avanzado.

## ✅ Funcionalidades Implementadas

### 📄 Páginas y Rutas

- **`/dashboard/templates`** - Página principal con grid de plantillas
- **`/dashboard/templates/new`** - Editor para nueva plantilla
- **`/dashboard/templates/[id]`** - Detalle de plantilla con preview
- **`/dashboard/templates/[id]/edit`** - Editor para plantilla existente

### 🗂️ Componentes Principales

#### TemplatesPage.tsx
- Grid responsive de plantillas con filtros
- Métricas por estado (activas, borradores, archivadas)
- Búsqueda en tiempo real por nombre y asunto
- Filtros por estado de plantilla
- Acciones: ver, editar, duplicar, eliminar
- Datos mock con 5 plantillas de ejemplo

#### TemplateEditor.tsx
- **Editor HTML completo** con textarea de código
- **Toggle Editor/Preview** con vista responsive
- **Sistema de variables dinámicas**:
  - Sidebar con variables disponibles
  - Inserción automática en posición del cursor
  - Agregar/eliminar variables personalizadas
- **Preview en tiempo real**:
  - Vista desktop y mobile
  - Datos de muestra para variables
  - Renderizado HTML completo
- **Información de plantilla**:
  - Contador de caracteres
  - Número de variables
  - Estado de plantilla
- **Plantilla base HTML** predefinida con estilos

#### TemplateDetailPage.tsx
- Vista completa de información de plantilla
- **Preview responsive** con toggle desktop/mobile
- **Toggle Preview/Código** para ver HTML fuente
- Información detallada (fechas, variables, estado)
- Lista de variables disponibles con formato
- Acciones: editar, duplicar, eliminar
- Versión de texto plano si está disponible

### 🎨 Sistema de Variables Dinámicas

#### Variables Predefinidas
- `{{firstName}}` - Nombre del contacto
- `{{lastName}}` - Apellido del contacto
- `{{company}}` - Empresa del contacto
- `{{email}}` - Email del contacto
- `{{unsubscribeUrl}}` - URL de baja
- `{{actionUrl}}` - URL de acción principal

#### Gestión de Variables
- **Agregar variables personalizadas** desde el editor
- **Inserción automática** en posición del cursor
- **Eliminación** de variables no utilizadas
- **Preview con datos de muestra** para todas las variables
- **Validación** de variables en plantilla

### 📊 Dashboard Avanzado

#### Métricas en Tiempo Real
- **Actualización automática cada 30 segundos**
- **Timestamp de última actualización**
- **Variación aleatoria** para simular datos reales
- Métricas principales:
  - Total de contactos
  - Total de campañas
  - Total de plantillas
  - Emails enviados

#### Características Avanzadas
- **Gráficos interactivos** con Recharts
- **Actividad reciente** del sistema
- **Estados de carga** con skeletons
- **Responsive design** completo

### 🔧 Funcionalidades Técnicas

#### Editor de Plantillas
- **Textarea con sintaxis HTML**
- **Inserción de variables** en posición del cursor
- **Preview en tiempo real** con renderizado HTML
- **Toggle responsive** desktop/mobile
- **Guardado de estado** entre navegación
- **Validación básica** de contenido

#### Gestión de Estados
- **Draft**: Plantilla en desarrollo
- **Active**: Plantilla lista para usar
- **Archived**: Plantilla archivada
- **Badges visuales** con colores específicos

#### Sistema de Preview
- **Renderizado HTML completo** con estilos
- **Datos de muestra** para variables
- **Vista responsive** adaptativa
- **Toggle código fuente** para debugging

### 🎨 Diseño y UX

#### Sistema de Diseño Xtrim
- **Colores consistentes** con paleta principal
- **Efectos glass** en componentes
- **Gradientes** de fondo
- **Iconografía** con Heroicons

#### Responsive Design
- **Grid adaptativo** para plantillas
- **Editor responsive** con sidebar
- **Preview adaptativo** desktop/mobile
- **Modal responsive** para confirmaciones

#### Estados Visuales
- **Loading skeletons** para carga
- **Badges de estado** coloridos
- **Indicadores de progreso**
- **Transiciones suaves**

### 📡 Integración con API

#### Métodos Implementados
```typescript
// Plantillas
apiClient.getTemplates()
apiClient.getTemplate(id)
apiClient.createTemplate(template)
apiClient.updateTemplate(id, template)
apiClient.deleteTemplate(id)
apiClient.duplicateTemplate(id)
apiClient.previewTemplate(id, data)
```

#### Datos Mock
- **5 plantillas de ejemplo** con diferentes propósitos
- **Variables realistas** por plantilla
- **Estados variados** (active, draft, archived)
- **Fechas de creación** y actualización

### 🚀 Características Avanzadas

#### Editor Inteligente
- **Plantilla base HTML** con estilos predefinidos
- **Sistema de variables** con inserción automática
- **Preview en tiempo real** con datos de muestra
- **Información contextual** en sidebar

#### Gestión Avanzada
- **Duplicación** de plantillas existentes
- **Filtros múltiples** por estado y búsqueda
- **Acciones en lote** preparadas
- **Navegación intuitiva** entre vistas

#### Dashboard Mejorado
- **Actualización automática** cada 30 segundos
- **Métricas dinámicas** con variación
- **Timestamp** de última actualización
- **Gráficos interactivos** mantenidos

### 🔄 Flujo de Trabajo

#### Crear Plantilla
1. Clic en "Nueva Plantilla"
2. Completar información básica
3. Editar HTML con variables
4. Preview responsive
5. Guardar plantilla

#### Editar Plantilla
1. Seleccionar plantilla existente
2. Clic en "Editar"
3. Modificar contenido y variables
4. Preview cambios
5. Actualizar plantilla

#### Gestionar Plantillas
1. Ver grid de plantillas
2. Filtrar por estado o buscar
3. Usar acciones (ver, editar, duplicar)
4. Cambiar estados según necesidad

### 🎯 Próximas Mejoras

- **Editor WYSIWYG** con TinyMCE
- **Plantillas predefinidas** por categoría
- **Sistema de versiones** de plantillas
- **Marketplace** de plantillas
- **Importación/Exportación** de plantillas
- **Test de spam score** integrado
- **Optimización de imágenes** automática

## 📁 Estructura de Archivos

```
src/components/templates/
├── TemplatesPage.tsx         # Página principal con grid
├── TemplateEditor.tsx        # Editor completo con preview
├── TemplateDetailPage.tsx    # Detalle con información completa
└── README.md                 # Esta documentación
```

## 🔗 Navegación

El módulo se integra con el sidebar principal mostrando subitems:

- **Todas las Plantillas** → `/dashboard/templates`
- **Nueva Plantilla** → `/dashboard/templates/new`

## 📊 Datos de Ejemplo

### Plantillas Mock
- **Newsletter Básico**: Plantilla activa con 5 variables
- **Promocional Ventas**: Plantilla activa para ofertas
- **Encuesta Satisfacción**: Borrador con 2 variables
- **Bienvenida Nuevos Usuarios**: Plantilla activa de onboarding
- **Recordatorio Evento**: Plantilla archivada con 4 variables

### Variables Comunes
- `{{firstName}}`, `{{lastName}}` - Datos personales
- `{{company}}`, `{{email}}` - Información de contacto
- `{{month}}`, `{{eventDate}}` - Datos temporales
- `{{actionUrl}}`, `{{unsubscribeUrl}}` - URLs funcionales

El módulo está completamente funcional y listo para crear, editar y gestionar plantillas de correo electrónico con un sistema avanzado de variables y preview responsive.