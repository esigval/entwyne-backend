### Docker Port Rules for Server

docker run -p 443:443 126425568953.dkr.ecr.us-east-1.amazonaws.com/client-secure-development:latest
docker run -p 3001:3001 126425568953.dkr.ecr.us-east-1.amazonaws.com/server-secure-development:latest 

docker pull 126425568953.dkr.ecr.us-east-1.amazonaws.com/server-secure-development:latest 
docker pull 126425568953.dkr.ecr.us-east-1.amazonaws.com/client-secure-development:latest

## Production Pulls

docker run -p 3001:3001 126425568953.dkr.ecr.us-east-1.amazonaws.com/server-production
docker run -p 3001:3001 126425568953.dkr.ecr.us-east-1.amazonaws.com/server-secure-development:latest