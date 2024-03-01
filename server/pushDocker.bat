REM Pushing Docker For Server
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 126425568953.dkr.ecr.us-east-1.amazonaws.com
docker build -t server-secure-development .
docker tag server-secure-development:latest 126425568953.dkr.ecr.us-east-1.amazonaws.com/server-secure-development:latest
docker push 126425568953.dkr.ecr.us-east-1.amazonaws.com/server-secure-development:latest