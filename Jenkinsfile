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
          when { expression { return fileExists ('PolicyDocument.pdf') } }
          steps {
               echo "file exists"
              }
        }
      }
    }
    stage('Deploy') {
      steps {
        echo 'deploying'
      }
    }
  }
}
