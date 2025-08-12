# Dockerfile para desarrollo
FROM openjdk:17-jdk-slim

WORKDIR /app

RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Copiar todo el proyecto
COPY . .

# Compilar aplicación
RUN mvn clean package -DskipTests -pl microservicios/campaign-service -am

EXPOSE 8083

CMD ["java", "-jar", "/app/microservicios/campaign-service/target/campaign-service-1.0.0-SNAPSHOT.jar"]