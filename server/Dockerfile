# Use an official Node runtime as a parent image
FROM node:lts

# Set the working directory in the container
WORKDIR /server

# Print the architecture
RUN uname -m

# Install dependencies for downloading and extracting files
RUN apt-get update && apt-get install -y wget xz-utils

# Download the static FFmpeg build
RUN wget https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-linux64-gpl.tar.xz

# Extract the FFmpeg tarball
RUN tar xvf ffmpeg-master-latest-linux64-gpl.tar.xz

# Move the FFmpeg binaries to /usr/local/bin
RUN cp ffmpeg-master-latest-linux64-gpl/bin/ffmpeg /usr/local/bin/ && \
    cp ffmpeg-master-latest-linux64-gpl/bin/ffprobe /usr/local/bin/

# Clean up the downloaded and extracted files
RUN rm -rf ffmpeg-master-latest-linux64-gpl* ffmpeg-master-latest-linux64-gpl.tar.xz

# Copy the font files to the appropriate directory
COPY ./assets/fonts /usr/local/share/fonts

# Update font cache (optional, depending on your use case)
RUN fc-cache -fv

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the current directory contents into the container at /server
COPY . .

# Make ports available to the world outside this container
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 3001

# Define environment variable
ENV NODE_ENV=production
ENV PORT=3001

# Run npm start when the container launches
CMD ["npm", "start"]
