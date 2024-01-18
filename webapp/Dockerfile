# Use the official Node.js image as the base image
FROM node:18.17.1

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port your app will run on
EXPOSE 3003

# Define the command to run your application
CMD ["node", "app.js"]
