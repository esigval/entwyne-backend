# Use the AWS Lambda Node.js 14 base image
FROM public.ecr.aws/lambda/nodejs:14

# Copy FFmpeg and FFprobe binaries from the local directory to /usr/bin in the image
COPY ffmpeg /usr/bin/
COPY ffprobe /usr/bin/

# Install aws-sdk
RUN npm install aws-sdk

# Ensure FFmpeg and FFprobe are executable
RUN chmod +x /usr/bin/ffmpeg && \
    chmod +x /usr/bin/ffprobe

# Clean up
RUN rm -rf /var/cache/apk/*

# Copy test.mp4 into /usr/video
# ENV VIDEO_INPUT_PATH=/usr/video/test.mp4

# Create the /usr/video directory
RUN mkdir -p /temp
# RUN mkdir -p /usr/video

# Copy function code
COPY app.js ${LAMBDA_TASK_ROOT}
COPY videoUtils.js ${LAMBDA_TASK_ROOT}
COPY checkBinaries.js ${LAMBDA_TASK_ROOT}
# COPY test.mp4 /usr/video/

# Set the CMD to your handler
CMD [ "app.handler" ]
