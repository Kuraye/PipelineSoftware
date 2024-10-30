pipeline {
    agent any
    tools {
        nodejs '22.9.0'
    }
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/Kuraye/PipelineSoftware.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Test Leadership') {
            steps {
                script {
                    if (fileExists('PolicyDocument.pdf')) {
                        echo "5.1.A. ✅ Policy document found"
                    } else {
                        echo "5.1.A. ❌ Policy document missing"
                    }
                }
            }
        }
        stage('Deploy to Container') {
            steps {
                script {
                    // Deploy the image to your container platform
                    withDockerContainer([image: 'glassfish', containers: 'Deployserver']) {
                        // Additional steps for deployment (e.g., starting the container, configuring services)
                        sh 'docker start Deployserver'
                    }
                }
            }
        }
    }
}
