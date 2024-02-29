## Pushing Docker For Server
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 126425568953.dkr.ecr.us-east-1.amazonaws.com
docker build -t server-secure-development .
docker tag server-secure-development:latest 126425568953.dkr.ecr.us-east-1.amazonaws.com/server-secure-development:latest
docker push 126425568953.dkr.ecr.us-east-1.amazonaws.com/server-secure-development:latest

### Docker Pull and Run Server Development

docker pull 126425568953.dkr.ecr.us-east-1.amazonaws.com/server-secure-development:latest 
docker run -p 3001:3001 126425568953.dkr.ecr.us-east-1.amazonaws.com/server-secure-development:latest 

## Docker Pull and Run Client Development

docker pull 126425568953.dkr.ecr.us-east-1.amazonaws.com/client-secure-development:latest
docker run -p 443:443 126425568953.dkr.ecr.us-east-1.amazonaws.com/client-secure-development:latest




## Production Pulls

docker run -p 3001:3001 126425568953.dkr.ecr.us-east-1.amazonaws.com/server-production
docker run -p 3001:3001 126425568953.dkr.ecr.us-east-1.amazonaws.com/server-secure-development:latest

