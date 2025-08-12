# Dockerfile para desarrollo
FROM openjdk:17-jdk-slim

WORKDIR /app

RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Copiar todo el proyecto
COPY . .

# Compilar aplicación
RUN mvn clean package -DskipTests -pl microservicios/email-service -am

EXPOSE 8084

CMD ["java", "-jar", "/app/microservicios/email-service/target/email-service-1.0.0-SNAPSHOT.jar"]