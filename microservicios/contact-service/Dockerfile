# Dockerfile para desarrollo
FROM openjdk:17-jdk-slim

WORKDIR /app

# Instalar Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Copiar todo el proyecto
COPY . .

# Compilar aplicación
RUN mvn clean package -DskipTests -pl microservicios/contact-service -am

# Exponer puerto
EXPOSE 8082

# Comando de inicio
CMD ["java", "-jar", "/app/microservicios/contact-service/target/contact-service-1.0.0-SNAPSHOT.jar"]