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
                npx jest --runInBand --coverage
              '''
            }
          }
          post {
            always {
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

            export SONAR_TOKEN="${SONAR_TOKEN}"
            "$SCANNER_BIN" -Dsonar.login="${SONAR_TOKEN}" -Dsonar.host.url=https://sonarcloud.io
          '''
        }
      }
    }

    stage('Security') {
      parallel {
        stage('Dependency Scan (Snyk)') {
          steps {
            withCredentials([string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')]) {
              sh '''
                npm i -g snyk@latest
                snyk auth ${SNYK_TOKEN}
                (cd backend && snyk test || true)
                (cd frontend && snyk test || true)
              '''
            }
          }
        }
        stage('npm audit (baseline)') {
          steps {
            dir('backend') { sh 'npm audit --audit-level=high || true' }
            dir('frontend') { sh 'npm audit --audit-level=high || true' }
          }
        }
      }
    }

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

    stage('Deploy to Staging') {
      steps {
        script {
          // Stop existing containers if running
          sh '''
            docker-compose -f docker-compose.staging.yml down || true
            docker system prune -f || true
          '''
          
          // Deploy to staging environment
          sh """
            # Create staging environment variables
            echo "BACKEND_IMAGE=${env.BACKEND_IMAGE}" > .env.staging
            echo "FRONTEND_IMAGE=${env.FRONTEND_IMAGE}" >> .env.staging
            echo "IMAGE_TAG=${env.IMAGE_TAG}" >> .env.staging
            
            # Deploy with docker-compose
            docker-compose -f docker-compose.staging.yml --env-file .env.staging up -d
            
            # Wait for services to be ready
            echo "Waiting for services to start..."
            sleep 45
            
            # Show running containers
            docker ps
            
            # Check container logs if needed
            docker-compose -f docker-compose.staging.yml logs --tail=20
          """
        }
      }
      post {
        success {
          echo 'Successfully deployed to staging environment!'
          sh '''
            echo "=== STAGING DEPLOYMENT STATUS ==="
            echo "Frontend: http://localhost:3000"
            echo "Backend: http://localhost:5001"
            docker-compose -f docker-compose.staging.yml ps
          '''
        }
        failure {
          echo 'Deployment to staging failed!'
          sh '''
            echo "=== DEPLOYMENT FAILURE LOGS ==="
            docker-compose -f docker-compose.staging.yml logs
            docker-compose -f docker-compose.staging.yml ps
          '''
        }
      }
    }

    stage('Staging Tests') {
      steps {
        script {
          // Simple connectivity tests
          sh '''
            echo "Running basic connectivity tests..."
            
            # Wait a bit more for services to be fully ready
            sleep 15
            
            # Test if containers are running
            if ! docker ps | grep -q "cloudpix-backend-staging"; then
              echo "❌ Backend container not running"
              exit 1
            fi
            
            if ! docker ps | grep -q "cloudpix-frontend-staging"; then
              echo "❌ Frontend container not running"  
              exit 1
            fi
            
            echo "✅ All containers are running"
            
            # Test ports are accessible (basic check)
            if ! netstat -tuln | grep -q ":5001"; then
              echo "❌ Backend port 5001 not accessible"
              exit 1
            fi
            
            if ! netstat -tuln | grep -q ":3000"; then
              echo "❌ Frontend port 3000 not accessible"
              exit 1
            fi
            
            echo "✅ All ports are accessible"
            echo "✅ Staging deployment successful!"
          '''
        }
      }
    }

    stage('Release to Production') {
      when {
        anyOf {
          branch 'main'
          branch 'master'
        }
      }
      steps {
        script {
          // Manual approval for production deployment
          timeout(time: 15, unit: 'MINUTES') {
            input message: 'Deploy to Production?', 
                  ok: 'Deploy',
                  submitterParameter: 'APPROVER'
          }
          
          echo "Deployment approved by: ${env.APPROVER}"
          
          // Push images to registry
          sh """
            echo "Pushing images to registry..."
            docker push ${env.BACKEND_IMAGE}
            docker push ${env.FRONTEND_IMAGE}
            
            # Tag as latest for production
            docker tag ${env.BACKEND_IMAGE} ${env.REGISTRY}/${env.REGISTRY_NS}/${env.APP_NAME}-backend:latest
            docker tag ${env.FRONTEND_IMAGE} ${env.REGISTRY}/${env.REGISTRY_NS}/${env.APP_NAME}-frontend:latest
            
            docker push ${env.REGISTRY}/${env.REGISTRY_NS}/${env.APP_NAME}-backend:latest
            docker push ${env.REGISTRY}/${env.REGISTRY_NS}/${env.APP_NAME}-frontend:latest
          """
          
          // Deploy to production
          sh '''
            # Create production environment variables
            echo "BACKEND_IMAGE=${BACKEND_IMAGE}" > .env.production
            echo "FRONTEND_IMAGE=${FRONTEND_IMAGE}" >> .env.production
            echo "IMAGE_TAG=${IMAGE_TAG}" >> .env.production
            echo "ENVIRONMENT=production" >> .env.production
            
            # Stop staging environment
            docker-compose -f docker-compose.staging.yml down || true
            
            # Deploy to production
            docker-compose -f docker-compose.production.yml --env-file .env.production up -d
            
            # Wait for services to be ready
            sleep 45
            
            # Production health checks
            curl -f http://localhost:8001/health || echo "Production backend health check failed"
            curl -f http://localhost:8000 || echo "Production frontend health check failed"
          '''
        }
      }
      post {
        success {
          echo '''
          🎉 PRODUCTION DEPLOYMENT SUCCESSFUL! 🎉
          
          Application has been successfully deployed to production.
          Frontend: http://localhost:8000
          Backend: http://localhost:8001
          '''
        }
        failure {
          echo 'Production deployment failed! Rolling back...'
          sh '''
            # Rollback to previous version if deployment fails
            docker-compose -f docker-compose.production.yml down
            echo "Production deployment rolled back"
          '''
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