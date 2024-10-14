FROM docker.io/jenkins/jenkins:latest

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Expose the Jenkins port
EXPOSE 8080

# Command to run Jenkins
CMD ["java", "-jar", "/usr/share/jenkins/jenkins.war"]
