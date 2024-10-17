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
        sh 'if grep -q "security requirements" /path/to/BPM/config.yaml; then echo "Security requirements integrated"; else echo "Security requirements missing"; fi'
        sh 'if grep -q "information_security" /path/to/resource_management/data.csv; then echo "Resources assigned"; else echo "Resources not assigned"; fi'
        sh 'if grep -q "information security" /path/to/intranet/news_feed.html; then echo "Security news communicated"; else echo "Security news not communicated"; fi'
        sh 'if curl -s http://kpi-dashboard.local/api/v1/objectives | grep -q "information_security"; then echo "ISMS objectives tracked"; else echo "ISMS objectives not tracked"; fi'
            
      }
    }
    stage('Deploy') {
      steps {
        echo 'deploying'
      }
    }
  }
}
