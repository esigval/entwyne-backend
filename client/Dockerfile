# ---- Build Stage ----
# Use an official Node runtime as a parent image
FROM node:lts as build-stage

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

# Define environment variable
ENV NODE_ENV=production

# Build the project (assuming you have a script to build your Expo project for production)
RUN yarn build:web

# ---- Serve Stage ----
# Start from the official Nginx image
FROM nginx:latest

#Add Folders
RUN mkdir -p /etc/nginx/ssl/

# Copy SSL certificates
COPY /nginx/cert.pem /etc/nginx/ssl/cert.pem
COPY /nginx/key.pem /etc/nginx/ssl/key.pem

# Copy the Nginx configuration file
COPY /nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy the built Expo-React application from the build-stage
COPY --from=build-stage /app/web-build /usr/share/nginx/html

# Expose port 443 for HTTPS
EXPOSE 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
