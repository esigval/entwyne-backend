REM Log in to AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 126425568953.dkr.ecr.us-east-1.amazonaws.com

REM Create ECR repositories if they don't exist
aws ecr describe-repositories --repository-names app-audio --region us-east-1 || aws ecr create-repository --repository-name app-audio --region us-east-1
aws ecr describe-repositories --repository-names app-compress --region us-east-1 || aws ecr create-repository --repository-name app-compress --region us-east-1
aws ecr describe-repositories --repository-names app-thumbnail --region us-east-1 || aws ecr create-repository --repository-name app-thumbnail --region us-east-1

REM Build, tag, and push appAudio Docker image
docker build -t app-audio:latest -f Dockerfile.appAudio .
docker tag app-audio:latest 126425568953.dkr.ecr.us-east-1.amazonaws.com/app-audio:latest
docker push 126425568953.dkr.ecr.us-east-1.amazonaws.com/app-audio:latest

REM Build, tag, and push appCompress Docker image
docker build -t app-compress:latest -f Dockerfile.appCompress .
docker tag app-compress:latest 126425568953.dkr.ecr.us-east-1.amazonaws.com/app-compress:latest
docker push 126425568953.dkr.ecr.us-east-1.amazonaws.com/app-compress:latest

REM Build, tag, and push appThumbnail Docker image
docker build -t app-thumbnail:latest -f Dockerfile.appThumbnail .
docker tag app-thumbnail:latest 126425568953.dkr.ecr.us-east-1.amazonaws.com/app-thumbnail:latest
docker push 126425568953.dkr.ecr.us-east-1.amazonaws.com/app-thumbnail:latest
