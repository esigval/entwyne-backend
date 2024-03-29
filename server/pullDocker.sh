#!/bin/bash

# Get the password for the ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 126425568953.dkr.ecr.us-east-1.amazonaws.com

# Find the container ID of the running server
container_id=$(docker ps -qf "ancestor=126425568953.dkr.ecr.us-east-1.amazonaws.com/server-secure-development:latest")

# Find the image ID of the running container
image_id=$(docker inspect -f '{{.Image}}' $container_id)

# If a container is running, stop and remove it
if [ ! -z "$container_id" ]
then
    docker rm -f $container_id
fi

# If an image is found, delete it
if [ ! -z "$image_id" ]
then
    docker rmi -f $image_id
fi

# Pull the latest image
docker pull 126425568953.dkr.ecr.us-east-1.amazonaws.com/server-secure-development:latest 

# Run the new container
docker run -d -e NODE_ENV=development -p 3001:3001 126425568953.dkr.ecr.us-east-1.amazonaws.com/server-secure-development:latest