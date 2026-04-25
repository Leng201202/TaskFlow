# First stage: Build React app
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the React app source code
COPY . .

# Build the app for production (this will generate the 'build' directory)
RUN npm run build

# Second stage: Serve the build using Nginx
FROM nginx:alpine

# Copy the build files from the build stage to the nginx folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to access the React app
EXPOSE 80

# Start nginx to serve the React app
CMD ["nginx", "-g", "daemon off;"]