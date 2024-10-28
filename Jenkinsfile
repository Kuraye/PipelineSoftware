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
                if (fileExists('PolicyDocument.pdf')) {
                    echo "File exists"
                } else {
                    echo "Policy document missing"
                }
    }
}
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying'
            }
        }
    }
}
