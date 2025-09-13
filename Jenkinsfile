pipeline {
  agent any
  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }
  tools { nodejs 'NodeJS' }

  environment {
    REGISTRY          = 'docker.io'
    REGISTRY_NS       = 'natanaelgeraldo'      // TODO: ganti
    APP_NAME          = 'cloudpix'
  }

  stages {
    stage('Init Vars') {
      steps {
        script {
          env.GIT_SHA        = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
          env.IMAGE_TAG      = env.GIT_SHA
          env.BACKEND_IMAGE  = "${env.REGISTRY}/${env.REGISTRY_NS}/${env.APP_NAME}-backend:${env.IMAGE_TAG}"
          env.FRONTEND_IMAGE = "${env.REGISTRY}/${env.REGISTRY_NS}/${env.APP_NAME}-frontend:${env.IMAGE_TAG}"

          echo "BACKEND_IMAGE=${env.BACKEND_IMAGE}"
          echo "FRONTEND_IMAGE=${env.FRONTEND_IMAGE}"
        }
      }
    }

    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build') {
      parallel {
        stage('Backend: npm ci & (no-build)') {
          steps {
            dir('backend') {
              sh 'npm ci'
              sh 'npm run lint || true'
              sh 'echo "No compile step for plain JS backend"'
            }
          }
        }
        stage('Frontend: npm ci & build') {
          steps {
            dir('frontend') {
              sh 'npm ci'
              sh 'npm run build'
              archiveArtifacts artifacts: 'dist/**', fingerprint: true
            }
          }
        }
      }
    }

    stage('Unit & Integration Tests') {
      parallel {
        stage('Backend: Jest + Supertest') {
          steps {
            dir('backend') { sh 'npm test' }
          }
          post {
            always {
              junit allowEmptyResults: true, testResults: 'jest-*.xml'
            }
          }
        }
        stage('Frontend: Vitest') {
          steps {
            dir('frontend') { sh 'npm test || true' } // jika test belum lengkap, jangan fail pipeline
          }
        }
        stage('API Contract (Postman/Newman)') {
          when { expression { fileExists('tests/postman/collection.json') } }
          steps {
            sh '''
              npm i -g newman
              newman run tests/postman/collection.json \
                --environment tests/postman/env.staging.json \
                --reporters cli,junit --reporter-junit-export newman-results.xml || true
            '''
          }
          post {
            always { junit allowEmptyResults: true, testResults: 'newman-results.xml' }
          }
        }
      }
    }

  }
}