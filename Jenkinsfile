pipeline {
    agent any
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
                script {
                    nodejs {
                        sh 'npm install --save-dev jest pdf-parse csv-parser'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    nodejs {
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    nodejs {
                        sh 'npm test'
                    }
                }
            }
        }

        stage('Deploy to Container') {
            steps {
                script {
                    // Replace with your deployment script/commands
                    // withDockerContainer(image: 'glassfish', serverName: 'Deployserver') {
                    //     // Additional steps for deployment (e.g., starting the container, configuring services)
                    //     // sh 'docker start Deployserver'
                    // }
                    echo 'deploying...'
                }
            }
        }
    }
}
