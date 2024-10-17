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
     stage('Test') {
      steps {
        sh 'if [[ -f /path/to/policy/document.pdf ]]; then echo "Policy document exists"; else echo "Policy document missing"; fi'
            
      }
    }
    stage('Deploy') {
      steps {
        echo 'deploying'
      }
    }
  }
}
