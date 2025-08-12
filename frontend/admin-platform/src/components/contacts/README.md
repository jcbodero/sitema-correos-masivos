# Módulo de Gestión de Contactos

Módulo completo para la gestión de contactos en la plataforma administrativa.

## ✅ Funcionalidades Implementadas

### 📄 Páginas y Rutas

- **`/dashboard/contacts`** - Página principal con tabla de contactos
- **`/dashboard/contacts/import`** - Importación masiva de contactos
- **`/dashboard/contacts/lists`** - Gestión de listas de contactos
- **`/dashboard/contacts/[id]`** - Detalle individual de contacto

### 🗂️ Componentes Principales

#### ContactsPage.tsx
- Tabla de contactos con paginación y ordenamiento
- Búsqueda en tiempo real
- Filtros avanzados
- Selección múltiple con acciones en lote
- Métricas de contactos (total, activos, listas, segmentos)

#### ContactTable.tsx
- Tabla responsive con ordenamiento por columnas
- Paginación client-side (10 items por página)
- Selección individual y masiva
- Acciones por fila (ver, editar, eliminar)
- Estados visuales (activo/inactivo)
- Tags con límite de visualización

#### ContactFilters.tsx
- Filtros por estado (activo/inactivo)
- Filtro por rango de fechas
- Filtro por empresa
- Filtro múltiple por tags
- Badges de filtros activos
- Función de limpiar filtros

#### ContactForm.tsx
- Formulario modal para crear/editar contactos
- Validación de campos requeridos
- Validación de formato de email
- Campos: nombre, apellido, email, teléfono, empresa, dirección, tags, notas
- Manejo de errores con mensajes específicos

#### ContactImportPage.tsx
- Drag & drop para archivos CSV
- Preview de datos con primeras 5 filas
- Mapeo automático de columnas comunes
- Mapeo manual personalizable
- Simulación de importación con resultados
- Descarga de plantilla CSV

#### ContactListsPage.tsx
- Vista de grid de listas de contactos
- Métricas por lista (total contactos, promedio)
- CRUD básico de listas
- Modal de creación de listas
- Tags por lista

#### ContactDetailPage.tsx
- Vista completa de información del contacto
- Historial de emails enviados
- Estados de entrega (entregado, abierto, clic)
- Sección de tags editables
- Notas del contacto
- Información de actividad

### 🔧 Funcionalidades Técnicas

#### Gestión de Estado
- Estado local con React hooks
- Carga asíncrona de datos
- Estados de loading y error
- Actualización optimista de UI

#### Validación
- Validación de email con regex
- Campos requeridos (nombre, apellido, email)
- Mensajes de error específicos
- Validación en tiempo real

#### Filtrado y Búsqueda
- Búsqueda por nombre, apellido y email
- Filtros combinables
- Filtros persistentes con badges
- Limpieza individual y masiva de filtros

#### Importación de Datos
- Soporte para archivos CSV
- Detección automática de encoding
- Mapeo inteligente de columnas
- Preview antes de importar
- Reporte de resultados (importados, duplicados, errores)

### 🎨 Diseño y UX

#### Sistema de Diseño Xtrim
- Colores consistentes con la paleta principal
- Efectos glass en cards
- Gradientes de fondo
- Iconografía con Heroicons

#### Responsive Design
- Grid adaptativo (1-4 columnas según pantalla)
- Tabla responsive con scroll horizontal
- Modal adaptativo para móviles
- Navegación colapsible

#### Estados Visuales
- Loading skeletons
- Estados vacíos
- Badges de estado con colores
- Indicadores de progreso

### 📡 Integración con API

#### Métodos Implementados
```typescript
// Contactos
apiClient.getContacts()
apiClient.getContact(id)
apiClient.createContact(contact)
apiClient.updateContact(id, contact)
apiClient.deleteContact(id)
apiClient.importContacts(file)

// Listas
apiClient.getContactLists()
apiClient.createContactList(list)
apiClient.updateContactList(id, list)
apiClient.deleteContactList(id)
```

#### Manejo de Errores
- Try-catch en todas las operaciones
- Logging de errores en consola
- Mensajes de error para el usuario
- Fallbacks para datos no disponibles

### 🚀 Características Avanzadas

#### Selección Múltiple
- Checkbox en header para seleccionar todos
- Selección individual por fila
- Contador de elementos seleccionados
- Acciones en lote (eliminar)

#### Paginación Inteligente
- Navegación por páginas
- Información de elementos mostrados
- Botones de anterior/siguiente
- Cálculo automático de páginas totales

#### Ordenamiento
- Clic en headers para ordenar
- Indicador visual de columna activa
- Ordenamiento ascendente/descendente
- Soporte para múltiples tipos de datos

### 📊 Métricas y Analytics

#### Dashboard de Contactos
- Total de contactos
- Contactos activos vs inactivos
- Número de listas
- Número de segmentos

#### Métricas por Lista
- Contactos por lista
- Promedio de contactos
- Tags más utilizados
- Fechas de creación y actualización

### 🔄 Flujo de Trabajo

#### Crear Contacto
1. Clic en "Nuevo Contacto"
2. Completar formulario modal
3. Validación automática
4. Guardar y actualizar lista

#### Importar Contactos
1. Navegar a página de importación
2. Arrastrar archivo CSV o seleccionar
3. Revisar preview de datos
4. Mapear columnas si es necesario
5. Confirmar importación
6. Ver resultados detallados

#### Gestionar Listas
1. Navegar a página de listas
2. Ver grid de listas existentes
3. Crear nueva lista con modal
4. Editar o eliminar listas existentes

### 🎯 Próximas Mejoras

- Exportación de contactos a CSV/Excel
- Segmentación avanzada con query builder
- Merge de contactos duplicados
- Integración con CRM externos
- Analytics avanzados de engagement
- Automatización de tags basada en comportamiento

## 📁 Estructura de Archivos

```
src/components/contacts/
├── ContactsPage.tsx          # Página principal
├── ContactTable.tsx          # Tabla con funcionalidades
├── ContactFilters.tsx        # Filtros avanzados
├── ContactForm.tsx           # Formulario crear/editar
├── ContactImportPage.tsx     # Importación masiva
├── ContactListsPage.tsx      # Gestión de listas
├── ContactDetailPage.tsx     # Detalle individual
└── README.md                 # Esta documentación
```

## 🔗 Navegación

El módulo se integra con el sidebar principal mostrando subitems cuando está activo:

- **Todos los Contactos** → `/dashboard/contacts`
- **Importar** → `/dashboard/contacts/import`  
- **Listas** → `/dashboard/contacts/lists`

Cada página está protegida con Auth0 y mantiene el layout principal del dashboard.