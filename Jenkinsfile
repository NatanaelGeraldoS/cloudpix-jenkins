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
    REGISTRY_NS       = 'natanaelgeraldo'
    APP_NAME          = 'cloudpix'

    OCTO_URL     = 'https://natanaelgeraldo.octopus.app'
    OCTO_SPACE   = 'Default'
    OCTO_PROJECT = 'cloudpix'
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
    stage('Docker Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'DOCKER_HUB',
          usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            set -e
            docker --version || true

            # coba cara baru; kalau gagal (unknown flag), fallback ke -p
            ( echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin ) \
              || docker login -u "$DOCKER_USER" -p "$DOCKER_PASS"

            docker push ${BACKEND_IMAGE}
            docker push ${FRONTEND_IMAGE}
            docker logout || true
          '''
        }
      }
    }



    stage('Setup Docker CLI') {
      steps {
        script {
          def dockerHome = tool name: 'Docker', type: 'org.jenkinsci.plugins.docker.commons.tools.DockerTool'
          env.PATH = "${dockerHome}/bin:${env.PATH}"
          sh 'docker --version || true'
          sh 'docker compose version || true'
        }
      }
    }

    stage('Install Docker Compose') {
      steps {
        sh '''
          # Check if docker-compose already exists
          if ! command -v docker-compose &> /dev/null; then
            echo "Installing Docker Compose to user directory..."
            
            # Create local bin directory
            mkdir -p $HOME/.local/bin
            
            # Download Docker Compose
            curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o $HOME/.local/bin/docker-compose
            chmod +x $HOME/.local/bin/docker-compose
            
            # Add to PATH for this session
            export PATH="$HOME/.local/bin:$PATH"
          fi
          
          # Verify installation
          $HOME/.local/bin/docker-compose --version || docker-compose --version || echo "Docker Compose installation failed"
        '''
      }
    }

    stage('Deploy to Staging') {
      steps {
        script {
          sh 'export PATH="$HOME/.local/bin:$PATH"'

          sh """
            cat > .env.staging <<EOF
    BACKEND_IMAGE=${env.BACKEND_IMAGE}
    FRONTEND_IMAGE=${env.FRONTEND_IMAGE}
    IMAGE_TAG=${env.IMAGE_TAG}
    EOF
          """

          withCredentials([
            usernamePassword(credentialsId: 'CLOUDPIX_DB', usernameVariable: 'DB_USER', passwordVariable: 'DB_PASS'),
            string(credentialsId: 'CLOUDPIX_DB_NAME', variable: 'DB_NAME'),
            string(credentialsId: 'CLOUDPIX_DB_HOST', variable: 'DB_HOST'),
            string(credentialsId: 'CLOUDPIX_JWT', variable: 'JWT_SECRET')
          ]) {
            sh """
              cat > .env.backend <<'EOF'
    PORT=5000
    ENV_TYPE=Production
    DB_NAME=${DB_NAME}
    DB_USER=${DB_USER}
    DB_PASS=${DB_PASS}
    DB_HOST=${DB_HOST}
    JWT_SECRET=${JWT_SECRET}
    EOF
            """
          }

          // Stop & deploy
          sh '''
            docker-compose -f docker-compose.staging.yml down || $HOME/.local/bin/docker-compose -f docker-compose.staging.yml down || true
            docker system prune -f || true

            docker-compose -f docker-compose.staging.yml --env-file .env.staging up -d \
              || $HOME/.local/bin/docker-compose -f docker-compose.staging.yml --env-file .env.staging up -d

            echo "Waiting for services to start..."
            sleep 30

            docker ps
            docker-compose -f docker-compose.staging.yml logs --tail=50 \
              || $HOME/.local/bin/docker-compose -f docker-compose.staging.yml logs --tail=50
          '''
        }
      }
      post {
        success {
          echo 'Successfully deployed to staging environment!'
          sh '''
            export PATH="$HOME/.local/bin:$PATH"
            echo "=== STAGING DEPLOYMENT STATUS ==="
            echo "Frontend: http://localhost:3000"
            echo "Backend: http://localhost:5001"
            docker-compose -f docker-compose.staging.yml ps || $HOME/.local/bin/docker-compose -f docker-compose.staging.yml ps
          '''
        }
        failure {
          echo 'Deployment to staging failed!'
          sh '''
            export PATH="$HOME/.local/bin:$PATH"
            echo "=== DEPLOYMENT FAILURE LOGS ==="
            docker-compose -f docker-compose.staging.yml logs || $HOME/.local/bin/docker-compose -f docker-compose.staging.yml logs || echo "Failed to get logs"
            docker-compose -f docker-compose.staging.yml ps || $HOME/.local/bin/docker-compose -f docker-compose.staging.yml ps || echo "Failed to get container status"
          '''
        }
      }
    }
    stage('Release to Production (Octopus)') {
      steps {
        withCredentials([string(credentialsId: 'OCTOPUS_API_KEY', variable: 'OCTO_API_KEY')]) {
          sh '''
            set -e

            # Cek versi CLI (auto-pull image)
            docker run --rm \
              -e OCTOPUS_CLI_API_KEY="$OCTO_API_KEY" \
              octopusdeploy/octo:latest version

            # Create release
            docker run --rm \
              -e OCTOPUS_CLI_API_KEY="$OCTO_API_KEY" \
              octopusdeploy/octo:latest create-release \
              --server "$OCTO_URL" --space "$OCTO_SPACE" --project "$OCTO_PROJECT" \
              --version "${IMAGE_TAG}" \
              --variable "Image.Tag=${IMAGE_TAG}" \
              --releaseNotes "Jenkins build ${BUILD_NUMBER}, git ${GIT_SHA}"

            # Deploy release
            docker run --rm \
              -e OCTOPUS_CLI_API_KEY="$OCTO_API_KEY" \
              octopusdeploy/octo:latest deploy-release \
              --server "$OCTO_URL" --space "$OCTO_SPACE" --project "$OCTO_PROJECT" \
              --version "$IMAGE_TAG" \
              --deployTo "Production" \
              --progress --cancelOnTimeout --deploymentTimeout "00:20:00"

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