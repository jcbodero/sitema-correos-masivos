# Dockerfile para desarrollo
FROM openjdk:17-jdk-slim

WORKDIR /app

# Instalar Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Copiar todo el proyecto
COPY . .

# Instalar POM padre y compilar aplicación
RUN mvn clean install -N && mvn clean package -DskipTests -pl microservicios/user-service -am

# Exponer puerto
EXPOSE 8081

# Comando de inicio
CMD ["java", "-jar", "/app/microservicios/user-service/target/user-service-1.0.0-SNAPSHOT.jar"]