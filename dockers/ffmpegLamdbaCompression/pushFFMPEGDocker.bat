REM Pushing Docker For Server
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 126425568953.dkr.ecr.us-east-1.amazonaws.com
docker build -t lambda-ffmpeg .
docker tag lambda-ffmpeg:latest 126425568953.dkr.ecr.us-east-1.amazonaws.com/lambda-ffmpeg:latest
docker push 126425568953.dkr.ecr.us-east-1.amazonaws.com/lambda-ffmpeg:latest