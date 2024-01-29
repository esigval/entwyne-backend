# Use an official Node runtime as a parent image
FROM node:lts

# Set the working directory in the container
WORKDIR /app

# Print the architecture
RUN uname -m

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Install expo-cli globally in the container
RUN yarn global add expo-cli

# Copy the current directory contents into the container at /app
COPY . .

# Make port available to the world outside this container
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 3000

# Define environment variable
ENV NODE_ENV=production

# Run expo start when the container launches
# Run yarn start when the container launches
CMD ["yarn", "serve"]