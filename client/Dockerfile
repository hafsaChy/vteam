# Use an official Node.js 18 image as the base image
FROM node

# Set the working directory in the container
WORKDIR /client

# Copy the 'package.json' file into the container
COPY package.json . 

RUN apt-get update && apt-get install -y --no-install-recommends nano

# Install dependencies
RUN npm install

COPY . .

# Expose port 3000
EXPOSE 3000

# Set the command to run the development server
CMD ["npm", "start"]
