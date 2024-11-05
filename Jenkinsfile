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
                    writeFile(file: reportFile, text: "# This document has the results if the application complies with the ISO 27001 and NEN 7510\n")

                    if (fileExists('PolicyDocument.pdf')) {
                        writeFile(file: reportFile, text: "5.1.A. Policy document exists\n", append: true)

                        def fileContent = readFile('PolicyDocument.pdf').toLowerCase() // Convert to lowercase for case-insensitive comparison
                        writeFile(file: reportFile, text: "5.2.A. ${fileContent.contains('organization specific') ? 'Policy document is tailored' : '[!] Policy document is not tailored'}\n", append: true)
                        writeFile(file: reportFile, text: "5.2.C. ${fileContent.contains('commitment to compliance') ? 'Policy document contains commitment to compliance' : '[!] Policy document does not contain commitment to compliance'}\n", append: true)
                    } else {
                        writeFile(file: reportFile, text: "[!] 5.1.A. Policy document missing\n", append: true)
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
