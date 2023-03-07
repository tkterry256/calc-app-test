pipeline{
    agent any
    environment {
        DOCKER_HUB = credentials('docker-hub-fauzia')
        MONGO_DEV = credentials('mongo-development-uri')
        MONGO_PROD = credentials('mongo-production-uri')
    }
    stages{
        stage('Install Dependencies'){
            
            steps{
                sh '''
                    cd calc-client
                    npm install
                '''
                sh '''
                    cd calc-server
                    npm install
                '''
            }
            
        }

        stage('Run Tests'){

            steps{
                sh '''
                    cd calc-server
                    npm run test
                '''
            }
            
        }

        stage('Build node projects'){
            steps{
                
                sh '''
                    cd calc-server
                    npm run build
                '''
            }
            
        }

        stage('Build docker image'){
            steps{
                // 19
                // 20
                sh '''
                    cd calc-server
                    docker build . -t fauzianaava/calc-app:$BUILD_NUMBER
                '''
            }
            
        }

        stage('Publish docker image'){
            steps{
                sh '''
                    echo $DOCKER_HUB_PSW | docker login -u $DOCKER_HUB_USR --password-stdin
                    docker push fauzianaava/calc-app:$BUILD_NUMBER
                '''
            }
            
        }

        stage('Deploy docker image'){
            steps{
                sh '''
                    docker stop calc-app-dev && docker rm calc-app-dev || true
                    docker run \\
                -e MONGO_PROD="${MONGO_PROD}" -e MONGO_DEV="${MONGO_DEV}" -e PORT='8080' -e NODE_ENV=development \\
                -d -p 5000:8080 --name calc-app-dev \\
                fauzianaava/calc-app:$BUILD_NUMBER
                '''
            }
            input{
                message "Press Ok to continue"
                submitter "coder"
	        }
            
        }
    }
}
