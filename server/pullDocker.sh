#!/bin/bash

# Find the container ID of the running server
container_id=$(docker ps -qf "ancestor=126425568953.dkr.ecr.us-east-1.amazonaws.com/server-secure-development:latest")

# If a container is running, stop and remove it
if [ ! -z "$container_id" ]
then
    docker rm -f $container_id
fi

# Pull the latest image
docker pull 126425568953.dkr.ecr.us-east-1.amazonaws.com/server-secure-development:latest 

# Run the new container
docker run -d -e NODE_ENV=development -p 3001:3001 126425568953.dkr.ecr.us-east-1.amazonaws.com/server-secure-development:latest 