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

# Copy the current directory contents into the container at /app
COPY . .

# Define environment variable
ENV NODE_ENV=production

# Build the project (assuming you're using create-react-app)
RUN yarn build

# ---- Serve Stage ----
# Start from the official Nginx image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build-stage /app/build /usr/share/nginx/html

# Expose port 80 for HTTP
EXPOSE 88

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]