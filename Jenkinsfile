pipeline {
    agent any

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                git url: 'https://github.com/Kuraye/PipelineSoftware.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install --save-dev jest pdf-parse csv-parse'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npx jest'
            }
        }

        stage('Deploy to Container') {
            when {
                expression {
                    return env.BRANCH_NAME == 'master'
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
