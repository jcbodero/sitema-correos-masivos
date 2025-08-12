# API de Estadísticas de Correos - Documentación

## Descripción General

El sistema de estadísticas de correos proporciona métricas detalladas sobre el rendimiento de las campañas de email marketing, incluyendo tasas de entrega, apertura, clics y rebotes.

## Endpoints Disponibles

### 1. Estadísticas Básicas

#### GET `/api/emails/stats`
Obtiene estadísticas básicas globales o por campaña.

**Parámetros:**
- `campaignId` (opcional): ID de la campaña específica

**Respuesta:**
```json
{
  "totalEmails": 1000,
  "sentEmails": 950,
  "deliveredEmails": 900,
  "openedEmails": 450,
  "clickedEmails": 120,
  "bouncedEmails": 50,
  "failedEmails": 50
}
```

### 2. Estadísticas Detalladas

#### GET `/api/emails/stats/detailed`
Obtiene estadísticas detalladas con tasas calculadas y desglose por estado.

**Parámetros:**
- `campaignId` (opcional): ID de la campaña específica
- `fromDate` (opcional): Fecha de inicio (YYYY-MM-DD)
- `toDate` (opcional): Fecha de fin (YYYY-MM-DD)

**Respuesta:**
```json
{
  "totalEmails": 1000,
  "sentEmails": 950,
  "deliveredEmails": 900,
  "openedEmails": 450,
  "clickedEmails": 120,
  "bouncedEmails": 50,
  "failedEmails": 50,
  "deliveryRate": 94.74,
  "openRate": 50.0,
  "clickRate": 26.67,
  "bounceRate": 5.26,
  "campaignId": 1,
  "fromDate": "2024-01-01T00:00:00",
  "toDate": "2024-12-31T23:59:59",
  "statusBreakdown": {
    "SENT": 950,
    "DELIVERED": 900,
    "OPENED": 450,
    "CLICKED": 120,
    "BOUNCED": 50,
    "FAILED": 50
  }
}
```

### 3. Estadísticas en Tiempo Real

#### GET `/api/emails/stats/realtime`
Obtiene estadísticas actualizadas en tiempo real con timestamp.

**Parámetros:**
- `campaignId` (opcional): ID de la campaña específica

**Respuesta:**
```json
{
  "totalEmails": 1000,
  "sentEmails": 950,
  "deliveredEmails": 900,
  "openedEmails": 450,
  "clickedEmails": 120,
  "bouncedEmails": 50,
  "failedEmails": 50,
  "deliveryRate": 94.74,
  "openRate": 50.0,
  "clickRate": 26.67,
  "bounceRate": 5.26,
  "timestamp": "2024-01-15T14:30:00",
  "type": "realtime",
  "campaignId": 1
}
```

## Métricas Calculadas

### Tasas de Rendimiento

1. **Tasa de Entrega (Delivery Rate)**
   - Fórmula: `(Emails Entregados / Emails Enviados) × 100`
   - Indica el porcentaje de emails que llegaron exitosamente

2. **Tasa de Apertura (Open Rate)**
   - Fórmula: `(Emails Abiertos / Emails Entregados) × 100`
   - Indica el porcentaje de emails que fueron abiertos

3. **Tasa de Clics (Click Rate)**
   - Fórmula: `(Emails con Clics / Emails Abiertos) × 100`
   - Indica el porcentaje de emails abiertos que generaron clics

4. **Tasa de Rebote (Bounce Rate)**
   - Fórmula: `(Emails Rebotados / Emails Enviados) × 100`
   - Indica el porcentaje de emails que no pudieron ser entregados

## Estados de Email

- **PENDING**: Email en cola para envío
- **SENDING**: Email en proceso de envío
- **SENT**: Email enviado exitosamente
- **DELIVERED**: Email entregado al destinatario
- **OPENED**: Email abierto por el destinatario
- **CLICKED**: Destinatario hizo clic en un enlace
- **BOUNCED**: Email rebotado (no entregado)
- **FAILED**: Error en el envío

## Filtros Disponibles

### Por Campaña
```
GET /api/emails/stats/detailed?campaignId=1
```

### Por Rango de Fechas
```
GET /api/emails/stats/detailed?fromDate=2024-01-01&toDate=2024-01-31
```

### Combinado
```
GET /api/emails/stats/detailed?campaignId=1&fromDate=2024-01-01&toDate=2024-01-31
```

## Ejemplos de Uso

### 1. Dashboard Principal
```javascript
// Obtener estadísticas globales en tiempo real
fetch('/api/emails/stats/realtime')
  .then(response => response.json())
  .then(stats => {
    updateDashboard(stats);
  });
```

### 2. Reporte de Campaña
```javascript
// Obtener estadísticas detalladas de una campaña
fetch('/api/emails/stats/detailed?campaignId=1')
  .then(response => response.json())
  .then(stats => {
    generateCampaignReport(stats);
  });
```

### 3. Análisis Temporal
```javascript
// Obtener estadísticas por período
fetch('/api/emails/stats/detailed?fromDate=2024-01-01&toDate=2024-01-31')
  .then(response => response.json())
  .then(stats => {
    createTimeSeriesChart(stats);
  });
```

## Optimizaciones de Rendimiento

### Índices de Base de Datos
- Índices compuestos para consultas por campaña y fecha
- Índices específicos para conteos por estado
- Vista materializada para estadísticas frecuentes

### Caché
- Las estadísticas se pueden cachear usando Redis
- TTL recomendado: 5 minutos para tiempo real, 1 hora para históricas

### Paginación
- Para grandes volúmenes de datos, usar paginación
- Límite recomendado: 1000 registros por consulta

## Webhooks para Actualización Automática

El sistema actualiza automáticamente las estadísticas mediante webhooks:

- **Delivery**: Actualiza estado a DELIVERED
- **Open**: Actualiza estado a OPENED  
- **Click**: Actualiza estado a CLICKED
- **Bounce**: Actualiza estado a BOUNCED

## Monitoreo y Alertas

### Métricas Clave a Monitorear
- Tasa de entrega < 95%
- Tasa de rebote > 5%
- Emails fallidos > 2%
- Tiempo de respuesta de APIs > 500ms

### Alertas Recomendadas
- Caída significativa en tasa de entrega
- Aumento súbito en rebotes
- Fallas masivas en envío

## Integración con Frontend

### Componentes Recomendados
1. **Dashboard de Métricas**: Gráficos en tiempo real
2. **Tabla de Campañas**: Lista con estadísticas básicas
3. **Reportes Detallados**: Análisis profundo por campaña
4. **Alertas**: Notificaciones de problemas

### Librerías Sugeridas
- **Chart.js**: Para gráficos y visualizaciones
- **React Query**: Para manejo de estado y caché
- **Socket.io**: Para actualizaciones en tiempo real

## Troubleshooting

### Problemas Comunes
1. **Estadísticas no actualizan**: Verificar webhooks
2. **Consultas lentas**: Revisar índices de BD
3. **Datos inconsistentes**: Ejecutar migración V5

### Logs Importantes
```bash
# Ver logs de estadísticas
tail -f logs/email-service.log | grep "stats"

# Verificar webhooks
tail -f logs/email-service.log | grep "webhook"
```