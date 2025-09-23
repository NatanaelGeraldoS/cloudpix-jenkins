pipeline {
  agent any
  // Add timestamps to logs and keep keep only the last 20 build
  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }
  // Import the configured NodeJS and Docker
  tools { 
    nodejs 'NodeJS'
    dockerTool 'Docker' 
  }
  // Define the common variable that will be used, such as the Octopus URL, space, project, the application name, etc
  environment {
    REGISTRY          = 'docker.io'
    REGISTRY_NS       = 'natanaelgeraldo'
    APP_NAME          = 'cloudpix'

    OCTO_URL     = 'https://natanaelgeraldo.octopus.app'
    OCTO_SPACE   = 'Default'
    OCTO_PROJECT = 'cloudpix'
  }

  stages {
    // Initialize all of the variables that will be used on our CI/CD
    // Echoing the name of image of our Backend and Frontend
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
    // Checkout the repository Code
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build') {
      // Run it parallelly
      parallel {
        // Install all of the depedency , and run the lint without blocking.
        stage('Backend: npm ci & (no-build)') {
          steps {
            dir('backend') {
              sh 'npm ci'
              sh 'npm run lint || true'
              sh 'echo "No compile step for plain JS backend"'
            }
          }
        }
        // Install depedency for the Frontend and run the production build. Then store the result of build as artifacts
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
      // Run it Parallelly
      parallel {
        stage('Backend: Jest + Supertest') {
          steps {
            // Install depedency, and run the Jest with coverage, and publish the report and archive the coverage
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
          // Install depedency, and run the Vitest with coverage because we are using Vite for our frontend so it will suitable for this code. 
          // And publish the report and archive the coverage
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
      }
    }

    stage('SonarCloud Analysis') {
      steps {
        // Download the SonarScanner CLI, and Authenticate with the our SONAR_TOKEN, and run a scan against SonarCloud
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
        // INstall Snyk from the lastest version, and we authenticate with our SNYK_TOKEN, and run the test for the backend and frontend using the SNYK
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
          // Run audit in both apps and give warns if the audit level high or above
          steps {
            dir('backend') { sh 'npm audit --audit-level=high || true' }
            dir('frontend') { sh 'npm audit --audit-level=high || true' }
          }
        }
      }
    }

    stage('Docker Build') {
      parallel {
        // Build the Backend Image
        stage('Build Backend Image') {
          steps {
            dir('backend') {
              sh "docker build -t ${env.BACKEND_IMAGE} ."
            }
          }
        }
        // Build the Frontend Image
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
      // Push the Images using teh docker hubs, we will login to the docker hub using our credentials
      steps {
        withCredentials([usernamePassword(credentialsId: 'DOCKER_HUB',
          usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            set -e
            docker --version || true

            ( echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin ) \
              || docker login -u "$DOCKER_USER" -p "$DOCKER_PASS"

            docker push ${BACKEND_IMAGE}
            docker push ${FRONTEND_IMAGE}
            docker logout || true
          '''
        }
      }
    }


    // Add the Configuration of docker, and validate the docker version and docker compose version
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
    // Check if the docker-compose already present, if not we will download to the local bin and make it executable and verivy the installation
    stage('Install Docker Compose') {
      steps {
        sh '''
          # Check if docker-compose already exists
          if ! command -v docker-compose &> /dev/null; then
            echo "Install Docker Data..."
            
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
          // Creating the Environment file for staging
          sh """
            cat > .env.staging <<EOF
    BACKEND_IMAGE=${env.BACKEND_IMAGE}
    FRONTEND_IMAGE=${env.FRONTEND_IMAGE}
    IMAGE_TAG=${env.IMAGE_TAG}
    EOF
          """
          // Creating the environment file for the Backend staging
          withCredentials([
            usernamePassword(credentialsId: 'CLOUDPIX_DB', usernameVariable: 'DB_USER', passwordVariable: 'DB_PASS'),
            string(credentialsId: 'CLOUDPIX_DB_NAME', variable: 'DB_NAME'),
            string(credentialsId: 'CLOUDPIX_DB_HOST', variable: 'DB_HOST'),
            string(credentialsId: 'CLOUDPIX_JWT', variable: 'JWT_SECRET')
          ]) {
            sh """
              cat > .env.backend <<'EOF'
    PORT=5000
    ENV_TYPE=Staging
    DB_NAME=${DB_NAME}
    DB_USER=${DB_USER}
    DB_PASS=${DB_PASS}
    DB_HOST=${DB_HOST}
    JWT_SECRET=${JWT_SECRET}
    EOF
            """
          }
          // We run the docker compose to clean and push all of the new deployment that we have
          // Wait for 30 second to show the container list and recent logs
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
          echo 'Failed deployed to staging environment!'
          sh '''
            export PATH="$HOME/.local/bin:$PATH"
            echo "=== STAGING DEPLOYMENT STATUS FAILED ==="
            docker-compose -f docker-compose.staging.yml logs || $HOME/.local/bin/docker-compose -f docker-compose.staging.yml logs || echo "Failed to get logs"
            docker-compose -f docker-compose.staging.yml ps || $HOME/.local/bin/docker-compose -f docker-compose.staging.yml ps || echo "Failed to get container status"
          '''
        }
      }
    }
    stage('Release to Production (Octopus)') {
      steps {
        // We will use the credential of Octopus API Key to deploy our releases
        withCredentials([string(credentialsId: 'OCTOPUS_API_KEY', variable: 'OCTO_API_KEY')]) {
          sh '''
            set -e

            #CHeck the CLI version and use the lastest version
            docker run --rm \
              -e OCTOPUS_CLI_API_KEY="$OCTO_API_KEY" \
              octopusdeploy/octo:latest version

            # Create release, we create the release using the information that we have such as the image tage, build number and all of the release to the Octopus
            docker run --rm \
              -e OCTOPUS_CLI_API_KEY="$OCTO_API_KEY" \
              octopusdeploy/octo:latest create-release \
              --server "$OCTO_URL" --space "$OCTO_SPACE" --project "$OCTO_PROJECT" \
              --version "${IMAGE_TAG}" \
              --variable "Image.Tag=${IMAGE_TAG}" \
              --releaseNotes "Jenkins build ${BUILD_NUMBER}, git ${GIT_SHA}"

            # Deploy release, we will deploy the production environtment using Octopus, with timeout 20 minutes.
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
      // Echo if Success
      echo 'Pipeline completed successfully! ✅'
    }
    failure {
      // Echo if Failed
      echo 'Pipeline failed! ❌'
    }
  }
}