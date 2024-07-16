@echo off
FOR /F "tokens=1" %%i IN ('docker ps -a --format "{{.Names}}"') DO (
    docker stop %%i
    docker rm %%i
)
docker build -t your-image-name:your-tag -f Dockerfile.app .
docker run -d --name yourssssss your-image-name:your-tag