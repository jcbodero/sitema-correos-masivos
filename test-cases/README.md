# Casos de Prueba - Sistema de Correos Masivos

Este directorio contiene casos de prueba completos para todos los microservicios del sistema de correos masivos.

## Estructura de Pruebas

### 1. Pruebas Unitarias por Microservicio

#### UserServiceTest.java
- ✅ Health check del servicio
- ✅ Login con credenciales válidas
- ✅ Login con credenciales inválidas
- ✅ Validación de campos vacíos

#### ContactServiceTest.java
- ✅ Health check del servicio
- ✅ Creación de contactos válidos
- ✅ Validación de email inválido
- ✅ Obtención de contactos paginados
- ✅ Creación de listas de contactos
- ✅ Importación CSV
- ✅ Estadísticas de contactos
- ✅ Desuscripción de contactos
- ✅ Gestión de listas

#### EmailServiceTest.java
- ✅ Health check del servicio
- ✅ Envío de email individual
- ✅ Validación de email inválido
- ✅ Envío masivo de emails
- ✅ Estadísticas de emails
- ✅ Reintentos de emails fallidos
- ✅ Webhooks de delivery
- ✅ Estadísticas en tiempo real
- ✅ Historial de envíos

#### CampaignServiceTest.java
- ✅ Health check del servicio
- ✅ Creación de campañas
- ✅ Validación de campos requeridos
- ✅ Obtención de campañas con filtros
- ✅ Programación de campañas
- ✅ Control de estado (start/pause/cancel)
- ✅ Gestión de destinatarios
- ✅ Duplicación de campañas
- ✅ Estadísticas de campañas

#### TemplateServiceTest.java
- ✅ Health check del servicio
- ✅ Creación de plantillas
- ✅ Validación de campos requeridos
- ✅ Renderizado de plantillas
- ✅ Preview de plantillas
- ✅ Validación de plantillas
- ✅ Estadísticas de plantillas
- ✅ Duplicación de plantillas

### 2. Pruebas de Integración

#### IntegrationTest.java
- ✅ Flujo completo de envío de emails
- ✅ Health checks de todos los servicios via API Gateway
- ✅ Flujo de envío masivo
- ✅ Manejo de errores

### 3. Pruebas de Rendimiento

#### PerformanceTest.java
- ✅ Creación masiva de contactos (100 contactos concurrentes)
- ✅ Envío masivo de emails (50 destinatarios)
- ✅ Operaciones concurrentes de campañas (20 campañas)
- ✅ Monitoreo de uso de memoria

### 4. Pruebas de Seguridad

#### SecurityTest.java
- ✅ Protección contra SQL Injection
- ✅ Protección contra XSS
- ✅ Control de acceso no autorizado
- ✅ Rechazo de payloads masivos
- ✅ Protección contra Email Injection
- ✅ Rate limiting
- ✅ Validación de content-type
- ✅ Protección contra path traversal
- ✅ Protección de datos sensibles

## Ejecución de Pruebas

### Prerrequisitos
```bash
# Asegurar que la infraestructura esté ejecutándose
cd config
start-infrastructure.bat

# Compilar el proyecto
mvn clean compile
```

### Ejecutar Todas las Pruebas
```bash
# Desde el directorio raíz del proyecto
mvn test

# O ejecutar pruebas específicas
mvn test -Dtest=UserServiceTest
mvn test -Dtest=ContactServiceTest
mvn test -Dtest=EmailServiceTest
mvn test -Dtest=CampaignServiceTest
mvn test -Dtest=TemplateServiceTest
```

### Ejecutar Pruebas de Integración
```bash
mvn test -Dtest=IntegrationTest
```

### Ejecutar Pruebas de Rendimiento
```bash
mvn test -Dtest=PerformanceTest
```

### Ejecutar Pruebas de Seguridad
```bash
mvn test -Dtest=SecurityTest
```

## Configuración de Pruebas

### Base de Datos de Pruebas
Las pruebas utilizan H2 en memoria para evitar conflictos con la base de datos de desarrollo:

```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=create-drop
```

### Perfiles de Prueba
```properties
# application-test.properties
spring.profiles.active=test
logging.level.com.correos.masivos=DEBUG
```

## Métricas de Cobertura

### Objetivos de Cobertura
- **Cobertura de Líneas**: > 80%
- **Cobertura de Ramas**: > 70%
- **Cobertura de Métodos**: > 85%

### Generar Reporte de Cobertura
```bash
mvn jacoco:report
```

El reporte se genera en: `target/site/jacoco/index.html`

## Casos de Prueba por Funcionalidad

### Gestión de Contactos
- [x] CRUD básico de contactos
- [x] Validación de emails
- [x] Importación CSV/Excel
- [x] Gestión de listas
- [x] Suscripción/Desuscripción
- [x] Búsqueda y filtrado
- [x] Estadísticas

### Gestión de Campañas
- [x] CRUD básico de campañas
- [x] Estados de campaña
- [x] Programación de envíos
- [x] Gestión de destinatarios
- [x] Duplicación
- [x] Métricas y reportes

### Envío de Emails
- [x] Envío individual
- [x] Envío masivo
- [x] Tracking de eventos
- [x] Reintentos automáticos
- [x] Webhooks
- [x] Estadísticas en tiempo real

### Gestión de Plantillas
- [x] CRUD básico de plantillas
- [x] Renderizado con variables
- [x] Validación de sintaxis
- [x] Preview
- [x] Duplicación

## Automatización CI/CD

### GitHub Actions
```yaml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up JDK 17
        uses: actions/setup-java@v2
        with:
          java-version: '17'
      - name: Run tests
        run: mvn test
      - name: Generate coverage report
        run: mvn jacoco:report
```

## Mejores Prácticas Implementadas

1. **Aislamiento**: Cada prueba es independiente
2. **Datos de Prueba**: Uso de factories y builders
3. **Mocking**: MockBean para dependencias externas
4. **Assertions**: Uso de AssertJ para mejor legibilidad
5. **Cleanup**: Limpieza automática entre pruebas
6. **Documentación**: Nombres descriptivos y comentarios
7. **Cobertura**: Casos positivos y negativos
8. **Performance**: Pruebas de carga y estrés
9. **Security**: Validación de vulnerabilidades comunes

## Próximos Pasos

- [ ] Pruebas de carga con JMeter
- [ ] Pruebas de contrato con Pact
- [ ] Pruebas de mutación con PIT
- [ ] Pruebas de accesibilidad
- [ ] Pruebas de compatibilidad de navegadores (frontend)