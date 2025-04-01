# Étape 1 : Construction du projet avec Maven
FROM maven:3.9-eclipse-temurin-8-alpine AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline

COPY src /app/src
RUN mvn clean package -DskipTests

# Étape 2 : Déploiement de l'application avec un serveur de servlet (Tomcat)
FROM tomcat:9.0-jdk8-openjdk-slim
WORKDIR /usr/local/tomcat/webapps
COPY --from=builder /app/target/cloud-crypto-back-java.war ./ROOT.war

# Exposer le port par défaut de Tomcat
EXPOSE 8080

# Commande pour démarrer Tomcat
CMD ["catalina.sh", "run"]

