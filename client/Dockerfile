# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /client

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose a port if your application listens on a specific port
# EXPOSE 3000

# Start your application
CMD ["npm", "start"]