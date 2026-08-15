// Jenkins pipeline for Tiranga Taar.
// Assumes this job runs on an agent (typically the EC2 host itself) that has
// Docker and the Docker Compose plugin installed, and that the Jenkins user
// is a member of the `docker` group (see deploy/ec2-setup.sh).

pipeline {
    agent any

    environment {
        IMAGE_NAME = "tiranga-taar"
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build image') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                // recreate the container with the freshly built image,
                // zero manual steps on the box after this
                sh 'docker compose up -d --remove-orphans'
            }
        }

        stage('Health check') {
            steps {
                sh '''
                  for i in $(seq 1 10); do
                    if curl -sf http://localhost/ > /dev/null; then
                      echo "Site is up."
                      exit 0
                    fi
                    sleep 2
                  done
                  echo "Site did not respond after deploy." >&2
                  exit 1
                '''
            }
        }
    }

    post {
        success {
            echo "Deployed ${IMAGE_NAME} successfully."
        }
        failure {
            echo "Deploy failed — check the stage logs above."
        }
        always {
            sh 'docker image prune -f'
        }
    }
}
