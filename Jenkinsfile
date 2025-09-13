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
                    dir('backend') {
                    sh '''
                        npm ci
                        # jalankan jest dengan junit + coverage (lcov)
                        npx jest --coverage --runInBand \
                        --reporters=default --reporters=jest-junit
                    '''
                    }
                }
                post {
                    always {
                    // path hasil junit & coverage backend
                    junit allowEmptyResults: true, testResults: 'backend/junit.xml'
                    archiveArtifacts artifacts: 'backend/coverage/**', allowEmptyArchive: true
                    }
                }
                }

                stage('Frontend: Vitest') {
                steps {
                    dir('frontend') {
                    sh '''
                        npm ci
                        # jalankan vitest dgn coverage (butuh @vitest/coverage-v8 terpasang)
                        npx vitest run --coverage || true
                    '''
                    }
                }
                post {
                    always {
                    // (opsional) publish junit vitest jika dipakai (lihat bagian B.2)
                    junit allowEmptyResults: true, testResults: 'frontend/junit.xml'
                    archiveArtifacts artifacts: 'frontend/coverage/**', allowEmptyArchive: true
                    }
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
                    always {
                    junit allowEmptyResults: true, testResults: 'newman-results.xml'
                    }
                }
            }

        }
    }


    stage('SonarCloud Analysis') {
        steps {
            withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
            sh '''
                set -e

                SCANNER_VERSION=5.0.1.3006
                SCANNER_DIR=.scanner-cli
                SCANNER_URL="https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SCANNER_VERSION}-linux.zip"

                rm -rf "$SCANNER_DIR"
                mkdir -p "$SCANNER_DIR"
                echo "Downloading SonarScanner ${SCANNER_VERSION}..."
                curl -sSL --retry 3 --retry-delay 2 "$SCANNER_URL" -o "$SCANNER_DIR/scanner.zip"
                unzip -q "$SCANNER_DIR/scanner.zip" -d "$SCANNER_DIR"
                SCANNER_BIN="$(echo $SCANNER_DIR/sonar-scanner-*/bin/sonar-scanner)"

                # Jalankan scanner dari root repo; config dibaca dari sonar-project.properties
                export SONAR_TOKEN="${SONAR_TOKEN}"
                "$SCANNER_BIN" -Dsonar.login="${SONAR_TOKEN}" -Dsonar.host.url=https://sonarcloud.io
            '''
            }
        }
    }




  }
}