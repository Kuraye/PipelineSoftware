pipeline {
    agent any
    tools {
        NodeJS '22.9.0'
    }
    stages {
        // Clean Workspace stage
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        // Other stages
        stage('Checkout') {
            steps {
                git url: 'https://github.com/Kuraye/PipelineSoftware.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install --save-dev jest pdf-parse csv-parser'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Test') {         
             steps {
                sh 'npm test'          
            }
        }
        stage('Deploy to Container') {
            steps {
                script {
                    // Deploy the image to your container platform
                    //withDockerContainer(image: 'glassfish', serverName: 'Deployserver') {
                    //    // Additional steps for deployment (e.g., starting the container, configuring services)
                    //    //sh 'docker start Deployserver'
                    //}
                    echo 'deploying...'
                }
            }
        }
    }
} 
