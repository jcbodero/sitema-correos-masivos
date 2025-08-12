# Módulo de Gestión de Campañas

Módulo completo para la gestión de campañas de correo masivo en la plataforma administrativa.

## ✅ Funcionalidades Implementadas

### 📄 Páginas y Rutas

- **`/dashboard/campaigns`** - Página principal con tabla de campañas
- **`/dashboard/campaigns/new`** - Wizard de creación de campaña
- **`/dashboard/campaigns/[id]`** - Detalle individual de campaña
- **`/dashboard/campaigns/[id]/edit`** - Edición de campaña existente

### 🗂️ Componentes Principales

#### CampaignsPage.tsx
- Tabla de campañas con filtros y búsqueda
- Métricas generales (total campañas, emails enviados, tasas)
- Gestión de estados de campaña (draft, scheduled, sending, sent, paused)
- Acciones por estado (pausar, reanudar, cancelar, eliminar)
- Filtros por estado y búsqueda por nombre/asunto

#### CampaignWizard.tsx
- **Wizard de 5 pasos** para crear/editar campañas:
  1. **Información Básica**: Nombre, asunto, remitente
  2. **Destinatarios**: Selección de listas de contactos
  3. **Contenido**: Selector de plantillas
  4. **Programación**: Envío inmediato vs programado
  5. **Revisión**: Confirmación final
- Navegación entre pasos con indicadores de progreso
- Validación por pasos
- Guardado de datos entre pasos

#### CampaignDetailPage.tsx
- Vista completa de métricas de campaña
- Gráficos interactivos (barras y pie charts)
- Estadísticas detalladas:
  - Enviados, entregados, abiertos, clics, rebotes
  - Tasas de entrega, apertura, clic, rebote
  - CTR (Click-through Rate)
- Información de campaña (fechas, plantilla, listas)
- Acciones disponibles (preview, exportar, duplicar)

#### CampaignPreview.tsx
- Vista previa responsive (desktop/mobile)
- Simulación de email con header completo
- Toggle entre vistas de dispositivo
- Contenido de muestra personalizable

### 🎯 Gestión de Estados

#### Estados de Campaña
- **Draft**: Borrador editable
- **Scheduled**: Programada para envío futuro
- **Sending**: En proceso de envío
- **Sent**: Enviada completamente
- **Paused**: Pausada temporalmente

#### Transiciones de Estado
- **Draft** → **Scheduled**: Programar campaña
- **Sending** → **Paused**: Pausar envío
- **Paused** → **Sending**: Reanudar envío
- **Scheduled/Sending** → **Draft**: Cancelar

#### Acciones por Estado
- **Draft**: Editar, Programar, Eliminar
- **Scheduled**: Cancelar, Eliminar
- **Sending**: Pausar, Cancelar
- **Paused**: Reanudar, Cancelar
- **Sent**: Ver detalle, Duplicar, Eliminar

### 📊 Métricas y Analytics

#### Dashboard Principal
- Total de campañas
- Emails enviados totales
- Tasa de apertura promedio
- Tasa de clic promedio

#### Métricas por Campaña
- **Enviados**: Número total de emails enviados
- **Entregados**: Emails que llegaron al destinatario
- **Abiertos**: Emails abiertos por los destinatarios
- **Clics**: Enlaces clickeados en los emails
- **Rebotes**: Emails que no pudieron ser entregados

#### Gráficos Interactivos
- **Gráfico de Barras**: Rendimiento general de la campaña
- **Gráfico Circular**: Distribución de emails abiertos vs no abiertos
- **Tasas Calculadas**: Porcentajes automáticos de rendimiento

### 🔧 Funcionalidades Técnicas

#### Wizard de Creación
- Estado compartido entre pasos
- Validación progresiva
- Navegación bidireccional
- Indicadores visuales de progreso
- Guardado automático de datos

