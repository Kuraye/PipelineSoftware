FROM jenkins/jenkins:latest

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Copy your Jenkins configuration files here
COPY jenkins_home.xml /var/jenkins_home/jenkins.xml

# Expose the Jenkins port
EXPOSE 8080

# Command to run Jenkins
CMD ["java", "-jar", "/usr/share/jenkins/jenkins.war"]
