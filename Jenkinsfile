pipeline {
    agent any

    stages {
        // Clean Workspace stage
        stage('Clean Workspace') {
            steps {
                cleanWs() // Remove contents of workspace before each build
            }
        }

        // Checkout Code stage
        stage('Checkout Code') {
            steps {
                git url: 'https://github.com/Kuraye/PipelineSoftware.git' // Fetch code from Git repository
            }
        }

        // Install Dependencies stage
        stage('Install Dependencies') {
            steps {
                node(label: 'nodejs') { // Use specific Node.js version for dependencies
                    sh 'npm install --save-dev jest pdf-parse' // Install required development dependencies
                }
            }
        }

        // Build stage
        stage('Build') {
            steps {
                sh 'npm run build' // Execute the build script defined in your package.json
            }
        }

        // Deploy to Container stage (Optional)
        stage('Deploy to Container') {
            when {
                expression { // Optional condition for deployment (e.g., only on successful builds)
                    return env.BRANCH_NAME == 'master' // Example: Deploy only on master branch
                }
            }
            steps {
                script {
                    echo 'Add deployment stage here.'
                }
            }
        }
    }
}