#### Gestión de Datos
- Datos mock integrados para desarrollo
- Estructura preparada para API backend
- Estados de loading y error
- Actualización optimista de UI

#### Filtrado y Búsqueda
- Filtro por estado de campaña
- Búsqueda en tiempo real por nombre y asunto
- Combinación de filtros
- Resultados dinámicos

### 🎨 Diseño y UX

#### Sistema de Diseño Xtrim
- Paleta de colores consistente
- Badges de estado con colores específicos
- Efectos glass en cards
- Iconografía con Heroicons

#### Responsive Design
- Tabla responsive con scroll horizontal
- Grid adaptativo para métricas
- Modal responsive para preview
- Wizard adaptativo para móviles

#### Estados Visuales
- Loading skeletons
- Badges de estado coloridos
- Indicadores de progreso
- Gráficos interactivos

### 📡 Integración con API

#### Métodos Implementados
```typescript
// Campañas
apiClient.getCampaigns()
apiClient.getCampaign(id)
apiClient.createCampaign(campaign)
apiClient.updateCampaign(id, campaign)
apiClient.deleteCampaign(id)
apiClient.updateCampaignStatus(id, status)
apiClient.duplicateCampaign(id)
```

#### Datos Mock
- 4 campañas de ejemplo con diferentes estados
- Métricas realistas de rendimiento
- Fechas y horarios variados
- Listas de contactos simuladas

### 🚀 Características Avanzadas

#### Wizard Inteligente
- Auto-guardado entre pasos
- Validación contextual
- Preview en tiempo real
- Navegación intuitiva

#### Gestión de Estados Dinámica
- Botones de acción contextuales
- Transiciones visuales suaves
- Confirmaciones de seguridad
- Actualizaciones en tiempo real

#### Analytics Avanzados
- Cálculos automáticos de tasas
- Comparación visual de métricas
- Gráficos interactivos con tooltips
- Exportación de datos (preparado)

### 🔄 Flujo de Trabajo

#### Crear Campaña
1. Clic en "Nueva Campaña"
2. Completar wizard paso a paso
3. Revisar información final
4. Crear y programar/enviar

#### Gestionar Campañas
1. Ver tabla con todas las campañas
2. Filtrar por estado o buscar
3. Usar acciones contextuales por estado
4. Ver detalles y métricas

#### Analizar Rendimiento
1. Acceder a detalle de campaña
2. Revisar métricas y gráficos
3. Comparar tasas de rendimiento
4. Exportar reportes (preparado)

### 🎯 Próximas Mejoras

- A/B Testing de campañas
- Campañas recurrentes/automatizadas
- Editor de contenido avanzado
- Segmentación dinámica de destinatarios
- Integración con analytics externos
- Plantillas de campaña personalizables
- Calendario de campañas programadas

## 📁 Estructura de Archivos

```
src/components/campaigns/
├── CampaignsPage.tsx         # Página principal
├── CampaignWizard.tsx        # Wizard de creación/edición
├── CampaignDetailPage.tsx    # Detalle con métricas
├── CampaignPreview.tsx       # Preview responsive
└── README.md                 # Esta documentación
```

## 🔗 Navegación

El módulo se integra con el sidebar principal mostrando subitems:

- **Todas las Campañas** → `/dashboard/campaigns`
- **Nueva Campaña** → `/dashboard/campaigns/new`

Cada página está protegida con Auth0 y mantiene el layout principal del dashboard.

## 📊 Datos de Ejemplo

### Estados de Campaña
- **Newsletter Enero 2024**: Enviada (1,250 enviados, 38% apertura)
- **Promoción San Valentín**: Programada para Feb 10
- **Encuesta de Satisfacción**: Borrador
- **Webinar Tecnología**: Enviando (450/800 enviados)

### Métricas Simuladas
- Total campañas: 4
- Emails enviados: 1,700+
- Tasa apertura promedio: 32%
- Tasa clic promedio: 8%