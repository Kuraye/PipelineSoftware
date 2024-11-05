pipeline {
    agent any
    tools {
        nodejs '22.9.0'
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
                    def reportFile = 'test_report.txt'
                    writeFile file: reportFile, text: "# This document has the results if the application complies with the ISO 27001 and NEN 7510\n"
        
                    if (fileExists('PolicyDocument.pdf')) {
                        def content = readFile(file: reportFile)
                        content += "\n5.1.A. Policy document exists\n"
        
                        def fileContent = readFile('PolicyDocument.pdf').toLowerCase()
                        if (fileContent.contains('commitment to compliance')) {
                            content += "\n5.2.C. Policy document contains Commitment to compliance\n"
                        } else {
                            content += "\n[!] 5.2.C. Policy document does not contain Commitment to compliance\n"
                        }
        
                        if (fileContent.contains('organization specific')) {
                            content += "\n5.2.A. Policy document is tailored\n"
                        } else {
                            content += "\n[!] 5.2.A. Policy document is not tailored\n"
                        }
        
                        writeFile file: reportFile, text: content
                    } else {
                        def content = readFile(file: reportFile)
                        content += "\n[!] Policy document does not exist\n"
                        writeFile file: reportFile, text: content
                    }
                }
            }
        }
        stage('Deploy to Container') {
            steps {
                script {
                    // Deploy the image to your container platform
                    //withDockerContainer(image: 'glassfish', serverName: 'Deployserver') {
                    //  // Additional steps for deployment (e.g., starting the container, configuring services)
                    //  //sh 'docker start Deployserver'
                    //}
                    echo 'deploying...'
                }
            }
        }
    }
}
