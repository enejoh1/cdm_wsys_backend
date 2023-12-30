# Sử dụng image chứa Gradle để build dự án
FROM gradle:7.2.0-jdk11 AS builder

WORKDIR /app

COPY . .

RUN gradle build

# Sử dụng image chứa OpenJDK để chạy ứng dụng
FROM openjdk:11-jre-slim

WORKDIR /app

COPY --from=builder /app/build/libs/wsys-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
