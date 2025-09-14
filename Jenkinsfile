pipeline {
  agent any
  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }
  tools { 
    nodejs 'NodeJS'
    dockerTool 'Docker' 
  }

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

    // stage('Unit & Integration Tests') {
    //   parallel {
    //     stage('Backend: Jest + Supertest') {
    //       steps {
    //         dir('backend') {
    //           sh '''
    //             npm ci
    //             npx jest --runInBand --coverage
    //           '''
    //         }
    //       }
    //       post {
    //         always {
    //           junit allowEmptyResults: true, testResults: 'backend/junit.xml'
    //           archiveArtifacts artifacts: 'backend/coverage/**', allowEmptyArchive: true
    //         }
    //       }
    //     }

    //     stage('Frontend: Vitest') {
    //       steps {
    //         dir('frontend') {
    //           sh '''
    //             npm ci
    //             # jalankan vitest dgn coverage (butuh @vitest/coverage-v8 terpasang)
    //             npx vitest run --coverage || true
    //           '''
    //         }
    //       }
    //       post {
    //         always {
    //           // (opsional) publish junit vitest jika dipakai (lihat bagian B.2)
    //           junit allowEmptyResults: true, testResults: 'frontend/junit.xml'
    //           archiveArtifacts artifacts: 'frontend/coverage/**', allowEmptyArchive: true
    //         }
    //       }
    //     }

    //     stage('API Contract (Postman/Newman)') {
    //       when { expression { fileExists('tests/postman/collection.json') } }
    //       steps {
    //         sh '''
    //           npm i -g newman
    //           newman run tests/postman/collection.json \
    //             --environment tests/postman/env.staging.json \
    //             --reporters cli,junit --reporter-junit-export newman-results.xml || true
    //         '''
    //       }
    //       post {
    //         always {
    //           junit allowEmptyResults: true, testResults: 'newman-results.xml'
    //         }
    //       }
    //     }
    //   }
    // }

    // stage('SonarCloud Analysis') {
    //   steps {
    //     withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
    //       sh '''
    //         set -e

    //         SCANNER_VERSION=5.0.1.3006
    //         SCANNER_DIR=.scanner-cli
    //         SCANNER_URL="https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SCANNER_VERSION}-linux.zip"

    //         rm -rf "$SCANNER_DIR"
    //         mkdir -p "$SCANNER_DIR"
    //         echo "Downloading SonarScanner ${SCANNER_VERSION}..."
    //         curl -sSL --retry 3 --retry-delay 2 "$SCANNER_URL" -o "$SCANNER_DIR/scanner.zip"
    //         unzip -q "$SCANNER_DIR/scanner.zip" -d "$SCANNER_DIR"
    //         SCANNER_BIN="$(echo $SCANNER_DIR/sonar-scanner-*/bin/sonar-scanner)"

    //         export SONAR_TOKEN="${SONAR_TOKEN}"
    //         "$SCANNER_BIN" -Dsonar.login="${SONAR_TOKEN}" -Dsonar.host.url=https://sonarcloud.io
    //       '''
    //     }
    //   }
    // }

    // stage('Security') {
    //   parallel {
    //     stage('Dependency Scan (Snyk)') {
    //       steps {
    //         withCredentials([string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')]) {
    //           sh '''
    //             npm i -g snyk@latest
    //             snyk auth ${SNYK_TOKEN}
    //             (cd backend && snyk test || true)
    //             (cd frontend && snyk test || true)
    //           '''
    //         }
    //       }
    //     }
    //     stage('npm audit (baseline)') {
    //       steps {
    //         dir('backend') { sh 'npm audit --audit-level=high || true' }
    //         dir('frontend') { sh 'npm audit --audit-level=high || true' }
    //       }
    //     }
    //   }
    // }

    stage('Docker Build') {
      parallel {
        stage('Build Backend Image') {
          steps {
            dir('backend') {
              sh "docker build -t ${env.BACKEND_IMAGE} ."
            }
          }
        }
        stage('Build Frontend Image') {
          steps {
            dir('frontend') {
              sh "docker build -t ${env.FRONTEND_IMAGE} ."
            }
          }
        }
      }
    }

    stage('Setup Docker CLI') {
      steps {
        script {
          // Nama 'Docker' harus sama persis dgn yang di Global Tool Configuration
          def dockerHome = tool name: 'Docker', type: 'org.jenkinsci.plugins.docker.commons.tools.DockerTool'
          env.PATH = "${dockerHome}/bin:${env.PATH}"
          sh 'docker --version || true'
          // Optional: cek compose v2 tersedia
          sh 'docker compose version || true'
        }
      }
    }
    stage('Install Docker Compose') {
      steps {
        sh '''
          # Check if docker-compose already exists
          if ! command -v docker-compose &> /dev/null; then
            echo "Installing Docker Compose..."
            # Download and install Docker Compose v2.21.0
            sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            sudo chmod +x /usr/local/bin/docker-compose
            # Create symlink if needed
            sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
          fi
          
          # Verify installation
          docker-compose --version
        '''
      }
    }

    stage('Deploy to Staging') {
      steps {
        script {
          sh '''
            docker-compose -f docker-compose.staging.yml --env-file .env.staging up -d
          '''
        }
      }
      post {
        success {
          script {
            def workspacePath = pwd()

            echo 'Successfully deployed to staging environment!'
            sh """
              echo "=== STAGING DEPLOYMENT STATUS ==="
              echo "Frontend: http://localhost:3000"
              echo "Backend: http://localhost:5001"
              docker run --rm \
                -v /var/run/docker.sock:/var/run/docker.sock \
                -v ${workspacePath}:/workspace \
                -w /workspace \
                docker/compose:latest -f docker-compose.staging.yml ps
            """
          }
        }
        failure {
          script {
            def workspacePath = pwd()

            echo 'Deployment to staging failed!'
            sh """
              echo "=== DEPLOYMENT FAILURE LOGS ==="
              docker run --rm \
                -v /var/run/docker.sock:/var/run/docker.sock \
                -v ${workspacePath}:/workspace \
                -w /workspace \
                docker/compose:latest -f docker-compose.staging.yml logs || echo "Failed to get logs"
              docker run --rm \
                -v /var/run/docker.sock:/var/run/docker.sock \
                -v ${workspacePath}:/workspace \
                -w /workspace \
                docker/compose:latest -f docker-compose.staging.yml ps || echo "Failed to get container status"
            """
          }
        }
      }
    }
  }

  post {
    always {
      // Clean up Docker images to save space
      sh '''
        docker system prune -f || true
        rm -f .env.staging .env.production || true
      '''
    }
    success {
      echo 'Pipeline completed successfully! ✅'
    }
    failure {
      echo 'Pipeline failed! ❌'
    }
  }
}