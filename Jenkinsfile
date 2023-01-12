pipeline {
    agent any 

    environment {
      ENVIRONMENT_TEST_FLAG = 'NO'
    }
    stages {
        stage('Init') { 
            steps { 
              script {
                BUILD_EXPRESSION = true
                DEPLOY_USER = 'liumiaocn'
              }
            }
        }
        stage('Build') { 
            steps { 
              script {
                if ( BUILD_EXPRESSION ) {
                    sh 'echo Build stage ...' 
                }
              }
            }
        }
        
        stage('Test'){
            steps {
              script {
                if ( ENVIRONMENT_TEST_FLAG == 'YES' ) {
                  sh 'echo Test stage ...' 
                }
              }
            }
        }
        
        stage('Deploy') {
            steps {
              script {
                if ( DEPLOY_USER == 'liumiaocn' ) {
                  sh 'echo Deploy stage ...' 
                }
              }
            }
        }
    }
  }
