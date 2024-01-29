# Use an official Node runtime as a parent image
FROM node:lts

# Set the working directory in the container
WORKDIR /server

# Install FFmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg

# Print the architecture
RUN uname -m

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the current directory contents into the container at /server
COPY . .

# Make port available to the world outside this container
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 3001

# Define environment variable
ENV NODE_ENV=production
ENV PORT=3001

# Run npm start when the container launches
CMD ["npm", "start"]
