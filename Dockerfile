# Stage 1: Install Node.js (temporary)
FROM ubuntu:latest AS builder

RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Stage 2: Copy Node.js and Jenkins
FROM docker.io/jenkins/jenkins:latest

COPY --from=builder /usr/bin/node /usr/bin/node
COPY --from=builder /usr/lib/node_modules /usr/lib/node_modules

# Expose Jenkins port
EXPOSE 8080

# Command to run Jenkins
CMD ["java", "-jar", "/usr/share/jenkins/jenkins.war"]
